export const key_lan_pair = {
  // languages
  FLOWER: {
    EN: "Flower",
    CH: "生之花",
  },
  PLUME: {
    EN: "Plume",
    CH: "死之羽",
  },
  SANDS: {
    EN: "Sands",
    CH: "时之沙",
  },
  GOBLET: {
    EN: "Goblet",
    CH: "空之杯",
  },
  CIRCLET: {
    EN: "Circlet",
    CH: "理之冠",
  },
  ATK_FLAT: {
    EN: "ATK",
    CH: "攻击",
  },
  DEF_FLAT: {
    EN: "DEF",
    CH: "防御",
  },
  HP_FLAT: {
    EN: "HP",
    CH: "生命",
  },
  ATK_PCT: {
    EN: "ATK%",
    CH: "攻击%",
  },
  DEF_PCT: {
    EN: "DEF%",
    CH: "防御%",
  },
  HP_PCT: {
    EN: "HP%",
    CH: "生命%",
  },
  CRIT_RATE: {
    EN: "Crit Rate",
    CH: "暴率",
  },
  CRIT_DMG: {
    EN: "Crit DMG",
    CH: "暴伤",
  },
  EM: {
    EN: "EM",
    CH: "精通",
  },
  ER: {
    EN: "ER",
    CH: "充能%",
  },
  PYRO_DB: {
    EN: "Pyro",
    CH: "火伤",
  },
  HYDRO_DB: {
    EN: "Hydro",
    CH: "水伤",
  },
  ANEMO_DB: {
    EN: "Anemo",
    CH: "风伤",
  },
  ELECTRO_DB: {
    EN: "Electro",
    CH: "雷伤",
  },
  DENDRO_DB: {
    EN: "Dendro",
    CH: "草伤",
  },
  CRYO_DB: {
    EN: "Cryo",
    CH: "冰伤",
  },
  GEO_DB: {
    EN: "Geo",
    CH: "岩伤",
  },
  PHYSICAL_DB: {
    EN: "Physical",
    CH: "物理",
  },
  HEALING_BONUS: {
    EN: "Healing Bonus",
    CH: "治疗",
  },
  // weight plans
  common_atk_crit_plan: {
    EN: "Common ATK CRIT",
    CH: "通用攻击双暴",
  },
  common_def_crit_plan: {
    EN: "Common DEF CRIT",
    CH: "通用防御双暴",
  },
  common_hp_crit_plan: {
    EN: "Common HP CRIT",
    CH: "通用生命双暴",
  },
  crit_only_plan: {
    EN: "Crit Only",
    CH: "仅双暴",
  },
};

export function key_2_lan(key, lan) {
  if (key_lan_pair[key] && key_lan_pair[key][lan]) {
    return key_lan_pair[key][lan];
  } else {
    return key;
  }
}

/**
 * @param {prompt_lan_pair} prompt
 * @param {*} lan
 */
export default function key_lan_select(prompt, lan) {
  if (lan in prompt) {
    return prompt[lan];
  } else if ("EN" in prompt) {
    return prompt.EN;
  } else {
    return "";
  }
}
