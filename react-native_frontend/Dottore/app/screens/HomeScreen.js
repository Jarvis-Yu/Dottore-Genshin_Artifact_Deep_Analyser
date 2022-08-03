import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Button, Text, View } from "react-native";
import { SText } from "../styles/Components";
import { SingleArtifactRatingScreen } from "./SingleArtifactRating";

const Stack = createNativeStackNavigator();

// navigation: https://reactnavigation.org/docs/getting-started/
export function HomeScreen({ navigation }) {
  return (
    <View>
      {/* <SText>Home</SText> */}
      <Text>Home</Text>
      <Button
        title="Single Artifact Rating"
        onPress={() => navigation.navigate("Single Artifact Rating")}
      />
    </View>
  );
}
