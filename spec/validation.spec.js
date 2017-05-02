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

    context('with a custom translator', () => {
      const translator = (message, field) => `${field}: ${message}`
      const errors = validator({ name: null }, v => {
        v.validate('name').required()
      }, translator)

      it('returns a translated message', () => {
        expect(errors.name).toInclude(translator('required', 'name'))
      })
    })

    describe('satisfies', () => {
      it('populates errors based on a custom rule', () => {
        const rule = () => 'error'
        const errors = validator({ name: 'invalid' }, v => {
          v.validate('name').satisfies(rule)
        })

        expect(errors.name).toInclude('error')
      })

      it('accepts multiple rules', () => {
        const rule1 = () => 'error1'
        const rule2 = () => 'error2'
        const errors = validator({ name: 'invalid' }, v => {
          v.validate('name').satisfies(rule1, rule2)
        })

        expect(errors.name).toEqual(['error1', 'error2'])
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
      context('when a child object does not exist', () => {
        const values = {}

        it('populates child errors', () => {
          const errors = validator(values, v => {
            v.validateChild('user', cv => {
              cv.validate('name').required()
            })
          })

          expect(errors.user.name).toExist()
        })
      })

      context('when a child object has no errors', () => {
        const values = {
          user: {
            name: 'samo'
          }
        }

        it('does not populate errors for the child', () => {
          const errors = validator(values, v => {
            v.validateChild('user', cv => {
              cv.validate('name').required()
            })
          })

          expect(errors.user).toNotExist()
        })
      })

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
      context('when the child array does not exist', () => {
        const values = {}

        it('does not populate errors', () => {
          const errors = validator(values, v => {
            v.validateChildren('contacts', cv => {
              cv.validate('name').required()
            })
          })

          expect(errors.contacts).toNotExist()
        })
      })

      context('when a child array has no errors', () => {
        const values = {
          contacts: [{
            name: 'samo'
          }]
        }

        it('does not populate errors for the child array', () => {
          const errors = validator(values, v => {
            v.validateChildren('contacts', cv => {
              cv.validate('name').required()
            })
          })

          expect(errors.contacts).toNotExist()
        })
      })

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
