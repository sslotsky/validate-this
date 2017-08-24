import expect from 'expect'
import * as rules from '../src/rules'

describe('required', () => {
  context('with no value', () => {
    it('returns an error', () => {
      expect(rules.required()).toEqual('required')
    })
  })
  
  context('with a value', () => {
    it('returns nothing', () => {
      expect(rules.required('any value')).toBe(undefined)
    })
  })
})

describe('matches', () => {
  const rule = rules.matches('password')
  const values = { password: 'foo' }

  context('when values do not match', () => {
    it('returns an error', () => {
      expect(rule('bar', values)).toEqual('mismatch')
    })
  })

  context('when values match', () => {
    it('returns nothing', () => {
      expect(rule(values.password, values)).toBe(undefined)
    })
  })
})

describe('numeric', () => {
  context('when value is numeric', () => {
    it('returns nothing', () => {
      expect(rules.numeric('4')).toBe(undefined)
    })
  })

  context('when value is not numeric', () => {
    it('returns an error', () => {
      expect(rules.numeric('a4')).toEqual('expected_numeric')
    })
  })
})
