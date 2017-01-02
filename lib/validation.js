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
      rule = _ref.rule,
      _ref$higherOrder = _ref.higherOrder,
      higherOrder = _ref$higherOrder === undefined ? false : _ref$higherOrder;

  customRules[name] = { rule: rule, higherOrder: higherOrder };
}

defineValidator({ name: 'require', rule: rules.required });

defineValidator({
  name: 'matches',
  higherOrder: true,
  rule: rules.matches
});

function validator(values, validations) {
  var errors = {};

  function validateFields(rule, fields) {
    fields.forEach(function (f) {
      var error = rule(values[f], values);
      if (error) {
        errors[f] = (errors[f] || []).concat(error);
      }
    });
  }

  var customValidator = Object.keys(customRules).reduce(function (v, name) {
    var config = customRules[name];
    var validation = config.higherOrder ? function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return function () {
        for (var _len2 = arguments.length, fieldNames = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          fieldNames[_key2] = arguments[_key2];
        }

        return validateFields(config.rule.apply(config, args), fieldNames);
      };
    } : function () {
      for (var _len3 = arguments.length, fieldNames = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        fieldNames[_key3] = arguments[_key3];
      }

      return validateFields(config.rule, fieldNames);
    };

    return _extends(_defineProperty({}, name, validation), v);
  }, {});

  var v = _extends({
    validateChild: function validateChild(field, childValidations) {
      errors[field] = validator(values[field], childValidations);
    },
    validateChildren: function validateChildren(field, childValidations) {
      errors[field] = values[field].map(function (v) {
        return validator(v, childValidations);
      });
    }
  }, customValidator);

  validations(v, values);

  return errors;
}