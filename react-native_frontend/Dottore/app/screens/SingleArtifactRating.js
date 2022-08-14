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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Slider } from "@miblanchard/react-native-slider";
import { postBackendJson } from "../backend/Backend";
import key_2_lan from "../language/key_2_lan";
import languages from "../language/languages";
import { lightTheme, ThemeContext } from "../styles/Styles";
import { SelectOne, TitledSlider } from "../components/Selection";

// navigation: https://reactnavigation.org/docs/getting-started/
export function SingleArtifactRatingScreen({ navigation }) {
  // const [selectedLanguage, setSelectedLanguage] = useState();
  const [artifactLevel, setArtifactLevel] = useState(0);
  const [artifactType, setArtifactType] = useState("");
  const [artifactMainAttr, setArtifactMainAttr] = useState("");
  const [artifactSubAttr, setArtifactSubAttr] = useState("");
  const [specificSet, setSpecificSet] = useState(true);
  const [result, setResult] = useState({});

  const [artifactMainAttrs, setArtifactMainAttrs] = useState([]);
  const [artifactSubAttrs, setArtifactSubAttrs] = useState([]);
  const [artifactSelectedSubAttrs, setArtifactSelectedSubAttrs] = useState([]);

  const theme = React.useContext(ThemeContext);
  const [selected, setSelected] = useState("#000088");
  const [notSelected, setNotSelected] = useState("#8888FF");
  useEffect(() => {
    setSelected(theme.colors.selected);
    setNotSelected(theme.colors.notSelected);
  }, [theme]);
  const language = languages.EN;

  function SelectMultiple({ data, onValueChange = (f) => f, title = "Sample Title:", maxNum = 4 }) {
    const [value, setValue] = useState({});
    const [propDict, setPropDict] = useState({});
    const updateStates = (key) => {
      const currentSelected = value;
      const newSelected = {};
      let updated = false;
      if (currentSelected[key]) {
        // remove key from value
        Object.keys(currentSelected).forEach((thisKey) => {
          if (thisKey !== key && data[thisKey]) {
            newSelected[thisKey] = currentSelected[thisKey];
          }
        });
        updated = true;
      } else if (Object.keys(currentSelected).length < maxNum) {
        // add key to value
        Object.keys(currentSelected).forEach((thisKey) => {
          newSelected[thisKey] = currentSelected[thisKey];
        });
        newSelected[key] = data[key];
        updated = true;
      }
      if (updated) {
        const tmpDict = {};
        Object.keys(data).forEach((key) => {
          tmpDict[key] = {
            key: key,
            color: notSelected,
          };
        });
        Object.keys(newSelected).forEach((key) => {
          tmpDict[key].color = selected;
        });
        setValue(newSelected);
        onValueChange(newSelected);
        setPropDict(tmpDict);
      }
    };
    const renderItem = ({ item }) => {
      const tmpDict = propDict;
      if (!tmpDict[item.key] || (tmpDict[item.key].color === selected && !value[item.key])) {
        tmpDict[item.key] = {
          key: item.key,
          title: item.title || item.key,
          color: notSelected,
        };
        setPropDict(tmpDict);
      }
      return (
        <TouchableHighlight
          style={{ marginRight: 10 }}
          underlayColor={selected}
          onPress={() => {
            updateStates(item.key);
          }}
          key={item.key}
        >
          <View style={{ backgroundColor: propDict[item.key].color, padding: 5 }}>
            <Text style={{ color: "#FFFFFF" }}>{item.title || item.key}</Text>
          </View>
        </TouchableHighlight>
      );
    };
    Object.keys(value).forEach((key) => {
      if (!data[key]) {
        updateStates(key);
      }
    });
    return (
      <View style={{ marginHorizontal: 10, marginVertical: 5 }}>
        {Object.keys(data).length == 0 && Object.keys(value).length !== 0 && setValue({})}
        {Object.keys(data).length > 0 && (
          <Text style={{ fontSize: 16 }}>
            {title}
            {/* [{Object.keys(value)}] */}
          </Text>
        )}
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {data && Object.keys(data).map((key) => renderItem({ item: data[key] }))}
        </ScrollView>
      </View>
    );
  }

  function MultipleSlider({ data, onValueChange = (f) => f, title = "Sample Title:" }) {
    const [value, setValue] = useState({});
    const updateValue = (the_key, val) => {
      const tmpVal = {};
      Object.keys(value).forEach((key) => {
        if (data[key]) {
          tmpVal[key] = value[key];
        }
      });
      tmpVal[the_key] = val;
      setValue(tmpVal);
      onValueChange(tmpVal);
    };
    Object.keys(value).forEach((key) => {
      if (!data[key]) {
        const tmpVal = {};
        Object.keys(value).forEach((key) => {
          if (data[key]) {
            tmpVal[key] = value[key];
          }
        });
        setValue(tmpVal);
        onValueChange(tmpVal);
      }
    });
    const renderItem = ({ item }) => {
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
                <Text>{item.title || item.key}</Text>
                <Text>
                  {value[item.key] &&
                    (min_val < 1 ? (value[item.key] * 100).toFixed(1) : value[item.key].toFixed(0))}
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
                thumbStyle={{ backgroundColor: selected }}
                trackStyle={{ backgroundColor: notSelected }}
                minimumTrackTintColor={notSelected}
              />
            </View>
          </View>
        </View>
      );
    };
    return (
      <View style={{ marginHorizontal: 10, marginVertical: 5 }}>
        {Object.keys(data).length == 0 && Object.keys(value).length !== 0 && setValue({})}
        {/* {Object.keys(data).length > 0 && (
          <Text style={{ fontSize: 16 }}>
            {title} [{Object.keys(value)}]
          </Text>
        )} */}
        {data && Object.keys(data).map((key) => renderItem({ item: data[key] }))}
      </View>
    );
  }

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
          setArtifactMainAttrs(resp.data);
        }
      };
      f();
    }
  }, [artifactType]);

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
            resp.data[key].title = key_2_lan(key, language.key);
          });
          setArtifactSubAttrs(resp.data);
        }
      };
      f();
    } else {
      setArtifactSubAttrs({});
    }
  }, [artifactMainAttr]);

  // ==========
  // Experiment()
  // ==========

  return (
    <ScrollView backgroundColor={theme.colors.background}>
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
        title: "Artifact level is",
        value: artifactLevel,
        onValueChange: setArtifactLevel,
        minVal: 0,
        maxVal: 20,
        step: 1,
        theme,
      })}
      <SelectOne
        title="Artifact kind is"
        data={{
          Flower: { key: "Flower", title: "Flower" },
          Plume: { key: "Plume", title: "Plume" },
          Sands: { key: "Sands", title: "Sands" },
          Goblet: { key: "Goblet", title: "Goblet" },
          Circlet: { key: "Circlet", title: "Circlet" },
        }}
        value={artifactType}
        onValueChange={setArtifactType}
        theme={theme}
        wrap={true}
      />
      <SelectOne
        title="Main attribute is"
        data={artifactMainAttrs}
        value={artifactMainAttr}
        onValueChange={setArtifactMainAttr}
        theme={theme}
        wrap={true}
      />
      {SelectMultiple({
        title: "Sub attribues are",
        data: artifactSubAttrs,
        onValueChange: setArtifactSelectedSubAttrs,
        maxNum: 4,
      })}
      {MultipleSlider({
        title: "TMP",
        data: artifactSelectedSubAttrs,
        onValueChange: setArtifactSubAttr,
      })}
      {Object.keys(artifactSelectedSubAttrs).length > 0 && (
        <View style={{ flexDirection: "row", marginHorizontal: 10, marginVertical: 0 }}>
          <Text style={{ flex: 1 }}>Specific Set?</Text>
          <Switch
            trackColor={{ false: notSelected, true: selected }}
            value={specificSet}
            onValueChange={() => setSpecificSet((previousState) => !previousState)}
            style={{ flex: 4 }}
          />
        </View>
      )}
      <Button
        title="submit"
        disabled={Object.keys(artifactSubAttr).length < (artifactLevel >= 4 ? 4 : 3)}
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
      />
      {Object.keys(result).length > 0 && (
        <View>
          <Text>On average:</Text>
          <Text>
            {(result.art_runs / (specificSet ? 1 : 2)).toFixed(0)} domain runs are needed to obtain
            an artifact like this.
          </Text>
          <Text>
            {((1 - result.art_relative / (specificSet ? 2 : 1)) * 100).toFixed(3)}% {artifactType}{" "}
            of the same level are not as good as this one.
          </Text>
          <Text>{result.art_curr.toFixed(1)} is the current score.</Text>
          <Text>{result.art_expect.toFixed(1)} is the expected score at level 20.</Text>
          <Text>{result.art_extreme.toFixed(1)} is the best score it can get at level 20.</Text>
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
