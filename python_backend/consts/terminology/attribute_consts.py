from enum import Enum
from typing import List

"""
Data Sources:
- https://genshin-impact.fandom.com/wiki/Artifacts/Stats
- https://docs.google.com/spreadsheets/d/1sYQrV5Yp_QTVEKMLWquMu0mDgHhOO_Rh2LfcWdS_Eno/edit#gid=1604940600
- https://github.com/Dimbreath/GenshinData/blob/72c9112a7c5e8e5014f61009a1a2764e266aeab7/ExcelBinOutput/ReliquaryAffixExcelConfigData.json#L120
"""

AVG_SUBATTR_RATIO = 0.85
LIST_SUBATTR_RATIO = [0.7, 0.8, 0.9, 1.0]


class _AttributeConsts:
    def __init__(self, short_name: str, name: str, mainattr_max_val: float = -1,
                 subattr_vals: List[float] = []):
        self.SHORT_NAME = short_name
        self.NAME = name
        self.MAINATTR_MAX_VAL = mainattr_max_val
        if len(subattr_vals) == 4:
            self.SUBATTR_7_VAL = subattr_vals[0]
            self.SUBATTR_8_VAL = subattr_vals[1]
            self.SUBATTR_9_VAL = subattr_vals[2]
            self.SUBATTR_10_VAL = subattr_vals[3]
        else:
            self.SUBATTR_7_VAL = -1
            self.SUBATTR_8_VAL = -1
            self.SUBATTR_9_VAL = -1
            self.SUBATTR_10_VAL = -1


class AttributeEnum(Enum):
    HP_FLAT = _AttributeConsts("HP", "Flat HP", mainattr_max_val=4780, subattr_vals=[
        209.1300048828125,
        239.0,
        268.8800048828125,
        298.75,
    ])
    HP_PCT = _AttributeConsts("HP%", "HP%", mainattr_max_val=0.466, subattr_vals=[
        0.040800001472234726,
        0.04659999907016754,
        0.05249999836087227,
        0.05829999968409538,
    ])
    ATK_FLAT = _AttributeConsts("ATK", "Flat ATK", mainattr_max_val=311, subattr_vals=[
        13.619999885559082,
        15.5600004196167,
        17.510000228881836,
        19.450000762939453,
    ])
    ATK_PCT = _AttributeConsts("ATK%", "ATK%", mainattr_max_val=0.466, subattr_vals=[
        0.040800001472234726,
        0.04659999907016754,
        0.05249999836087227,
        0.05829999968409538
    ])
    DEF_FLAT = _AttributeConsts("DEF", "Flat DEF", subattr_vals=[
        16.200000762939453,
        18.520000457763672,
        20.829999923706055,
        23.149999618530273,
    ])
    DEF_PCT = _AttributeConsts("DEF%", "DEF%", mainattr_max_val=0.583, subattr_vals=[
        0.050999999046325684,
        0.05829999968409538,
        0.06560000032186508,
        0.07289999723434448,
    ])
    ER = _AttributeConsts("ER", "Elemental Recharge", mainattr_max_val=0.518, subattr_vals=[
        0.04529999941587448,
        0.05180000141263008,
        0.05829999968409538,
        0.06480000168085098,
    ])
    EM = _AttributeConsts("EM", "Elemental Mastery", mainattr_max_val=186.5, subattr_vals=[
        16.31999969482422,
        18.649999618530273,
        20.979999542236328,
        23.309999465942383,
    ])
    CRIT_RATE = _AttributeConsts("Crit Rate", "Crit Rate%", mainattr_max_val=0.311, subattr_vals=[
        0.0272000003606081,
        0.031099999323487282,
        0.03500000014901161,
        0.03889999911189079,
    ])
    CRIT_DMG = _AttributeConsts("Crit DMG", "Crit DMG%", mainattr_max_val=0.622, subattr_vals=[
        0.0544000007212162,
        0.062199998646974564,
        0.06989999860525131,
        0.07769999653100967,
    ])
    PYRO_DB = _AttributeConsts("Pyro", "Pyro DMG Bonus", mainattr_max_val=0.466)
    HYDRO_DB = _AttributeConsts("Hydro", "Hydro DMG Bonus", mainattr_max_val=0.466)
    ANEMO_DB = _AttributeConsts("Anemo", "Anemo DMG Bonus", mainattr_max_val=0.466)
    ELECTRO_DB = _AttributeConsts("Electro", "Electro DMG Bonus", mainattr_max_val=0.466)
    DENDRO_DB = _AttributeConsts("Dendro", "Dendro DMG Bonus", mainattr_max_val=0.466)
    CRYO_DB = _AttributeConsts("Cryo", "Cryo DMG Bonus", mainattr_max_val=0.466)
    GEO_DB = _AttributeConsts("Geo", "Geo DMG Bonus", mainattr_max_val=0.466)
    PHYSICAL_DB = _AttributeConsts("Physical", "Physical DMG Bonus", mainattr_max_val=0.466)
    HEALING_BONUS = _AttributeConsts("Healing Bonus", "Healing Bonus%", mainattr_max_val=0.359)

    def full_name(self) -> str:
        return self.value.NAME

    def short_name(self) -> str:
        return self.value.SHORT_NAME

    def mainattr_max_val(self) -> float:
        return self.value.MAINATTR_MAX_VAL

    def subattr_max_val(self) -> float:
        return self.value.SUBATTR_10_VAL

    def subattr_step(self) -> float:
        return self.value.SUBATTR_10_VAL / (LIST_SUBATTR_RATIO[-1] * 10)

    def subattr_vals(self):
        return [
            self.value.SUBATTR_7_VAL,
            self.value.SUBATTR_8_VAL,
            self.value.SUBATTR_9_VAL,
            self.value.SUBATTR_10_VAL,
        ]

    @classmethod
    def find_with_short_name(cls, short_name: str):
        for item in AttributeEnum:
            if item.short_name() == short_name:
                return item
        return None
