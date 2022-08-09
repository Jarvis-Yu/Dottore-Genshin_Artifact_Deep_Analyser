import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { Switch, Text } from "react-native";
import { getBackendJson, postBackendJson } from "./app/backend/Backend";
import RootTabs from "./app/screens/RootTabs";
import SettingScreen from "./app/screens/SettingScreen";
import { SingleArtifactRatingScreen } from "./app/screens/SingleArtifactRating";
import { darkTheme, lightTheme, ThemeContext } from "./app/styles/Styles";

const Stack = createNativeStackNavigator();

export default function App() {
  console.log("[i] App: rendered");
  const [darkMode, setDarkMode] = useState(false);
  const [data, setData] = useState({ val1: -1, val2: -1 });

  async function getSimpleJson() {
    // const data = await getBackendJson({ route: "/simple_json" });
    const data = await postBackendJson({
      route: "/repeat",
      args: {
        val1: 5,
        val2: 4,
      },
    });
    if (data.ok) {
      setData(data.data);
    } else {
      // setData({ val1: -1, val2: -1 });
    }
  }

  useEffect(() => {
    getSimpleJson();
  }, []);

  return (
    <ThemeContext.Provider value={darkMode ? darkTheme : lightTheme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Single Artifact Rating">
          <Stack.Screen name="RootTabs" component={RootTabs} options={{ headerShown: false }} />
          <Stack.Screen name="Single Artifact Rating" component={SingleArtifactRatingScreen} />
          {/* <Stack.Screen
            name="Setting"
            component={SettingScreen}
            initialParams={{ themeValue: darkMode, themeSet: setDarkMode }}
          /> */}
        </Stack.Navigator>
      </NavigationContainer>
      <Text>
        {data?.val1}, {data?.val2}
      </Text>
    </ThemeContext.Provider>
  );
}
