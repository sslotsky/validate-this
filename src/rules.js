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

export function numeric(n) {
  if (isNaN(parseFloat(n)) || !isFinite(n)) {
    return 'expected_numeric'
  }
}
