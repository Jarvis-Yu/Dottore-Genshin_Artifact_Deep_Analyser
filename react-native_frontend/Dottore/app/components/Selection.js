import { Slider } from "@miblanchard/react-native-slider";
import { useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Switch } from "react-native";
import { key_2_lan } from "../language/key_2_lan";
import languages from "../language/languages";
import { prompt_2_lan } from "../language/prompt_2_lan";
import { lightTheme } from "../styles/Styles";
import { Option, TouchableText } from "./Gadgets";

/**
 * @param {Object} item
 * @param {string} item.key
 * @param {string} [item.title]
 * @param {*} language
 * @returns
 */
function getItemTitle(item, language) {
  if (item) {
    return item.title || key_2_lan(item.key, language);
  } else {
    return "";
  }
}

/**
 * @param {Object} data
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
  // toggle the selection statee of the key
  const updateStates = (key) => {
    if (data[key]) {
      onValueChange(data[key].value || data[key].key);
    } else {
      onValueChange("");
    }
  };
  const renderItem = (item) => {
    return (
      <Option
        key={item.key}
        title={getItemTitle(item, language)}
        onPress={() => {
          updateStates(item.key);
        }}
        theme={theme}
        language={language}
        selected={value === item.key}
      />
    );
  };
  // empties value if selected value is no longer provided by data
  useEffect(() => {
    if (value !== "" && !data[value]) {
      onValueChange("");
    }
  });
  const theSelected = data[value];
  return (
    <View style={styles.component}>
      {Object.keys(data).length > 0 && title !== "" && (
        <Text style={[theme.text.content, { color: theme.colors.text }]}>
          {title} [{getItemTitle(theSelected, language)}]{" "}
          {wrap ? "" : prompt_2_lan("options_scrollable", language)}
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
 * @param {Object} data all fields will be passed to `value`
 * @param {string} data.key unique identifier
 * @param {string} [data.title] use data.key if not found
 * @param {string} value pair with onValueChange
 * @param {function} onValueChange pair with value
 * @param {string} title
 * @param {number} maxNum the maximum number of options selected
 * @param {boolean} wrap true if options should be wrapped into multiple lines
 */
export function SelectMultiple({
  data = {},
  value = {},
  onValueChange = (f) => f,
  title = "",
  maxNum = 4,
  theme = lightTheme,
  language = languages.EN.key,
  wrap = false,
}) {
  // toggle the selection statee of the key
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
    return (
      <Option
        key={item.key}
        title={getItemTitle(item, language)}
        onPress={() => {
          updateStates(item.key);
        }}
        theme={theme}
        language={language}
        selected={value[item.key]}
      />
    );
  };
  // empties value if selected value is no longer provided by data
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
          if (value !== val[0]) {
            onValueChange(val[0]);
          }
        }}
        thumbStyle={{ backgroundColor: theme.colors.selected }}
        trackStyle={{ backgroundColor: theme.colors.notSelected }}
        minimumTrackTintColor={theme.colors.notSelected}
      />
    </View>
  );
}

/**
 * Sample data
 * {
 *  a: {
 *    key: "",
 *    title: "",
 *    min_val: 0,
 *    max_val: 0,
 *    step: 0,
 *    percent: false,
 *    decimal: 1,
 *  },
 * }
 */
export function MultipleSlider({
  data = {},
  value = {},
  onValueChange = (f) => f,
  title = "",
  theme = lightTheme,
  language = languages.EN.key,
  minValCff = 1,
  maxValCff = 1,
}) {
  const updateValue = (the_key, val) => {
    if (value[the_key] !== val) {
      const tmpVal = {};
      Object.keys(value).forEach((key) => {
        if (data[key]) {
          tmpVal[key] = value[key];
        }
      });
      tmpVal[the_key] = val;
      onValueChange(tmpVal);
    }
  };
  useEffect(() => {
    Object.keys(value).forEach((key) => {
      if (!(key in data)) {
        const tmpVal = {};
        Object.keys(value).forEach((key) => {
          if (data[key]) {
            tmpVal[key] = value[key];
          }
        });
        onValueChange(tmpVal);
      }
    });
  });
  const renderItem = (item) => {
    const min_val = item.min_val * minValCff;
    const max_val = item.max_val * maxValCff;
    const step = item.step;
    if (!value[item.key]) {
      updateValue(item.key, min_val);
    } else if (value[item.key] > max_val + step / 2) {
      updateValue(item.key, max_val);
    } else if (value[item.key] < min_val - step / 2) {
      updateValue(item.key, min_val);
    }
    return (
      <View key={item.key} style={{ marginBottom: 5 }}>
        <View style={{ flexDirection: "row" }}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
            <View style={{ padding: 5, alignContent: "center" }}>
              <Text style={[theme.text.text, { color: theme.colors.text }]}>
                {item.title || key_2_lan(item.key, language)}
              </Text>
              <Text style={[theme.text.text, { color: theme.colors.text }]}>
                {value[item.key] &&
                  (value[item.key] * (item.percent ? 100 : 1)).toFixed(item.decimal_fixed)}
                {item.percent ? "%" : ""}
              </Text>
            </View>
          </ScrollView>
          <View style={{ flex: 4 }}>
            <Slider
              minimumValue={min_val}
              maximumValue={max_val}
              step={item.step}
              value={value[item.key]}
              onValueChange={(val) => {
                updateValue(item.key, val[0]);
              }}
              thumbStyle={{ backgroundColor: theme.colors.selected }}
              trackStyle={{ backgroundColor: theme.colors.notSelected }}
              minimumTrackTintColor={theme.colors.notSelected}
            />
          </View>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.component}>
      {Object.keys(data).length > 0 && title !== "" && (
        <Text style={{ fontSize: 16 }}>
          {title} [{Object.keys(value).join(" ")}]
        </Text>
      )}
      {data && Object.keys(data).map((key) => renderItem(data[key]))}
    </View>
  );
}

export function TitledSwitch({
  title = "",
  onPress = undefined,
  theme = lightTheme,
  value = undefined,
  setValue = (f) => f,
}) {
  return (
    <View
      style={[
        styles.component,
        {
          flexDirection: "row",
          justifyContent: "flex-start",
        },
      ]}
    >
      <TouchableText title={title} onPress={onPress} theme={theme} />
      <View style={{ flex: 4, flexDirection: "row", justifyContent: "space-between" }}>
        <Switch
          trackColor={{ false: theme.colors.notSelected, true: theme.colors.selected }}
          value={value}
          onValueChange={() => setValue((previousState) => !previousState)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  component: {
    marginHorizontal: 10,
    marginVertical: 5,
  },
});
