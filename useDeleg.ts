import { useReducer } from "react";
import { State, executeWord, prelude } from "./lib/deleg";

export function useDeleg(
  initialState: State = { stack: [], dictionary: prelude }
) {
  const [state, dispatch] = useReducer(executeWord, initialState);

  return {
    stack: state.stack,
    dictionary: state.dictionary,
    executeName: (name: string) => dispatch({ type: "name", name }),
    pushLiteral: (value: any) => dispatch({ type: "literal", value }),
  };
}
