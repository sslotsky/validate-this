import * as rules from './rules'

const customRules = {}

export function defineValidator({ name, rule }) {
  customRules[name] = { rule }
}

defineValidator({ name: 'required', rule: rules.required })
defineValidator({ name: 'isNumeric', rule: rules.numeric })

defineValidator({
  name: 'matches',
  rule: rules.matches
})

export default function validator(values, validations, translator = message => message) {
  const errors = {}

  function validateFields(rule, fields) {
    fields.forEach(f => {
      const error = translator(rule(values[f], values), f)
      if (error) {
        errors[f] = (errors[f] || []).concat(error)
      }
    })
  }

  function customValidator(fields) {
    return Object.keys(customRules).reduce((v, name) => {
      const config = customRules[name]
      const validation = (...args) => {
        const rule = args.length ? config.rule(...args) : config.rule
        return validateFields(rule, fields)
      }

      return {
        [name]: validation,
        ...v
      }
    }, {})
  }

  const v = {
    validateChild: (field, childValidations) => {
      errors[field] = validator(values[field], childValidations)
    },
    validateChildren: (field, childValidations) => {
      errors[field] = values[field].map(v => validator(v, childValidations))
    },
    validate: (...fields) => customValidator(fields)
  }

  validations(v, values)

  return errors
}
