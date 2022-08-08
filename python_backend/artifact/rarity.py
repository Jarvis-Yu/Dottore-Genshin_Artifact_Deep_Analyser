__fpath__ = "artifact"

from typing import Dict, Set

import numpy as np

from python_backend.consts.terminology.artifact_consts import ArtifactEnum, P_3_SUBATTRS_ART_DOMAIN, \
    P_4_SUBATTRS_ART_DOMAIN
from python_backend.consts.terminology.attribute_consts import AttributeEnum
from python_backend.helpers.random_weighted_dict_selector import wd_total_weight, \
    wd_p_key
from python_backend.statistics.function_call_stat import func_called

FIVE_STAR_ARTIFACT_PER_CONDENSED = 2.141484
CONDENSED_RESIN_VALUE = 40


def rarity_expectation(p: float) -> float:
    """
    :return: 1/p
    """
    return 1 / p


def rarity_in_resin(p: float) -> float:
    return CONDENSED_RESIN_VALUE * rarity_expectation(p) / FIVE_STAR_ARTIFACT_PER_CONDENSED


def rarity_in_domain_runs(p: float, use_resin=True) -> float:
    if use_resin:
        return rarity_expectation(p) / FIVE_STAR_ARTIFACT_PER_CONDENSED
    else:
        return rarity_expectation(p) / (FIVE_STAR_ARTIFACT_PER_CONDENSED / 2)


def p_get_set() -> float:
    """
    :return: the probability of getting an artifact of a particular set from corresponding artifact
             domain.
    """
    return 0.5


def p_get_type(artifact_type: ArtifactEnum = None) -> float:
    return 0.2


def p_get_mainattr(artifact_type: ArtifactEnum, mainattr: AttributeEnum) -> float:
    """
    :return: the probability of getting the `mainattr` from a random artifact of `artifact_type`.
    """
    weights = artifact_type.mainattr_weights_readonly()
    return weights.get(mainattr, 0) / wd_total_weight(weights)


def p_get_x_subattrs(x: int) -> float:
    """
    :return: the probability that the artifact got from artifact domain has 3 or 4 sub-attrs.
             0 is returned if `x` is not 3 or 4.
    """
    if x == 3:
        return P_3_SUBATTRS_ART_DOMAIN
    elif x == 4:
        return P_4_SUBATTRS_ART_DOMAIN
    else:
        return 0


def p_y_useful_given_x(artifact_type: ArtifactEnum, mainattr: AttributeEnum, x: int, y: int,
                       useful_attrs: Set[AttributeEnum]) -> float:
    """
    Given the artifact has x sub-attrs at level 0, there are y useful

    :param artifact_type: type is ArtifactEnum
    :param mainattr:  type is AttributeEnum
    :param useful_attrs:  type is Set(AttributeEnum)
    :param x: number of sub-attrs at level 0
    :param y: desired number of useful attrs at level 0
    :return: probability that the conditions are satisfied
    """
    func_called(__fpath__ + "p_y_useful_given_x")

    def brute_force() -> float:
        possible_sub_attr: Dict = artifact_type.subattr_weights_readonly().copy()
        possible_sub_attr.pop(mainattr, None)
        subattrs: Set = set()  # current subattrs
        p_success = []  # list of prob of all satisfying cases
        p_fail = []
        probilities = []  # list of probilities that the sub-attrs is chosen

        recur_times = [0]  # records the number of times recur() is called

        def recur():
            recur_times[0] += 1
            if len(subattrs) == x:
                count = 0
                for attr in subattrs:
                    if attr in useful_attrs:
                        count += 1
                if count >= y:
                    p_success.append(np.prod(probilities))
                else:
                    p_fail.append(np.prod(probilities))
                return
            else:
                for attr in possible_sub_attr:
                    if possible_sub_attr[attr] != 0:
                        probilities.append(wd_p_key(possible_sub_attr, attr))
                        subattrs.add(attr)
                        weight = possible_sub_attr[attr]
                        possible_sub_attr[attr] = 0
                        recur()
                        possible_sub_attr[attr] = weight
                        subattrs.remove(attr)
                        probilities.pop()
                return

        recur()
        p_success.sort()
        return sum(p_success)

    def dynamic_programming() -> float:
        possible_sub_attrs: Dict = artifact_type.subattr_weights_readonly().copy()
        possible_sub_attrs.pop(mainattr, None)
        p_success = []  # list of prob of all satisfying cases
        memorized_data = [{}, {}]

        one_iteration_times = [0]  # records the number of times recur() is called

        def one_iteration(num_attrs: int):
            base = memorized_data[num_attrs - 1]
            now = memorized_data[num_attrs]
            for case in base:
                one_iteration_times[0] += 1
                saved_data = {}
                for attr in case:  # remove existing attrs from pool
                    saved_data[attr] = possible_sub_attrs.pop(attr)
                for attr in possible_sub_attrs:  # calc probability
                    attrs = set(case)
                    attrs.add(attr)
                    frozen_attrs = frozenset(attrs)
                    now[frozen_attrs] = now.setdefault(frozen_attrs, 0) + base[case] * wd_p_key(
                        possible_sub_attrs, attr)
                for attr in case:  # restore consts
                    possible_sub_attrs[attr] = saved_data[attr]

        for attr in possible_sub_attrs:
            memorized_data[1][frozenset([attr])] = wd_p_key(possible_sub_attrs, attr)
        for curr_num_subattrs in range(2, x + 1):
            memorized_data.append({})
            one_iteration(curr_num_subattrs)
        for case in memorized_data[x]:
            count = 0
            for attr in case:
                if attr in useful_attrs:
                    count += 1
            if count >= y:
                p_success.append(memorized_data[x][case])
        p_success.sort()
        return sum(p_success)

    # return brute_force()
    return dynamic_programming()


if __name__ == '__main__':
    print(p_y_useful_given_x(ArtifactEnum.PLUME, AttributeEnum.ATK_FLAT, 4, 1, {
        AttributeEnum.ATK_PCT,
        AttributeEnum.CRIT_DMG,
        AttributeEnum.CRIT_RATE,
    }))
