import {
  compose,
  createStore,
applyMiddleware }   from 'redux';
import React        from 'react';
import ReactDOM     from 'react-dom';
import {
  Router,
  Route,
  hashHistory,
  IndexRoute
} from 'react-router';
import { Provider } from 'react-redux';
import BeerGrid     from './beer_grid';
import BarGrid      from './bar_grid';
import reducers     from './reducers';
import App          from './app';

let store = createStore(reducers);

ReactDOM.render((
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={BarGrid} />
        <Route path="/bar/:barID" component={BeerGrid}/>
      </Route>
    </Router>
  </Provider>
), document.getElementById('app-container'));
