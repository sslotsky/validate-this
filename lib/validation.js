'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.defineValidator = defineValidator;
exports.default = validator;

var _rules = require('./rules');

var rules = _interopRequireWildcard(_rules);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var customRules = {};

function defineValidator(_ref) {
  var name = _ref.name,
      rule = _ref.rule;

  customRules[name] = { rule: rule };
}

defineValidator({ name: 'required', rule: rules.required });
defineValidator({ name: 'isNumeric', rule: rules.numeric });

defineValidator({
  name: 'matches',
  rule: rules.matches
});

function validator() {
  var values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var validations = arguments[1];
  var translator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (message) {
    return message;
  };

  var errors = {};

  function validateFields(rule, fields) {
    fields.forEach(function (f) {
      var error = rule(values[f], values);
      if (error) {
        errors[f] = (errors[f] || []).concat(translator(error, f));
      }
    });
  }

  function customValidator(fields) {
    return Object.keys(customRules).reduce(function (v, name) {
      var config = customRules[name];
      var validation = function validation() {
        var rule = arguments.length ? config.rule.apply(config, arguments) : config.rule;
        return validateFields(rule, fields);
      };

      return _extends(_defineProperty({}, name, validation), v);
    }, {
      satisfies: function satisfies(rule) {
        return validateFields(rule, fields);
      }
    });
  }

  var v = {
    validateChild: function validateChild(field, childValidations) {
      errors[field] = validator(values[field], childValidations);
    },
    validateChildren: function validateChildren(field, childValidations) {
      errors[field] = values[field].map(function (v) {
        return validator(v, childValidations);
      });
    },
    validate: function validate() {
      for (var _len = arguments.length, fields = Array(_len), _key = 0; _key < _len; _key++) {
        fields[_key] = arguments[_key];
      }

      return customValidator(fields);
    }
  };

  validations(v, values);

  return errors;
}