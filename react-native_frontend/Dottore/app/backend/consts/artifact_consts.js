import { generateCombinations } from "../helpers/comb_perm";
import { AttributeEnum } from "./attribute_consts";

export const MAX_NUM_ATTRS = 4;
export const P_3_SUBATTRS_ART_DOMAIN = 0.8;
export const P_4_SUBATTRS_ART_DOMAIN = 0.2;

/**
 * PRIVATE
 */
export class ArtifactConsts {
  static #SUBATTR_WEIGHTS = {
    HP_FLAT: 150,
    ATK_FLAT: 150,
    DEF_FLAT: 150,
    HP_PCT: 100,
    ATK_PCT: 100,
    DEF_PCT: 100,
    CRIT_RATE: 75,
    CRIT_DMG: 75,
    EM: 100,
    ER: 100,
  };

  #KEY;
  #SHORT_NAME;
  #NAME;
  #MAINATTR_WEIGHTS;
  /**
   * @param {string} key
   * @param {string} short_name
   * @param {string} name
   * @param {Object<string, number>} mainattr_weights
   */
  constructor(key, short_name, name, mainattr_weights) {
    this.#KEY = key;
    this.#SHORT_NAME = short_name;
    this.#NAME = name;
    this.#MAINATTR_WEIGHTS = mainattr_weights;
  }

  get key() {
    return this.#KEY;
  }

  get name() {
    return this.#NAME;
  }

  get short_name() {
    return this.#SHORT_NAME;
  }

  get mainattr_weights_readonly() {
    return this.#MAINATTR_WEIGHTS;
  }

  get subattr_weights_readonly() {
    return ArtifactConsts.#SUBATTR_WEIGHTS;
  }
}

export const ALL_3_ATTR_COMB = generateCombinations(Object.keys(new ArtifactConsts().subattr_weights_readonly), 3)
export const ALL_4_ATTR_COMB = generateCombinations(Object.keys(new ArtifactConsts().subattr_weights_readonly), 4)

export const ArtifactEnum = {
  FLOWER: new ArtifactConsts("FLOWER", "Flower", "Flower of Life", {
    HP_FLAT: 100,
  }),
  PLUME: new ArtifactConsts("PLUME", "Plume", "Plume of Death", {
    ATK_FLAT: 100,
  }),
  SANDS: new ArtifactConsts("SANDS", "Sands", "Sands of Eon", {
    HP_PCT: 26.68,
    ATK_PCT: 26.66,
    DEF_PCT: 26.66,
    EM: 10,
    ER: 10,
  }),
  GOBLET: new ArtifactConsts("GOBLET", "Goblet", "Goblet of Eonothem", {
    HP_PCT: 19.175,
    ATK_PCT: 19.175,
    DEF_PCT: 19.15,
    PYRO_DB: 5,
    HYDRO_DB: 5,
    ANEMO_DB: 5,
    ELECTRO_DB: 5,
    DENDRO_DB: 5,
    CRYO_DB: 5,
    GEO_DB: 5,
    PHYSICAL_DB: 5,
    EM: 2.5,
  }),
  CIRCLET: new ArtifactConsts("CIRCLET", "Circlet", "Circlet of Logos", {
    HP_PCT: 22,
    ATK_PCT: 22,
    DEF_PCT: 22,
    EM: 4,
    HEALING_BONUS: 10,
    CRIT_RATE: 10,
    CRIT_DMG: 10,
  }),
};

/**
 * @param {string} short_name
 * @returns {ArtifactConsts}
 */
export function ArtifactEnum_find_with_short_name(short_name) {
  let result = undefined;
  Object.keys(ArtifactEnum).some((key) => {
    if (ArtifactEnum[key].short_name === short_name) {
      result = ArtifactEnum[key];
      return true;
    }
  });
  return result;
}
