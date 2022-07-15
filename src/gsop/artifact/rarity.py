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
    func_called(__fpath__+"p_y_useful_given_x")

    def brute_force() -> float:
        possible_sub_stats: Dict = artifact_type.substat_weights().copy()
        possible_sub_stats.pop(mainstat, None)
        substats: Set = set()  # current substats
        p_success = []  # list of prob of all satisfying cases
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
        return sum(p_success)

    return brute_force()


if __name__ == '__main__':
    print(p_y_useful_given_x(ae.GOBLET, attre.HYDRO_DB,
                             {attre.CRIT_RATE, attre.CRIT_DMG}, 4, 2))
    a = {"a", "b"}
    b = {"b", "c"}
    d = {frozenset(a): 1, frozenset(b): 2}
    print(d)
