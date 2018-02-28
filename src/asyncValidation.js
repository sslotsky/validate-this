export function validator(model, validations) {
  const errors = {}

  const applyError = (f, message) => {
    errors[f] = (errors[f] || []).concat(message)
  }

  const validateField = rule => f =>
    rule(f, model).then(message => {
      if (message) {
        applyError(f, message)
      }
    })

  const rules = fields => ({
    satisfies: (...rules) => {
      return Promise.all(
        rules.reduce(
          (all, rule) => all.concat(fields.map(validateField(rule))),
          []
        )
      )
    }
  })

  const collect = (...facts) => Promise.all(facts)
  const scope = {
    validate: (...fields) => rules(fields),
    validateChild: (
      { field, drill = () => model[field] },
      childValidations
    ) => {
      return validator(
        drill(model, field) || {},
        childValidations
      ).then(childErrors => {
        if (Object.keys(childErrors).length > 0) {
          errors[field] = childErrors
        }
      })
    },
    validateChildren: (
      { field, drill = () => model[field] },
      childValidations
    ) => {
      const children = (drill(model, field) || [])
        .map(v => validator(v, childValidations))
      return Promise.all(children).then(childErrors => {
        if (childErrors.some(e => Object.keys(e).length > 0)) {
          errors[field] = childErrors
        }
      })
    }
  }

  return validations(collect, scope).then(() => errors)
}
