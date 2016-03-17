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
          window.location.href = `${window.location.origin}/#/bar/${gridRow.props.data._id}`;
        })
        .catch((response) => {
          console.log('failure');
          console.log(response);
        });
    };

    return (
      <div id="barGrid">
        <h4>Which bar</h4>
        <Griddle
          results={data}
          showFilter={true}
          columns={['name', 'lastUpdated']}
          initialSort={'name'}
          onRowClick={onRowClick}
          resultsPerPage={100}
        />
      </div>
    );
  }
}