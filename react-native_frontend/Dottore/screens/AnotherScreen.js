import React from "react";
import { Button, Text, View } from "react-native";

export function AnotherScreen({ navigation }) {
  const testF = () => navigation.navigate("Home", { name: "test home" });
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Another Screen</Text>
      <Button
        title="Go to Home"
        onPress={() => navigation.navigate("Home", { name: "imma back" })} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
      <Button title="test" onPress={testF} />
    </View>
  );
}
