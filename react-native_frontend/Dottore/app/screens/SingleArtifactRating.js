import React, { useEffect, useState } from "react";
import { Button, ScrollView, Switch, Text, TouchableHighlight, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Slider } from "@miblanchard/react-native-slider";
import { postBackendJson } from "../backend/Backend";
import { LIST_SUBATTR_RATIO } from "../backend/consts/attribute_consts";

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
  const selected = "#000088";
  const notSelected = "#8888FF";

  const LevelComponent = () => {
    return (
      <View style={{ marginHorizontal: 10, marginVertical: 5 }}>
        <Text style={{ fontSize: 16 }}>Artifact level is [{artifactLevel}]</Text>
        <Slider
          // animateTransitions
          minimumValue={0}
          maximumValue={20}
          step={1}
          value={artifactLevel}
          onValueChange={(val) => {
            setArtifactLevel(val[0]);
          }}
          thumbStyle={{ backgroundColor: selected }}
          trackStyle={{ backgroundColor: notSelected }}
          minimumTrackTintColor={notSelected}
        />
      </View>
    );
  };

  function SelectOne({ data, set = (f) => f, title = "Sample Title:" }) {
    const [lastOne, setLastOne] = useState("");
    const [value, setValue] = useState("");
    const [propDict, setPropDict] = useState({});
    const origianlData = ({ last = "" }) => {
      const tmpDict = propDict;
      if (tmpDict[last]) {
        tmpDict[last].color = notSelected;
      }
      return tmpDict;
    };
    // const [localStyles, setLocalStyles] = useState(origianlData({ lastOne }));
    const updateStates = (item) => {
      const k = origianlData({ last: lastOne });
      setLastOne(item);
      setValue(item);
      if (item !== "") {
        set(propDict[item].value);
        k[item]["color"] = selected;
      } else {
        set("");
      }
      setPropDict(k);
    };
    const renderItem = ({ item }) => {
      tmpDict = propDict;
      if (!tmpDict[item.title]) {
        tmpDict[item.title] = {
          title: item.title,
          value: item.value || item.title,
          color: notSelected,
        };
        setPropDict(tmpDict);
      }
      return (
        <TouchableHighlight
          style={{ marginRight: 10 }}
          underlayColor={selected}
          onPress={() => {
            updateStates(propDict[item.title].title);
          }}
          key={item.title}
        >
          <View style={{ backgroundColor: propDict[item.title].color, padding: 5 }}>
            <Text style={{ color: "#FFFFFF" }}>{propDict[item.title].title}</Text>
          </View>
        </TouchableHighlight>
      );
    };
    if (lastOne !== "" && !data.map((item) => item.title === lastOne).reduce((a, b) => a || b)) {
      updateStates("");
    }
    return (
      <View style={{ marginHorizontal: 10, marginVertical: 5 }}>
        {data.length > 0 && (
          <Text style={{ fontSize: 16 }}>
            {title} [{value}]
          </Text>
        )}
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {data && data.map((item) => renderItem({ item }))}
        </ScrollView>
      </View>
    );
  }

  function SelectMultiple({ data, set = (f) => f, title = "Sample Title:", maxNum = 4 }) {
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
        set(newSelected);
        setPropDict(tmpDict);
      }
    };
    const renderItem = ({ item }) => {
      const tmpDict = propDict;
      if (!tmpDict[item.key] || (tmpDict[item.key].color === selected && !value[item.key])) {
        tmpDict[item.key] = {
          key: item.key,
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
            <Text style={{ color: "#FFFFFF" }}>{item.key}</Text>
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
            {title} [{Object.keys(value)}]
          </Text>
        )}
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {data && Object.keys(data).map((key) => renderItem({ item: data[key] }))}
        </ScrollView>
      </View>
    );
  }

  function MultipleSlider({ data, set = (f) => f, title = "Sample Title:" }) {
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
      set(tmpVal);
    };
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
                <Text>{item.key}</Text>
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
          setArtifactSubAttrs(resp.data);
        }
      };
      f();
    } else {
      setArtifactSubAttrs({});
    }
  }, [artifactMainAttr]);

  console.log(typeof LIST_SUBATTR_RATIO)
  return (
    <ScrollView>
      {/* <Text>
        [{artifactLevel}][{artifactType}][{artifactMainAttr}][
        {Object.keys(artifactSelectedSubAttrs)}]
      </Text>
      {Object.keys(artifactSubAttr).map((key) => (
        <Text key={key}>
          [{key}, {artifactSubAttr[key]}]
        </Text>
      ))} */}
      {LevelComponent()}
      {SelectOne({
        title: "Artifact kind is",
        data: [
          { title: "Flower" },
          { title: "Plume" },
          { title: "Sands" },
          { title: "Goblet" },
          { title: "Circlet" },
        ],
        set: setArtifactType,
      })}
      {SelectOne({
        title: "Main attribute is",
        data: artifactMainAttrs,
        set: setArtifactMainAttr,
      })}
      {SelectMultiple({
        title: "Sub attribues are",
        data: artifactSubAttrs,
        set: setArtifactSelectedSubAttrs,
        maxNum: 4,
      })}
      {MultipleSlider({
        title: "TMP",
        data: artifactSelectedSubAttrs,
        set: setArtifactSubAttr,
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
              console.log(resp.data);
            }
          };
          f(post);
          // console.log(post)
          // alert("Submitted");
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
    </ScrollView>
  );
}
