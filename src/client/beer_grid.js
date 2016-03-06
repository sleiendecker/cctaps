import React from 'react';
import ReactDOM from 'react-dom';
import Griddle from 'griddle-react';

export default class BeerGrid extends React.Component {
  render () {
    const self = this;

    const fakeData =  [
      {
        "id": 0,
        "name": "Mayer Leonard",
        "city": "Kapowsin",
        "state": "Hawaii",
        "country": "United Kingdom",
        "company": "Ovolo",
        "favoriteNumber": 7
      },
      {
        "id": 1,
        "name": "Maye22r Leonard",
        "city": "Kapowafdssin",
        "state": "Hawaisadasi",
        "country": "United Kasdingdom",
        "company": "Ovolasdsao",
        "favoriteNumber": 72
      }
    ];

    console.log('am i getting here beer_grid');
    return (
      <div id="indexTest">
        <Griddle results={fakeData} />
      </div>
    );
  }
}