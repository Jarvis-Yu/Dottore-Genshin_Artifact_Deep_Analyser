from enum import Enum, auto


class AttributeEnum(Enum):
    """
    TODO: replace auto() with full name
    """
    HP_FLAT = auto()
    DEF_FLAT = auto()
    ATK_FLAT = auto()
    ER = auto()
    EM = auto()
    CRIT_RATE = auto()
    CRIT_DMG = auto()
    HP_PCT = auto()
    DEF_PCT = auto()
    ATK_PCT = auto()
    PYRO_DB = auto()
    HYDRO_DB = auto()
    ANEMO_DB = auto()
    ELECTRO_DB = auto()
    DENDRO_DB = auto()
    CRYO_DB = auto()
    GEO_DB = auto()
    PHYSICAL_DB = auto()
    HEALING_BONUS = auto()
