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
            ak.HP_PCT: 2668,
            ak.ATK_PCT: 2666,
            ak.DEF_PCT: 2666,
            ak.EM: 1000,
            ak.ER: 1000,
        },
    )
    GOBLET = _ArtifactConsts(
        "Goblet of Eonothem",
        {
            ak.HP_PCT: 2125,
            ak.ATK_PCT: 2125,
            ak.DEF_PCT: 2000,
            ak.PYRO_DB: 500,
            ak.HYDRO_DB: 500,
            ak.ANEMO_DB: 500,
            ak.ELECTRO_DB: 500,
            ak.DENDRO_DB: 500,
            ak.CRYO_DB: 500,
            ak.GEO_DB: 500,
            ak.PHYSICAL_DB: 500,
            ak.EM: 250,
        },
    )
    CIRCLET = _ArtifactConsts(
        "Circlet of Logos",
        {
            ak.HP_PCT: 2200,
            ak.ATK_PCT: 2200,
            ak.DEF_PCT: 2200,
            ak.EM: 400,
            ak.HEALING_BONUS: 1000,
            ak.CRIT_RATE: 1000,
            ak.CRIT_DMG: 1000,
        },
    )

    def name(self):
        return self.value.NAME

    def mainstat_weights(self):
        return self.value.MAINSTAT_WEIGHTS

    def substat_weights(self):
        return self.value.SUBSTAT_WEIGHTS
