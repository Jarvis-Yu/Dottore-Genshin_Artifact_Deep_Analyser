from enum import Enum, auto


class ElementEnum(Enum):
    PYRO = auto()
    HYDRO = auto()
    ANEMO = auto()
    ELECTRO = auto()
    DENDRO = auto()
    CRYO = auto()
    GEO = auto()
    PHYSICAL = auto()
    TRUE = auto()  # ignores enemy defence and resistance
    FREEZE = auto()  # freeze reaction element
    HEAVY = auto()  # heavy attack that triggers shattered reaction
