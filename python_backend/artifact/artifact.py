import time

from python_backend.artifact.artifact_attrs import ArtifactAttrs
from python_backend.artifact.rating import artifact_rating_expectation, \
    best_possible_rating, artifact_current_rating, default_rating_to_crit_based_rating
from python_backend.artifact.subattr_distribution import leveled_subattrs_distribution, \
    relative_rarity_compare_subattrs
from python_backend.artifact.weighted_attrs import WeightedAttrs
from python_backend.consts.terminology.artifact_consts import ArtifactEnum
from python_backend.consts.terminology.attribute_consts import AttributeEnum
from python_backend.helpers.random_weighted_dict_selector import wd_p_key


class Artifact:
    """
    The class for an artifact. (only 5-star artifact for now)
    """

    def __init__(self, level: int, exp: int, artifact_set, artifact_type: ArtifactEnum,
                 mainattr: AttributeEnum, subattrs: ArtifactAttrs,
                 weighted_subattrs: WeightedAttrs):
        self._level: int = level
        self._exp: int = exp
        self._artifact_set = artifact_set
        self._artifact_type: ArtifactEnum = artifact_type
        self._mainattr: AttributeEnum = mainattr
        self._subattrs: ArtifactAttrs = subattrs
        self._weighted_subattrs: WeightedAttrs = weighted_subattrs

    def current_rating(self, weighted_subattrs: WeightedAttrs = None, crit_based: bool = False):
        if weighted_subattrs is None:
            weighted_subattrs = self._weighted_subattrs
        rating = artifact_current_rating(self._mainattr, self._subattrs, weighted_subattrs)
        if crit_based:
            return default_rating_to_crit_based_rating(rating)
        else:
            return rating

    def expected_rating(self, weighted_subattrs: WeightedAttrs = None, crit_based: bool = False):
        """
        :param weighted_subattrs: if not defined, use the private field of class instead
        :param crit_based: if set to True, the returned rating will be scaled to the most commonly
                           used crit-dmg-based rating
        :return: average rating
        """
        if weighted_subattrs is None:
            weighted_subattrs = self._weighted_subattrs
        rating = artifact_rating_expectation(self._artifact_type, self._mainattr, self._level,
                                             self._subattrs, weighted_subattrs)
        if crit_based:
            return default_rating_to_crit_based_rating(rating)
        else:
            return rating

    def extreme_rating(self, weighted_subattrs: WeightedAttrs = None, crit_based: bool = False):
        """
        :param weighted_subattrs: if not defined, use the private field of class instead
        :param crit_based: if set to True, the returned rating will be scaled to the most commonly
                           used crit-dmg-based rating
        :return: best possible rating
        """
        if weighted_subattrs is None:
            weighted_subattrs = self._weighted_subattrs
        rating = best_possible_rating(self._artifact_type, self._mainattr, self._level,
                                      self._subattrs, weighted_subattrs)
        if crit_based:
            return default_rating_to_crit_based_rating(rating)
        else:
            return rating

    def relative_p(self, weighted_subattrs: WeightedAttrs = None):
        """
        :param weighted_subattrs: if provided, use the provided weight plan, otherwise, use the
                                  saved plan of the object
        :return: the probability that the given artifact has the main-attr and this value of
                 sub-attrs
        """
        if weighted_subattrs is None:
            weighted_subattrs = self._weighted_subattrs
        p_main_attr = wd_p_key(self._artifact_type.mainattr_weights_readonly(), self._mainattr)
        p_subattrs: float
        if self._level < 4:  # FUTURE_TODO: magic number
            p_subattrs = relative_rarity_compare_subattrs(self._artifact_type, self._mainattr,
                                                          self._level, self._subattrs,
                                                          weighted_subattrs)
        else:
            result = leveled_subattrs_distribution(self._mainattr, self._level, weighted_subattrs)
            p_subattrs = result.p_score_greater(
                self.expected_rating(weighted_subattrs=weighted_subattrs),
                with_exp=True
            )
        return p_main_attr * p_subattrs

    def level_up(self):
        if self._level < 20:
            self._level += 1
            self._exp = 0
            return True
        else:
            return False

    def __str__(self):
        return f"Artifact{{level: {self._level}, artifact_type: {self._artifact_type}, main-attr: {self._mainattr}}} "

    @classmethod
    def rating_only_plan(cls, level: int, artifact_type: ArtifactEnum, mainattr: AttributeEnum,
                         subattrs: ArtifactAttrs,
                         weights: WeightedAttrs = WeightedAttrs.crit_atk_plan()):
        return Artifact(level, 0, None, artifact_type, mainattr, subattrs, weights)

    @classmethod
    def default_plan(cls):
        return Artifact(0, 0, None, ArtifactEnum.FLOWER, AttributeEnum.HP_FLAT, ArtifactAttrs(),
                        WeightedAttrs.crit_atk_plan())


