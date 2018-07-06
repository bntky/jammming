import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../utils/Spotify';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchResults: [],
            playlistName: 'New Playlist',
            playlistTracks: []
        };
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
        this.search = this.search.bind(this);
        Spotify.getAccessToken();
    }

    addTrack(track) {
        const curTracks = this.state.playlistTracks;
        if( ! curTracks.find( trk => trk.id === track.id )) {
            curTracks.push(track);
        }
        this.setState({ playlistTracks: curTracks });
    }

    removeTrack(track) {
        const curTracks = this.state.playlistTracks;
        const idx = curTracks.findIndex(trk => track.id === trk.id);
        if( idx > -1 ) {
            curTracks.splice(idx, 1);
        }
        this.setState({ playlistTracks: curTracks });
    }

    updatePlaylistName(name) {
        this.setState({ playlistName: name });
    }

    savePlaylist() {
        console.log(`Entering App.savePlaylist() with ${this.state.playlistTracks.length}`);
        const trackURIs = this.state.playlistTracks.map( track => track.uri );
        Spotify.savePlaylist(this.state.playlistName, trackURIs);
        this.setState({
            playlistName: 'New Playlist',
            playlistTracks: []
        });
    }

    search(term) {
        Spotify.search(term).then(tracks => {
            this.setState({ searchResults: tracks });
        });
    }

    render() {
        return (
            <div>
              <h1>Ja<span className="highlight">mmm</span>ing</h1>
              <div className="App">
                <SearchBar onSearch={ this.search } />
                <div className="App-playlist">
                  <SearchResults searchResults={ this.state.searchResults }
                                 onAdd={ this.addTrack } />
                  <Playlist playlistName={ this.state.playlistName }
                            playlistTracks={ this.state.playlistTracks }
                            onRemove={ this.removeTrack }
                            onNameChange={ this.updatePlaylistName }
                            onSave={ this.savePlaylist } />
                </div>
              </div>
            </div>
        );
    }
}

export default App;
