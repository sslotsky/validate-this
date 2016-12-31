'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.defineValidator = defineValidator;
exports.default = validator;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function required(value) {
  if (!value) {
    return 'required';
  }
}

var customRules = {};

function defineValidator(name, rule) {
  customRules[name] = rule;
}

function validator(values, validations) {
  var errors = {};

  function validateFields(rule, fields) {
    fields.forEach(function (f) {
      var error = rule(values[f]);
      if (error) {
        errors[f] = (errors[f] || []).concat(error);
      }
    });
  }

  var customValidator = Object.keys(customRules).reduce(function (v, name) {
    return _extends(_defineProperty({}, name, function () {
      for (var _len = arguments.length, fieldNames = Array(_len), _key = 0; _key < _len; _key++) {
        fieldNames[_key] = arguments[_key];
      }

      validateFields(customRules[name], fieldNames);
    }), v);
  }, {});

  var v = _extends({
    require: function require() {
      for (var _len2 = arguments.length, fieldNames = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        fieldNames[_key2] = arguments[_key2];
      }

      validateFields(required, fieldNames);
    },
    validateChild: function validateChild(field, childValidations) {
      errors[name] = validator(values[field], childValidations);
    },
    validateChildren: function validateChildren(field, childValidations) {
      errors[name] = valus[field].map(function (v) {
        return validator(v, childValidations);
      });
    }
  }, customValidator);

  validations(v, values);

  return errors;
}