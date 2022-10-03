import { ArtifactConsts, Artifacts_key } from "../consts/artifact_consts";
import { AttributeConsts, Attributes_key } from "../consts/attribute_consts";
import { get_or } from "../helpers/object_helper";
import { wd_total_weight } from "../helpers/random_weighted_dict_selector";

export const FIVE_STAR_ARTIFACT_PER_CONDENSED = 2.141484;
export const CONDENSED_RESIN_VALUE = 40;

export function rarity_expectation(p: number): number {
  return 1 / p;
}

export function rarity_in_resin(p: number): number {
  return (CONDENSED_RESIN_VALUE * rarity_expectation(p)) / FIVE_STAR_ARTIFACT_PER_CONDENSED;
}

export function rarity_in_domain_runs(p: number, use_resin: boolean = true): number {
  if (use_resin) {
    return rarity_expectation(p) / FIVE_STAR_ARTIFACT_PER_CONDENSED;
  } else {
    return rarity_expectation(p) / (FIVE_STAR_ARTIFACT_PER_CONDENSED / 2);
  }
}

export function p_get_set(): number {
  return 0.5;
}

export function p_get_type(artifact_type: Artifacts_key = "UNDEFINED"): number {
  return 0.2;
}

/**
 * @param {ArtifactConsts} artifact_type
 * @param {AttributeConsts} mainattr
 * @returns {number}
 */
export function p_get_mainattr(artifact_type: ArtifactConsts, mainattr: AttributeConsts): number {
  const weights = artifact_type.mainattr_weights_readonly;
  return get_or(weights, mainattr.key, 0) / wd_total_weight(weights);
}
