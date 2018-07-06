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

    search(term) {
        accessToken = Spotify.getAccessToken();
        if( accessToken === '' || accessToken === null || accessToken === undefined ) {
            return [];
        }
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            if(response.ok) {
                return response.json();
            }

            throw new Error('Request failed!');
        }).then(responseJson => {
            if( responseJson.tracks && responseJson.tracks.items ) {
                return responseJson.tracks.items.map(track => {
                    return {
                        id: track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        uri: track.uri
                    };
                });
            } else {
                return [];
            }
        });
    },

    savePlaylist(name, trackURIs) {
        console.log(`Entering Spotify.savePlaylist() trying to save ${name} named playlist`);
        if( ! name || trackURIs.length === 0 ) {
            return null;
        }

        accessToken = Spotify.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        };
        let userId = '';
        const baseUrl = 'https://api.spotify.com/v1/';
        let playlistID = '';

        // Get the User ID
        console.log(`Attempting to get user ID`);
        return fetch(`${baseUrl}me`, {headers})
            .then(response => {
                console.log(`Received a response for userId: ${accessToken}`);
                console.log(`Calling URL: ${baseUrl}me`);
                if( response.ok ) {
                    console.log(response);
                    return response.json();
                }

                console.log('Failed to get user ID');
                throw new Error('Request failed!: No user ID');
            })
            .then(responseJson => {
                // Create a play list with the user ID
                if( responseJson.id ) {
                    userId = responseJson.id;
                    console.log(`Got user ID: ${userId}`);
                    return fetch(`${baseUrl}users/${userId}/playlists`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({name})
                    }).then(response => {
                        if( response.ok ) {
                            return response.json();
                        }

                        console.log(`Failed to get new playlist for ${userId}`);
                        throw new Error(
                            'Request failed!: Play list NOT created');
                    }).then(responseJson => {
                        // Add tracks to the created play list
                        if( responseJson.id ) {
                            playlistID = responseJson.id;
                            console.log(`Got new playlist with ID: ${playlistID}`);
                            return fetch(
                                `${baseUrl}users/${userId}/playlists/` +
                                    `${playlistID}/tracks`, {
                                        method: 'POST',
                                        headers,
                                        body: JSON.stringify({uris: trackURIs})
                                    }).then(response => {
                                        if( response.ok ) {
                                            return response.json();
                                        }

                                        console.log(`Failed to add tracks for ${userId} in playlist, ${playlistID}`);
                                        throw new Error(
                                            'Request failed!: Unable to add tracks');
                                    }).then(responseJson => {
                                        if( responseJson.snapshot_id ) {
                                            console.log(`Added songs to playlist`);
                                            return responseJson.snapshot_id;
                                        }

                                        console.log(`Failed to parse add tracks results for ${userId} in laylist, ${playlistID}`);
                                        throw new Error(
                                            'Request failed!: Unable to add tracks');
                                    });
                        }

                        console.log(`Failed to parse new playlist results for ${userId}`);
                        throw new Error('Request failed!: Playlist NOT created');
                    });
                }

                console.log('Failed to parse user ID from JSON results');
                throw new Error('Request failed!: No user ID');
            });
    }
};

export default Spotify;
