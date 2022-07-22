import React from "react";
import { Button, Text, View } from "react-native";
import styles from "../styles/styles";

// navigation: https://reactnavigation.org/docs/getting-started/
export function HomeScreen({ navigation }) {
  return (
    <View style={styles({}).container}>
      <Text>Home</Text>
      <Button title="Go to AnotherScreen..." onPress={() => navigation.navigate("AnotherScreen")} />
    </View>
  );
}
