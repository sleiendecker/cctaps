import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import Griddle from 'griddle-react';

export default class BeerGrid extends React.Component {

  componentDidMount () {
    axios.get(`/api/${encodeURIComponent(this.props.params.barID)}`)
      .then((response) => {
        console.log('response', response);
        this.beerData = response.data.beers;
        this.barTitle = response.data.bar;
      })
      .catch((response) => {
        console.log('failure');
        console.log(response);
      });
  }

  render () {
    const onRowClick = (gridRow, event) => {
      window.location = gridRow.props.data.url;
    };

    const beerData = this.beerData;
    const barTitle = this.barTitle;

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

    console.log(this.barTitle);

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