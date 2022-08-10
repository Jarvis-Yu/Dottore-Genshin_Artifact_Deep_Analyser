import itertools
from typing import Set, List

from python_backend.artifact.artifact_attrs import ArtifactAttrs
from python_backend.artifact.weighted_attrs import WeightedAttrs
from python_backend.consts.terminology.artifact_consts import MAX_NUM_ATTRS, ArtifactEnum
from python_backend.consts.terminology.attribute_consts import AttributeEnum, AVG_SUBATTR_RATIO
from python_backend.helpers.random_weighted_dict_selector import wd_p_key


def _p_permutation(weights, permutation):
    """
    :param weights: Dict[key, val]
    :param permutation: ordered iterable of keys
    :return: the probabilty that a particular permutation is chosen with weights.
             And each item can only be chosen once.
    """
    p = 1
    tmp_save = {}
    for case in permutation:
        p *= wd_p_key(weights, case)
        tmp_save[case] = weights.pop(case)
    for case in tmp_save.keys():
        weights[case] = tmp_save[case]
    return p


def p_subattr_combination(weights, combination):
    """
    :param weights: Dict[key, val]
    :param combination: iterable of keys
    :return: the probabilty that a particular combination is chosen with weights.
             And each item can only be chosen once.
    """
    pers = itertools.permutations(combination)
    p = 0
    for per in pers:
        p += _p_permutation(weights, per)
    return p


def artifact_remaining_enhance(lvl: int) -> int:
    if lvl > 20 or lvl < 0:
        return -1
    return (23 - lvl) // 4


class _AttrsSituationData:
    def __init__(self, lvl):
        # sample data {
        #     ((1.0, 1), (0.8, 2), (0.5, 0)): 0.0015,
        #     ((1.0, 0), (0.8, 3), (0.5, 0)): 0.0033,
        # }
        self._lvl = lvl
        self._data: dict[tuple, float] = {}

    def add_situation(self, situation: tuple, probability: float):
        """
        :param situation: tuple[[weight, scale]...]
        :param probability: the probability that the situation occurs
        :return: self
        """
        self._data[situation] = self._data.setdefault(situation, 0) + probability
        return self

    def get_situations(self):
        return self._data.keys()

    def get_level(self):
        return self._lvl

    def get_probability(self, situation):
        return self._data.get(situation, 0)


class _WeightScale:
    def __init__(self, weight: float, scale: float):
        self._weight = weight
        self._scale = scale

    def weight(self):
        return self._weight

    def scale(self):
        return self._scale


class _WeightsScale:
    def __init__(self, weights: list[float], scales: list[float]):
        self._data: list[_WeightsScale]
        pass


class _SubAttrsRatingSim:
    def __init__(self, combs: dict[tuple, float], lvl: int, weights: WeightedAttrs,
                 backup_attrs: dict[AttributeEnum, float]):
        """
        This class is for completely attribute simulation with no pre-set scale of attributes.

        :param combs: dict[attrs, probability]; make sure all attrs are of THE SAME LENGTH
        :param lvl: level of the imaginary artifact
        :param weights: should already have excluded the main-attr
        """
        self._combs = combs
        self._lvl = lvl
        self._weights = weights
        self._backup_attrs = backup_attrs

    def _process(self, combs: dict[tuple, float]):
        len_attrs = len(list(combs.keys())[0])
        data: _AttrsSituationData
        if len_attrs == MAX_NUM_ATTRS - 1:
            if self._lvl >= 4:  # TODO: magic number
                return None
            lvl = 4
            data = _AttrsSituationData(lvl)
            for comb in combs:
                p_comb = combs[comb]
                for attr in self._weights.attrs():
                    if attr not in comb and attr in self._backup_attrs:
                        situation = []  # list[tuple[weight, scale]]
                        for tmp_attr in comb:
                            weight = self._weights.get(tmp_attr)
                            if weight > 0:
                                situation.append((weight, 1))
                        situation.append((self._weights.get(attr), 1))
                        data.add_situation(tuple(situation), p_comb)

            pass
        elif len_attrs == MAX_NUM_ATTRS:
            pass
        else:
            return None

    def result(self) -> dict[float, float]:
        pass


