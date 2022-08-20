export const prompt_lan_pair = {
  // Screen
  single_artifact_rating: {
    EN: "Single Artifact Analysis",
    CH: "单圣遗物分析",
  },
  setting: {
    EN: "Setting",
    CH: "设置",
  },
  // Button
  submit: {
    EN: "submit",
    CH: "提交",
  },
  // Prompt
  dark_mode: {
    EN: "Dark Mode?",
    CH: "深色模式？",
  },
  language: {
    EN: "Language?",
    CH: "语言?",
  },
  artifact_level_is: {
    EN: "Artifact level is",
    CH: "圣遗物等级为",
  },
  artifact_kind_is: {
    EN: "Artifact kind is",
    CH: "圣遗物位置为",
  },
  main_attr_is: {
    EN: "Main-attribute is",
    CH: "主属性为",
  },
  sub_attrs_are: {
    EN: "Sub-attributes are",
    CH: "副属性为",
  },
  specific_set: {
    EN: "One of Set?",
    CH: "凑套装用？",
  },
  options_scrollable: {
    EN: "(options scrollable)",
    CH: "(可左右滑动选项)",
  },
  on_avg: {
    EN: "On average:",
    CH: "平均而言：",
  },
  domain_runs_needed: {
    EN: " domain runs are needed to obtain an artifact like this.",
    CH: "次圣遗物副本，才能产出一个如此的圣遗物。",
  },
  compare_same_level: {
    EN: " of the same level are not better than this one.",
    CH: "同等级时都不比此圣遗物好。",
  },
  is_curr_score: {
    EN: " is the current score.",
    CH: "为当前分数。",
  },
  is_expected_score: {
    EN: " is the expected score at level 20.",
    CH: "为此圣遗物20级时的预期分数。",
  },
  is_extreme_score: {
    EN: " is the best score it can get at level 20.",
    CH: "为此圣遗物20级时的最高可能的分数。",
  },
  explanation: {
    EN: "Explanation",
    CH: "说明",
  },
  show_advanced_setting: {
    EN: "Show Advanced Settings",
    CH: "显示高级设置",
  },
  one_of_set_explanation: {
    EN:
      "Switching it on means you are using the set effect of the artifact," +
      " instead of using it as a standalone piece.",
    CH: "如果你认为该圣遗物的套装效果你也会用得上，而不是作为散件使用，那么请打开开关。",
  },
  set_weights_attrs: {
    EN: "Set Weights of Attributes(0~1)",
    CH: "设置各属性价值权重（0～1）",
  },
  set_weights_explanation: {
    EN: "Sets the weight of attributes, the higher the weight, the more valuable the attribute is.\n" +
        "For example, if you set weight 1 for Crit DMG and 0.5 for" +
        " Crit Rate, 7.8% Crit Rate weights the same as 7.8% Crit DMG. The algorithm will" +
        " determine the value of an artifact based on the weights of the attributes.",
    CH: "可以为各个属性设置权重，权重越高，该属性越有价值。\n" +
        "举例来说的话，如果给暴伤权重1，暴击0.5。那么7.8%暴击将和7.8%暴伤在等价。算法基于圣遗物的属性价值为圣遗物排名。",
  }
};

export function prompt_2_lan(key, lan) {
  if (prompt_lan_pair[key] && prompt_lan_pair[key][lan]) {
    return prompt_lan_pair[key][lan];
  } else {
    return key;
  }
}

/**
 * @param {prompt_lan_pair} prompt
 * @param {*} lan
 */
export default function prompt_lan_select(prompt, lan) {
  if (lan in prompt) {
    return prompt[lan];
  } else if ("EN" in prompt) {
    return prompt.EN;
  } else {
    return "";
  }
}
