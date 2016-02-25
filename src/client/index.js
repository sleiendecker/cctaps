import { Component } from 'react';
import React from 'react';
import ReactDOM from 'react-dom';

export default class Hello extends Component {

  constructor () {
    super();
  }

  onClick () {
    const request = new XMLHttpRequest();
    request.open('GET', '/beers', true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        console.log(request.responseText);
      } else {
        // We reached our target server, but it returned an error

      }
    };

    request.onerror = () => {
      // There was a connection error of some sort
    };

    request.send();
  }

  render () {
    const self = this;

    return (
      <div id="indexTest">
        <h1 onClick={self.onClick}>Welcome to CCtaps</h1>
      </div>
    );
  }
}

ReactDOM.render(<Hello />, document.getElementById('app-container'));