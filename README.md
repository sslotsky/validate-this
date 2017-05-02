[![Build Status](https://travis-ci.org/sslotsky/validate-this.svg?branch=master)](https://travis-ci.org/sslotsky/validate-this)
[![codecov](https://codecov.io/gh/sslotsky/validate-this/branch/master/graph/badge.svg)](https://codecov.io/gh/sslotsky/validate-this)


# validate-this

`validate-this` is a validation library that applies validation rules to structured form data. It also allows you to define your own validation rules.

## Validating Form Data

Imagining that we have structured form data that looks like:

```javascript
const formData = {
  username: '',
  email: 'bob'
}
```

Then we could pass that object into the function below:

```javascript
import { validator } from 'validate-this'

function validate(values) {
  return validator(values, v => {
    v.validate('username', 'email').required() // the required() validation is built into the package
    v.validate('email').isValidEmail()         // the email() validation is defined below as a custom validation, read on!
  })
}
```

Calling the function with the `formData` we defined previously will return an `errors` object like this:

```javascript
{
  username: ['required'],
  email: ['email_invalid']
}
```
## Defining a Custom Validation

There are two ways to do your own validations: by using the `satisfies` validation,
or by using `defineValidator`.

### .satisfies(...rules)

Call this with your own validation rule(s). Example:

```javascript
import email from 'email-validator'

function isValidEmail(value) {
  if (value && !email.validate(value)) {
    return 'email_invalid'
  }
}

function validate(values) {
  return validator(values, v => {
    v.validate('email').satisfies(isValidEmail)
  })
}
```

Or with multiple rules:

```javascript
function greaterThan(n) {
  return value => {
    if (value <= n) {
      return 'too_small'
    }
  }
}

function lessThan(n) {
  return value => {
    if (value >= n) {
      return 'too_big'
    }
  }
}

function validate(values) {
  return validator(values, v => {
    v.validate('age').satisfies(greaterThan(17), lessThan(26))
  })
}
```

### defineValidator(config)

In the most simple case, a rule accepts a `value` and returns a string if and only if the `value` is invalid.

```javascript
import email from 'email-validator'
import { defineValidator } from 'validate-this'

defineValidator({
  name: 'isValidEmail',
  rule: value => {
    if (value && !email.validate(value)) {
      return 'email_invalid'
    }
  }
})
```

For more complex cases, a higher order rule can be defined. The example below is built into
`validate-this` but makes a good demonstration.

```javascript
defineValidator({
  name: 'matches',
  rule: fieldName => (val, values) => {
    if (val !== values[fieldName]) {
      return 'mismatch'
    } 
  }
})
```

This will validate that one field matches another. Here's a validation function that uses this
validator:

```javascript
function validate(values) {
  return validator(values, v => {
    v.validate('username', 'email', 'password', 'confirm').required()
    v.validate('email').isValidEmail()
    v.validate('confirm').matches('password')
  })
}
```

## Deep Validation

If your form data is like this instead:

```javascript
const formData = {
  name: 'Bob',
  address: {
    street: '123 Fake St'
  }
}
```

Then you can validate the `address` property like this:


```javascript
import { validator } from 'validate-this'

function validate(values) {
  return validator(values, v => {
    v.validateChild('address', av => {
      av.validate('street').required()
    })
  })
}
```

Or if there's a nested array:

```javascript
const formData = {
  contacts: [{
    name: 'bob',
    email: 'bob@example.com'
  }]
}
```

Then you can validate those like this:

```javascript
import { validator } from 'validate-this'

function validate(values) {
  return validator(values, v => {
    v.validateChildren('contacts', cv => {
      cv.validate('name', 'email').required()
    })
  })
}
```

## Message translation

A third argument can be provided to the `validator` function that will allow you to
translate error messages using something like `I18n`. Example:

```javascript
function validate(values) {
  return validator(values, v => {
    v.validate('username', 'password', 'confirm').required()
    v.validate('confirm').matches('password')
  }, (message, field) => I18n.t(`forms.newUser.${field}.${message}`))
}
```
