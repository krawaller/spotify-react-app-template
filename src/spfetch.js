import { client_id, scope } from './config.json';

let accessToken = getTokenFromUrlHash();
const spfetch = (global.spfetch = async (input, init) => {
  if (!accessToken) await spfetch.login();
  if (!init) init = {};
  if (!init.headers) init.headers = {};
  init.headers.Authorization = `Bearer ${accessToken}`;
  const response = await fetch(
    input.startsWith('https://')
      ? input
      : `https://api.spotify.com${input.startsWith('/') ? '' : '/'}${input}`,
    {
      ...init,
      body:
        typeof init.body === 'object' ? JSON.stringify(init.body) : init.body
    }
  );

  const { ok, status, statusText } = response;

  let json = {};
  try {
    json = await response.json();
  } catch (error) {}

  const { error: { message: errorMessage } = {} } = json || {};

  if (
    response.status === 401 &&
    (errorMessage === 'The access token expired' ||
      errorMessage === 'Invalid access token')
  ) {
    accessToken = await fetchTokenFromPopup();
    return spfetch(input, init);
  }

  return Object.assign(json, { ok, status });
});

spfetch.login = async () =>
  (accessToken =
    accessToken || getTokenFromUrlHash() || (await fetchTokenFromPopup()));
spfetch.logout = () => (accessToken = null);
spfetch.isLoggedIn = () => !!accessToken;
spfetch.getToken = () => accessToken;

export default spfetch;

function getTokenFromUrlHash() {
  return new URLSearchParams(global.location.hash.slice(1)).get('access_token');
}

async function fetchTokenFromPopup() {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(
      reject,
      20000,
      new Error('Timeout getting token')
    );
    window.addEventListener(
      'message',
      function onMessage(event) {
        let data = event.data;
        try {
          data = JSON.parse(event.data);
        } catch (error) {}
        const { type, accessToken } = data || {};
        if (type === 'access_token') {
          clearTimeout(timeout);
          resolve(accessToken);
          window.removeEventListener('message', onMessage, false);
          global.location.hash = new URLSearchParams([
            ['access_token', accessToken]
          ]).toString();
        }
      },
      false
    );

    const width = 450;
    const height = 730;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const url = new URL(window.location.origin);
    url.pathname =
      window.location.hostname === 'localhost' ? 'auth.html' : 'auth';
    url.searchParams.set('client_id', client_id);
    url.searchParams.set('scope', scope);

    window.open(
      url.toString(),
      'Spotify',
      `menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=${width}, height=${height}, top=${top}, left=${left}`
    );
  });
}
