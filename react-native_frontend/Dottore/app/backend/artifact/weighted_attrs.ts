import { Attributes_key } from "../consts/attribute_consts";
import { copy_object, get_or } from "../helpers/object_helper";

type weighted_attrs_type = { [key in Attributes_key]?: number };

export class WeightedAttrs {
  #weighted_attrs: weighted_attrs_type;
  constructor() {
    this.#weighted_attrs = {};
  }

  set(weighted_attrs: weighted_attrs_type): WeightedAttrs {
    this.#weighted_attrs = copy_object(weighted_attrs);
    return this;
  }

  add(weighted_attr: Attributes_key, weight: number): WeightedAttrs {
    this.#weighted_attrs[weighted_attr] = weight;
    return this;
  }

  get(weighted_attr: Attributes_key): number {
    return get_or(this.#weighted_attrs, weighted_attr, 0);
  }

  get attrs(): Attributes_key[] {
    return <Attributes_key[]> Object.keys(this.#weighted_attrs);
  }
}

export const WeightedAttrsPresets: { [key: string]: WeightedAttrs } = {
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
  }),
};
