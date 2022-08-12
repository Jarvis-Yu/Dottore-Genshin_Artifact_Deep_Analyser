import itertools
from enum import Enum
from typing import Dict

from python_backend.consts.terminology.attribute_consts import AttributeEnum

MAX_NUM_ATTRS = 4
P_3_SUBATTRS_ART_DOMAIN = 0.8
P_4_SUBATTRS_ART_DOMAIN = 0.2


class _ArtifactConsts:
    SUBATTR_WEIGHTS = {
        AttributeEnum.HP_FLAT: 150,
        AttributeEnum.ATK_FLAT: 150,
        AttributeEnum.DEF_FLAT: 150,
        AttributeEnum.HP_PCT: 100,
        AttributeEnum.ATK_PCT: 100,
        AttributeEnum.DEF_PCT: 100,
        AttributeEnum.CRIT_RATE: 75,
        AttributeEnum.CRIT_DMG: 75,
        AttributeEnum.EM: 100,
        AttributeEnum.ER: 100,
    }

    def __init__(self, short_name: str, name: str, mainattr_weights: Dict[AttributeEnum, float]):
        self.SHORT_NAME = short_name
        self.NAME = name
        self.MAINATTR_WEIGHTS = mainattr_weights


class _ScaledWeights:
    def __init__(self, pairs: dict):
        self._tuple = tuple(sorted(pairs.items()))


ALL_3_ATTR_COMB = list(itertools.combinations(_ArtifactConsts.SUBATTR_WEIGHTS.keys(), 3))
ALL_4_ATTR_COMB = list(itertools.combinations(_ArtifactConsts.SUBATTR_WEIGHTS.keys(), 4))


class ArtifactEnum(Enum):
    FLOWER = _ArtifactConsts(
        "Flower",
        "Flower of Life",
        {
            AttributeEnum.HP_FLAT: 100,
        },
    )
    PLUME = _ArtifactConsts(
        "Plume",
        "Plume of Death",
        {
            AttributeEnum.ATK_FLAT: 100,
        },
    )
    SANDS = _ArtifactConsts(
        "Sands",
        "Sands of Eon",
        {
            AttributeEnum.HP_PCT: 26.68,
            AttributeEnum.ATK_PCT: 26.66,
            AttributeEnum.DEF_PCT: 26.66,
            AttributeEnum.EM: 10,
            AttributeEnum.ER: 10,
        },
    )
    GOBLET = _ArtifactConsts(
        "Goblet",
        "Goblet of Eonothem",
        {
            AttributeEnum.HP_PCT: 21.25,
            AttributeEnum.ATK_PCT: 21.25,
            AttributeEnum.DEF_PCT: 20.00,
            AttributeEnum.PYRO_DB: 5,
            AttributeEnum.HYDRO_DB: 5,
            AttributeEnum.ANEMO_DB: 5,
            AttributeEnum.ELECTRO_DB: 5,
            # AttributeEnum.DENDRO_DB: 5,
            AttributeEnum.CRYO_DB: 5,
            AttributeEnum.GEO_DB: 5,
            AttributeEnum.PHYSICAL_DB: 5,
            AttributeEnum.EM: 2.5,
        },
    )
    CIRCLET = _ArtifactConsts(
        "Circlet",
        "Circlet of Logos",
        {
            AttributeEnum.HP_PCT: 22,
            AttributeEnum.ATK_PCT: 22,
            AttributeEnum.DEF_PCT: 22,
            AttributeEnum.EM: 4,
            AttributeEnum.HEALING_BONUS: 10,
            AttributeEnum.CRIT_RATE: 10,
            AttributeEnum.CRIT_DMG: 10,
        },
    )

    def name(self) -> str:
        return self.value.NAME

    def short_name(self) -> str:
        return self.value.SHORT_NAME

    def mainattr_weights_readonly(self) -> Dict[AttributeEnum, float]:
        """
        ADD `.copy()` IF NEED CHANGE
        """
        return self.value.MAINATTR_WEIGHTS

    def subattr_weights_readonly(self) -> Dict[AttributeEnum, float]:
        """
        ADD `.copy()` IF NEED CHANGE
        """
        return self.value.SUBATTR_WEIGHTS

    @classmethod
    def find_with_short_name(cls, short_name: str):
        for item in ArtifactEnum:
            if item.short_name() == short_name:
                return item
        return None


if __name__ == '__main__':
    d = {
        1.0: 0,
        0.8: 1,
    }
    t = tuple(sorted(d.items(), reverse=True))
    print(t)
    for i in t:
        print(i)
