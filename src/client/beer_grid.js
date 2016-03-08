import React from 'react';
import ReactDOM from 'react-dom';
import Griddle from 'griddle-react';

export default class BeerGrid extends React.Component {
  render () {
    const data =  window.__INITIAL__STATE__.bars;

    return (
      <div id="indexTest">
        <Griddle results={data} />
      </div>
    );
  }
}