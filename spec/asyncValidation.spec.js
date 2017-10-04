import expect from 'expect'
import { validator } from '../src/asyncValidation'

const required = (field, model) => {
  if (!model[field]) {
    return Promise.resolve('Required')
  }

  return Promise.resolve()
}

describe('asyncValidation', () => {
  describe('satisfies', () => {
    it('populates errors based on a custom rule', () => {
      const rule = () => Promise.resolve('error')

      return validator({ name: 'invalid' }, v => v(
        v.validate('name').satisfies(rule)
      )).then((errors) => {
        expect(errors.name).toInclude('error')
      })
    })

    it('accepts multiple rules', () => {
      const rule1 = () => Promise.resolve('error1')
      const rule2 = () => Promise.resolve('error2')

      return validator({ name: 'invalid' }, v => v(
        v.validate('name').satisfies(rule1, rule2)
      )).then((errors) => {
        expect(errors.name).toEqual(['error1', 'error2'])
      })
    })
  })

  describe('validateChild', () => {
    context('when a child object does not exist', () => {
      const values = {}

      it('populates child errors', () => {
        return validator(values, v => v(
          v.validateChild({ field: 'user' }, user => user(
            user.validate('name').satisfies(required)
          ))
        )).then((errors) => {
          expect(errors.user.name).toExist()
        })
      })
    })

    context('when a child object has no errors', () => {
      const values = {
        user: {
          name: 'samo'
        }
      }

      it('does not populate errors for the child', () => {
        return validator(values, v => v(
          v.validateChild('user', user => user(
            user.validate('name').satisfies(required)
          ))
        )).then((errors) => {
          expect(errors.user).toNotExist()
        })
      })
    })

    context('when a child object has errors', () => {
      const values = {
        user: {
          name: null
        }
      }

      it('populates the errors object correctly', () => {
        return validator(values, v => v(
          v.validateChild({ field: 'user' }, user => user(
            user.validate('name').satisfies(required)
          ))
        )).then((errors) => {
          expect(errors.user.name).toExist()
        })
      })
    })
  })

  describe('validateChildren', () => {
    context('when the child array does not exist', () => {
      const values = {}

      it('does not populate errors', () => {
        return validator(values, v => v(
          v.validateChildren({ field: 'contacts' }, contacts => contacts(
            contacts.validate('name').satisfies(required)
          ))
        )).then((errors) => {
          expect(errors.contacts).toNotExist()
        })
      })
    })

    context('when a child array has no errors', () => {
      const values = {
        contacts: [{
          name: 'samo'
        }]
      }

      it('does not populate errors for the child array', () => {
        return validator(values, v => v(
          v.validateChildren('contacts', contacts => contacts(
            contacts.validate('name').satisfies(required)
          ))
        )).then((errors) => {
          expect(errors.contacts).toNotExist()
        })
      })
    })

    context('when a child array item has errors', () => {
      const values = {
        contacts: [{
          name: null
        }]
      }

      it('populates the errors object correctly', () => {
        return validator(values, v => v(
          v.validateChildren({ field: 'contacts' }, contact => contact(
            contact.validate('name').satisfies(required)
          ))
        )).then((errors) => {
          expect(errors.contacts[0].name).toExist()
        })
      })
    })
  })
})
