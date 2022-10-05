import { Artifacts, Artifacts_key, MAX_NUM_ATTRS } from "../consts/artifact_consts";
import { Attributes, Attributes_key, AVG_SUBATTR_RATIO } from "../consts/attribute_consts";
import { permute } from "../helpers/comb_perm";
import { copy_object, set_if_exist } from "../helpers/object_helper";
import { wd_p_key } from "../helpers/random_weighted_dict_selector";
import { ArtifactAttrs } from "./artifact_attrs";
import { WeightedAttrs } from "./weighted_attrs";

/**
 * @param {Object<string, number>} weights
 * @param {Array<string>} permutation ordered iterable of keys
 * @returns {number} the probabilty that a particular permutation is chosen with weights.
                     And each item can only be chosen once.
 */
function p_permutation(weights: { [key: string]: number }, permutation: string[]): number {
  let p = 1;
  const tmp_save: { [key: string]: number } = {};
  permutation.forEach((key) => {
    p *= wd_p_key(weights, key);
    tmp_save[key] = weights[key];
    weights[key] = 0;
  });
  Object.keys(tmp_save).forEach((key) => {
    weights[key] = tmp_save[key];
  });
  return p;
}

/**
 * @param {Object<string, number>} weights
 * @param {Array<string>} combination iterable of keys
 * @returns {number} the probabilty that a particular combination is chosen with weights.
                     And each item can only be chosen once.
 */
export function p_subattr_combination(
  weights: { [key: string]: number },
  combination: string[]
): number {
  const permutations = permute(combination);
  let p = 0;
  permutations.forEach((permutation) => {
    p += p_permutation(weights, permutation);
  });
  return p;
}

export function artifact_remaining_enhance(lvl: number): number {
  if (lvl > 20 || lvl < 0) {
    return -1;
  }
  return Math.floor((23 - lvl) / 4);
}

export function default_rating_to_crit_based_rating(rating: number): number {
  return rating * Attributes.CRIT_DMG.subattr_max_val * 100;
}

/**
 * @param {string} mainattr AttributeEnum
 * @param {ArtifactAttrs} attrs
 * @param {WeightedAttrs} weights
 * @returns {number} rating
 */
export function artifact_current_rating(
  mainattr: Attributes_key,
  attrs: ArtifactAttrs,
  weights: WeightedAttrs
): number {
  let rating = 0;
  attrs.attrs.forEach((attr) => {
    rating += weights.get(attr) * attrs.get_scale(attr);
  });
  return rating;
}

/**
 * @param {string} artifact_type ArtifactEnum
 * @param {string} mainattr AttributeEnum
 * @param {number} lvl
 * @param {ArtifactAttrs} attrs
 * @param {WeightedAttrs} weights
 * @returns {number} rating
 */
export function artifact_rating_expectation(
  artifact_type: Artifacts_key,
  mainattr: Attributes_key,
  lvl: number,
  attrs: ArtifactAttrs,
  weights: WeightedAttrs
): number {
  let rating = 0;
  const true_artifact_type = Artifacts[artifact_type];
  const true_mainattr = Attributes[mainattr];
  const chances = artifact_remaining_enhance(lvl);
  const chance_per_attr = (chances - (MAX_NUM_ATTRS - attrs.num_of_attrs)) / MAX_NUM_ATTRS;
  attrs.attrs.forEach((attr) => {
    let tmp = attrs.get_scale(attr);
    tmp += chance_per_attr * AVG_SUBATTR_RATIO;
    rating += tmp * weights.get(attr);
  });
  if (attrs.num_of_attrs === 3) {
    const backup_attrs = copy_object(true_artifact_type.subattr_weights_readonly);
    set_if_exist(backup_attrs, mainattr, 0);
    attrs.attrs.forEach((attr) => {
      set_if_exist(backup_attrs, attr, 0);
    });
    weights.attrs.forEach((attr) => {
      if (backup_attrs[attr] && backup_attrs[attr] > 0) {
        rating +=
          wd_p_key(backup_attrs, attr) *
          weights.get(attr) *
          (1 + chance_per_attr) *
          AVG_SUBATTR_RATIO;
      }
    });
  }
  return rating;
}

/**
 * @param {string} artifact_type ArtifactEnum
 * @param {string} mainattr AttributeEnum
 * @param {number} lvl
 * @param {ArtifactAttrs} attrs
 * @param {WeightedAttrs} weights
 * @returns {number} rating
 */
export function best_possible_rating(
  artifact_type: Artifacts_key,
  mainattr: Attributes_key,
  lvl: number,
  attrs: ArtifactAttrs,
  weights: WeightedAttrs
): number {
  let rating = 0;
  const true_artifact_type = Artifacts[artifact_type];
  const true_mainattr = Attributes[mainattr];
  const chances = artifact_remaining_enhance(lvl);
  if (attrs.num_of_attrs === MAX_NUM_ATTRS) {
    // case when artifact has 4 sub-attrs
    let best_attrs: Attributes_key[] = [];
    attrs.attrs.forEach((attr) => {
      if (best_attrs.length === 0) {
        best_attrs.push(attr);
      } else if (weights.get(attr) > weights.get(best_attrs[0])) {
        best_attrs = [attr];
      } else if (weights.get(attr) === weights.get(best_attrs[0])) {
        best_attrs.push(attr);
      }
      rating += weights.get(attr) * attrs.get_scale(attr);
    });
    rating += chances * weights.get(best_attrs[0]);
  } else {
    const all_possible_attrs: Attributes_key[] = <Attributes_key[]>(
      Object.keys(true_artifact_type.subattr_weights_readonly)
    );
    let highest_weighted_attrs: Attributes_key[] = [];
    let highest_not_in_attrs: Attributes_key[] = [];
    all_possible_attrs.forEach((attr) => {
      if (attr === mainattr) return;
      const weight_attr = weights.get(attr);
      if (highest_not_in_attrs.length === 0) {
        highest_weighted_attrs.push(attr);
      } else if (weight_attr > weights.get(highest_weighted_attrs[0])) {
        highest_weighted_attrs = [attr];
      } else if (weight_attr === weights.get(highest_weighted_attrs[0])) {
        highest_weighted_attrs.push(attr);
      }
      if (!attrs.attrs.includes(attr)) {
        if (highest_not_in_attrs.length === 0) {
          highest_not_in_attrs.push(attr);
        } else if (weight_attr > weights.get(highest_not_in_attrs[0])) {
          highest_not_in_attrs = [attr];
        } else if (weight_attr === weights.get(highest_not_in_attrs[0])) {
          highest_not_in_attrs.push(attr);
        }
      }
    });
    attrs.attrs.forEach((attr) => {
      rating += weights.get(attr) * attrs.get_scale(attr);
    });
    rating += weights.get(highest_not_in_attrs[0]);
    rating += (chances - 1) * weights.get(highest_weighted_attrs[0]);
  }
  return rating;
}
