import { useContext } from "react";
import { Button, View, Text } from "react-native";
import { ThemeContext } from "./Styles";

export const SView = ({ style, ...rest }) => {
  const theme = useContext(ThemeContext);

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        ...style,
      }}
      {...rest}
    />
  );
};

export const SText = ({ style, ...rest }) => {
  const theme = useContext(ThemeContext);

  return (
    <Text
      style={{
        color: theme.colors.normal,
        ...style,
      }}
      {...rest}
    />
  );
};

export const SButton = ({ style, ...rest }) => {
  const theme = useContext(ThemeContext);

  return <Button style={{ ...style }} {...rest} />;
};
