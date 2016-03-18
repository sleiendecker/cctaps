import React from 'react';
import ReactDOM from 'react-dom';
import Griddle from 'griddle-react';

export default class BeerGrid extends React.Component {
  render () {
    const beerData = window.__INITIAL__STATE__.beers;
    const barTitle = window.__INITIAL__STATE__.currentBar;

    const onRowClick = (gridRow, event) => {
      window.location = gridRow.props.data.url;
    };

    const metadata = [
      {
        columnName: 'name',
        displayName: 'Name'
      },
      {
        columnName: 'rating',
        displayName: 'Rating'
      },
      {
        columnName: 'abv',
        displayName: 'ABV'
      },
      {
        columnName: 'style',
        displayName: 'Style'
      },
      {
        columnName: 'brewery',
        displayName: 'Brewery'
      }
    ];

    return (
      <div id="beerGrid">
        <h4>{barTitle}</h4>
        <Griddle
          results={beerData}
          showFilter={true}
          filterPlaceholderText={'Search for beers'}
          noDataMessage={'No beers found'}
          columns={['name', 'rating', 'abv', 'style', 'brewery']}
          columnMetadata={metadata}
          initialSort={'rating'}
          initialSortAscending={false}
          onRowClick={onRowClick}
          resultsPerPage={100}
        />
      </div>
    );
  }
}