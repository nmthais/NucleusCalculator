// Recursive-descent parser for arithmetic expressions. It deliberately avoids eval().
export function calculate(expression) {
  if (typeof expression !== 'string' || expression.length === 0 || expression.length > 200) {
    throw new Error('Expression must be a string between 1 and 200 characters.');
  }

  const input = expression.replace(/\s+/g, '');
  let position = 0;

  function parseExpression() {
    let value = parseTerm();
    while (input[position] === '+' || input[position] === '-') {
      const operator = input[position++];
      const right = parseTerm();
      value = operator === '+' ? value + right : value - right;
    }
    return value;
  }

  function parseTerm() {
    let value = parseUnary();
    while (input[position] === '*' || input[position] === '/') {
      const operator = input[position++];
      const right = parseUnary();
      if (operator === '/' && right === 0) throw new Error('Cannot divide by zero.');
      value = operator === '*' ? value * right : value / right;
    }
    return value;
  }

  function parseUnary() {
    if (input[position] === '+') {
      position++;
      return parseUnary();
    }
    if (input[position] === '-') {
      position++;
      return -parseUnary();
    }
    return parsePrimary();
  }

  function parsePrimary() {
    if (input[position] === '(') {
      position++;
      const value = parseExpression();
      if (input[position] !== ')') throw new Error('Missing closing parenthesis.');
      position++;
      return value;
    }

    const start = position;
    let decimalSeen = false;
    while (position < input.length) {
      const character = input[position];
      if (character >= '0' && character <= '9') {
        position++;
      } else if (character === '.' && !decimalSeen) {
        decimalSeen = true;
        position++;
      } else {
        break;
      }
    }

    const numberText = input.slice(start, position);
    if (!numberText || numberText === '.') throw new Error('Expected a number.');
    const value = Number(numberText);
    if (!Number.isFinite(value)) throw new Error('Number is out of range.');
    return value;
  }

  const result = parseExpression();
  if (position !== input.length) throw new Error(`Unexpected character: ${input[position]}`);
  if (!Number.isFinite(result)) throw new Error('Result is out of range.');
  return result;
}
