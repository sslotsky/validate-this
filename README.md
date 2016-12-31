# validate-this

`validate-this` is a validation library that applies validation rules to structured form data. It also allows you to define your own validation rules.

## Defining a Custom Validation

```javascript
import email from 'email-validator'
import { defineValidator } from 'validate-this'

defineValidator('email', value => {
  if (value && !email.validate(value)) {
    return 'email_invalid'
  }
})
```

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
    v.email('email')               // the email() validation was defined above as a custom validation
  })
}
```

Calling the function with the `formData` we defined previously will return an `errors` object like this:

```javascript
{
  username: 'required',
  email: 'email_invalid'
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
