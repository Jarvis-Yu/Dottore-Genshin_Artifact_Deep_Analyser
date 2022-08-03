import React from "react";
import { Button, Text, TextInput, View } from "react-native";

// navigation: https://reactnavigation.org/docs/getting-started/
export function SingleArtifactRatingScreen({ navigation }) {
  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
        <Text>Artifact Name:</Text>
        <TextInput
          style={{
            flex: 1,
            backgroundColor: "white",
            borderRadius: 5,
          }}
          placeholder="input here..."
        />
      </View>
    </View>
  );
}
