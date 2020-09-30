import { useReducer } from "react";
import { State, executeWord } from "./lib/deleg";

export function useDeleg(initialState: State = { stack: [], dictionary: {} }) {
  const [state, dispatch] = useReducer(executeWord, initialState);

  return {
    stack: state.stack,
    dictionary: state.dictionary,
    execute: dispatch,
  };
}
