import React from 'react';
import ReactDOM from 'react-dom';
import Griddle from 'griddle-react';
import axios from 'axios';

export default class BarGrid extends React.Component {
  render () {
    const data =  window.__INITIAL__STATE__.bars;

    const onRowClick = (gridRow, event) => {
      axios.get(`/api/${gridRow.props.data._id}`)
        .then((response) => {
          window.__INITIAL__STATE__.beers = response.data.records;
          window.__INITIAL__STATE__.currentBar = gridRow.props.data.name;
          window.location.href = `${window.location.origin}/#/bar/${gridRow.props.data._id}`;
        })
        .catch((response) => {
          console.log('failure');
          console.log(response);
        });
    };

    const metadata = [
      {
        columnName: 'name',
        displayName: 'Name'
      },
      {
        columnName: 'lastUpdated',
        displayName: 'Last Updated'
      }
    ];

    return (
      <div id="barGrid">
        <Griddle
          columnMetadata={metadata}
          columns={['name', 'lastUpdated']}
          filterPlaceholderText={'Search for bars (ex. Max\'s Taphouse): '}
          initialSort={'name'}
          noDataMessage={'No bars found'}
          onRowClick={onRowClick}
          results={data}
          resultsPerPage={100}
          showFilter={true}
        />
      </div>
    );
  }
}