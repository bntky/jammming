import React, { Component } from 'react';
import './TrackList.css';
import Track from '../Track/Track';

class TrackList extends Component {
    render() {
        return (
            <div className="TrackList">
              <Track />
              <Track />
              <Track />
            </div>
        );
    }
}

export default TrackList;
