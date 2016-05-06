import React from 'react';
import BarGrid from './bar_grid';

export default React.createClass({
  render() {
    return (
      <div>
        <h4 id="mainTitle">CCtaps</h4>
        <h5 id="subTitle">Find the best beers in Charm City</h5>
        {this.props.children || <BarGrid />}
      </div>
    );
  }
})