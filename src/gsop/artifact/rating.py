from typing import Dict, Set, List

from src.gsop.artifact.artifact_attrs import ArtifactAttrs
from src.gsop.helpers.random_weighted_dict_selector import wd_p_key
from src.gsop.values.terminology.artifact_consts import MAX_NUM_ATTRS, ArtifactEnum
from src.gsop.values.terminology.attribute_consts import AttributeEnum, AVG_SUBATTR_RATIO


class WeightedAttrs:
    def __init__(self):
        self._weighted_attrs: Dict[AttributeEnum, float] = {}

    def set(self, weighted_attrs: Dict[AttributeEnum, float]):
        """
        The weights should be from 0 to 1
        """
        self._weighted_attrs: Dict[AttributeEnum, float] = weighted_attrs.copy()
        return self

    def add(self, weighted_attr: AttributeEnum, weight: float = 1) -> bool:
        """
        :param weight: from 0 to 1
        """
        if weighted_attr not in self._weighted_attrs.keys():
            self._weighted_attrs[weighted_attr] = weight
            return True
        else:
            return False

    def remove(self, weighted_attr: AttributeEnum) -> bool:
        if weighted_attr in self._weighted_attrs.keys():
            self._weighted_attrs.pop(weighted_attr)
            return True
        else:
            return False

    def update(self, weighted_attr: AttributeEnum, weight: float):
        if weighted_attr in self._weighted_attrs.keys():
            self._weighted_attrs[weighted_attr] = weight
            return True
        else:
            return False

    def force_update(self, weighted_attr: AttributeEnum, weight: float):
        self._weighted_attrs[weighted_attr] = weight

    def get(self, weighted_attr: AttributeEnum):
        return self._weighted_attrs.get(weighted_attr, 0)

    def attrs(self):
        return self._weighted_attrs.keys()

    @classmethod
    def crit_atk_er_em_plan(cls):
        weights = WeightedAttrs()
        weights.set({
            AttributeEnum.CRIT_RATE: 1,
            AttributeEnum.CRIT_DMG: 1,
            AttributeEnum.ATK_PCT: 0.8,
            AttributeEnum.ATK_FLAT: 0.3,
            AttributeEnum.ER: 0.6,
            AttributeEnum.EM: 0.7,
        })
        return weights

    @classmethod
    def crit_plan(cls):
        weights = WeightedAttrs()
        weights.set({
            AttributeEnum.CRIT_RATE: 1,
            AttributeEnum.CRIT_DMG: 1,
        })
        return weights

    @classmethod
    def crit_atk_plan(cls):
        weights = WeightedAttrs()
        weights.set({
            AttributeEnum.CRIT_RATE: 1,
            AttributeEnum.CRIT_DMG: 1,
            AttributeEnum.ATK_PCT: 0.8,
            AttributeEnum.ATK_FLAT: 0.3,
        })
        return weights


def artifact_remaining_enhance(lvl: int) -> int:
    if lvl > 20 or lvl < 0:
        return -1
    return (23 - lvl) // 4


def _artifact_rating_expectation_4attrs(lvl: int, attrs: ArtifactAttrs,
                                        weights: WeightedAttrs) -> float:
    """
    This is for 5-star artifacts only, please make sure `attrs` has 3 to 4 attributes
    """
    chances = artifact_remaining_enhance(lvl)
    rating = 0
    chance_per_attr = chances / MAX_NUM_ATTRS
    for attr in attrs.attrs():
        tmp = attrs.get_scale(attr)
        tmp += chance_per_attr * AVG_SUBATTR_RATIO
        rating += tmp * weights.get(attr)
    return rating


def artifact_rating_expectation(artifact_type: ArtifactEnum, mainattr: AttributeEnum, lvl: int,
                                attrs: ArtifactAttrs, weights: WeightedAttrs) -> float:
    """
    This is for 5-star artifacts only, please make sure `attrs` has 3 to 4 attributes
    """
    chances = artifact_remaining_enhance(lvl)
    rating = 0
    chance_per_attr = (chances - MAX_NUM_ATTRS + attrs.num_of_attrs()) / MAX_NUM_ATTRS
    for attr in attrs.attrs():
        tmp = attrs.get_scale(attr)
        tmp += chance_per_attr * AVG_SUBATTR_RATIO
        rating += tmp * weights.get(attr)
    if attrs.num_of_attrs() != MAX_NUM_ATTRS:
        backup_attrs = artifact_type.subattr_weights()
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
            rating += weights.get(attr)  # btw, add the current rating
        # Optimize the rating in extreme conditions
        rating += chances * weights.get(best_attrs[0])
    else:  # case when artifact has 3 sub-stats
        # Find the possible attributes that has the highest weight
        all_possible_attrs: Set[AttributeEnum] = set(attrs.attrs()).union(
            artifact_type.subattr_weights().keys())
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
            rating += weights.get(attr)
        rating += weights.get(highest_not_in_attr[0])
        rating += (chances - 1) * weights.get(highest_weighted_attrs[0])
    return rating


def default_rating_to_crit_based_rating(rating: float) -> float:
    return rating * AttributeEnum.CRIT_DMG.subattr_max_val() * 100


if __name__ == '__main__':
    a = best_possible_rating(ArtifactEnum.FLOWER, AttributeEnum.HP_FLAT, 0, ArtifactAttrs().set_avg({
        AttributeEnum.CRIT_RATE,
        AttributeEnum.CRIT_DMG,
        AttributeEnum.ATK_PCT,
    }), WeightedAttrs.crit_atk_plan())
    print(default_rating_to_crit_based_rating(a))
