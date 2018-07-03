import config from './config';

const clientId = config.clientId;
const redirectUri = config.redirectUri || 'http://localhost:3000';
let accessToken = '';
let expiresIn = '';

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
            expiresIn = href.match(/expires_in=([^&]*)/)[1];

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
        window.location.replace(url);
        return null;
    }
};

export default Spotify;
