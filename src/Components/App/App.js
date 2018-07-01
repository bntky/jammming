import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchResults: [
                {
                    id: 1,
                    name: 'Mr. Klaw',
                    album: 'Miscellaneous T The B Side Remix Compilation',
                    artist: 'They Might Be Giants',
                    uri: 'https://open.spotify.com/track/46Jgumlov6yuVz35ROk1XY'
                },
                {
                    id: 2,
                    name: 'Birds Fly',
                    album: 'Miscellaneous T The B Side Remix Compilation',
                    artist: 'They Might Be Giants',
                    uri: 'https://open.spotify.com/track/4QGXc9Hslo0IKISTY1JrIS'
                },
                {
                    id: 3,
                    name: 'Nightgown of the Sullen Moon',
                    album: 'Miscellaneous T The B Side Remix Compilation',
                    artist: 'They Might Be Giants',
                    uri: 'https://open.spotify.com/track/5bmoxC4K2qxvdsi9Td8yQU'
                }
            ],
            playlistName: '',
            playlistTracks: []
        };
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
        this.search = this.search.bind(this);
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
        const trackURIs = this.state.searchResults.map( track => track.uri );
    }

    search(term) {
        console.log(`Searching for ${term}`);
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
