import {
  ALL_3_ATTR_COMB,
  ALL_4_ATTR_COMB,
  Artifacts,
  Artifacts_key,
  MAX_NUM_ATTRS,
  P_3_SUBATTRS_ART_DOMAIN,
  P_4_SUBATTRS_ART_DOMAIN,
} from "../consts/artifact_consts";
import { Attributes_key, AVG_SUBATTR_RATIO, LIST_SUBATTR_RATIO } from "../consts/attribute_consts";
import { sum_array } from "../helpers/array_helper";
import { copy_object, get_or, set_if_exist } from "../helpers/object_helper";
import { ArtifactAttrs } from "./artifact_attrs";
import {
  artifact_rating_expectation,
  artifact_remaining_enhance,
  p_subattr_combination,
} from "./rating";
import { WeightedAttrs } from "./weighted_attrs";

function scale_distribution(): { [num: string]: number }[] {
  const distribution: { [num: string]: number }[] = [{ 0: 1 }];
  const len_ratios = LIST_SUBATTR_RATIO.length;
  for (let i = 1; i < 11; i++) {
    const prev: { [num: string]: number } = distribution[i - 1];
    const curr: { [num: string]: number } = {};
    Object.keys(prev).forEach((scale) => {
      LIST_SUBATTR_RATIO.forEach((ratio) => {
        const key = (Number(scale) + ratio).toFixed(1);
        curr[key] = get_or(curr, key, 0) + prev[scale] * (1 / len_ratios);
      });
    });
    distribution.push(curr);
  }
  return distribution;
}

function lvl0_distribution(): { data: number[][]; p: number; num: number }[] {
  const distribution: { data: number[][]; p: number; num: number }[] = [{ data: [], p: 1, num: 0 }];
  const len_list: number = LIST_SUBATTR_RATIO.length;
  for (let i = 1; i < 5; i++) {
    const num = i;
    const p = (1 / len_list) ** num;
    const list: number[][] = [];

    function recur(carry_list: number[], recur_times: number): void {
      if (recur_times === 0) {
        list.push([...carry_list]);
        return;
      }
      LIST_SUBATTR_RATIO.forEach((j) => {
        carry_list.push(j);
        recur(carry_list, recur_times - 1);
        carry_list.pop();
      });
    }

    recur([], i);
    distribution.push({
      data: list,
      p,
      num,
    });
  }
  return distribution;
}

export const SCALE_DISTRIBUTION: { [num: string]: number }[] = scale_distribution();
export const LVL0_DISTRIBUTION: { data: number[][]; p: number; num: number }[] =
  lvl0_distribution();

function encode(arr: number[]): string {
  return arr.map((item) => item.toString()).join(":");
}

function decode(s: string): number[] {
  return s.split(":").map((val) => Number(val));
}

function encodeArr(arr: number[][]): string {
  return arr.map(encode).join(";");
}

function decodeArr(s: string): number[][] {
  return s.split(";").map(decode);
}

class LSDResult {
  #LVL: number;
  #REMAINING_ENHANCE: number;
  #SORTED_RESULT;
  #MAX_VALUES: number[];
  #MIN_VALUES: number[];
  #EXP_VALUES: number[];
  #LEN_RESULT;

  private_max_value(casee: number[][]): number {
    let score = 0;
    casee.forEach((each) => {
      score += each[0] * each[2];
    });
    return score;
  }

  private_min_value(casee: number[][]): number {
    let score = 0;
    casee.forEach((each) => {
      score += each[0] * each[2] * 0.7;
    });
    return score;
  }

