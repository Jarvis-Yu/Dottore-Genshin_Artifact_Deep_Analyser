const key_lan_pair = {
  ATK: {
    EN: "ATK",
    CH: "攻击",
  },
  DEF: {
    EN: "DEF",
    CH: "防御"
  },
  HP: {
    EN: "HP",
    CH: "生命",
  },
  "ATK%": {
    EN: "ATK%",
    CH: "攻击%"
  },
  "DEF%": {
    EN: "DEF%",
    CH: "防御%"
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
    CH: "充能%"
  }
}

export default function key_2_lan(key, lan) {
  if (key_lan_pair[key] && key_lan_pair[key][lan]) {
    return key_lan_pair[key][lan]
  } else {
    return key
  }
}