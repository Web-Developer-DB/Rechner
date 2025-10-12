const OPERATORS = ['+', '-', '*', '/', '^'];
const PRECEDENCE = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 };
const RIGHT_ASSOC = { '^': true };

export const isOperator = (token) => OPERATORS.includes(token);

export const tokenize = (expression) => {
  if (!expression) {
    return [];
  }

  const out = [];
  let buffer = '';

  const pushNumber = () => {
    if (!buffer) {
      return;
    }
    out.push(buffer);
    buffer = '';
  };

  for (let i = 0; i < expression.length; i += 1) {
    let char = expression[i];

    if (char === ',') {
      char = '.';
    }

    if (/[0-9.]/.test(char)) {
      buffer += char;
      continue;
    }

    if (char === ' ') {
      pushNumber();
      continue;
    }

    if (isOperator(char) || char === '(' || char === ')') {
      pushNumber();
      out.push(char);
    }
  }

  pushNumber();
  return out;
};

export const toRpn = (tokens) => {
  const output = [];
  const stack = [];

  tokens.forEach((token) => {
    if (isOperator(token)) {
      while (
        stack.length > 0 &&
        isOperator(stack.at(-1)) &&
        (PRECEDENCE[stack.at(-1)] > PRECEDENCE[token] ||
          (PRECEDENCE[stack.at(-1)] === PRECEDENCE[token] && !RIGHT_ASSOC[token]))
      ) {
        output.push(stack.pop());
      }
      stack.push(token);
      return;
    }

    if (token === '(') {
      stack.push(token);
      return;
    }

    if (token === ')') {
      while (stack.length > 0 && stack.at(-1) !== '(') {
        output.push(stack.pop());
      }
      if (stack.at(-1) === '(') {
        stack.pop();
      }
      return;
    }

    output.push(token);
  });

  while (stack.length > 0) {
    output.push(stack.pop());
  }

  return output;
};

export const evalRpn = (rpnTokens) => {
  const stack = [];

  rpnTokens.forEach((token) => {
    if (isOperator(token)) {
      const b = parseFloat(stack.pop());
      const a = parseFloat(stack.pop());
      let result = 0;

      switch (token) {
        case '+':
          result = a + b;
          break;
        case '-':
          result = a - b;
          break;
        case '*':
          result = a * b;
          break;
        case '/':
          result = b === 0 ? NaN : a / b;
          break;
        case '^':
          result = Math.pow(a, b);
          break;
        default:
          result = NaN;
      }

      stack.push(String(result));
      return;
    }

    stack.push(token);
  });

  const finalValue = stack.pop();
  return finalValue === undefined ? NaN : parseFloat(finalValue);
};

export const evaluateExpression = (expression) => {
  const tokens = tokenize(expression);

  if (tokens.length === 0) {
    return { tokens, rpn: [], result: NaN };
  }

  const rpn = toRpn(tokens);
  const result = evalRpn(rpn);
  return { tokens, rpn, result };
};
