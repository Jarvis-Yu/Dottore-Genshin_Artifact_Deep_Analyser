import React from "react";
import { Button, Text, View } from "react-native";

export function SampleScreen({ navigation }) {
  const testF = () => navigation.navigate("Home", { name: "test home" });
  return (
    <View>
      <Text>A Sample Screen</Text>
      {/* <Button
        title="Go to Home"
        onPress={() => navigation.navigate("Home", { name: "imma back" })} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
      <Button title="test" onPress={testF} /> */}
    </View>
  );
}
