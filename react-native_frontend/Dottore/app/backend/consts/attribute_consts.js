export const AVG_SUBATTR_RATIO = 0.85;
export const LIST_SUBATTR_RATIO = [0.7, 0.8, 0.9, 1.0];

/**
 * PRIVATE
 */
class AttributeConsts {
  #KEY;
  #SHORT_NAME;
  #NAME;
  #MAINATTR_MAX_VAL;
  #SUBATTR_7_VAL;
  #SUBATTR_8_VAL;
  #SUBATTR_9_VAL;
  #SUBATTR_10_VAL;
  /**
   * @param {string} key
   * @param {string} short_name
   * @param {string} name
   * @param {number} mainattr_max_val
   * @param {list<number>} subattr_vals list[number]
   */
  constructor(key, short_name, name, mainattr_max_val = -1, subattr_vals = []) {
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

  get key() {
    return this.#KEY;
  }

  get name() {
    return this.#NAME;
  }

  get short_name() {
    return this.#SHORT_NAME;
  }

  get mainattr_max_val() {
    return this.#MAINATTR_MAX_VAL;
  }

  get subattr_max_val() {
    return this.#SUBATTR_10_VAL;
  }

  get subattr_step() {
    return this.#SUBATTR_10_VAL / LIST_SUBATTR_RATIO[LIST_SUBATTR_RATIO.length - 1];
  }

  get subattr_vals() {
    return [this.#SUBATTR_7_VAL, this.#SUBATTR_8_VAL, this.#SUBATTR_9_VAL, this.#SUBATTR_10_VAL];
  }
}

export const AttributeEnum = {
  HP_FLAT: new AttributeConsts(
    "HP_FLAT",
    "HP",
    "Flat HP",
    (mainattr_max_val = 4780),
    (subattr_vals = [209.1300048828125, 239.0, 268.8800048828125, 298.75])
  ),
  HP_PCT: new AttributeConsts(
    "HP_PCT",
    "HP%",
    "HP%",
    (mainattr_max_val = 0.466),
    (subattr_vals = [
      0.040800001472234726, 0.04659999907016754, 0.05249999836087227, 0.05829999968409538,
    ])
  ),
  ATK_FLAT: new AttributeConsts(
    "ATK_FLAT",
    "ATK",
    "Flat ATK",
    (mainattr_max_val = 311),
    (subattr_vals = [13.619999885559082, 15.5600004196167, 17.510000228881836, 19.450000762939453])
  ),
  ATK_PCT: new AttributeConsts(
    "ATK_PCT",
    "ATK%",
    "ATK%",
    (mainattr_max_val = 0.466),
    (subattr_vals = [
      0.040800001472234726, 0.04659999907016754, 0.05249999836087227, 0.05829999968409538,
    ])
  ),
  DEF_FLAT: new AttributeConsts(
    "DEF_FLAT",
    "DEF",
    "Flat DEF",
    (subattr_vals = [
      16.200000762939453, 18.520000457763672, 20.829999923706055, 23.149999618530273,
    ])
  ),
  DEF_PCT: new AttributeConsts(
    "DEF_PCT",
    "DEF%",
    "DEF%",
    (mainattr_max_val = 0.583),
    (subattr_vals = [
      0.050999999046325684, 0.05829999968409538, 0.06560000032186508, 0.07289999723434448,
    ])
  ),
  ER: new AttributeConsts(
    "ER",
    "ER",
    "Elemental Recharge",
    (mainattr_max_val = 0.518),
    (subattr_vals = [
      0.04529999941587448, 0.05180000141263008, 0.05829999968409538, 0.06480000168085098,
    ])
  ),
  EM: new AttributeConsts(
    "EM",
    "EM",
    "Elemental Mastery",
    (mainattr_max_val = 186.5),
    (subattr_vals = [16.31999969482422, 18.649999618530273, 20.979999542236328, 23.309999465942383])
  ),
  CRIT_RATE: new AttributeConsts(
    "CRIT_RATE",
    "Crit Rate",
    "Crit Rate%",
    (mainattr_max_val = 0.311),
    (subattr_vals = [
      0.0272000003606081, 0.031099999323487282, 0.03500000014901161, 0.03889999911189079,
    ])
  ),
  CRIT_DMG: new AttributeConsts(
    "CRIT_DMG",
    "Crit DMG",
    "Crit DMG%",
    (mainattr_max_val = 0.622),
    (subattr_vals = [
      0.0544000007212162, 0.062199998646974564, 0.06989999860525131, 0.07769999653100967,
    ])
  ),
  PYRO_DB: new AttributeConsts("PYRO_DB", "Pyro", "Pyro DMG Bonus", (mainattr_max_val = 0.466)),
  HYDRO_DB: new AttributeConsts("HYDRO_DB", "Hydro", "Hydro DMG Bonus", (mainattr_max_val = 0.466)),
  ANEMO_DB: new AttributeConsts("ANEMO_DB", "Anemo", "Anemo DMG Bonus", (mainattr_max_val = 0.466)),
  ELECTRO_DB: new AttributeConsts(
    "ELECTRO_DB",
    "Electro",
    "Electro DMG Bonus",
    (mainattr_max_val = 0.466)
  ),
  DENDRO_DB: new AttributeConsts(
    "DENDRO_DB",
    "Dendro",
    "Dendro DMG Bonus",
    (mainattr_max_val = 0.466)
  ),
  CRYO_DB: new AttributeConsts("CRYO_DB", "Cryo", "Cryo DMG Bonus", (mainattr_max_val = 0.466)),
  GEO_DB: new AttributeConsts("GEO_DB", "Geo", "Geo DMG Bonus", (mainattr_max_val = 0.466)),
  PHYSICAL_DB: new AttributeConsts(
    "PHYSICAL_DB",
    "Physical",
    "Physical DMG Bonus",
    (mainattr_max_val = 0.466)
  ),
  HEALING_BONUS: new AttributeConsts(
    "HEALING_BONUS",
    "Healing Bonus",
    "Healing Bonus%",
    (mainattr_max_val = 0.359)
  ),
};

/**
 * @param {string} short_name
 * @returns {AttributeConsts}
 */
export function AttributeEnum_find_with_short_name(short_name) {
  let result = undefined;
  Object.keys(AttributeEnum).some((key) => {
    if (AttributeEnum[key].short_name === short_name) {
      result = AttributeEnum[key];
      return true;
    }
  });
  return result;
}
