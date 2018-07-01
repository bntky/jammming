import React, { Component } from 'react';
import './Playlist.css';
import TrackList from '../TrackList/TrackList';

class Playlist extends Component {
    render() {
        return (
            <div className="Playlist">
              <input value={'New Playlist'}/>
              <TrackList tracks={ this.props.playlistTracks } />
              <a className="Playlist-save">SAVE TO SPOTIFY</a>
            </div>
        );
    }
}

export default Playlist;
