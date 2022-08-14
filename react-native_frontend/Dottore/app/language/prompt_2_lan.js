const prompt_lan_pair = {
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
};

export default function prompt_2_lan(key, lan) {
  if (prompt_lan_pair[key] && prompt_lan_pair[key][lan]) {
    return prompt_lan_pair[key][lan];
  } else {
    return key;
  }
}
