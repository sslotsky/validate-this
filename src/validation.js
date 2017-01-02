import * as rules from './rules'

const customRules = {}

export function defineValidator({ name, rule, higherOrder = false }) {
  customRules[name] = { rule, higherOrder }
}

defineValidator({ name: 'require', rule: rules.required })
defineValidator({ name: 'numeric', rule: rules.numeric })

defineValidator({
  name: 'matches',
  higherOrder: true,
  rule: rules.matches
})

export default function validator(values, validations) {
  const errors = {}

  function validateFields(rule, fields) {
    fields.forEach(f => {
      const error = rule(values[f], values)
      if (error) {
        errors[f] = (errors[f] || []).concat(error)
      }
    })
  }

  const customValidator = Object.keys(customRules).reduce((v, name) => {
    const config = customRules[name]
    const validation = config.higherOrder ?
      (...args) => (...fieldNames) =>
        validateFields(config.rule(...args), fieldNames) :
      (...fieldNames) =>
        validateFields(config.rule, fieldNames)

    return {
      [name]: validation,
      ...v
    }
  }, {})

  const v = {
    validateChild: (field, childValidations) => {
      errors[field] = validator(values[field], childValidations)
    },
    validateChildren: (field, childValidations) => {
      errors[field] = values[field].map(v => validator(v, childValidations))
    },
    ...customValidator
  }

  validations(v, values)

  return errors
}
