import { Switch, View } from "react-native";

export default function SettingScreen({ navigation, route }) {
  console.log(route)
  return (
    <View>
      <Switch />
    </View>
  )
}
