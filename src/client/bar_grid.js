import React from 'react';
import ReactDOM from 'react-dom';
import Griddle from 'griddle-react';
import axios from 'axios';

export default class BarGrid extends React.Component {
  render () {
    const data =  window.__INITIAL__STATE__.bars;

    const onRowClick = (gridRow, event) => {
      console.log(gridRow.props.data);
      axios.get(`/api/${gridRow.props.data._id}`)
        .then(function (response) {
          console.log('success');
          console.log(response);
          window.__INITIAL__STATE__.beers = response.data.records2;
          this.setState({
            page: 'beers'
          });
        })
        .catch(function (response) {
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