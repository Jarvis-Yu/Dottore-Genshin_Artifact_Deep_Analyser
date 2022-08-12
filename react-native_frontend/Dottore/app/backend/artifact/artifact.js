import { ArtifactEnum } from "../consts/artifact_consts";
import { wd_p_key } from "../helpers/random_weighted_dict_selector";
import { ArtifactAttrs } from "./artifact_attrs";
import {
  artifact_current_rating,
  artifact_rating_expectation,
  best_possible_rating,
  default_rating_to_crit_based_rating,
} from "./rating";
import {
  leveled_subattrs_distribution,
  relative_rarity_compare_subattrs,
} from "./subattr_distribution";
import { WeightedAttrs, WeightedAttrsPresets } from "./weighted_attrs";

export class Artifact {
  #level;
  #exp;
  #artifact_set;
  #artifact_type;
  #mainattr;
  #subattrs;
  #weighted_subattrs;
  /**
   * @param {number} level
   * @param {number} exp
   * @param {Any} artifact_set
   * @param {string} artifact_type ArtifactEnum
   * @param {string} mainattr AttributeEnum
   * @param {ArtifactAttrs} subattrs
   * @param {WeightedAttrs} weighted_subattrs
   */
  constructor(level, exp, artifact_set, artifact_type, mainattr, subattrs, weighted_subattrs) {
    this.#level = level;
    this.#exp = exp;
    this.#artifact_set = artifact_set;
    this.#artifact_type = artifact_type;
    this.#mainattr = mainattr;
    this.#subattrs = subattrs;
    this.#weighted_subattrs = weighted_subattrs;
  }

  /**
   * @param {weightedattrs} weighted_subattrs
   * @param {boolean} crit_based
   * @returns {number}
   */
  current_rating({ weighted_subattrs = undefined, crit_based = false }) {
    if (!weighted_subattrs) {
      weighted_subattrs = this.#weighted_subattrs;
    }
    rating = artifact_current_rating(this.#mainattr, this.#subattrs, weighted_subattrs);
    if (crit_based) {
      return default_rating_to_crit_based_rating(rating);
    } else {
      return rating;
    }
  }

  /**
   * @param {weightedattrs} weighted_subattrs
   * @param {boolean} crit_based
   * @returns {number}
   */
  expected_rating({ weighted_subattrs = undefined, crit_based = false }) {
    if (!weighted_subattrs) {
      weighted_subattrs = this.#weighted_subattrs;
    }
    rating = artifact_rating_expectation(
      this.#artifact_type,
      this.#mainattr,
      this.#level,
      this.#subattrs,
      weighted_subattrs
    );
    if (crit_based) {
      return default_rating_to_crit_based_rating(rating);
    } else {
      return rating;
    }
  }

  /**
   * @param {weightedattrs} weighted_subattrs
   * @param {boolean} crit_based
   * @returns {number}
   */
  extreme_rating({ weighted_subattrs = undefined, crit_based = false }) {
    if (!weighted_subattrs) {
      weighted_subattrs = this.#weighted_subattrs;
    }
    rating = best_possible_rating(
      this.#artifact_type,
      this.#mainattr,
      this.#level,
      this.#subattrs,
      weighted_subattrs
    );
    if (crit_based) {
      return default_rating_to_crit_based_rating(rating);
    } else {
      return rating;
    }
  }

  /**
   * @param {weightedattrs} weighted_subattrs
   * @returns {number}
   */
  relative_p({ weighted_subattrs = undefined }) {
    if (!weighted_subattrs) {
      weighted_subattrs = this.#weighted_subattrs;
    }
    const p_main_attr = wd_p_key(
      ArtifactEnum[this.#artifact_type].mainattr_weights_readonly,
      this.#mainattr
    );
    let p_subattrs = 0;
    if (this.#level < 4) {
      p_subattrs = relative_rarity_compare_subattrs(
        this.#artifact_type,
        this.#mainattr,
        this.#level,
        this.#subattrs,
        weighted_subattrs
      );
    } else {
      const result = leveled_subattrs_distribution(this.#mainattr, this.#level, weighted_subattrs);
      p_subattrs = result.p_score_greater(this.expected_rating({ weighted_subattrs }), true);
    }
    return p_main_attr * p_subattrs;
  }

  /**
   * @param {number} level
   * @param {string} artifact_type  ArtifactEnum
   * @param {string} mainattr AttributeEnum
   * @param {ArtifactAttrs} subattrs
   * @param {WeightedAttrs} [weights]
   * @returns
   */
  static rating_only_plan(
    level,
    artifact_type,
    mainattr,
    subattrs,
    weights = WeightedAttrsPresets.crit_atk_plan
  ) {
    return new Artifact(level, 0, undefined, artifact_type, mainattr, subattrs, weights);
  }
}
