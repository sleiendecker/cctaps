import React from 'react';
import BarGrid from './bar_grid';

export default React.createClass({
  render() {
    return (
      <div>
        {this.props.children || <BarGrid />}
      </div>
    );
  }
})