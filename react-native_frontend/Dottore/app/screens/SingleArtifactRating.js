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
  const selected = "#000088";
  const notSelected = "#8888FF";

  // const ArtifactTypeComponent = () => {
  //   const flowerTitle = "Flower";
  //   const plumeTitle = "Plume";
  //   const sandsTitle = "Sands";
  //   const gobletTitle = "Goblet";
  //   const circletTitle = "Circlet";
  //   const [flowerColor, setFlowerColor] = useState(notSelected);
  //   const [plumeColor, setPlumeColor] = useState(notSelected);
  //   const [sandsColor, setSandsColor] = useState(notSelected);
  //   const [gobletColor, setGobletColor] = useState(notSelected);
  //   const [circletColor, setCircletColor] = useState(notSelected);
  //   const updateStates = (kind) => {
  //     const ifStatement = (title, setColor) => {
  //       if (kind === title) {
  //         setArtifactType(title);
  //         setColor(selected);
  //       } else {
  //         setColor(notSelected);
  //       }
  //     };
  //     ifStatement(flowerTitle, setFlowerColor);
  //     ifStatement(plumeTitle, setPlumeColor);
  //     ifStatement(sandsTitle, setSandsColor);
  //     ifStatement(gobletTitle, setGobletColor);
  //     ifStatement(circletTitle, setCircletColor);
  //   };
  //   const LocalButton = (title, color) => (
  //     <TouchableHighlight
  //       underlayColor={selected}
  //       onPress={() => {
  //         updateStates(title);
  //       }}
  //     >
  //       <View style={{ backgroundColor: color, padding: 5 }}>
  //         <Text style={{ color: "#FFFFFF" }}>{title}</Text>
  //       </View>
  //     </TouchableHighlight>
  //   );
  //   return (
  //     <View style={{ margin: 10 }}>
  //       <Text style={{ fontSize: 16 }}>Artifact kind is [{artifactType}]</Text>
  //       <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
  //         {LocalButton(flowerTitle, flowerColor)}
  //         {LocalButton(plumeTitle, plumeColor)}
  //         {LocalButton(sandsTitle, sandsColor)}
  //         {LocalButton(gobletTitle, gobletColor)}
  //         {LocalButton(circletTitle, circletColor)}
  //       </View>
  //     </View>
  //   );
  // };

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
    const propList = {};
    // data.forEach((val) => {
    //   propList[val.title] = {
    //     title: val.title,
    //     value: val.value || val.title,
    //     color: notSelected,
    //   };
    // });
    const origianlData = ({ last = "" }) => {
      if (propList[last]) {
        propList[last].title = val;
        propList[last].value = val;
        propList[last].color = notSelected;
      }
      return propList;
    };
    const [localStyles, setLocalStyles] = useState(origianlData({ lastOne }));
    const updateStates = (item) => {
      const k = origianlData({ lastOne });
      setLastOne(item);
      setValue(item);
      set(propList[item].value);
      k[item]["color"] = selected;
      setLocalStyles(k);
    };
    const renderItem = ({ item }) => {
      propList[item.title] = {
        title: item.title,
        value: item.value || item.title,
        color: notSelected,
      };
      return (
        <TouchableHighlight
          style={{ marginRight: 10 }}
          underlayColor={selected}
          onPress={() => {
            updateStates(localStyles[item.title].title);
          }}
          key={item.title}
        >
          <View style={{ backgroundColor: localStyles[item.title].color, padding: 5 }}>
            <Text style={{ color: "#FFFFFF" }}>{localStyles[item.title].title}</Text>
          </View>
        </TouchableHighlight>
      );
    };
    return (
      <View style={{ margin: 10 }}>
        <Text style={{ fontSize: 16 }}>
          {title} [{value}]
        </Text>
        <ScrollView
          horizontal={true}
          decelerationRate={0}
          scrollEventThrottle={16}
          snapToAlignment="center"
          showsHorizontalScrollIndicator={false}
        >
          {data && data.map((item) => renderItem({ item }))}
        </ScrollView>
      </View>
    );
  }

  // useEffect(() => {
  //   if (artifactType !== "") {
  //     const k = async (set) => {
  //       const resp = await postBackendJson({
  //         route: "/artifact/type-to-mainattrs",
  //         args: {
  //           type: artifactType,
  //         },
  //       });
  //       if (resp.ok) {
  //         console.log(resp.data);
  //         setArtifactMainAttrs([{ title: "a" }]);
  //       }
  //     };
  //     k();
  //   }
  // }, [artifactType]);

  return (
    <View>
      <Text>
        [{artifactLevel}][{artifactType}][{artifactMainAttr}][{artifactSubAttr}]
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
        title: "TMP",
        data: artifactMainAttrs,
        set: setArtifactMainAttr,
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
