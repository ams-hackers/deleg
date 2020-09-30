import React, { useState, useRef } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
  StyleProp,
  KeyboardAvoidingView,
} from "react-native";

// Must match the app.json androidNavigationBar's background color.
const KEYPAD_BACKGROUND_COLOR = "#78b9ff";

import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import { Svg, Rect, Circle, Path } from "react-native-svg";

import { Button, ButtonProps } from "./components/Button";

function Display() {
  return (
    <View style={{ width: "100%", aspectRatio: 1 }}>
      <Svg
        preserveAspectRatio="xMidYMid meet"
        height="100%"
        width="100%"
        style={{ backgroundColor: "lightblue" }}
        viewBox="0 0 100 100"
      >
        <Rect x="0" y="0" width="100" height="100" fill="#bbb" />
        <Circle cx="50" cy="50" r="30" fill="yellow" />
        <Circle cx="40" cy="40" r="4" fill="black" />
        <Circle cx="60" cy="40" r="4" fill="black" />
        <Path d="M 40 60 A 10 10 0 0 0 60 60" stroke="black" />
      </Svg>
    </View>
  );
}

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
}

const Keypad: React.FC<KeypadProps> = ({ onEnteringMode }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
      }}
    >
      <Op title="DUP" onPress={() => {}} />
      <Op title="SWAP" onPress={() => {}} />
      <Op title="DROP" onPress={() => {}} />
      <Op title="NUM" onPress={onEnteringMode} />
      <Op title="+" onPress={() => {}} />
      <Op title="*" onPress={() => {}} />
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

  const inputRef = useRef<TextInput>(null);

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <Layout
          style={{ flex: 1 }}
          display={<Display />}
          keypad={
            <SafeAreaView
              style={{
                flexGrow: 1,
                backgroundColor: KEYPAD_BACKGROUND_COLOR,
              }}
              edges={["bottom"]}
            >
              <Keypad onEnteringMode={() => setEnteringMode(true)} />
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
              onSubmitEditing={() => {
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
