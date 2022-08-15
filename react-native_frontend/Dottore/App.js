import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ScrollView, Switch, Text, TouchableHighlight, StyleSheet, View } from "react-native";
import { getBackendJson, postBackendJson } from "./app/backend/Backend";
import { SelectOne } from "./app/components/Selection";
import languages from "./app/language/languages";
import prompt_2_lan from "./app/language/prompt_2_lan";
import RootTabs from "./app/screens/RootTabs";
import SettingScreen from "./app/screens/SettingScreen";
import { SingleArtifactRatingScreen } from "./app/screens/SingleArtifactRating";
import { darkTheme, LanguageContext, lightTheme, ThemeContext } from "./app/styles/Styles";

const Stack = createNativeStackNavigator();

/*
follow: https://docs.expo.dev/build/setup/
to build app
also: https://docs.expo.dev/archive/classic-updates/building-standalone-apps/?redirected
*/

export default function App() {
  console.log("[i] App: rendered");
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState(languages.EN.key);

  const theme = darkMode ? darkTheme : lightTheme;

  function Setting({ navigation }) {
    const languageData = {};
    Object.keys(languages).forEach((key) => {
      languageData[key] = { key, title: languages[key].title };
    });
    return (
      <ScrollView style={{ backgroundColor: theme.colors.background }}>
        <View style={[styles.oneSetting, { flexDirection: "row" }]}>
          <Text style={[theme.text.content, { color: theme.colors.text, flex: 1 }]}>
            {prompt_2_lan("dark_mode", language)}
          </Text>
          <View style={{ flex: 4, flexDirection: "row", justifyContent: "space-between" }}>
            <Switch
              trackColor={{ false: theme.colors.notSelected, true: theme.colors.selected }}
              value={darkMode}
              onValueChange={() => setDarkMode((previousState) => !previousState)}
            />
          </View>
        </View>
        <SelectOne
          title={prompt_2_lan("language", language)}
          data={languageData}
          value={language}
          onValueChange={setLanguage}
          theme={theme}
          wrap={true}
        />
      </ScrollView>
    );
  }

  const ToSetting = () => {
    const navigation = useNavigation();
    return (
      <TouchableHighlight
        underlayColor={theme.colors.bar}
        onPress={() => navigation.navigate("Setting")}
      >
        <Text style={[theme.text.title, { color: theme.colors.textContrast }]}>
          {prompt_2_lan("setting", language)}
        </Text>
      </TouchableHighlight>
    );
  };

  return (
    <ThemeContext.Provider value={theme}>
      <LanguageContext.Provider value={language}>
        <StatusBar style={theme.statusBarStyle} />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="SingleArtifactRating"
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.bar,
              },
              headerTintColor: theme.colors.textContrast,
              headerRight: () => ToSetting(),
              headerBackTitle: "",
            }}
          >
            <Stack.Screen name="RootTabs" component={RootTabs} options={{ headerShown: false }} />
            <Stack.Screen
              name="SingleArtifactRating"
              component={SingleArtifactRatingScreen}
              options={{ title: prompt_2_lan("single_artifact_rating", language) }}
            />
            <Stack.Screen
              name="Setting"
              component={Setting}
              options={{
                title: prompt_2_lan("setting", language),
                headerRight: () => <></>,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </LanguageContext.Provider>
    </ThemeContext.Provider>
  );
}

const styles = StyleSheet.create({
  oneSetting: {
    marginHorizontal: 10,
    marginVertical: 5,
  },
});
