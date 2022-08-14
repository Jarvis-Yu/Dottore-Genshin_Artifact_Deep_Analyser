import { Slider } from "@miblanchard/react-native-slider";
import { TouchableHighlight, View, Text, ScrollView, StyleSheet } from "react-native";
import { lightTheme } from "../styles/Styles";

/**
 * @param {Object<>} data
 * @param {string} data.key unique identifier
 * @param {string} [data.title] use data.key if not found
 * @param {string} [data.value] use data.key if not found
 * @param {string} value pair with onValueChange
 * @param {function} onValueChange pair with value
 * @param {string} title
 * @param {boolean} wrap true if options should be wrapped into multiple lines
 */
export function SelectOne({
  data = {},
  value = undefined,
  onValueChange = (f) => f,
  title = "",
  wrap = false,
  theme = lightTheme,
}) {
  const updateStates = (key) => {
    if (data[key]) {
      onValueChange(data[key].value || data[key].key);
    } else {
      onValueChange("");
    }
  };
  const renderItem = (item) => {
    return (
      <TouchableHighlight
        style={styles.option}
        underlayColor={theme.colors.selected}
        onPress={() => {
          updateStates(item.key);
        }}
        key={item.key}
      >
        <View
          style={{
            backgroundColor: value === item.key ? theme.colors.selected : theme.colors.notSelected,
            padding: 5,
          }}
        >
          <Text style={{ color: theme.colors.textContrast }}>{item.title || item.key}</Text>
        </View>
      </TouchableHighlight>
    );
  };
  if (value !== "" && !data[value]) {
    onValueChange("");
  }
  return (
    <View style={styles.component}>
      {Object.keys(data).length > 0 && title !== "" && (
        <Text style={[theme.text.content, { color: theme.colors.text }]}>
          {title} [{value}] {wrap ? "" : "(options scrollable)"}
        </Text>
      )}
      {!wrap && (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {data && Object.keys(data).map((key) => renderItem(data[key]))}
        </ScrollView>
      )}
      {wrap && (
        <View style={{ flexDirection: "row", flexWrap: true }}>
          {data && Object.keys(data).map((key) => renderItem(data[key]))}
        </View>
      )}
    </View>
  );
}

export function TitledSlider({
  title = "",
  value = undefined,
  onValueChange = (f) => f,
  minVal = 0,
  maxVal = 1,
  step = 0.1,
  theme = lightTheme,
}) {
  return (
    <View style={styles.component}>
      {title !== "" && (
        <Text style={[theme.text.content, { color: theme.colors.text }]}>
          {title} [{value}]
        </Text>
      )}
      <Slider
        minimumValue={minVal}
        maximumValue={maxVal}
        step={step}
        value={value}
        onValueChange={(val) => {
          onValueChange(val[0]);
        }}
        thumbStyle={{ backgroundColor: theme.colors.selected }}
        trackStyle={{ backgroundColor: theme.colors.notSelected }}
        minimumTrackTintColor={theme.colors.notSelected}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  component: {
    marginHorizontal: 10,
    marginVertical: 5,
  },
  option: {
    marginRight: 10,
    marginBottom: 5,
  },
});
