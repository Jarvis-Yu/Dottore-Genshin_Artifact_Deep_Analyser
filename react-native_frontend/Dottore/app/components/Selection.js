import { Slider } from "@miblanchard/react-native-slider";
import { useEffect } from "react";
import { TouchableHighlight, View, Text, ScrollView, StyleSheet } from "react-native";
import key_2_lan from "../language/key_2_lan";
import languages from "../language/languages";
import prompt_2_lan from "../language/prompt_2_lan";
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
  value = "",
  onValueChange = (f) => f,
  title = "",
  theme = lightTheme,
  language = languages.EN.key,
  wrap = false,
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
          <Text style={{ color: theme.colors.textContrast }}>
            {item.title || key_2_lan(item.key, language)}
          </Text>
        </View>
      </TouchableHighlight>
    );
  };
  useEffect(() => {
    if (value !== "" && !data[value]) {
      onValueChange("");
    }
  });
  return (
    <View style={styles.component}>
      {Object.keys(data).length > 0 && title !== "" && (
        <Text style={[theme.text.content, { color: theme.colors.text }]}>
          {title} [{(data[value] && data[value].title) || ""}]{" "}
          {wrap ? "" : prompt_2_lan("options_scrollable", language)}
          {/* {title} [{value}] {wrap ? "" : "(options scrollable)"} */}
        </Text>
      )}
      {!wrap && (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {data && Object.keys(data).map((key) => renderItem(data[key]))}
        </ScrollView>
      )}
      {wrap && (
        <View style={{ flexDirection: "row", flexWrap: wrap ? "wrap" : "nowrap" }}>
          {data && Object.keys(data).map((key) => renderItem(data[key]))}
        </View>
      )}
    </View>
  );
}

/**
 * @param {Object<>} data all fields will be passed to `value`
 * @param {string} data.key unique identifier
 * @param {string} [data.title] use data.key if not found
 * @param {string} value pair with onValueChange
 * @param {function} onValueChange pair with value
 * @param {string} title
 * @param {boolean} wrap true if options should be wrapped into multiple lines
 */
export function SelectMultiple({
  data,
  value = {},
  onValueChange = (f) => f,
  title = "",
  maxNum = 4,
  theme = lightTheme,
  language = languages.EN.key,
  wrap = false,
}) {
  const updateStates = (key) => {
    const currentSelected = value;
    const newSelected = {};
    let updated = false;
    if (currentSelected[key]) {
      // remove key from value
      Object.keys(currentSelected).forEach((thisKey) => {
        if (thisKey !== key && data[thisKey]) {
          newSelected[thisKey] = data[thisKey];
        }
      });
      updated = true;
    } else if (Object.keys(currentSelected).length < maxNum) {
      // add key to value
      Object.keys(currentSelected).forEach((thisKey) => {
        newSelected[thisKey] = data[thisKey];
      });
      newSelected[key] = data[key];
      updated = true;
    }
    if (updated) {
      onValueChange(newSelected);
    }
  };
  const renderItem = (item) => {
    console.log(">", language, item);
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
            backgroundColor: value[item.key] ? theme.colors.selected : theme.colors.notSelected,
            padding: 5,
          }}
        >
          <Text style={{ color: theme.colors.textContrast }}>
            {item.title || key_2_lan(item.key, language)}
          </Text>
        </View>
      </TouchableHighlight>
    );
  };
  useEffect(() => {
    Object.keys(value).forEach((key) => {
      if (!data[key]) {
        updateStates(key);
      }
    });
  });
  return (
    <View style={styles.component}>
      {Object.keys(data).length > 0 && title !== "" && (
        <Text style={[theme.text.content, { color: theme.colors.text }]}>
          {title} {wrap ? "" : prompt_2_lan("options_scrollable", language)}
        </Text>
      )}
      {!wrap && (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {data && Object.keys(data).map((key) => renderItem(data[key]))}
        </ScrollView>
      )}
      {wrap && (
        <View style={{ flexDirection: "row", flexWrap: wrap ? "wrap" : "nowrap" }}>
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