class ArtifactBuilder:
    """
    A builder for `Artifact`, you should fill the field necessary yourself. No checks before build.
    """
    _level: int = 0
    _exp: int = 0
    _artifact_set = None
    _artifact_type: ArtifactEnum = ArtifactEnum.FLOWER
    _mainattr: AttributeEnum = AttributeEnum.HP_FLAT
    _subattrs: ArtifactAttrs = ArtifactAttrs()
    _weighted_subattrs: WeightedAttrs = WeightedAttrs.crit_atk_plan()

    def level(self, level: int):
        self._level = level
        return self

    def exp(self, exp: int):
        self._exp = exp
        return self

    def artifact_set(self, artifact_set):
        self._artifact_set = artifact_set
        return self

    def mainattr(self, mainattr: AttributeEnum):
        self._mainattr = mainattr
        return self

    def subattrs(self, subattrs: ArtifactAttrs):
        self._subattrs = subattrs
        return self

    def weighted_subattrs(self, weighted_subattrs: WeightedAttrs):
        self._weighted_subattrs = weighted_subattrs
        return self

    def build(self):
        return Artifact(self._level, self._exp, self._artifact_set, self._artifact_type,
                        self._mainattr, self._subattrs, self._weighted_subattrs)


if __name__ == '__main__':
    start = time.time()
    art1: Artifact = Artifact.rating_only_plan(0, ArtifactEnum.SANDS, AttributeEnum.ATK_PCT,
                                               ArtifactAttrs().set_avg({
                                                   AttributeEnum.CRIT_RATE,
                                                   AttributeEnum.CRIT_DMG,
                                                   AttributeEnum.EM,
                                                   AttributeEnum.ER,
                                               }))
    art2: Artifact = Artifact.rating_only_plan(0, ArtifactEnum.PLUME, AttributeEnum.ATK_FLAT,
                                               ArtifactAttrs().set_avg({
                                                   AttributeEnum.CRIT_RATE,
                                                   AttributeEnum.CRIT_DMG,
                                                   AttributeEnum.ATK_PCT,
                                                   AttributeEnum.ER,
                                               }))
    art3: Artifact = Artifact.rating_only_plan(4, ArtifactEnum.PLUME, AttributeEnum.ATK_FLAT,
                                               ArtifactAttrs().set({
                                                   AttributeEnum.CRIT_RATE: 0.8,
                                                   AttributeEnum.ATK_PCT: 1,
                                                   AttributeEnum.CRIT_DMG: 1,
                                                   AttributeEnum.EM: 2,
                                               }))
    art4: Artifact = Artifact.rating_only_plan(20, ArtifactEnum.SANDS, AttributeEnum.ATK_PCT,
                                               ArtifactAttrs().set({
                                                   AttributeEnum.CRIT_RATE: 4.5,
                                                   AttributeEnum.CRIT_DMG: 1,
                                                   AttributeEnum.HP_FLAT: 2,
                                                   AttributeEnum.EM: 1,
                                               }))
    # print(art1.expected_rating())
    # print(art1.extreme_rating())
    # print(art1.relative_p())
    # print("======")
    # print(art2.expected_rating())
    # print(art2.extreme_rating())
    # print(art2.relative_p())
    # print("======")
    print(art3.expected_rating())
    print(art3.current_rating())
    print(art3.extreme_rating())
    print(art3.relative_p())
    print("======")
    print(art4.expected_rating())
    print(art4.extreme_rating())
    print(art4.relative_p())
    end = time.time()
    print("time:", end - start)
