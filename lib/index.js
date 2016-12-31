'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineValidator = exports.validator = undefined;

var _validation = require('./validation');

Object.defineProperty(exports, 'defineValidator', {
  enumerable: true,
  get: function get() {
    return _validation.defineValidator;
  }
});

var _validation2 = _interopRequireDefault(_validation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.validator = _validation2.default;