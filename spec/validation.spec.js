import expect from 'expect'
import validator, { defineValidator } from '../src/validation'

describe('defineValidator', () => {
  it('registers a validator with the given name', () => {
    defineValidator({
      name: 'custom',
      rule: () => {}
    })

    validator({}, v => {
      expect(v.custom).toExist()
    })
  })
})

describe('validator', () => {
  describe('default validators', () => {
    validator({}, v => {
      expect(v.require).toExist()
      expect(v.numeric).toExist()
      expect(v.matches).toExist()
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
            cv.require('name')
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
            cv.require('name')
          })
        })

        expect(errors.contacts[0].name).toExist()
      })
    })
  })
})
