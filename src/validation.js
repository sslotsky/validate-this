function required(value) {
  if (!value) {
    return 'required'
  }
}

const customRules = {}

export function defineValidator(name, rule) {
  customRules[name] = rule
}

export default function validator(values, validations) {
  const errors = {}

  function validateFields(rule, fields) {
    fields.forEach(f => {
      const error = rule(values[f])
      if (error) {
        errors[f] = (errors[f] || []).concat(error)
      }
    })
  }

  const customValidator = Object.keys(customRules).reduce((v, name) => ({
    [name]: (...fieldNames) => {
      validateFields(customRules[name], fieldNames)
    },
    ...v
  }), {})

  const v = {
    require: (...fieldNames) => {
      validateFields(required, fieldNames)
    },
    validateChild: (field, childValidations) => {
      errors[name] = validator(values[field], childValidations)
    },
    validateChildren: (field, childValidations) => {
      errors[name] = valus[field].map(v => validator(v, childValidations))
    },
    ...customValidator
  }

  validations(v, values)

  return errors
}
