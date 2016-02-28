'use strict';

import React from 'react';
import griddle from 'griddle';
import ReactDOM from 'react-dom';

class Barlist extends React.Component {
  render () {
    return <h1>Bars</h1>;
  }
}

ReactDOM.render(<Barlist/>, document.getElementById('app-container'));