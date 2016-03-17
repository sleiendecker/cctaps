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

ReactDOM.render(<BeerGrid />, document.getElementById('app-container'));
