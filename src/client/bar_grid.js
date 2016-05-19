import ReactDOM from 'react-dom';
import React    from 'react';
import Griddle  from 'griddle-react';
import moment   from 'moment';
import axios    from 'axios';

export default class BarGrid extends React.Component {
  render () {
    const data =  window.__INITIAL__STATE__.bars;
    data.forEach((bar) => {
      if (bar.lastUpdated) {
        bar.lastUpdated = moment(new Date(bar.lastUpdated)).startOf('day').fromNow();
      } else {
        bar.lastUpdated = 'N/A';
      }
    });

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

    const neighborhood = 'Baltimore'; // @todo: make this a neighborhood

    return (
      <div id="barGrid" className="cctapsGrid">
        <Griddle
          columnMetadata={metadata}
          columns={['name', 'lastUpdated']}
          filterPlaceholderText={'bar search...'}
          initialSort={'name'}
          settingsText={neighborhood}
          showSettings={true}
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