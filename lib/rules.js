'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.required = required;
exports.matches = matches;
exports.numeric = numeric;
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

function numeric(value) {
  if (value && !/\d+/.test(value)) {
    return 'expected_numeric';
  }
}