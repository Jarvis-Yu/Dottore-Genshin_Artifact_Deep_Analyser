import { copy_object, get_or } from "../helpers/object_helper";

export class WeightedAttrs {
  #weighted_attrs;
  constructor() {
    this.#weighted_attrs = {};
  }

  /**
   * @param {Object<string, number>} weighted_attrs Object[AttributeEnum, number]
   * @returns {WeightedAttrs}
   */
  set(weighted_attrs) {
    this.#weighted_attrs = copy_object(weighted_attrs);
    return this;
  }

  /**
   * @param {stinrg} weighted_attr AttributeEnum
   * @returns {number}
   */
  get(weighted_attr) {
    return get_or(this.#weighted_attrs, weighted_attr, 0);
  }

  get attrs() {
    return Object.keys(this.#weighted_attrs);
  }
}

export const PresetWeightedAttrs = {
  crit_atk_er_em_plan: new WeightedAttrs().set({
    CRIT_RATE: 1,
    CRIT_DMG: 1,
    ATK_PCT: 0.8,
    ATK_FLAT: 0.3,
    ER: 0.3,
    EM: 0.3,
  }),
  crit_plan: new WeightedAttrs().set({
    CRIT_RATE: 1,
    CRIT_DMG: 1,
  }),
  crit_atk_plan: new WeightedAttrs().set({
    CRIT_RATE: 1,
    CRIT_DMG: 1,
    ATK_PCT: 0.8,
    ATK_FLAT: 0.3,
  })
};
