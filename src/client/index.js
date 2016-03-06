import React                         from 'react';
import ReactDOM                      from 'react-dom';
import BeerGrid                      from './beer_grid';

window.onload = () => {
  console.log('am i getting here index');
  ReactDOM.render(<BeerGrid />, document.getElementById('app-container'));
};