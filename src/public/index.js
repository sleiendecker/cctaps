import React                         from 'react';
import ReactDOM                      from 'react-dom';
import { Provider }                  from 'react-redux';
import { Router, IndexRoute, Route } from 'react-router';

import BarList                       from './bars';


ReactDOM.render(
  <Provider>
    <Router>
      <Route path="/" component={App}>
        <IndexRoute onEnter={ defaultPage: '/' }/>
        <Route path="map" component={MapContainer} />
      </Route>
    </Router>
  </Provider>, document.getElementById('container')
);