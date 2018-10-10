import querystring from 'querystring';

const client_id = '360f2e3776ed4f7c878f2097e6bf947a';
const scope =
  'user-follow-read user-library-read playlist-read-private user-library-modify user-follow-modify playlist-modify-public playlist-modify-private user-modify-playback-state';

function getTokenFromUrlHash() {
  if (!global.location) return null;
  let params = querystring.parse(global.location.hash.slice(1));
  return (params.token_type === 'Bearer' && params.access_token) || null;
}

function refreshToken() {
  global.location = `https://accounts.spotify.com/authorize?${querystring.stringify(
    {
      response_type: 'token',
      client_id,
      scope,
      redirect_uri: `${global.location.origin}${global.location.pathname}`
    }
  )}`;
}

let accessToken = getTokenFromUrlHash();
const spfetch = (global.spfetch = (input, init) => {
  if (!accessToken) spfetch.login();
  if (!init) init = {};
  if (!init.headers) init.headers = {};
  init.headers.Authorization = `Bearer ${accessToken}`;
  return fetch(
    input.startsWith('https://')
      ? input
      : `https://api.spotify.com${input.startsWith('/') ? '' : '/'}${input}`,
    init
  ).then(response => {
    if (response.status === 401) refreshToken();
    return response;
  });
});
spfetch.login = () =>
  (accessToken = accessToken || getTokenFromUrlHash() || refreshToken());
spfetch.logout = () => (accessToken = null);
spfetch.isLoggedIn = () => !!accessToken;
spfetch.getToken = () => accessToken;

export default spfetch;
