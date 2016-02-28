'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _griddle = require('griddle');

var _griddle2 = _interopRequireDefault(_griddle);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Barlist extends _react2.default.Component {
  render() {
    return _react2.default.createElement(
      'h1',
      null,
      'Bars'
    );
  }
}

_reactDom2.default.render(_react2.default.createElement(Barlist, null), document.getElementById('app-container'));
