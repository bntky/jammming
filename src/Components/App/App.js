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
    }

    render() {
        return (
            <div>
              <h1>Ja<span className="highlight">mmm</span>ing</h1>
              <div className="App">
                <SearchBar />
                <div className="App-playlist">
                  <SearchResults searchResults={ this.state.searchResults } />
                  <Playlist playlistName={ this.state.playlistName }
                            playlistTracks={ this.state.playlistTracks } />
                </div>
              </div>
            </div>
        );
    }
}

export default App;
