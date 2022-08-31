import React, { useEffect, useState } from "react";
import {
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
import { key_2_lan } from "../language/key_2_lan";
import { LanguageContext, lightTheme, ThemeContext } from "../styles/Styles";
import {
  MultipleSlider,
  SelectMultiple,
  SelectOne,
  TitledSlider,
  TitledSwitch,
} from "../components/Selection";
import prompt_lan_select, { prompt_2_lan, prompt_lan_pair } from "../language/prompt_2_lan";
import languages from "../language/languages";
import { Option, TouchableText } from "../components/Gadgets";
import { WEIGHTS_PLANS, WEIGHTS_PLANS_SELECT } from "../data/weightsPlans";

// navigation: https://reactnavigation.org/docs/getting-started/
export function SingleArtifactRatingScreen({ navigation }) {
  const [artifactLevel, setArtifactLevel] = useState(0);
  const [artifactType, setArtifactType] = useState("");
  const [artifactMainAttr, setArtifactMainAttr] = useState("");
  const [artifactSubAttr, setArtifactSubAttr] = useState({});
  // advanced
  const [specificSet, setSpecificSet] = useState(true);
  const [useCustomWeights, setUseCustomWeights] = useState(false);
  const [selectedWeights, setSelectedWeights] = useState("common_atk_crit_plan");
  const [weights, setWeights] = useState({});
  const [result, setResult] = useState({});

  const [artifactTypes, setArtifactTypes] = useState({});
  const [artifactMainAttrs, setArtifactMainAttrs] = useState({});
  const [artifactSubAttrs, setArtifactSubAttrs] = useState({});
  const [artifactSelectedSubAttrs, setArtifactSelectedSubAttrs] = useState({});
  const [advanced, setAdvanced] = useState(false);
  const [artifactAllSubAttrs, setArtifactAllSubAttrs] = useState({});
  const disableSubmit = Object.keys(artifactSubAttr).length < (artifactLevel >= 4 ? 4 : 3);

  const theme = React.useContext(ThemeContext);
  const language = React.useContext(LanguageContext);

  // const submittable = Object.keys(artifactSelectedSubAttrs).length > 0;

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
          weights: useCustomWeights
            ? weights
            : selectedWeights !== ""
            ? WEIGHTS_PLANS[selectedWeights]
            : {},
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

  const AdvancedSwitch = (
    <TitledSwitch
      title={prompt_lan_select(prompt_lan_pair.show_advanced_setting, language)}
      value={advanced}
      setValue={setAdvanced}
      theme={theme}
    />
  );

  const OneOfSet = (
    <TitledSwitch
      title={prompt_2_lan("specific_set", language)}
      onPress={() => {
        Alert.alert(
          prompt_2_lan("explanation", language),
          prompt_2_lan("one_of_set_explanation", language)
        );
      }}
      value={specificSet}
      setValue={setSpecificSet}
      theme={theme}
    />
  );

  const WeightsSwitch = (
    <TitledSwitch
      title={prompt_lan_select(prompt_lan_pair.custom_weight_switch, language)}
      value={useCustomWeights}
      setValue={setUseCustomWeights}
      theme={theme}
    />
  );

  const WeightsSelector = (
    <SelectOne
      data={WEIGHTS_PLANS_SELECT}
      value={selectedWeights}
      onValueChange={setSelectedWeights}
      title={prompt_lan_select(prompt_lan_pair.select_weights_plan, language)}
      theme={theme}
      language={language}
      wrap={true}
    />
  );

  const WeightsSetter = (
    <>
      <View style={styles.component}>
        <TouchableText
          title={prompt_2_lan("set_weights_attrs", language)}
          onPress={() => {
            Alert.alert(
              prompt_lan_select(prompt_lan_pair.explanation, language),
              prompt_lan_select(prompt_lan_pair.set_weights_explanation, language)
            );
          }}
          theme={theme}
          style={theme.text.content}
        />
      </View>
      {MultipleSlider({
        data: artifactAllSubAttrs,
        value: weights,
        onValueChange: (val) => {
          let flag = false;
          Object.keys(val).some((key) => {
            if (!Object.keys(weights).includes(key)) {
              flag = true;
              return true;
            } else if (weights[key] !== val[key]) {
              flag = true;
              return true;
            }
          });
          if (flag) {
            setWeights(val);
          }
        },
        theme,
        language,
      })}
    </>
  );

  const FAQ = (
    <TouchableHighlight
      style={styles.option}
      underlayColor={theme.colors.pressed}
      disabled={false}
      onPress={() => {
        Alert.alert(
          prompt_lan_select(prompt_lan_pair.explanation, language),
          prompt_lan_select(prompt_lan_pair.single_art_FAQ, language)
        );
      }}
    >
      <View
        style={{
          backgroundColor: theme.colors.activated,
          flexDirection: "row",
          justifyContent: "center",
          padding: 5,
        }}
      >
        <Text style={[theme.text.title, { color: theme.colors.textContrast }]}>
          {prompt_2_lan("FAQ", language)}
        </Text>
      </View>
    </TouchableHighlight>
  );

  // get artifact types && else
  useEffect(() => {
    const f = async () => {
      const resp = await getBackendJson({
        route: "/artifact/types",
      });
      if (resp.ok) {
        setArtifactTypes(resp.data);
      }
    };
    f();
  }, []);

  // get artifact sub-attributes
  useEffect(() => {
    const f = async () => {
      const resp = await getBackendJson({
        route: "/artifact/subattrs",
      });
      if (resp.ok) {
        const tmpSubAttrs = {};
        resp.data.forEach((key) => {
          tmpSubAttrs[key] = {
            key,
            min_val: 0,
            max_val: 1,
            step: 0.05,
            decimal_fixed: 2,
            percent: false,
          };
        });
        setArtifactAllSubAttrs(tmpSubAttrs);
      }
    };
    f();
  }, []);

  // get artifact main-attributes
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

  // get artifact sub-attributes
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
        language={language}
        wrap={true}
      />
      <SelectOne
        title={prompt_2_lan("main_attr_is", language)}
        data={artifactMainAttrs}
        value={artifactMainAttr}
        onValueChange={setArtifactMainAttr}
        theme={theme}
        language={language}
        wrap={true}
      />
      <SelectMultiple
        title={prompt_2_lan("sub_attrs_are", language)}
        data={artifactSubAttrs}
        value={artifactSelectedSubAttrs}
        onValueChange={setArtifactSelectedSubAttrs}
        maxNum={4}
        theme={theme}
        language={language}
        wrap={true}
      />
      {MultipleSlider({
        data: artifactSelectedSubAttrs,
        value: artifactSubAttr,
        onValueChange: setArtifactSubAttr,
        maxValCff: 1 + Math.floor(artifactLevel / 4),
        theme,
        language,
      })}
      {AdvancedSwitch}
      {advanced && (
        <>
          {OneOfSet}
          {WeightsSwitch}
          {useCustomWeights && WeightsSetter}
          {!useCustomWeights && WeightsSelector}
        </>
      )}
      <View style={styles.component}>{SubmissionButton}</View>
      {Object.keys(result).length > 0 && (
        <View style={{ padding: 10 }}>
          <Text style={[theme.text.content, { color: theme.colors.text }]}>
            {prompt_2_lan("on_avg", language)}
          </Text>
          <Text style={[theme.text.text, { color: theme.colors.text }]}>
            {(result.art_runs / (specificSet ? 1 : 2)).toFixed(0)}
            {prompt_2_lan(
              specificSet ? "specific_domain_runs_needed" : "any_domain_runs_needed",
              language
            )}
            {"\n"}
            {((1 - result.art_relative / (specificSet ? 2 : 1)) * 100).toFixed(3)}%{" "}
            {artifactTypes[artifactType].title || key_2_lan(artifactType, language)}
            {prompt_2_lan("compare_same_level", language)}{" "}
            {prompt_2_lan(specificSet ? "para_from_same_domain" : "para_from_any_domain", language)}
            {"\n"}
            {result.art_curr.toFixed(1)}
            {prompt_2_lan("is_curr_score", language)}
            {"\n"}
            {result.art_expect.toFixed(1)}
            {prompt_2_lan("is_expected_score", language)}
            {"\n"}
            {result.art_extreme.toFixed(1)}
            {prompt_2_lan("is_extreme_score", language)}
          </Text>
        </View>
      )}
      <View style={styles.component}>{FAQ}</View>
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
