from enum import Enum

from src.gsop.values.terminology.attribute import AttributeEnum as ak


class _ArtifactConsts:
    SUBSTAT_WEIGHTS = {
        ak.HP_FLAT: 150,
        ak.ATK_FLAT: 150,
        ak.DEF_FLAT: 150,
        ak.HP_PCT: 100,
        ak.ATK_PCT: 100,
        ak.DEF_PCT: 100,
        ak.CRIT_RATE: 75,
        ak.CRIT_DMG: 75,
        ak.EM: 100,
        ak.ER: 100,
    }

    def __init__(self, name, mainstat_weights):
        self.NAME = name
        self.MAINSTAT_WEIGHTS = mainstat_weights


class ArtifactEnum(Enum):
    FLOWER = _ArtifactConsts(
        "Flower of Life",
        {
            ak.HP_FLAT: 100,
        },
    )
    PLUME = _ArtifactConsts(
        "Plume of Death",
        {
            ak.ATK_FLAT: 100,
        },
    )
    SANDS = _ArtifactConsts(
        "Sands of Eon",
        {
            ak.HP_PCT: 26.68,
            ak.ATK_PCT: 26.66,
            ak.DEF_PCT: 26.66,
            ak.EM: 10,
            ak.ER: 10,
        },
    )
    GOBLET = _ArtifactConsts(
        "Goblet of Eonothem",
        {
            ak.HP_PCT: 21.25,
            ak.ATK_PCT: 21.25,
            ak.DEF_PCT: 20.00,
            ak.PYRO_DB: 5,
            ak.HYDRO_DB: 5,
            ak.ANEMO_DB: 5,
            ak.ELECTRO_DB: 5,
            ak.DENDRO_DB: 5,
            ak.CRYO_DB: 5,
            ak.GEO_DB: 5,
            ak.PHYSICAL_DB: 5,
            ak.EM: 2.5,
        },
    )
    CIRCLET = _ArtifactConsts(
        "Circlet of Logos",
        {
            ak.HP_PCT: 22,
            ak.ATK_PCT: 22,
            ak.DEF_PCT: 22,
            ak.EM: 4,
            ak.HEALING_BONUS: 10,
            ak.CRIT_RATE: 10,
            ak.CRIT_DMG: 10,
        },
    )

    def name(self):
        return self.value.NAME

    def mainstat_weights(self):
        return self.value.MAINSTAT_WEIGHTS

    def substat_weights(self):
        return self.value.SUBSTAT_WEIGHTS
