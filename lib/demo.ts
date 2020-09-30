import { sym, showStack, execute } from "./stack";

const myState = { stack: [], dictionary: {} };
showStack(myState);

const newState = execute(myState, [
  42,
  5,
  sym("one-swap"),
  [1, "swap"],
  "def",
  "one-swap",
]);
showStack(newState);
