import config from './config';

const clientId = config.clientId;
const redirectUri = config.redirectUri || 'http://localhost:3000';
let accessToken = '';

const Spotify = {
    getAccessToken() {
        if( accessToken ) {
            return accessToken;
        }

        // Where did we learn about this?
        const href = window.location.href;
        if( href.match(/access_token=.*expires_in=/) ||
            href.match(/expires_in=.*access_token=/) ) {

            // Pull access token and expiration date from URL
            accessToken = href.match(/access_token=([^&]*)/)[1];
            const expiresIn = href.match(/expires_in=([^&]*)/)[1];

            // Remove access token after it expires 
            window.setTimeout( () => accessToken = '', expiresIn * 1000 );

            // Reset window URL for the app...? What's this for?
            window.history.pushState('Access Token', null, '/');

            return accessToken;
        }
        const baseUrl = 'https://accounts.spotify.com/authorize?client_id=';
        const response_type = 'token';

        // Setting this because the docs say it's "strongly
        // recommended".  I should probably check that it's there
        // above too somehow, huh?
        const state = Math.floor(Math.random() * 100000);

        // How would I know that this is the correct scope?  At this
        // point I don't have any clue what endpoints will be used.
        // Reading about this scope, this could be what I want, but
        // couldn't it, also, be the "playlist-modify-private" scope?
        // Also, the "implicit Grant Flow" parameters note that the
        // "scope" parameter is optional.  So, do we even need it?
        const scope = 'playlist-modify-public';
        const url = `${baseUrl}${clientId}&redirect_uri=${redirectUri}` +
              `&response_type=${response_type}&scope=${scope}&state=${state}`;
        window.location = url;
    },

    async search(term) {
        accessToken = Spotify.getAccessToken();
        if( accessToken === '' || accessToken === null ||
            accessToken === undefined ) {
            return [];
        }

        const url = `https://api.spotify.com/v1/search?type=track&q=${term}`;
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if( ! response.ok) {
            return [];
        }

        const responseJson = await response.json();
        if( ! responseJson.tracks || ! responseJson.tracks.items ) {
            return [];
        }

        return responseJson.tracks.items.map(track => Object({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
        }));
    },

    async savePlaylist(name, trackURIs) {
        if( ! name || trackURIs.length === 0 ) {
            return null;
        }

        accessToken = Spotify.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        };
        const baseUrl = 'https://api.spotify.com/v1/';

        // Get the User ID
        const responseUid = await fetch(`${baseUrl}me`, {headers});
        if( ! responseUid.ok ) {
            return null;
        }

        const responseJsonUid = await responseUid.json();
        if( ! responseJsonUid.id ) {
            return null;
        }

        const userId = responseJsonUid.id;

        // Create a play list with the user ID
        const playlistUrl = `${baseUrl}users/${userId}/playlists`;
        const resPlaylistID = await fetch(playlistUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify({name})
        });
        if( ! resPlaylistID.ok ) {
            return null;
        }

        const resPlaylistJsonID = await resPlaylistID.json();
        if( ! resPlaylistJsonID.id ) {
            return null;
        }

        const playlistID = resPlaylistJsonID.id;

        // Add tracks to the created play list
        const tracksUrl =
              `${baseUrl}users/${userId}/playlists/${playlistID}/tracks`;
        const resSetPLTracks = await fetch(tracksUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify({uris: trackURIs})
        });
        if( ! resSetPLTracks.ok ) {
            return null;
        }

        const resSetPLTracksJson = await resSetPLTracks.json();
        if( ! resSetPLTracksJson.snapshot_id ) {
            return null;
        }

        return resSetPLTracksJson.snapshot_id;
    }
};

export default Spotify;
