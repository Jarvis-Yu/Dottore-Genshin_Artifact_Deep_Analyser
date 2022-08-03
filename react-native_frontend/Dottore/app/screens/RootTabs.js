import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Switch } from "react-native";
import { SampleScreen } from "./AnotherScreen";
import { HomeScreen } from "./HomeScreen";
import MyScreen from "./MyScreen";
import { SingleArtifactRatingScreen } from "./SingleArtifactRating";

const Tab = createBottomTabNavigator();

export default function RootTabs({ navigation, route }) {
  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          // tabBarActiveTintColor: "tomato",
          // tabBarInactiveTintColor: "gray",
        })}
        initialRouteName="Home"
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          // options={({ route }) => ({ title: route.params?.name })}
        />
        <Tab.Screen name="Sample Screen" component={SampleScreen} />
        <Tab.Screen name="My" component={MyScreen} />
      </Tab.Navigator>
    </>
  );
}
