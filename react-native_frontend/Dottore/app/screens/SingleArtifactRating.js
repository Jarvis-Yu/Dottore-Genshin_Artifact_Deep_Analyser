import React, { useEffect, useState } from "react";
import {
  Button,
  Dimensions,
  ScrollView,
  Switch,
  Text,
  TouchableHighlight,
  View,
  StyleSheet,
  Alert,
} from "react-native";
import { Slider } from "@miblanchard/react-native-slider";
import { getBackendJson, postBackendJson } from "../backend/Backend";
import key_2_lan from "../language/key_2_lan";
import { lightTheme, ThemeContext } from "../styles/Styles";
import { SelectMultiple, SelectOne, TitledSlider } from "../components/Selection";
import prompt_2_lan from "../language/prompt_2_lan";
import { StatusBar } from "expo-status-bar";
import languages from "../language/languages";

// navigation: https://reactnavigation.org/docs/getting-started/
export function SingleArtifactRatingScreen({ navigation }) {
  // const [selectedLanguage, setSelectedLanguage] = useState();
  const [artifactLevel, setArtifactLevel] = useState(0);
  const [artifactType, setArtifactType] = useState("");
  const [artifactMainAttr, setArtifactMainAttr] = useState("");
  const [artifactSubAttr, setArtifactSubAttr] = useState("");
  const [specificSet, setSpecificSet] = useState(true);
  const [result, setResult] = useState({});

  const [artifactTypes, setArtifactTypes] = useState({});
  const [artifactMainAttrs, setArtifactMainAttrs] = useState({});
  const [artifactSubAttrs, setArtifactSubAttrs] = useState({});
  const [artifactSelectedSubAttrs, setArtifactSelectedSubAttrs] = useState({});
  const disableSubmit = Object.keys(artifactSubAttr).length < (artifactLevel >= 4 ? 4 : 3);

  const themeData = React.useContext(ThemeContext);
  const theme = themeData.theme;
  const language = themeData.language;
  theme.language = languages[themeData.language];

  function MultipleSlider({
    data = {},
    value = {},
    onValueChange = (f) => f,
    title = "",
    theme = lightTheme,
  }) {
    const updateValue = (the_key, val) => {
      const tmpVal = {};
      Object.keys(value).forEach((key) => {
        if (data[key]) {
          tmpVal[key] = value[key];
        }
      });
      tmpVal[the_key] = val;
      onValueChange(tmpVal);
    };
    useEffect(() => {
      Object.keys(value).forEach((key) => {
        if (!data[key]) {
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
      // console.log(item)
      const min_val = item.min_val;
      const max_val = item.max_val * (1 + Math.floor(artifactLevel / 4));
      const step = item.step;
      if (!value[item.key]) {
        updateValue(item.key, min_val);
      } else if (value[item.key] > max_val + step / 2) {
        updateValue(item.key, max_val);
      }
      return (
        <View key={item.key} style={{ marginBottom: 5 }}>
          <View style={{ flexDirection: "row" }}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{ flex: 1 }}
            >
              <View style={{ padding: 5, alignContent: "center" }}>
                <Text style={[theme.text.text, { color: theme.colors.text }]}>
                  {item.title || item.key}
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

  const SubmissionButton = (
    <TouchableHighlight
      style={styles.option}
      underlayColor={theme.colors.pressed}
      disabled={disableSubmit}
      onPress={() => {
        const post = {
          level: artifactLevel,
          kind: artifactType,
          mainattr: artifactMainAttr,
          subattrs: artifactSubAttr,
        };
        const f = async (post) => {
          const resp = await postBackendJson({
            route: "/artifact/get_all_info",
            args: post,
          });
          if (resp.ok) {
            setResult(resp.data);
          }
        };
        f(post);
      }}
    >
      <View
        style={{
          backgroundColor: disableSubmit ? theme.colors.notActivated : theme.colors.activated,
          flexDirection: "row",
          justifyContent: "center",
          padding: 5,
        }}
      >
        <Text style={[theme.text.title, { color: theme.colors.textContrast }]}>
          {prompt_2_lan("submit", language)}
        </Text>
      </View>
    </TouchableHighlight>
  );

  useEffect(() => {
    const f = async () => {
      const resp = await getBackendJson({
        route: "/artifact/types",
      });
      if (resp.ok) {
        Object.keys(resp.data).forEach((key) => {
          resp.data[key].title = key_2_lan(key, language);
        });
        setArtifactTypes(resp.data);
      }
    };
    f();
  }, [themeData]);

  useEffect(() => {
    if (artifactType !== "") {
      const f = async () => {
        const resp = await postBackendJson({
          route: "/artifact/type-to-mainattrs",
          args: {
            type: artifactType,
          },
        });
        if (resp.ok) {
          Object.keys(resp.data).forEach((key) => {
            resp.data[key].title = key_2_lan(key, language);
          });
          setArtifactMainAttrs(resp.data);
        }
      };
      f();
    }
  }, [artifactType, themeData]);

  useEffect(() => {
    if (artifactMainAttr !== "") {
      const f = async () => {
        const resp = await postBackendJson({
          route: "/artifact/mainattr-to-subattrs",
          args: {
            mainattr: artifactMainAttr,
            level: artifactLevel,
          },
        });
        if (resp.ok) {
          Object.keys(resp.data).forEach((key) => {
            resp.data[key].title = key_2_lan(key, language);
          });
          setArtifactSubAttrs(resp.data);
        }
      };
      f();
    } else {
      setArtifactSubAttrs({});
    }
  }, [artifactMainAttr, themeData]);

  // ==========
  // Experiment()
  // ==========
  return (
    <ScrollView backgroundColor={theme.colors.background}>
      {theme.statusBarStyle === "light" && <StatusBar style="light" />}
      {theme.statusBarStyle === "dark" && <StatusBar style="dark" />}
      {/* <StatusBar style={theme.statusBarStyle} /> */}
      {/* <Text style={{ color: theme.colors.text }}>
        [{artifactLevel}][{artifactType}][{artifactMainAttr}][
        {Object.keys(artifactSelectedSubAttrs)}]
      </Text>
      {Object.keys(artifactSubAttr).map((key) => (
        <Text key={key} style={{ color: theme.colors.text }}>
          [{key}, {artifactSubAttr[key]}]
        </Text>
      ))} */}
      {TitledSlider({
        title: prompt_2_lan("artifact_level_is", language),
        value: artifactLevel,
        onValueChange: setArtifactLevel,
        minVal: 0,
        maxVal: 20,
        step: 1,
        theme,
      })}
      <SelectOne
        title={prompt_2_lan("artifact_kind_is", language)}
        data={artifactTypes}
        value={artifactType}
        onValueChange={setArtifactType}
        theme={theme}
        wrap={true}
      />
      <SelectOne
        title={prompt_2_lan("main_attr_is", language)}
        data={artifactMainAttrs}
        value={artifactMainAttr}
        onValueChange={setArtifactMainAttr}
        theme={theme}
        wrap={true}
      />
      <SelectMultiple
        title={prompt_2_lan("sub_attrs_are", language)}
        data={artifactSubAttrs}
        value={artifactSelectedSubAttrs}
        onValueChange={setArtifactSelectedSubAttrs}
        maxNum={4}
        theme={theme}
        wrap={true}
      />
      {MultipleSlider({
        data: artifactSelectedSubAttrs,
        value: artifactSubAttr,
        onValueChange: setArtifactSubAttr,
        theme,
      })}
      {Object.keys(artifactSelectedSubAttrs).length > 0 && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            marginHorizontal: 10,
            marginVertical: 0,
          }}
        >
          <TouchableHighlight
            style={{ flex: 1, justifyContent: "center" }}
            underlayColor={theme.colors.background}
            onPress={() => {
              Alert.alert("Not", "content");
            }}
          >
            <Text style={{ color: theme.colors.text, textDecorationLine: "underline" }}>
              {prompt_2_lan("specific_set", language)}
            </Text>
          </TouchableHighlight>
          <View style={{ flex: 4, flexDirection: "row", justifyContent: "space-between" }}>
            <Switch
              trackColor={{ false: theme.colors.notSelected, true: theme.colors.selected }}
              value={specificSet}
              onValueChange={() => setSpecificSet((previousState) => !previousState)}
            />
          </View>
        </View>
      )}
      <View style={styles.component}>{SubmissionButton}</View>
      {Object.keys(result).length > 0 && (
        <View>
          <Text>{prompt_2_lan("on_avg", language)}</Text>
          <Text>
            {(result.art_runs / (specificSet ? 1 : 2)).toFixed(0)}
            {prompt_2_lan("domain_runs_needed", language)}
          </Text>
          <Text>
            {((1 - result.art_relative / (specificSet ? 2 : 1)) * 100).toFixed(3)}%{" "}
            {artifactTypes[artifactType].title}
            {prompt_2_lan("compare_same_level", language)}
          </Text>
          <Text>
            {result.art_curr.toFixed(1)}
            {prompt_2_lan("is_curr_score", language)}
          </Text>
          <Text>
            {result.art_expect.toFixed(1)}
            {prompt_2_lan("is_expected_score", language)}
          </Text>
          <Text>
            {result.art_extreme.toFixed(1)}
            {prompt_2_lan("is_extreme_score", language)}
          </Text>
        </View>
      )}
      <View style={{ height: Dimensions.get("window").height * 0.5 }}></View>
    </ScrollView>
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
