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

export default function validator(values = {}, validations, translator = message => message) {
  const errors = {}

  function validateFields(rules, fields) {
    fields.forEach(f => {
      rules.forEach(rule => {
        const error = rule(values[f], values)
        if (error) {
          errors[f] = (errors[f] || []).concat(translator(error, f))
        }
      })
    })
  }

  function customValidator(fields) {
    return Object.keys(customRules).reduce((v, name) => {
      const config = customRules[name]
      const validation = (...args) => {
        const rule = args.length ? config.rule(...args) : config.rule
        return validateFields([rule], fields)
      }

      return {
        [name]: validation,
        ...v
      }
    }, {
      satisfies: (...rules) => validateFields(rules, fields)
    })
  }

  const v = {
    validateChild: (field, childValidations, childTranslator = translator) => {
      const childErrors = validator(values[field] || {}, childValidations, childTranslator)

      if (Object.keys(childErrors).length > 0) {
        errors[field] = childErrors
      }
    },
    validateChildren: (field, childValidations, childTranslator = translator) => {
      const childErrors = (values[field] || []).map(v => validator(v, childValidations, childTranslator))
      if (childErrors.some(e => Object.keys(e).length > 0)) {
        errors[field] = childErrors
      }
    },
    validate: (...fields) => customValidator(fields)
  }

  validations(v, values)

  return errors
}
