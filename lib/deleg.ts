export type Value = any;
export type Stack = Array<Value>;
export type Quotation = { type: "quotation"; body: Array<Word> };

export type Name = { type: "name"; name: string };
export type Literal = { type: "literal"; value: Value };
export type Word = Literal | Name;

export type Color = number;

type PrimitiveFunction = (state: State) => State;
export type Dictionary = { [name: string]: Quotation | PrimitiveFunction };
export type State = {
  stack: Stack;
  fill: Color;
  stroke: Color;
  dictionary: Dictionary;
};

// primitives
const swap = (state: State): State => ({
  ...state,
  stack: [state.stack[1], state.stack[0], ...state.stack.slice(2)],
});

const dup = (state: State): State => ({
  ...state,
  stack: [state.stack[0], state.stack[0], ...state.stack.slice(1)],
});

const drop = (state: State): State => ({
  ...state,
  stack: state.stack.slice(1),
});

const def = (state: State): State => {
  const name = state.stack[1];
  const body = state.stack[0];

  if (typeof name !== "object" || typeof name.name === "undefined") {
    throw new Error(`Expected symbol for definition name: ${name}`);
  }

  if (typeof body !== "object" || body.type !== "quotation") {
    throw new Error(`Expected quotation for definition body: ${body}`);
  }

  return {
    ...state,
    stack: state.stack.slice(2),
    dictionary: {
      ...state.dictionary,
      [name.name]: body,
    },
  };
};

export const prelude: Dictionary = {
  swap,
  dup,
  drop,
  def,
};

// core
export const push = (value: Value, state: State): State => ({
  ...state,
  stack: [value, ...state.stack],
});

export function executeWord(state: State, word: Word): State {
  if (word.type === "literal") {
    return push(word.value, state);
  } else if (word.name in state.dictionary) {
    const def = state.dictionary[word.name];
    if (def instanceof Function) {
      return def(state);
    } else {
      return executeQuotation(state, def);
    }
  } else {
    throw new Error(`Unknown word: ${word}`);
  }
}

export function executeQuotation(state: State, words: Quotation): State {
  return words.body.reduce(executeWord, state);
}

//  utils
const showValue = (value: Value): string =>
  typeof value === "number"
    ? `${value}`
    : value instanceof Array
    ? `[...]`
    : `\\${value.name}`;

export const showStack = (state: State) =>
  console.log(
    `<${state.stack.length}> ${state.stack
      .slice()
      .reverse()
      .map(showValue)
      .join(" ")}`
  );
