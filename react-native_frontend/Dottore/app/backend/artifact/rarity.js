import { ArtifactConsts } from "../consts/artifact_consts";
import { AttributeConsts } from "../consts/attribute_consts";
import { wd_total_weight } from "../helpers/random_weighted_dict_selector";

export const FIVE_STAR_ARTIFACT_PER_CONDENSED = 2.141484;
export const CONDENSED_RESIN_VALUE = 40;

/**
 * @param {number} p
 * @returns {number} 1 / p
 */
export function rarity_expectation(p) {
  return 1 / p;
}

/**
 * @param {number} p
 * @returns {number}
 */
export function rarity_in_resin(p) {
  return (CONDENSED_RESIN_VALUE * rarity_expectation(p)) / FIVE_STAR_ARTIFACT_PER_CONDENSED;
}

/**
 * @param {number} p
 * @param {boolean} [use_resin] default to true
 * @returns {number}
 */
export function rarity_in_domain_runs(p, use_resin = true) {
  if (use_resin) {
    return rarity_expectation(p) / FIVE_STAR_ARTIFACT_PER_CONDENSED;
  } else {
    return rarity_expectation(p) / (FIVE_STAR_ARTIFACT_PER_CONDENSED / 2);
  }
}

/**
 * @returns {number} 0.5
 */
export function p_get_set() {
  return 0.5;
}

/**
 * @param {ArtifactConsts} [artifact_type]
 * @returns {number} 0.2
 */
export function p_get_type(artifact_type = undefined) {
  return 0.2;
}

/**
 * @param {ArtifactConsts} artifact_type
 * @param {AttributeConsts} mainattr
 * @returns {number}
 */
export function p_get_mainattr(artifact_type, mainattr) {
  const weights = artifact_type.mainattr_weights_readonly;
  return (weights[mainattr.key] ? weights[mainattr.key] : 0) / wd_total_weight(weights);
}