def default_rating_to_crit_based_rating(rating: float) -> float:
    return rating * AttributeEnum.CRIT_DMG.subattr_max_val() * 100


def artifact_current_rating(mainattr: AttributeEnum, attrs: ArtifactAttrs,
                            weights: WeightedAttrs) -> float:
    rating = 0
    for attr in attrs.attrs():
        rating += weights.get(attr) * attrs.get_scale(attr)
    return rating


def artifact_rating_expectation(artifact_type: ArtifactEnum, mainattr: AttributeEnum, lvl: int,
                                attrs: ArtifactAttrs, weights: WeightedAttrs) -> float:
    """
    This is for 5-star artifacts only, please make sure `attrs` has 3 to 4 attributes
    """
    chances = artifact_remaining_enhance(lvl)
    rating = 0
    chance_per_attr = (chances - MAX_NUM_ATTRS + attrs.num_of_attrs()) / MAX_NUM_ATTRS
    # Calculates expected rating based on current attributes
    for attr in attrs.attrs():
        tmp = attrs.get_scale(attr)
        tmp += chance_per_attr * AVG_SUBATTR_RATIO
        rating += tmp * weights.get(attr)
    # If the artifact has 3 attrs, calculate the expectation of the last unknown attribute
    if attrs.num_of_attrs() != MAX_NUM_ATTRS:
        backup_attrs = artifact_type.subattr_weights_readonly().copy()
        backup_attrs.pop(mainattr, None)
        for attr in attrs.attrs():
            backup_attrs.pop(attr, None)
        for attr in weights.attrs():
            if attr in backup_attrs:
                rating += wd_p_key(backup_attrs, attr) * weights.get(attr) * (
                        1 + chance_per_attr) * AVG_SUBATTR_RATIO
    return rating


def best_possible_rating(artifact_type: ArtifactEnum, mainattr: AttributeEnum, lvl: int,
                         attrs: ArtifactAttrs, weights: WeightedAttrs) -> float:
    """
    This is for 5-star artifacts only, please make sure `attrs` has 3 to 4 attributes
    """
    chances: int = artifact_remaining_enhance(lvl)
    rating: float = 0
    if attrs.num_of_attrs() == MAX_NUM_ATTRS:  # case when artifact has 4 sub-attrs
        # Find the attributes with the highest weight
        best_attrs: List[AttributeEnum] = []
        for attr in attrs.attrs():
            if len(best_attrs) == 0:
                best_attrs.append(attr)
            elif weights.get(attr) > weights.get(best_attrs[0]):
                best_attrs = [attr]
            elif weights.get(attr) == weights.get(best_attrs[0]):
                best_attrs.append(attr)
            rating += weights.get(attr) * attrs.get_scale(attr)  # btw, add the current rating
        # Optimize the rating in extreme conditions
        rating += chances * weights.get(best_attrs[0])
    else:  # case when artifact has 3 sub-stats
        # Find the possible attributes that has the highest weight
        all_possible_attrs: Set[AttributeEnum] = set(attrs.attrs()).union(
            artifact_type.subattr_weights_readonly().keys())
        all_possible_attrs.discard(mainattr)
        highest_weighted_attrs: List[AttributeEnum] = []
        highest_not_in_attr: List[AttributeEnum] = []
        for attr in all_possible_attrs:
            weight_attr = weights.get(attr)
            if len(highest_weighted_attrs) == 0:
                highest_weighted_attrs.append(attr)
            elif weight_attr > weights.get(highest_weighted_attrs[0]):
                highest_weighted_attrs = [attr]
            elif weight_attr == weights.get(highest_weighted_attrs[0]):
                highest_weighted_attrs.append(attr)
            if attr not in attrs.attrs():
                if len(highest_not_in_attr) == 0:
                    highest_not_in_attr.append(attr)
                elif weight_attr > weights.get(highest_not_in_attr[0]):
                    highest_not_in_attr = [attr]
                elif weight_attr == weights.get(highest_not_in_attr[0]):
                    highest_not_in_attr.append(attr)
        for attr in attrs.attrs():
            rating += weights.get(attr) * attrs.get_scale(attr)
        rating += weights.get(highest_not_in_attr[0])
        rating += (chances - 1) * weights.get(highest_weighted_attrs[0])
    return rating
