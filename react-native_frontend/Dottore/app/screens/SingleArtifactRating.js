import React, { useEffect, useState } from "react";
import { Button, ScrollView, Text, TouchableHighlight, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Slider } from "@miblanchard/react-native-slider";
import { postBackendJson } from "../backend/Backend";

// navigation: https://reactnavigation.org/docs/getting-started/
export function SingleArtifactRatingScreen({ navigation }) {
  // const [selectedLanguage, setSelectedLanguage] = useState();
  const [artifactLevel, setArtifactLevel] = useState(0);
  const [artifactType, setArtifactType] = useState("");
  const [artifactMainAttr, setArtifactMainAttr] = useState("");
  const [artifactSubAttr, setArtifactSubAttr] = useState("");

  const [artifactMainAttrs, setArtifactMainAttrs] = useState([]);
  const [artifactSubAttrs, setArtifactSubAttrs] = useState([]);
  const [artifactSelectedSubAttrs, setArtifactSelectedSubAttrs] = useState([]);
  const selected = "#000088";
  const notSelected = "#8888FF";

  const LevelComponent = () => {
    return (
      <View style={{ margin: 10 }}>
        <Text style={{ fontSize: 16 }}>Artifact level is [{artifactLevel}]</Text>
        <Slider
          // animateTransitions
          minimumValue={0}
          maximumValue={20}
          step={1}
          value={artifactLevel}
          onValueChange={setArtifactLevel}
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
      <View style={{ margin: 10 }}>
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

  function SelectMultiple({ data, set = (f) => f, title = "Sample Title:" }, maxNum = 4) {
    const [value, setValue] = useState({});
    const [propDict, setPropDict] = useState({});
    const updateStates = (key) => {
      const currentSelected = value;
      const newSelected = {};
      let updated = false;
      if (currentSelected[key]) {
        // remove key from value
        Object.keys(currentSelected).forEach((thisKey) => {
          if (thisKey !== key) {
            newSelected[thisKey] = currentSelected[thisKey];
          }
        });
        updated = true;
      } else if (Object.keys(currentSelected).length < maxNum) {
        // add key to value
        Object.keys(currentSelected).forEach((thisKey) => {
          newSelected[thisKey] = currentSelected[thisKey];
        });
        newSelected[key] = true;
        updated = true;
        // setValue(newSelected);
        // set(newSelected);
      }
      if (updated) {
        setValue(newSelected);
        set(newSelected);
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
        setPropDict(tmpDict);
      }
    };
    const renderItem = ({ item }) => {
      tmpDict = propDict;
      if (!tmpDict[item.key]) {
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
      <View style={{ margin: 10 }}>
        {Object.keys(data).length == 0 && Object.keys(value).length !== 0 && setValue({})}
        {Object.keys(data).length > 0 && (
          <Text style={{ fontSize: 16 }}>
            {title} [{Object.keys(value)}]
          </Text>
        )}
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {data && Object.keys(data).map((key) => renderItem({ item: data[key] }))}
          {/* {data && data.map((item) => renderItem({ item }))} */}
        </ScrollView>
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

  return (
    <View>
      <Text>
        [{artifactLevel}][{artifactType}][{artifactMainAttr}][
        {Object.keys(artifactSelectedSubAttrs)}]
      </Text>
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
        title: "Sub attribues",
        data: artifactSubAttrs,
        set: setArtifactSelectedSubAttrs,
      })}
      <Button
        title="submit"
        onPress={() => {
          alert("Submitted");
        }}
      />
    </View>
  );
}
