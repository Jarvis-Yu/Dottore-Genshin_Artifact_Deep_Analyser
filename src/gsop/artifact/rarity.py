__fpath__ = "artifact"

from typing import Dict, Set

import numpy as np

from src.gsop.helpers.random_weighted_dict_selector import wd_total_weight, \
    wd_p_key
from src.gsop.statistics.function_call_stat import func_called
from src.gsop.values.constants import P_3_SUBSTAT_ART_DOMAIN, \
    P_4_SUBSTAT_ART_DOMAIN
from src.gsop.values.terminology.artifact import ArtifactEnum as ae
from src.gsop.values.terminology.attribute import AttributeEnum as attre

FIVE_STAR_ARTIFACT_PER_CONDENSED = 2.141484
CONDENSED_RESIN_VALUE = 40


def rarity_expectation(p: float) -> float:
    """
    Returns 1/p
    """
    return 1 / p


def rarity_in_resin(p: float) -> float:
    return CONDENSED_RESIN_VALUE * rarity_expectation(p) / FIVE_STAR_ARTIFACT_PER_CONDENSED


def rarity_in_domain_runs(p: float, use_resin=True) -> float:
    if use_resin:
        return rarity_expectation(p) / FIVE_STAR_ARTIFACT_PER_CONDENSED
    else:
        return rarity_expectation(p) / (FIVE_STAR_ARTIFACT_PER_CONDENSED / 2)


def p_get_set(setName=None) -> float:
    return 0.5


def p_get_type(artifact_type: ae = None) -> float:
    return 0.2


def p_get_mainstat(artifact_type: ae, mainstat: attre) -> float:
    weights = artifact_type.mainstat_weights()
    return weights[mainstat] / wd_total_weight(weights)


def p_get_x_substats(x: int) -> float:
    if x == 3:
        return P_3_SUBSTAT_ART_DOMAIN
    elif x == 4:
        return P_4_SUBSTAT_ART_DOMAIN
    else:
        return 0


def p_y_useful_given_x(artifact_type: ae, mainstat: attre,
                       usefulstats: Set[attre], x: int, y: int) -> float:
    """
    Given the artifact has x substats at level 0, there are y useful
    :param artifact_type: type is ArtifactEnum
    :param mainstat:  type is AttributeEnum
    :param usefulstats:  type is Set(AttributeEnum)
    :param x: number of substats at level 0
    :param y: desired number of useful stats at level 0
    :return: probability that the conditions are satisfied
    """
    func_called(__fpath__ + "p_y_useful_given_x")

    def brute_force() -> float:
        possible_sub_stats: Dict = artifact_type.substat_weights().copy()
        possible_sub_stats.pop(mainstat, None)
        substats: Set = set()  # current substats
        p_success = []  # list of prob of all satisfying cases
        p_fail = []
        probilities = []  # list of probilities that the substat is chosen

        recur_times = [0]  # records the number of times recur() is called

        def recur():
            recur_times[0] += 1
            if len(substats) == x:
                count = 0
                for attr in substats:
                    if attr in usefulstats:
                        count += 1
                if count >= y:
                    p_success.append(np.prod(probilities))
                else:
                    p_fail.append(np.prod(probilities))
                return
            else:
                for attr in possible_sub_stats:
                    if possible_sub_stats[attr] != 0:
                        probilities.append(wd_p_key(possible_sub_stats, attr))
                        substats.add(attr)
                        weight = possible_sub_stats[attr]
                        possible_sub_stats[attr] = 0
                        recur()
                        possible_sub_stats[attr] = weight
                        substats.remove(attr)
                        probilities.pop()
                return

        recur()
        p_success.sort()
        # print(recur_times[0])
        # print(sum(p_success) + sum(p_fail))
        return sum(p_success)

    def dynamic_programming() -> float:
        possible_sub_stats: Dict = artifact_type.substat_weights().copy()
        possible_sub_stats.pop(mainstat, None)
        substats: Set = set()  # current substats
        p_success = []  # list of prob of all satisfying cases
        probilities = []  # list of probilities that the substat is chosen
        memorized_data = [{}, {}]

        one_iteration_times = [0]  # records the number of times recur() is called

        def one_iteration(num_stats: int):
            base = memorized_data[num_stats - 1]
            now = memorized_data[num_stats]
            for case in base:
                one_iteration_times[0] += 1
                saved_data = {}
                for attr in case:  # remove existing stats from pool
                    saved_data[attr] = possible_sub_stats.pop(attr)
                for attr in possible_sub_stats:  # calc probability
                    stats = set(case);
                    stats.add(attr);
                    frozen_stats = frozenset(stats)
                    now[frozen_stats] = now.setdefault(frozen_stats, 0) + base[case] * wd_p_key(
                        possible_sub_stats, attr)
                for attr in case:  # restore values
                    possible_sub_stats[attr] = saved_data[attr]

        for attr in possible_sub_stats:
            memorized_data[1][frozenset([attr])] = wd_p_key(possible_sub_stats, attr)
        for curr_num_substats in range(2, x + 1):
            memorized_data.append({})
            one_iteration(curr_num_substats)
        for case in memorized_data[x]:
            count = 0
            for attr in case:
                if attr in usefulstats:
                    count += 1
            if count >= y:
                p_success.append(memorized_data[x][case])
                # print(case)
        p_success.sort()
        # print(one_iteration_times[0])
        # print(sum(memorized_data[x].values()))
        return sum(p_success)

    # return brute_force()
    return dynamic_programming()


if __name__ == '__main__':
    # start = time.time_ns()
    # for i in range(1000):
    #     p_y_useful_given_x(ae.GOBLET, attre.HYDRO_DB, {attre.CRIT_RATE, attre.CRIT_DMG}, 3, 1)
    # end = time.time_ns()
    # print(end - start)
    useful_attrs = {attre.CRIT_RATE, attre.CRIT_DMG}
    p_set = p_get_set()
    p_goblet = p_get_type(ae.GOBLET)
    p_mainstat = p_get_mainstat(ae.GOBLET, attre.PYRO_DB)
    p_3substat_filter = p_y_useful_given_x(ae.GOBLET, attre.PYRO_DB, useful_attrs, 3, 2)
    p_4substat_filter = p_y_useful_given_x(ae.GOBLET, attre.PYRO_DB, useful_attrs, 4, 2)
    p = p_set * p_goblet * p_mainstat * (
                p_get_x_substats(3) * p_3substat_filter + p_get_x_substats(4) * p_4substat_filter)
    p1 = p_set * p_goblet * p_mainstat * p_4substat_filter
    print(rarity_in_domain_runs(p1))
