import React, { useState, useRef } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
  StyleProp,
  KeyboardAvoidingView,
} from "react-native";
import { useDeleg } from "./useDeleg";
import { State, prelude } from "./lib/deleg";

// Must match the app.json androidNavigationBar's background color.
const KEYPAD_BACKGROUND_COLOR = "#78b9ff";

import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import { Svg, Rect, Circle, Path, G } from "react-native-svg";

import { Button, ButtonProps } from "./components/Button";

function Display({ stack }: { stack: Array<any> }) {
  return (
    <View style={{ width: "100%", aspectRatio: 1 }}>
      <Svg
        preserveAspectRatio="xMidYMid meet"
        height="100%"
        width="100%"
        style={{ backgroundColor: "lightblue" }}
        viewBox="-100 -100 200 200"
      >
        {/*
        <Rect x="0" y="0" width="100" height="100" fill="#bbb" />
        <Circle cx="50" cy="50" r="30" fill="yellow" />
        <Circle cx="40" cy="40" r="4" fill="black" />
        <Circle cx="60" cy="40" r="4" fill="black" />
        <Path d="M 40 60 A 10 10 0 0 0 60 60" stroke="black" />
        */}

        {React.Children.map(
          stack
            .slice(0)
            .reverse()
            .filter((value) => React.isValidElement(value)),
          (elem, ix) => (
            <React.Fragment key={ix}>{elem}</React.Fragment>
          )
        )}
      </Svg>
    </View>
  );
}

function scale(state: State): State {
  const factor = state.stack[0];
  const element = state.stack[1];

  if (typeof factor !== "number") {
    throw new Error(`Expected number for factor: ${factor}`);
  }

  if (!React.isValidElement(element)) {
    throw new Error(`Expected SVG element to scale: ${element}`);
  }

  const newElem = <G transform={`scale(${factor})`}>{element}</G>;

  return {
    ...state,
    stack: [newElem, ...state.stack.slice(2)],
  };
}

const initialState: State = {
  stack: [],
  dictionary: {
    ...prelude,
    scale,
  },
};

function Op(props: ButtonProps) {
  return <Button style={[styles.op, props.style]} {...props} />;
}

interface LayoutProps {
  display: React.ReactNode;
  keypad: React.ReactNode;
  style: StyleProp<ViewStyle>;
}

const Layout: React.FC<LayoutProps> = ({ display, keypad, style }) => {
  return (
    <View style={style}>
      <View style={{ flex: 1, justifyContent: "center" }}>{display}</View>
      <View>{keypad}</View>
    </View>
  );
};

interface KeypadProps {
  onEnteringMode: () => void;
  executeName: (name: string) => void;
  pushLiteral: (value: any) => void;
}

const Keypad: React.FC<KeypadProps> = ({
  onEnteringMode,
  executeName,
  pushLiteral,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
      }}
    >
      <Op
        title="DUP"
        onPress={() => {
          executeName("dup");
        }}
      />
      <Op
        title="SWAP"
        onPress={() => {
          executeName("swap");
        }}
      />
      <Op
        title="DROP"
        onPress={() => {
          executeName("drop");
        }}
      />
      <Op title="NUM" onPress={onEnteringMode} />
      <Op
        title="Circle"
        onPress={() => {
          pushLiteral(
            <Circle cx="0" cy="0" r="10" fill="red" stroke="white" />
          );
        }}
      />
      <Op
        title="Scale"
        onPress={() => {
          executeName("scale");
        }}
      />
      <Op title="-" onPress={() => {}} />
      <Op title="/" onPress={() => {}} />
      <Op title="NEG" onPress={() => {}} />
      <Op title="C" onPress={() => {}} />
      <Op title="RND" onPress={() => {}} />
      <Op title="√" onPress={() => {}} />
      <Op title="1/x" onPress={() => {}} />
      <Op title="π" onPress={() => {}} />
      <Op title="e" onPress={() => {}} />
      <Op title="UNDO" onPress={() => {}} />
      <Op title="REDO" onPress={() => {}} />
    </View>
  );
};

export default function App() {
  const [enteringMode, setEnteringMode] = useState(false);
  const { stack, executeName, pushLiteral } = useDeleg(initialState);

  console.log(stack);

  const inputRef = useRef<TextInput>(null);

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <Layout
          style={{ flex: 1 }}
          display={<Display stack={stack} />}
          keypad={
            <SafeAreaView
              style={{
                flexGrow: 1,
                backgroundColor: KEYPAD_BACKGROUND_COLOR,
              }}
              edges={["bottom"]}
            >
              <Keypad
                onEnteringMode={() => setEnteringMode(true)}
                executeName={executeName}
                pushLiteral={pushLiteral}
              />
            </SafeAreaView>
          }
        />

        {enteringMode && (
          <KeyboardAvoidingView
            behavior="padding"
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              justifyContent: "center",
            }}
          >
            <TextInput
              style={styles.input}
              autoFocus
              ref={inputRef}
              keyboardType="numeric"
              onSubmitEditing={(ev) => {
                pushLiteral(parseFloat(ev.nativeEvent.text));
                inputRef.current?.clear();
                setEnteringMode(false);
              }}
            />
          </KeyboardAvoidingView>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  op: {
    height: 50,
    width: `${100 / 7}%`,
    margin: 5,
    flexGrow: 1,
  },

  input: {
    backgroundColor: "white",
    elevation: 2,
    shadowRadius: 5,
    shadowOpacity: 0.5,
    margin: 20,
    padding: 20,
  },
});
