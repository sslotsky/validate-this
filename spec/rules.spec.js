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
