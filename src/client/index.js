import { Component } from 'react';
import React from 'react';
import ReactDOM from 'react-dom';

export default class Hello extends Component {

  constructor () {
    super();
  }

  render () {
    return (
      <div id="indexTest">
        <h1>Welcome to CCtaps</h1>
      </div>
    );
  }
}

ReactDOM.render(<Hello />, document.getElementById('app-container'));