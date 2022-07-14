from enum import Enum, auto
from typing import List

from src.gsop.values.terminology_element import ElementEnum as ee


class Reaction:
    def __init__(self, fst_elem: ee, snd_elem: ee, multiplier: float):
        self.FST_ELEM = fst_elem
        self.SND_ELEM = snd_elem
        self.MULTIPLIER = multiplier


class ReactionType(Enum):
    AMPLIFYING_REACTION = auto()
    TRANSFORMATIVE_REACTION = auto()
    CRYSTALLIZATION = auto()
    OTHER = auto()


class ReactionConsts:
    def __init__(self, reaction_type: ReactionType, triggers: List[Reaction]):
        self.REACTION_TYPE = reaction_type
        self.TRIGGERS = triggers


class ReactionEnum(Enum):
    MELT = ReactionConsts(
        ReactionType.AMPLIFYING_REACTION,
        [
            Reaction(ee.PYRO, ee.CRYO, 1.5),
            Reaction(ee.CRYO, ee.PYRO, 2),
        ]
    )
    VAPORIZE = ReactionConsts(
        ReactionType.AMPLIFYING_REACTION,
        [
            Reaction(ee.HYDRO, ee.PYRO, 1.5),
            Reaction(ee.PYRO, ee.HYDRO, 2),
        ]
    )
    SUPERCONDUCT = ReactionConsts(
        ReactionType.TRANSFORMATIVE_REACTION,
        [
            Reaction(ee.CRYO, ee.ELECTRO, 0.5),
            Reaction(ee.ELECTRO, ee.CRYO, 0.5),
        ]
    )
    SWIRL = ReactionConsts(
        ReactionType.TRANSFORMATIVE_REACTION,
        [
            Reaction(ee.PYRO, ee.ANEMO, 0.6),
            Reaction(ee.HYDRO, ee.ANEMO, 0.6),
            Reaction(ee.ELECTRO, ee.ANEMO, 0.6),
            Reaction(ee.CRYO, ee.ANEMO, 0.6),
            Reaction(ee.ANEMO, ee.PYRO, 0.6),
            Reaction(ee.ANEMO, ee.HYDRO, 0.6),
            Reaction(ee.ANEMO, ee.ELECTRO, 0.6),
            Reaction(ee.ANEMO, ee.CRYO, 0.6),
        ]
    )
    ELECTRO_CHARGED = ReactionConsts(
        ReactionType.TRANSFORMATIVE_REACTION,
        [
            Reaction(ee.HYDRO, ee.ELECTRO, 1.2),
            Reaction(ee.ELECTRO, ee.HYDRO, 1.2),
        ]
    )
    SHATTERED = ReactionConsts(
        ReactionType.TRANSFORMATIVE_REACTION,
        [
            Reaction(ee.FREEZE, ee.HEAVY, 1.5)
        ]
    )
    OVERLOADED = ReactionConsts(
        ReactionType.TRANSFORMATIVE_REACTION,
        [
            Reaction(ee.ELECTRO, ee.PYRO, 2),
            Reaction(ee.PYRO, ee.ELECTRO, 2),
        ]
    )
    CRYSTALLIZE = ReactionConsts(
        ReactionType.CRYSTALLIZATION,
        [
            Reaction(ee.PYRO, ee.GEO, 1),
            Reaction(ee.HYDRO, ee.GEO, 1),
            Reaction(ee.ELECTRO, ee.GEO, 1),
            Reaction(ee.CRYO, ee.GEO, 1),
        ]
    )
    BURNING = ReactionConsts(
        ReactionType.TRANSFORMATIVE_REACTION,
        [
            Reaction(ee.DENDRO, ee.PYRO, 1),
        ]
    )
    FROZEN = ReactionConsts(
        ReactionType.OTHER,
        []
    )

    def coefficient(self, fst_elem: ee = None, snd_elem: ee = None) -> float:
        return self.value.TRIGGERS[0].MULTIPLIER

    def reaction_type(self) -> ReactionType:
        return self.value.REACTION_TYPE
