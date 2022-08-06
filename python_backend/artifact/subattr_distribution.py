import time

from python_backend.artifact.rating import p_subattr_combination, artifact_remaining_enhance
from python_backend.artifact.weighted_attrs import WeightedAttrs
from python_backend.consts.terminology.artifact_consts import ArtifactEnum, ALL_4_ATTR_COMB, \
    P_3_SUBATTRS_ART_DOMAIN, P_4_SUBATTRS_ART_DOMAIN, MAX_NUM_ATTRS
from python_backend.consts.terminology.attribute_consts import AttributeEnum, LIST_SUBATTR_RATIO, \
    AVG_SUBATTR_RATIO


def _scale_distribtion():
    distribution = [{0: 1}]
    len_ratios = len(LIST_SUBATTR_RATIO)
    for i in range(1,
                   11):  # TODO: magic number (there's a maximum total of 9 subattrs enhancements)
        prev = distribution[i - 1]
        curr = {}
        for scale in prev:
            for ratio in LIST_SUBATTR_RATIO:
                key = scale + ratio
                curr[key] = curr.setdefault(key, 0) + prev[scale] * 1 / len_ratios
        distribution.append(curr)
    return distribution


_SCALE_DISTRIBUTION = _scale_distribtion()


class _LSDResult:
    def _max_value(self, case):
        score = 0
        for each in case:  # each[0]: value, each[2] num of scale
            score += each[0] * each[2]
        return score

    def _min_value(self, case):
        score = 0
        for each in case:  # each[0]: value, each[2] num of scale
            score += each[0] * each[2] * 0.7
        return score

    def _exp_case(self, case):
        score = 0
        for each in case:  # each[0]: value, each[1] weight
            score += each[0] * each[1] * AVG_SUBATTR_RATIO * (self._remaining_enhance / MAX_NUM_ATTRS)
        return score

    def __init__(self, result: dict, lvl: int):
        self._lvl = lvl
        self._remaining_enhance = artifact_remaining_enhance(self._lvl)
        self._sorted_result = list(
            sorted(result.items(), reverse=True, key=lambda x: self._max_value(x[0])))
        self._max_values = []
        self._min_values = []
        self._exp_values = []
        for case in self._sorted_result:
            self._max_values.append(self._max_value(case[0]))
            self._min_values.append(self._min_value(case[0]))
            self._exp_values.append(self._exp_case(case[0]))
        self._len_result = len(self._sorted_result)

    @staticmethod
    def _p_in_actual_distribution(case, score: float):
        """
        :param case:
        :param score:
        :return: the probability that the case has score not smaller than the given score
        """
        len_case = len(case)
        p = []  # the probabilities that the case has score greater than the given score

        def recur(i, carried_score, carried_p):
            if i == len_case:
                if carried_score >= score:
                    p.append(carried_p)
                return
            value = case[i][0]
            enhances = case[i][2]
            distribution = _SCALE_DISTRIBUTION[enhances]
            for scale in distribution:
                recur(i + 1, carried_score + value * scale, carried_p * distribution[scale])
            pass

        recur(0, 0, 1)
        return sum(sorted(p))

    def p_score_greater(self, score: float, with_exp=False) -> float:
        """
        :return: the probability that a random artifact has score not lower than the provided one
        """
        adjusted_score = score - 0.001  # to correct floating point minor errors
        p = []  # the probabilities that the given score is not greater than a random artifact's
        for i in range(self._len_result):
            case = self._sorted_result[i][0]
            p_case = self._sorted_result[i][1]
            max_value = self._max_values[i]
            min_value = self._min_values[i]
            exp_value: float
            if with_exp:
                exp_value = self._exp_values[i]
            else:
                exp_value = 0
            score_diff_exp = adjusted_score - exp_value
            if max_value >= score_diff_exp:
                if min_value >= score_diff_exp:
                    p.append(p_case)
                else:
                    p.append(
                        p_case * self._p_in_actual_distribution(case, score_diff_exp))
        return sum(sorted(p))


