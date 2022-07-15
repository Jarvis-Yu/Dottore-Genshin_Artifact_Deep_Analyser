__fpath__ = "artifact"

import time
from typing import Dict, Set

import numpy as np

from src.gsop.helpers.random_weighted_dict_selector import wd_total_weight, \
    wd_p_key
from src.gsop.statistics.function_call_stat import func_called
from src.gsop.values.constants import P_3_SUBSTAT_ART_DOMAIN, \
    P_4_SUBSTAT_ART_DOMAIN
from src.gsop.values.terminology.artifact import ArtifactEnum as ae
from src.gsop.values.terminology.attribute import AttributeEnum as attre


def p_get_set(setName=None) -> float:
    return 0.5


def p_get_type(artifact_type: ae = None) -> float:
    return 0.2


def p_get_mainstat(artifact_type: ae, mainstat: attre) -> float:
    weights = ae.mainstat_weights()
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

    def dynamic_programming():
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
                    stats = set(case); stats.add(attr); frozen_stats = frozenset(stats)
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

    return brute_force()
    # return dynamic_programming()


if __name__ == '__main__':
    start = time.time_ns()
    for i in range(1000):
        p_y_useful_given_x(ae.GOBLET, attre.HYDRO_DB, {attre.CRIT_RATE, attre.CRIT_DMG}, 3, 1)
    end = time.time_ns()
    print(end - start)
    # print(p_y_useful_given_x(ae.GOBLET, attre.HYDRO_DB, {attre.CRIT_RATE, attre.CRIT_DMG}, 3, 1))
    # a = {"a", "b"}
    # b = {"b", "c"}
    # c = {"b", "a"}
    # d = {frozenset(a): 1, frozenset(b): 2}
    # print(d.setdefault(frozenset(c), 100))
