export const AVG_SUBATTR_RATIO = 0.85;
export const LIST_SUBATTR_RATIO = [0.7, 0.8, 0.9, 1.0] as const;

export const Attributes_keyarray = [
  "HP_FLAT",
  "HP_PCT",
  "ATK_FLAT",
  "ATK_PCT",
  "DEF_FLAT",
  "DEF_PCT",
  "ER",
  "EM",
  "CRIT_RATE",
  "CRIT_DMG",
  "PYRO_DB",
  "HYDRO_DB",
  "ANEMO_DB",
  "ELECTRO_DB",
  "DENDRO_DB",
  "CRYO_DB",
  "GEO_DB",
  "PHYSICAL_DB",
  "HEALING_BONUS",
  "UNDEFINED",
] as const;
export type Attributes_key = typeof Attributes_keyarray[number];
export const Attributes_keyenum: { [key in Attributes_key]: Attributes_key } = {
  HP_FLAT: "HP_FLAT",
  HP_PCT: "HP_PCT",
  ATK_FLAT: "ATK_FLAT",
  ATK_PCT: "ATK_PCT",
  DEF_FLAT: "DEF_FLAT",
  DEF_PCT: "DEF_PCT",
  ER: "ER",
  EM: "EM",
  CRIT_RATE: "CRIT_RATE",
  CRIT_DMG: "CRIT_DMG",
  PYRO_DB: "PYRO_DB",
  HYDRO_DB: "HYDRO_DB",
  ANEMO_DB: "ANEMO_DB",
  ELECTRO_DB: "ELECTRO_DB",
  DENDRO_DB: "DENDRO_DB",
  CRYO_DB: "CRYO_DB",
  GEO_DB: "GEO_DB",
  PHYSICAL_DB: "PHYSICAL_DB",
  HEALING_BONUS: "HEALING_BONUS",
  UNDEFINED: "UNDEFINED",
};

/**
 * PRIVATE
 */
class AttributeConsts {
  #KEY: Attributes_key;
  #SHORT_NAME: string;
  #NAME: string;
  #MAINATTR_MAX_VAL: number;
  #SUBATTR_7_VAL: number;
  #SUBATTR_8_VAL: number;
  #SUBATTR_9_VAL: number;
  #SUBATTR_10_VAL: number;

  constructor(
    key: Attributes_key,
    short_name: string,
    name: string,
    mainattr_max_val: number = -1,
    subattr_vals: number[] = []
  ) {
    this.#KEY = key;
    this.#SHORT_NAME = short_name;
    this.#NAME = name;
    this.#MAINATTR_MAX_VAL = mainattr_max_val;
    if (subattr_vals.length === 4) {
      this.#SUBATTR_7_VAL = subattr_vals[0];
      this.#SUBATTR_8_VAL = subattr_vals[1];
      this.#SUBATTR_9_VAL = subattr_vals[2];
      this.#SUBATTR_10_VAL = subattr_vals[3];
    } else {
      this.#SUBATTR_7_VAL = -1;
      this.#SUBATTR_8_VAL = -1;
      this.#SUBATTR_9_VAL = -1;
      this.#SUBATTR_10_VAL = -1;
    }
  }

  get key(): Attributes_key {
    return this.#KEY;
  }

  get name(): string {
    return this.#NAME;
  }

  get short_name(): string {
    return this.#SHORT_NAME;
  }

  get mainattr_max_val(): number {
    return this.#MAINATTR_MAX_VAL;
  }

  get subattr_max_val(): number {
    return this.#SUBATTR_10_VAL;
  }

  get subattr_step(): number {
    return this.#SUBATTR_10_VAL / (LIST_SUBATTR_RATIO[LIST_SUBATTR_RATIO.length - 1] * 10);
  }

