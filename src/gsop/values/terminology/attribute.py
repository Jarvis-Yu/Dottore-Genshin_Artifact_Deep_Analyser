from enum import Enum, auto


class _AttributeConsts:
    def __init__(self, name: str, mainstat_max_val: float = -1, substat_max_val: float = -1):
        self.NAME = name
        self.MAINSTAT_MAX_VAL = mainstat_max_val
        self.SUBSTAT_MAX_VAL = substat_max_val


class AttributeEnum(Enum):
    HP_FLAT = _AttributeConsts("Flat HP", mainstat_max_val=4780, substat_max_val=298.75)
    DEF_FLAT = _AttributeConsts("Flat DEF", substat_max_val=23.15)
    ATK_FLAT = _AttributeConsts("Flat ATK", mainstat_max_val=311, substat_max_val=19.45)
    ER = _AttributeConsts("Elemental Recharge", mainstat_max_val=0.518, substat_max_val=0.0648)
    EM = _AttributeConsts("Elemental Mastery", mainstat_max_val=186.5, substat_max_val=23.31)
    CRIT_RATE = _AttributeConsts("Crit Rate%", mainstat_max_val=0.311, substat_max_val=0.0389)
    CRIT_DMG = _AttributeConsts("Crit DMG%", mainstat_max_val=0.622, substat_max_val=0.0777)
    HP_PCT = _AttributeConsts("HP%", mainstat_max_val=0.466, substat_max_val=0.0583)
    DEF_PCT = _AttributeConsts("DEF%", mainstat_max_val=0.583, substat_max_val=0.0729)
    ATK_PCT = _AttributeConsts("ATK%", mainstat_max_val=0.466, substat_max_val=0.0583)
    PYRO_DB = _AttributeConsts("Pyro DMG Bonus", mainstat_max_val=0.466)
    HYDRO_DB = _AttributeConsts("Hydro DMG Bonus", mainstat_max_val=0.466)
    ANEMO_DB = _AttributeConsts("Anemo DMG Bonus", mainstat_max_val=0.466)
    ELECTRO_DB = _AttributeConsts("Electro DMG Bonus", mainstat_max_val=0.466)
    DENDRO_DB = _AttributeConsts("Dendro DMG Bonus", mainstat_max_val=0.466)
    CRYO_DB = _AttributeConsts("Cryo DMG Bonus", mainstat_max_val=0.466)
    GEO_DB = _AttributeConsts("Geo DMG Bonus", mainstat_max_val=0.466)
    PHYSICAL_DB = _AttributeConsts("Physical DMG Bonus", mainstat_max_val=0.466)
    HEALING_BONUS = _AttributeConsts("Healing Bonus%", mainstat_max_val=0.359)

    def name(self):
        return self.value.NAME

    def mainstat_max_val(self):
        return self.value.MAINSTAT_MAX_VAL

    def substat_max_val(self):
        return self.value.SUBSTAT_MAX_VAL
