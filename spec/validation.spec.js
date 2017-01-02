import expect from 'expect'
import validator, { defineValidator } from '../src/validation'

describe('validation', () => {
  describe('defineValidator', () => {
    it('registers a validator with the given name', () => {
      defineValidator({
        name: 'custom',
        rule: () => {}
      })

      validator({}, v => {
        expect(v.validate().custom).toExist()
      })
    })
  })

  describe('validator', () => {
    it('contains default validators', () => {
      validator({}, v => {
        expect(v.validate().required).toExist()
        expect(v.validate().isNumeric).toExist()
        expect(v.validate().matches).toExist()
      })
    })

    describe('matches', () => {
      context('when values match', () => {
        const errors = validator({ password: 'foo', confirm: 'foo' }, v => {
          v.validate('confirm').matches('password')
        })

        it('raises no errors', () => {
          expect(errors.confirm).toNotExist()
        })
      })

      context('when values do not match', () => {
        const errors = validator({ password: 'foo', confirm: 'bar' }, v => {
          v.validate('confirm').matches('password')
        })

        it('populates the errors object correctly', () => {
          expect(errors.confirm).toEqual(['mismatch'])
        })
      })
    })

    describe('validateChild', () => {
      context('when a child object has errors', () => {
        const values = {
          user: {
            name: null
          }
        }

        it('populates the errors object correctly', () => {
          const errors = validator(values, v => {
            v.validateChild('user', cv => {
              cv.validate('name').required()
            })
          })

          expect(errors.user.name).toExist()
        })
      })
    })

    describe('validateChildren', () => {
      context('when a child array item has errors', () => {
        const values = {
          contacts: [{
            name: null
          }]
        }

        it('populates the errors object correctly', () => {
          const errors = validator(values, v => {
            v.validateChildren('contacts', cv => {
              cv.validate('name').required()
            })
          })

          expect(errors.contacts[0].name).toExist()
        })
      })
    })
  })
})
