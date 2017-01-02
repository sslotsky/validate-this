[![Build Status](https://travis-ci.org/sslotsky/validate-this.svg?branch=master)](https://travis-ci.org/sslotsky/validate-this)
[![Build Status](https://travis-ci.org/sslotsky/validate-this.svg?branch=master)](https://travis-ci.org/sslotsky/validate-this)


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
    v.require('username', 'email') // the require() validation is built into the package
    v.email('email')               // the email() validation is defined below as a custom validation, read on!
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

In the most simple case, a rule accepts a `value` and returns a string if and only if the `value` is invalid.

```javascript
import email from 'email-validator'
import { defineValidator } from 'validate-this'

defineValidator({
  name: 'email',
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
  higherOrder: true,
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
    v.require('username', 'email', 'password', 'confirm')
    v.email('email')
    v.matches('password')('confirm')
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
      a.require('street')
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
      cv.require('name', 'email')
    })
  })
}
```