  private_exp_value(casee: number[][]): number {
    let score = 0;
    casee.forEach((each) => {
      score += each[0] * each[1] * AVG_SUBATTR_RATIO * (this.#REMAINING_ENHANCE / MAX_NUM_ATTRS);
    });
    return score;
  }

  constructor(result: { [key: string]: number }, lvl: number) {
    this.#LVL = lvl;
    this.#REMAINING_ENHANCE = artifact_remaining_enhance(this.#LVL);
    const tmp_arr: [number[][], number][] = <[number[][], number][]>(
      Object.keys(result).map((key) => [decodeArr(key), result[key]])
    );
    tmp_arr.sort((a, b) => this.private_max_value(b[0]) - this.private_max_value(a[0]));
    this.#SORTED_RESULT = tmp_arr;
    this.#MAX_VALUES = [];
    this.#MIN_VALUES = [];
    this.#EXP_VALUES = [];
    this.#SORTED_RESULT.forEach((item) => {
      this.#MAX_VALUES.push(this.private_max_value(item[0]));
      this.#MIN_VALUES.push(this.private_min_value(item[0]));
      this.#EXP_VALUES.push(this.private_exp_value(item[0]));
    });
    this.#LEN_RESULT = this.#SORTED_RESULT.length;
  }

  private_p_in_actual_distribution(casee: number[][], score: number): number {
    const len_casee = casee.length;
    const p: number[] = [];

    function recur(i: number, carried_score: number, carried_p: number) {
      if (i === len_casee) {
        if (carried_score >= score) {
          p.push(carried_p);
        }
        return;
      }
      const value = casee[i][0];
      const enhances = casee[i][2];
      const distribution = SCALE_DISTRIBUTION[enhances];
      Object.keys(distribution).forEach((scale) => {
        recur(i + 1, carried_score + value * Number(scale), carried_p * distribution[scale]);
      });
    }

    recur(0, 0, 1);
    p.sort();
    return p.reduce((acc, nxt) => acc + nxt, 0);
  }

  p_score_greater(score: number, withExp: boolean = false): number {
    const adjusted_score = score - 0.001;
    const p = [];
    for (let i = 0; i < this.#LEN_RESULT; i++) {
      const casee = this.#SORTED_RESULT[i][0];
      const p_casee = this.#SORTED_RESULT[i][1];
      const max_value = this.#MAX_VALUES[i];
      const min_value = this.#MIN_VALUES[i];
      let exp_value = 0;
      if (withExp) {
        exp_value = this.#EXP_VALUES[i];
      }
      const score_diff_exp = adjusted_score - exp_value;
      if (max_value >= score_diff_exp) {
        if (min_value >= score_diff_exp) {
          p.push(p_casee);
        } else {
          p.push(p_casee * this.private_p_in_actual_distribution(casee, score_diff_exp));
        }
      }
    }
    p.sort();
    return p.reduce((acc, nxt) => acc + nxt, 0);
  }
}

/**
 * @param {string} mainattr AttributeEnum
 * @param {number} lvl
 * @param {WeightedAttrs} weights
 * @returns {LSDResult}
 */
export function leveled_subattrs_distribution(
  mainattr: Attributes_key,
  lvl: number,
  weights: WeightedAttrs
): LSDResult {
  if (lvl < 4) {
    return new LSDResult({}, -1); // TODO: empty
  }
  const weighted_subattrs = copy_object(Artifacts.FLOWER.subattr_weights_readonly);
  set_if_exist(weighted_subattrs, mainattr, 0);
  let curr_layer: { [key: string]: number } = {};
  let next_layer: { [key: string]: number } = {};
  let curr_level_covers = 7;
  // for Array<AttributeEnum.key> in ...
  ALL_4_ATTR_COMB.forEach((comb) => {
    if (!(mainattr in comb)) {
      const p_comb = p_subattr_combination(weighted_subattrs, comb);
      const attrs: [number, number, number][] = [];
      const attrs_count: { [key: string]: number } = {};
      // for AttributeEnum.key in ...
      comb.forEach((attr) => {
        const value = weights.get(attr);
        if (value > 0) {
          attrs_count[value] = get_or(attrs_count, value.toString(), 0) + 1;
        }
      });
      // for number in ...
      Object.keys(attrs_count).forEach((weight) => {
        const num_weight = Number(weight);
        attrs.push([num_weight, attrs_count[weight], attrs_count[weight]]);
      });
      attrs.sort((a, b) => b[0] - a[0]);
      if (attrs.length > 0) {
        let key: string = encodeArr(attrs);
        curr_layer[key] = get_or(curr_layer, key, 0) + P_3_SUBATTRS_ART_DOMAIN * p_comb;
        let not_stronger_count = MAX_NUM_ATTRS;
        const len_attrs = attrs.length;
        for (let i = 0; i < len_attrs; i++) {
          const original_tuple = attrs[i];
          const weight = original_tuple[1];
          attrs[i] = [original_tuple[0], original_tuple[1], original_tuple[2] + 1];
          key = encodeArr(attrs);
          const p_chosen = weight / MAX_NUM_ATTRS;
          curr_layer[key] =
            get_or(curr_layer, key, 0) + P_4_SUBATTRS_ART_DOMAIN * p_comb * p_chosen;
          not_stronger_count -= weight;
          attrs[i] = original_tuple;
        }
        key = encodeArr(attrs);
        const p_chosen = not_stronger_count / MAX_NUM_ATTRS;
        curr_layer[key] = get_or(curr_layer, key, 0) + P_4_SUBATTRS_ART_DOMAIN * p_comb * p_chosen;
      }
    }
  });

  while (curr_level_covers < lvl) {
    // for Array<Array<number>>.toString() in ...
    Object.keys(curr_layer).forEach((situation) => {
      let not_stronger_count = MAX_NUM_ATTRS;
      const arr_situation = decodeArr(situation);
      const len_attrs = arr_situation.length;
      const p_situation = curr_layer[situation];
      for (let i = 0; i < len_attrs; i++) {
        const original_tuple = arr_situation[i];
        const value = original_tuple[0];
        const weight = original_tuple[1];
        const scale = original_tuple[2];
        arr_situation[i] = [value, weight, scale + 1];
        const key = encodeArr(arr_situation);
        const p_chosen = weight / MAX_NUM_ATTRS;
        next_layer[key] = get_or(next_layer, key, 0) + p_situation * p_chosen;
        not_stronger_count -= weight;
        arr_situation[i] = original_tuple;
      }
      const key = encodeArr(arr_situation);
      const p_chosen = not_stronger_count / MAX_NUM_ATTRS;
      next_layer[key] = get_or(next_layer, key, 0) + p_situation * p_chosen;
    });
    curr_layer = next_layer;
    next_layer = {};
    curr_level_covers += 4;
  }

  // console.log("=========")
  // Object.keys(curr_layer).forEach((key) => {
  //   console.log(key, curr_layer[key])
  // })
  return new LSDResult(curr_layer, lvl);
}

