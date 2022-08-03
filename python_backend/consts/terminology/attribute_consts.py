from enum import Enum, auto


"""
Data Sources:
- https://genshin-impact.fandom.com/wiki/Artifacts/Stats
- https://docs.google.com/spreadsheets/d/1sYQrV5Yp_QTVEKMLWquMu0mDgHhOO_Rh2LfcWdS_Eno/edit#gid=1604940600
- https://github.com/Dimbreath/GenshinData/blob/72c9112a7c5e8e5014f61009a1a2764e266aeab7/ExcelBinOutput/ReliquaryAffixExcelConfigData.json#L120
"""


AVG_SUBATTR_RATIO = 0.85


class _AttributeConsts:
    def __init__(self, name: str, mainattr_max_val: float = -1, subattr_7_val: float = -1,
                 subattr_8_val: float = -1, subattr_9_val: float = -1, subattr_10_val: float = -1):
        self.NAME = name
        self.MAINATTR_MAX_VAL = mainattr_max_val
        self.SUBATTR_7_VAL = subattr_7_val


class AttributeEnum(Enum):
    HP_FLAT = _AttributeConsts("Flat HP", mainattr_max_val=4780, subattr_7_val=209.1300048828125)
    DEF_FLAT = _AttributeConsts("Flat DEF", subattr_7_val=23.15)
    ATK_FLAT = _AttributeConsts("Flat ATK", mainattr_max_val=311, subattr_7_val=19.45)
    ER = _AttributeConsts("Elemental Recharge", mainattr_max_val=0.518, subattr_7_val=0.0648)
    EM = _AttributeConsts("Elemental Mastery", mainattr_max_val=186.5, subattr_7_val=23.31)
    CRIT_RATE = _AttributeConsts("Crit Rate%", mainattr_max_val=0.311,
                                 subattr_7_val=0.038882352941)
    CRIT_DMG = _AttributeConsts("Crit DMG%", mainattr_max_val=0.622, subattr_7_val=0.07705882353)
    HP_PCT = _AttributeConsts("HP%", mainattr_max_val=0.466, subattr_7_val=0.0583)
    DEF_PCT = _AttributeConsts("DEF%", mainattr_max_val=0.583, subattr_7_val=0.0729)
    ATK_PCT = _AttributeConsts("ATK%", mainattr_max_val=0.466, subattr_7_val=0.0583)
    PYRO_DB = _AttributeConsts("Pyro DMG Bonus", mainattr_max_val=0.466)
    HYDRO_DB = _AttributeConsts("Hydro DMG Bonus", mainattr_max_val=0.466)
    ANEMO_DB = _AttributeConsts("Anemo DMG Bonus", mainattr_max_val=0.466)
    ELECTRO_DB = _AttributeConsts("Electro DMG Bonus", mainattr_max_val=0.466)
    DENDRO_DB = _AttributeConsts("Dendro DMG Bonus", mainattr_max_val=0.466)
    CRYO_DB = _AttributeConsts("Cryo DMG Bonus", mainattr_max_val=0.466)
    GEO_DB = _AttributeConsts("Geo DMG Bonus", mainattr_max_val=0.466)
    PHYSICAL_DB = _AttributeConsts("Physical DMG Bonus", mainattr_max_val=0.466)
    HEALING_BONUS = _AttributeConsts("Healing Bonus%", mainattr_max_val=0.359)

    def name(self):
        return self.value.NAME

    def mainattr_max_val(self):
        return self.value.MAINATTR_MAX_VAL

    def subattr_max_val(self):
        return self.value.SUBATTR_MIN_VAL / 0.7
