import { generateCombinations } from "../helpers/comb_perm";
import { Attributes_key, Attributes_keyenum } from "./attribute_consts";

export const MAX_NUM_ATTRS: number = 4;
export const P_3_SUBATTRS_ART_DOMAIN: number = 0.8;
export const P_4_SUBATTRS_ART_DOMAIN: number = 0.2;

export const Artifacts_keyarray = [
  "FLOWER",
  "PLUME",
  "SANDS",
  "GOBLET",
  "CIRCLET",
  "UNDEFINED",
] as const;
export type Artifacts_key = typeof Artifacts_keyarray[number];
export const Artifacts_keyenum: { [key in Artifacts_key]: Artifacts_key } = {
  FLOWER: "FLOWER",
  PLUME: "PLUME",
  SANDS: "SANDS",
  GOBLET: "GOBLET",
  CIRCLET: "CIRCLET",
  UNDEFINED: "UNDEFINED",
};

type attr_weights_t = { [key in Attributes_key]?: number };

/**
 * PRIVATE
 */
export class ArtifactConsts {
  static #SUBATTR_WEIGHTS: attr_weights_t = {
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

  #KEY: Artifacts_key;
  #SHORT_NAME: string;
  #NAME: string;
  #MAINATTR_WEIGHTS: attr_weights_t;

  constructor(
    key: Artifacts_key,
    short_name: string,
    name: string,
    mainattr_weights: attr_weights_t
  ) {
    this.#KEY = key;
    this.#SHORT_NAME = short_name;
    this.#NAME = name;
    this.#MAINATTR_WEIGHTS = mainattr_weights;
  }

  get key(): Artifacts_key {
    return this.#KEY;
  }

  get name(): string {
    return this.#NAME;
  }

  get short_name(): string {
    return this.#SHORT_NAME;
  }

  get mainattr_weights_readonly(): attr_weights_t {
    return this.#MAINATTR_WEIGHTS;
  }

  get subattr_weights_readonly(): attr_weights_t {
    return ArtifactConsts.#SUBATTR_WEIGHTS;
  }
}

export const ALL_3_ATTR_COMB: Attributes_key[][] = <Attributes_key[][]>(
  generateCombinations(
    Object.keys(new ArtifactConsts("UNDEFINED", "", "", {}).subattr_weights_readonly),
    3
  )
);
export const ALL_4_ATTR_COMB: Attributes_key[][] = <Attributes_key[][]>(
  generateCombinations(
    Object.keys(new ArtifactConsts("UNDEFINED", "", "", {}).subattr_weights_readonly),
    4
  )
);

export type Artifacts_val = ArtifactConsts;
type Artifacts_enum = {
  [key in Artifacts_key]: Artifacts_val;
};

export const Artifacts: Artifacts_enum = {
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
  UNDEFINED: new ArtifactConsts("UNDEFINED", "", "", {}),
};

export function ArtifactEnum_find_with_short_name(short_name: string): Artifacts_val {
  let result: ArtifactConsts = Artifacts.UNDEFINED;
  Artifacts_keyarray.some((key: Artifacts_key) => {
    if (Artifacts[key].short_name === short_name) {
      result = Artifacts[key];
      return true;
    }
  });
  return result;
}