/**
 * @param {string} artifact_type ArtifactEnum
 * @param {string} mainattr AttributeEnum
 * @param {number} lvl
 * @param {ArtifactAttrs} attrs
 * @param {WeightedAttrs} weights
 * @returns
 */
export function relative_rarity_compare_subattrs(
  artifact_type: Artifacts_key,
  mainattr: Attributes_key,
  lvl: number,
  attrs: ArtifactAttrs,
  weights: WeightedAttrs
) {
  const this_rating = artifact_rating_expectation(artifact_type, mainattr, lvl, attrs, weights);
  const subattrs_except_main = copy_object(Artifacts[artifact_type].subattr_weights_readonly);
  set_if_exist(subattrs_except_main, mainattr, 0);

  /**
   * @param {Array<Array>} combs
   */
  function calculate_p(combs: Attributes_key[][]) {
    const p_list: number[] = [];
    combs.forEach((comb) => {
      if (!(mainattr in comb)) {
        const p_comb = p_subattr_combination(subattrs_except_main, comb);
        const comb_attrs = new ArtifactAttrs();
        const tmp_attrs: { [key in Attributes_key]?: number } = {};
        comb.forEach((attr) => {
          tmp_attrs[attr] = 0;
        });
        comb_attrs.set(tmp_attrs);
        const comb_avg_rating = artifact_rating_expectation(
          artifact_type,
          mainattr,
          0,
          comb_attrs,
          weights
        );
        const max_base_rating =
          comb.map((attr) => weights.get(attr)).reduce((acc, nxt) => acc + nxt, 0) *
          LIST_SUBATTR_RATIO[LIST_SUBATTR_RATIO.length - 1];
        if (this_rating > comb_avg_rating + max_base_rating) {
          p_list.push(p_comb);
          return;
        }
        const len_comb = comb.length;
        const distribution = LVL0_DISTRIBUTION[len_comb];
        distribution.data.forEach((casee) => {
          let base_rating = 0;
          for (let i = 0; i < len_comb; i++) {
            base_rating += casee[i] * weights.get(comb[i]);
          }
          if (this_rating > comb_avg_rating + base_rating) {
            p_list.push(p_comb * distribution.p);
          }
        });
      }
    });
    return p_list;
  }

  const p_3 = calculate_p(ALL_3_ATTR_COMB);
  const p_4 = calculate_p(ALL_4_ATTR_COMB);
  p_3.sort();
  p_4.sort();
  const p: number = P_3_SUBATTRS_ART_DOMAIN * sum_array(p_3) + P_4_SUBATTRS_ART_DOMAIN * sum_array(p_4);
  return 1 - p;
}