def leveled_subattrs_distribution(mainattr: AttributeEnum, lvl: int,
                                  weights: WeightedAttrs) -> _LSDResult:
    """
    Only work for artifacts above (including) level 4.

    :return:
    """
    if lvl < 4:
        print("[!] Invalid request for leveled_subattrs_distribution: lvl too low")
        return _LSDResult({}, -1)
    weighted_subattrs = ArtifactEnum.FLOWER.subattr_weights()
    weighted_subattrs.pop(mainattr, None)
    curr_layer: dict = {}
    next_layer: dict = {}
    curr_level_covers: int = 7
    # Initialize for the sub-attrs of a random level 4 artifact
    for comb in ALL_4_ATTR_COMB:
        if mainattr not in comb:  # if this is a valid combination
            p_comb = p_subattr_combination(weighted_subattrs, comb)
            # initialize attributes
            attrs = []  # type is list[tuple[weight, scale]]
            attrs_count = {}
            for attr in comb:
                value = weights.get(attr)
                if value > 0:  # only record if it has value
                    attrs_count[value] = attrs_count.setdefault(value, 0) + 1
            for weight in attrs_count:
                attrs.append((weight, attrs_count[weight], attrs_count[weight]))
            attrs.sort(reverse=True)
            if len(attrs) > 0:
                key = tuple(attrs)
                # now attrs is in a situation of an originally 3-attr artifact
                curr_layer[key] = curr_layer.setdefault(key, 0) + P_3_SUBATTRS_ART_DOMAIN * p_comb
                # for original 4-attr artifact
                not_stronger_count = MAX_NUM_ATTRS
                len_attrs = len(attrs)
                # Calculate probability that weighted attribute is enhanced
                for i in range(len_attrs):
                    original_tuple = attrs[i]
                    weight = original_tuple[1]
                    attrs[i] = (original_tuple[0], original_tuple[1], original_tuple[2] + 1)
                    key = tuple(attrs)
                    p_chosen = weight / MAX_NUM_ATTRS
                    curr_layer[key] = curr_layer.setdefault(key, 0) \
                                      + P_4_SUBATTRS_ART_DOMAIN * p_comb * p_chosen
                    not_stronger_count -= weight
                    attrs[i] = original_tuple
                # Calculate probability that unweighted attribute is enhanced
                key = tuple(attrs)
                p_chosen = not_stronger_count / MAX_NUM_ATTRS
                curr_layer[key] = curr_layer.setdefault(key, 0) \
                                  + P_4_SUBATTRS_ART_DOMAIN * p_comb * p_chosen

    # Compute the sub-attrs for level 8+ artifacts if needed
    while curr_level_covers < lvl:
        for situation in curr_layer:
            not_stronger_count = MAX_NUM_ATTRS
            list_situation = list(situation)
            len_attrs = len(situation)
            p_situation = curr_layer[situation]
            # Calculate probability that weighted attribute is enhanced
            for i in range(len_attrs):
                original_tuple = list_situation[i]
                value = situation[i][0]
                weight = situation[i][1]
                scale = situation[i][2]
                list_situation[i] = (value, weight, scale + 1)
                key = tuple(list_situation)
                p_chosen = weight / MAX_NUM_ATTRS
                next_layer[key] = next_layer.setdefault(key, 0) + p_situation * p_chosen
                not_stronger_count -= weight
                list_situation[i] = original_tuple
            # Calculate probability that unweighted attribute is enhanced
            key = tuple(list_situation)
            p_chosen = not_stronger_count / MAX_NUM_ATTRS
            next_layer[key] = next_layer.setdefault(key, 0) + p_situation * p_chosen
        curr_layer = next_layer
        next_layer = {}
        curr_level_covers += 4

    return _LSDResult(curr_layer, lvl)


if __name__ == '__main__':
    start = time.time()
    k = leveled_subattrs_distribution(
        AttributeEnum.ATK_FLAT, 4, WeightedAttrs.crit_atk_er_em_plan()
    ).p_score_greater(5.5)
    end = time.time()
    print("probability:", k)
    print("time taken:", end - start)
