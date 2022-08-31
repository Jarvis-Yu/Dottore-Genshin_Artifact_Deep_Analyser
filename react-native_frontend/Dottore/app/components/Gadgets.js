import { lightTheme } from "../styles/Styles";
import { TouchableHighlight, View, Text, StyleSheet } from "react-native";

/**
 * @param {string} optionKey
 * @param {string} title
 * @param {function} onPress
 * @param {Object} theme
 * @param {boolean} selected
 * @returns
 */
export function Option({
  title = "",
  onPress = (f) => f,
  theme = lightTheme,
  selected = false,
  touchableStyle = {},
  viewStyle = {},
}) {
  return (
    <TouchableHighlight
      style={[styles.option, touchableStyle]}
      underlayColor={theme.colors.selected}
      onPress={onPress}
    >
      <View
        style={[
          {
            backgroundColor: selected ? theme.colors.selected : theme.colors.notSelected,
            padding: 5,
          },
          viewStyle,
        ]}
      >
        <Text style={{ color: theme.colors.textContrast }}>{title}</Text>
      </View>
    </TouchableHighlight>
  );
}

export function TouchableText({
  title = "",
  onPress = undefined,
  theme = lightTheme,
  contrastText = false,
  underlayColor = undefined,
  style = {},
}) {
  const onPressSet = onPress;
  return (
    <TouchableHighlight
      style={{ flex: 1, justifyContent: "center" }}
      underlayColor={underlayColor || theme.colors.background}
      onPress={onPress}
    >
      <Text
        style={[style, {
          color: contrastText ? theme.colors.textContrast : theme.colors.text,
          textDecorationLine: onPressSet ? "underline" : "none",
        }]}
      >
        {title}
      </Text>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  option: {
    marginRight: 10,
    marginBottom: 5,
  },
});
