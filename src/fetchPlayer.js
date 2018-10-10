import spfetch from './spfetch';

export default async function() {
  return new Promise((resolve, reject) => {
    if (global.Spotify) onSpotifyWebPlaybackSDKReady();
    global.onSpotifyWebPlaybackSDKReady = onSpotifyWebPlaybackSDKReady;

    async function onSpotifyWebPlaybackSDKReady() {
      const token = spfetch.getToken();
      const player = new global.Spotify.Player({
        name: 'Spotify React App Template Player',
        getOAuthToken: cb => cb(token)
      });

      player.addListener('initialization_error', reject);
      player.addListener('authentication_error', reject);
      player.addListener('account_error', reject);
      player.addListener('playback_error', console.error);

      await player.connect();
      player.id = player._options.id;

      // Add missing play functionality
      player.play = player.playTracks = player.playURI = (
        playable,
        { offset, position_ms } = {}
      ) => {
        let uris;
        let context_uri;
        if (
          Array.isArray(playable) &&
          playable.every(track => /^spotify:track:[^:]{22}$/.test(track))
        ) {
          uris = playable;
        } else if (
          /^spotify:(album|artist|playlist|(?:user:[^:]+:playlist)):[^:]+$/.test(
            playable
          )
        ) {
          context_uri = playable;
        } else {
          throw new Error('Unsupported playable');
        }

        return spfetch(`/v1/me/player/play?device_id=${player.id}`, {
          method: 'PUT',
          body: {
            uris,
            context_uri,
            position_ms,
            offset
          }
        });
      };

      resolve(player);
    }
  });
}