  get subattr_vals(): number[] {
    return [this.#SUBATTR_7_VAL, this.#SUBATTR_8_VAL, this.#SUBATTR_9_VAL, this.#SUBATTR_10_VAL];
  }
}

export type Attributes_val = AttributeConsts;
type Attributes_enum = {
  [key in Attributes_key]: Attributes_val;
};

export const Attributes: Attributes_enum = {
  HP_FLAT: new AttributeConsts(
    "HP_FLAT",
    "HP",
    "Flat HP",
    4780,
    [209.1300048828125, 239.0, 268.8800048828125, 298.75]
  ),
  HP_PCT: new AttributeConsts(
    "HP_PCT",
    "HP%",
    "HP%",
    0.466,
    [0.040800001472234726, 0.04659999907016754, 0.05249999836087227, 0.05829999968409538]
  ),
  ATK_FLAT: new AttributeConsts(
    "ATK_FLAT",
    "ATK",
    "Flat ATK",
    311,
    [13.619999885559082, 15.5600004196167, 17.510000228881836, 19.450000762939453]
  ),
  ATK_PCT: new AttributeConsts(
    "ATK_PCT",
    "ATK%",
    "ATK%",
    0.466,
    [0.040800001472234726, 0.04659999907016754, 0.05249999836087227, 0.05829999968409538]
  ),
  DEF_FLAT: new AttributeConsts(
    "DEF_FLAT",
    "DEF",
    "Flat DEF",
    undefined,
    [16.200000762939453, 18.520000457763672, 20.829999923706055, 23.149999618530273]
  ),
  DEF_PCT: new AttributeConsts(
    "DEF_PCT",
    "DEF%",
    "DEF%",
    0.583,
    [0.050999999046325684, 0.05829999968409538, 0.06560000032186508, 0.07289999723434448]
  ),
  ER: new AttributeConsts(
    "ER",
    "ER",
    "Elemental Recharge",
    0.518,
    [0.04529999941587448, 0.05180000141263008, 0.05829999968409538, 0.06480000168085098]
  ),
  EM: new AttributeConsts(
    "EM",
    "EM",
    "Elemental Mastery",
    186.5,
    [16.31999969482422, 18.649999618530273, 20.979999542236328, 23.309999465942383]
  ),
  CRIT_RATE: new AttributeConsts(
    "CRIT_RATE",
    "Crit Rate",
    "Crit Rate%",
    0.311,
    [0.0272000003606081, 0.031099999323487282, 0.03500000014901161, 0.03889999911189079]
  ),
  CRIT_DMG: new AttributeConsts(
    "CRIT_DMG",
    "Crit DMG",
    "Crit DMG%",
    0.622,
    [0.0544000007212162, 0.062199998646974564, 0.06989999860525131, 0.07769999653100967]
  ),
  PYRO_DB: new AttributeConsts("PYRO_DB", "Pyro", "Pyro DMG Bonus", 0.466),
  HYDRO_DB: new AttributeConsts("HYDRO_DB", "Hydro", "Hydro DMG Bonus", 0.466),
  ANEMO_DB: new AttributeConsts("ANEMO_DB", "Anemo", "Anemo DMG Bonus", 0.466),
  ELECTRO_DB: new AttributeConsts("ELECTRO_DB", "Electro", "Electro DMG Bonus", 0.466),
  DENDRO_DB: new AttributeConsts("DENDRO_DB", "Dendro", "Dendro DMG Bonus", 0.466),
  CRYO_DB: new AttributeConsts("CRYO_DB", "Cryo", "Cryo DMG Bonus", 0.466),
  GEO_DB: new AttributeConsts("GEO_DB", "Geo", "Geo DMG Bonus", 0.466),
  PHYSICAL_DB: new AttributeConsts("PHYSICAL_DB", "Physical", "Physical DMG Bonus", 0.466),
  HEALING_BONUS: new AttributeConsts("HEALING_BONUS", "Healing Bonus", "Healing Bonus%", 0.359),
  UNDEFINED: new AttributeConsts("UNDEFINED", "", ""),
};

export function Attribute_find_with_short_name(short_name: string): Attributes_val {
  let result: Attributes_val = Attributes.UNDEFINED;
  Attributes_keyarray.some((key: Attributes_key) => {
    if (Attributes[key].short_name === short_name) {
      result = Attributes[key];
      return true;
    }
  });
  return result;
}
