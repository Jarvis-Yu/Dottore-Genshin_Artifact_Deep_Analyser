const key_lan_pair = {
  // languages
  Flower: {
    EN: "Flower",
    CH: "生之花",
  },
  Plume: {
    EN: "Plume",
    CH: "死之羽",
  },
  Sands: {
    EN: "Sands",
    CH: "时之沙",
  },
  Goblet: {
    EN: "Goblet",
    CH: "空之杯",
  },
  Circlet: {
    EN: "Circlet",
    CH: "理之冠",
  },
  ATK: {
    EN: "ATK",
    CH: "攻击",
  },
  DEF: {
    EN: "DEF",
    CH: "防御",
  },
  HP: {
    EN: "HP",
    CH: "生命",
  },
  "ATK%": {
    EN: "ATK%",
    CH: "攻击%",
  },
  "DEF%": {
    EN: "DEF%",
    CH: "防御%",
  },
  "HP%": {
    EN: "HP%",
    CH: "生命%",
  },
  "Crit Rate": {
    EN: "Crit Rate",
    CH: "暴率",
  },
  "Crit DMG": {
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
  Pyro: {
    EN: "Pyro",
    CH: "火",
  },
  Hydro: {
    EN: "Hydro",
    CH: "水",
  },
  Anemo: {
    EN: "Anemo",
    CH: "风",
  },
  Electro: {
    EN: "Electro",
    CH: "雷",
  },
  Dendro: {
    EN: "Dendro",
    CH: "草",
  },
  Cryo: {
    EN: "Cryo",
    CH: "冰",
  },
  Geo: {
    EN: "Geo",
    CH: "岩",
  },
  Physical: {
    EN: "Physical",
    CH: "物理",
  },
  "Healing Bonus": {
    EN: "Healing Bonus",
    CH: "治疗",
  }
};

export default function key_2_lan(key, lan) {
  if (key_lan_pair[key] && key_lan_pair[key][lan]) {
    return key_lan_pair[key][lan];
  } else {
    return key;
  }
}
