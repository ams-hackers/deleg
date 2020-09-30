import { useState, useReducer } from "react";
import { State, Word, executeWord, prelude } from "./lib/deleg";

export function useDeleg(
  initialState: State = { stack: [], dictionary: prelude }
) {
  const [state, execute] = useReducer(executeWord, initialState);

  const [recordState, setRecordState] = useState<Array<Word>>([]);
  const [isRecording, setIsRecording] = useState(false);

  const dispatch = (word: Word) => {
    execute(word);
    if (isRecording) {
      setRecordState((x: Array<Word>) => [...x, word]);
    }
  };

  return {
    stack: state.stack,
    dictionary: state.dictionary,
    executeName: (name: string) => dispatch({ type: "name", name }),
    pushLiteral: (value: any) => dispatch({ type: "literal", value }),
    startRecording: () => {
      setRecordState([]);
      setIsRecording(true);
    },
    stopRecording: () => {
      setIsRecording(false);
      execute({
        type: "literal",
        value: { type: "quotation", body: recordState },
      });
    },
    isRecording,
  };
}
