import React, { useState, useRef } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
  StyleProp,
  KeyboardAvoidingView,
  Text,
} from "react-native";
import { useDeleg } from "./useDeleg";
import { Color, pop, push, State, prelude } from "./lib/deleg";

// Must match the app.json androidNavigationBar's background color.
const KEYPAD_BACKGROUND_COLOR = "#78b9ff";

import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import { Svg, Circle, Rect, G } from "react-native-svg";

import { Button, ButtonProps } from "./components/Button";

function DisplayValue({ value }: { value: any }) {
  if (React.isValidElement(value)) {
    return <Canvas>{value}</Canvas>;
  } else if (typeof value === "number") {
    return <Text>{value}</Text>;
  }
}

const Canvas: React.FC = ({ children }) => {
  return (
    <Svg
      preserveAspectRatio="xMidYMid meet"
      height="100%"
      width="100%"
      style={{ backgroundColor: "lightblue" }}
      viewBox="-100 -100 200 200"
    >
      {children}
    </Svg>
  );
};

function Display({ state }: { state: State }) {
  const [tosView, setTosView] = useState(false);
  return (
    <View style={{ width: "100%", aspectRatio: 1 }}>
      <View style={{ flexDirection: "row", height: 30 }}>
        <Button onPress={() => setTosView(true)} title="TOS" />
        <Button onPress={() => setTosView(false)} title="Stack" />
      </View>

      <View
        style={{
          borderColor: colorToString(state.stroke),
          backgroundColor: colorToString(state.fill),
          width: 10,
          height: 10,
        }}
      />

      {tosView ? (
        <DisplayValue value={state.stack[0]} />
      ) : (
        state.stack
          .slice(0)
          .reverse()
          .map((item, ix) => {
            return (
              <View key={ix} style={{ height: 40 }}>
                <DisplayValue value={item} />
              </View>
            );
          })
      )}
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

function rnd(state: State): State {
  const range = state.stack[0];
  if (typeof range !== "number") {
    throw new Error(`Expected number for range: ${range}`);
  }
  return {
    ...state,
    stack: [Math.random() * range, ...state.stack.slice(1)],
  };
}

function colorToString(color: Color) {
  return "#" + color.toString(16).padStart(6, "0");
}

const initialState: State = {
  stack: [],
  fill: 0xff0000,
  stroke: 0,
  dictionary: {
    ...prelude,
    scale,
    rnd,
    F1: { type: "quotation", body: [] },
    F2: { type: "quotation", body: [] },
    F3: { type: "quotation", body: [] },

    circle: (state: State) => {
      return push(
        <Circle
          cx="0"
          cy="0"
          r="10"
          fill={colorToString(state.fill)}
          stroke={colorToString(state.stroke)}
        />,
        state
      );
    },

    rect: (state: State) => {
      return push(
        <Rect
          x={-10}
          y={-10}
          width={20}
          height={20}
          fill={colorToString(state.fill)}
          stroke={colorToString(state.stroke)}
        />,
        state
      );
    },

    green: (state: State) => {
      return push(0x00ff00, state);
    },
    blue: (state: State) => {
      return push(0x0000ff, state);
    },
    red: (state: State) => {
      return push(0xff0000, state);
    },

    setStroke: (state: State) => {
      const [color, newstate] = pop(state);
      return {
        ...newstate,
        stroke: color,
      };
    },
    setFill: (state: State) => {
      const [color, newstate] = pop(state);
      return {
        ...newstate,
        fill: color,
      };
    },
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
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
}

const Keypad: React.FC<KeypadProps> = ({
  onEnteringMode,
  executeName,
  pushLiteral,
  isRecording,
  startRecording,
  stopRecording,
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
          executeName("circle");
        }}
      />
      <Op
        title="Rect"
        onPress={() => {
          executeName("rect");
        }}
      />
      <Op
        title="Green"
        onPress={() => {
          executeName("green");
        }}
      />
      <Op
        title="set fill"
        onPress={() => {
          executeName("setFill");
        }}
      />
      <Op
        title="set stroke"
        onPress={() => {
          executeName("setStroke");
        }}
      />

      <Op
        title="Scale"
        onPress={() => {
          executeName("scale");
        }}
      />
      <Op
        title="RND"
        onPress={() => {
          executeName("rnd");
        }}
      />
      <Op
        title={isRecording ? "✅" : "⏺"}
        onPress={isRecording ? stopRecording : startRecording}
      />
      <Op
        title="F1"
        onPress={() => {
          executeName("F1");
        }}
        onLongPress={() => {
          pushLiteral({ type: "name", name: "F1" });
          executeName("swap");
          executeName("def");
        }}
      />
      <Op
        title="F2"
        onPress={() => {
          executeName("F2");
        }}
        onLongPress={() => {
          pushLiteral({ type: "name", name: "F2" });
          executeName("swap");
          executeName("def");
        }}
      />
      <Op
        title="F3"
        onPress={() => {
          executeName("F3");
        }}
        onLongPress={() => {
          pushLiteral({ type: "name", name: "F3" });
          executeName("swap");
          executeName("def");
        }}
      />
    </View>
  );
};

export default function App() {
  const [enteringMode, setEnteringMode] = useState(false);
  const {
    state,
    executeName,
    pushLiteral,
    startRecording,
    stopRecording,
    isRecording,
  } = useDeleg(initialState);

  const inputRef = useRef<TextInput>(null);

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <Layout
          style={{ flex: 1 }}
          display={<Display state={state} />}
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
                isRecording={isRecording}
                startRecording={startRecording}
                stopRecording={stopRecording}
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
              returnKeyType="done"
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
