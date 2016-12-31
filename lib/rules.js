'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.required = required;
exports.matches = matches;
function required(value) {
  if (!value) {
    return 'required';
  }
}

function matches(fieldName) {
  return function (val, values) {
    if (val !== values[fieldName]) {
      return 'mismatch';
    }
  };
}