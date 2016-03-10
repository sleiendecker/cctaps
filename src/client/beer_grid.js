import React from 'react';
import ReactDOM from 'react-dom';
import Griddle from 'griddle-react';

export default class BeerGrid extends React.Component {
  render () {
    const data =  window.__INITIAL__STATE__.beers;

    const onRowClick = (gridRow, event) => {
      window.location = gridRow.props.data.url;
    };

    return (
      <div id="indexTest">
        <Griddle
          results={data}
          showFilter={true}
          columns={['name', 'rating', 'abv', 'style', 'brewery']}
          initialSort={'rating'}
          initialSortAscending={false}
          onRowClick={onRowClick}
          resultsPerPage={100}
        />
      </div>
    );
  }
}