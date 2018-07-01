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
                    artist: 'They Might Be Giants'
                },
                {
                    id: 2,
                    name: 'Birds Fly',
                    album: 'Miscellaneous T The B Side Remix Compilation',
                    artist: 'They Might Be Giants'
                },
                {
                    id: 3,
                    name: 'Nightgown of the Sullen Moon',
                    album: 'Miscellaneous T The B Side Remix Compilation',
                    artist: 'They Might Be Giants'
                }
            ],
            playlistName: 'empty',
            playlistTracks: []
        };
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);
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

    render() {
        return (
            <div>
              <h1>Ja<span className="highlight">mmm</span>ing</h1>
              <div className="App">
                <SearchBar />
                <div className="App-playlist">
                  <SearchResults searchResults={ this.state.searchResults }
                                 onAdd={ this.addTrack } />
                  <Playlist playlistName={ this.state.playlistName }
                            playlistTracks={ this.state.playlistTracks }
                            onRemove={ this.removeTrack }
                            onNameChange={ this.updatePlaylistName } />
                </div>
              </div>
            </div>
        );
    }
}

export default App;
