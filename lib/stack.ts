export type Sym = { name: string };
type Word = number | string | Sym | Quotation;
type Quotation = Array<Word>;

export type Value = number | Sym | Quotation;
type Stack = Array<Value>;
type Dictionary = { [name: string]: Quotation };
type State = {
  stack: Stack;
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

  if (typeof name !== "object" || name instanceof Array) {
    throw new Error(`Expected symbol for definition name: ${name}`);
  }

  if (!(body instanceof Array)) {
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

type PrimitiveFunction = (state: State) => State;
const primitives: { [word: string]: PrimitiveFunction } = {
  swap,
  dup,
  drop,
  def,
};

// core
const push = (value: Value, state: State): State => ({
  ...state,
  stack: [value, ...state.stack],
});

export function executeWord(state: State, word: Word): State {
  if (typeof word === "number" || typeof word === "object") {
    return push(word, state);
  } else if (word in state.dictionary) {
    return execute(state, state.dictionary[word]);
  } else if (word in primitives) {
    return primitives[word](state);
  } else {
    throw new Error(`Unknown word: ${word}`);
  }
}

export function execute(state: State, words: Quotation): State {
  return words.reduce(executeWord, state);
}
