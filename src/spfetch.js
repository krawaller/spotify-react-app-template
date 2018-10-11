const client_id = '518725f184ea4227b4f115aaf9886a10';
const scope =
  'streaming user-read-birthdate user-read-email user-read-private user-top-read';

let accessToken = getTokenFromUrlHash();
const spfetch = (global.spfetch = async (input, init) => {
  if (!accessToken) await spfetch.login();
  if (!init) init = {};
  if (!init.headers) init.headers = {};
  init.headers.Authorization = `Bearer ${accessToken}`;
  return fetch(
    input.startsWith('https://')
      ? input
      : `https://api.spotify.com${input.startsWith('/') ? '' : '/'}${input}`,
    init
  ).then(async response => {
    if (response.status === 401) await fetchTokenFromPopup();
    return response;
  });
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

    const url = new URL(
      window.location.hostname === 'localhost'
        ? window.location.origin + '/auth.html'
        : 'https://spotify-react-app-template.now.sh/auth'
    );
    url.searchParams.set('client_id', client_id);
    url.searchParams.set('scope', scope);

    window.open(
      (window.location.hostname === 'localhost'
        ? `//${window.location.host}/auth.html`
        : 'https://spotify-react-app-template.now.sh/auth') +
        `?client_id=${client_id}&scope=${encodeURIComponent(scope)}`,
      'Spotify',
      `menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=${width}, height=${height}, top=${top}, left=${left}`
    );
  });
}

global.fetchTokenFromPopup = fetchTokenFromPopup;
