import React      from 'react';
import ReactDOM   from 'react-dom';
import {
  Router,
  Route,
  hashHistory,
  IndexRoute
} from 'react-router';
import BeerGrid   from './beer_grid';
import BarGrid    from './bar_grid';
import App        from './app';

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={BarGrid} />
      <Route path="/bar/:barID" component={BeerGrid}/>
    </Route>
  </Router>
), document.getElementById('app-container'));
