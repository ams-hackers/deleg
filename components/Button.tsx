import React from "react";
import {
  View,
  ViewStyle,
  Text,
  TouchableNativeFeedback,
  StyleSheet,
  StyleProp,
} from "react-native";

export interface ButtonProps {
  title: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ title, style, onPress }) => {
  return (
    <TouchableNativeFeedback
      onPress={onPress}
      style={{ borderWidth: 0, flexGrow: 1 }}
    >
      <View style={[styles.button, style]}>
        <Text style={styles.buttonText}>{title}</Text>
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#0053ab",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowOpacity: 0.5,
    shadowOffset: { height: 2, width: 0 },
  },
  buttonText: {
    fontSize: 10,
    color: "white",
    fontWeight: "bold",
  },
});
