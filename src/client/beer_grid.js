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
      <div id="beerGrid" className="cctapsGrid">
        <Griddle
          columnMetadata={metadata}
          columns={['name', 'rating', 'abv', 'style', 'brewery']}
          filterPlaceholderText={'Search for beers'}
          initialSort={'rating'}
          initialSortAscending={false}
          noDataMessage={'No beers found'}
          onRowClick={onRowClick}
          settingsText={barTitle}
          showSettings={true}
          results={beerData}
          resultsPerPage={100}
          showFilter={true}
        />
      </div>
    );
  }
}