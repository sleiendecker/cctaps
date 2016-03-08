import React from 'react';
import ReactDOM from 'react-dom';
import Griddle from 'griddle-react';

export default class BeerGrid extends React.Component {
  render () {
    const data =  window.__INITIAL__STATE__.beers;

    return (
      <div id="indexTest">
        <Griddle
        results={data}
        showFilter={true}
        columns={['name', 'newRating', 'abv', 'style', 'brewery']}
        initialSort={'newRating'}
        initialSortAscending={false}
        resultsPerPage={100} />
      </div>
    );
  }
}