from python_backend.artifact.artifact_attrs import ArtifactAttrs
from python_backend.artifact.rarity import rarity_in_domain_runs
from python_backend.artifact.rating import artifact_rating_expectation, \
    default_rating_to_crit_based_rating, best_possible_rating, relative_rating_compare_subattrs
from python_backend.artifact.weighted_attrs import WeightedAttrs
from python_backend.helpers.random_weighted_dict_selector import wd_p_key
from python_backend.values.terminology.artifact_consts import ArtifactEnum
from python_backend.values.terminology.attribute_consts import AttributeEnum


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

    def expected_rating(self, weighted_subattrs: WeightedAttrs = None):
        """
        :param weighted_subattrs: if not defined, use the private field of class instead
        :return: average rating
        """
        if weighted_subattrs is None:
            weighted_subattrs = self._weighted_subattrs
        return default_rating_to_crit_based_rating(
            artifact_rating_expectation(self._artifact_type, self._mainattr, self._level,
                                        self._subattrs, weighted_subattrs)
        )

    def extreme_rating(self, weighted_subattrs: WeightedAttrs = None):
        """
        :param weighted_subattrs: if not defined, use the private field of class instead
        :return: best possible rating
        """
        if weighted_subattrs is None:
            weighted_subattrs = self._weighted_subattrs
        return default_rating_to_crit_based_rating(
            best_possible_rating(self._artifact_type, self._mainattr, self._level, self._subattrs,
                                 weighted_subattrs)
        )

    def relative_rating(self, weighted_subattrs: WeightedAttrs = None):
        """
        Currently only work for artifacts below level 4.

        :param weighted_subattrs:
        :return:
        """
        if weighted_subattrs is None:
            weighted_subattrs = self._weighted_subattrs
        p_set = 1 / 2
        p_artifact_type = 1 / len(ArtifactEnum)
        p_main_stat = wd_p_key(self._artifact_type.mainattr_weights(), self._mainattr)
        p_subattrs = relative_rating_compare_subattrs(self._artifact_type, self._mainattr,
                                                      self._level, self._subattrs,
                                                      weighted_subattrs)
        return p_set * p_artifact_type * p_main_stat * p_subattrs

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
                         subattrs: ArtifactAttrs):
        return Artifact(level, 0, None, artifact_type, mainattr, subattrs,
                        WeightedAttrs.crit_atk_plan())

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
                                                   # AttributeEnum.HP_FLAT,
                                                   AttributeEnum.EM,
                                                   AttributeEnum.DEF_FLAT,
                                               }))
    print(art1.expected_rating())
    print(art1.extreme_rating())
    print(art1.relative_rating())
    print(rarity_in_domain_runs(art1.relative_rating()))
    print("======")
    print(art2.expected_rating())
    print(art2.extreme_rating())
    print(art2.relative_rating())
    print(rarity_in_domain_runs(art2.relative_rating()))
