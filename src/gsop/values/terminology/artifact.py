from enum import Enum
from typing import Dict

from src.gsop.values.terminology.attribute import AttributeEnum


MAX_NUM_STATS = 4


class _ArtifactConsts:
    SUBSTAT_WEIGHTS = {
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

    def __init__(self, name: str, mainstat_weights: Dict[AttributeEnum, float]):
        self.NAME = name
        self.MAINSTAT_WEIGHTS = mainstat_weights


class ArtifactEnum(Enum):
    FLOWER = _ArtifactConsts(
        "Flower of Life",
        {
            AttributeEnum.HP_FLAT: 100,
        },
    )
    PLUME = _ArtifactConsts(
        "Plume of Death",
        {
            AttributeEnum.ATK_FLAT: 100,
        },
    )
    SANDS = _ArtifactConsts(
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
        "Goblet of Eonothem",
        {
            AttributeEnum.HP_PCT: 21.25,
            AttributeEnum.ATK_PCT: 21.25,
            AttributeEnum.DEF_PCT: 20.00,
            AttributeEnum.PYRO_DB: 5,
            AttributeEnum.HYDRO_DB: 5,
            AttributeEnum.ANEMO_DB: 5,
            AttributeEnum.ELECTRO_DB: 5,
            AttributeEnum.DENDRO_DB: 5,
            AttributeEnum.CRYO_DB: 5,
            AttributeEnum.GEO_DB: 5,
            AttributeEnum.PHYSICAL_DB: 5,
            AttributeEnum.EM: 2.5,
        },
    )
    CIRCLET = _ArtifactConsts(
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

    def mainstat_weights(self) -> Dict[AttributeEnum, float]:
        return self.value.MAINSTAT_WEIGHTS

    def substat_weights(self) -> Dict[AttributeEnum, float]:
        return self.value.SUBSTAT_WEIGHTS
