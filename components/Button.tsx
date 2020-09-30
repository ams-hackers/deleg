import React from "react";
import {
  View,
  ViewStyle,
  Text,
  Pressable,
  StyleSheet,
  StyleProp,
} from "react-native";

export interface ButtonProps {
  title: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  onLongPress?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  style,
  onPress,
  onLongPress,
}) => {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={[styles.button, style]}
    >
      <View>
        <Text style={styles.buttonText}>{title}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 0,
    flexGrow: 1,
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
