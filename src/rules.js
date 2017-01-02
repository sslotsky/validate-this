export function required(value) {
  if (!value) {
    return 'required'
  }
}

export function matches(fieldName) {
  return (val, values) => {
    if (val !== values[fieldName]) {
      return 'mismatch'
    } 
  }
}

export function numeric(value) {
  debugger
  if (value && !/\d+/.test(value)) {
    return 'expected_numeric'
  }
}
