from src.gsop._constReader.data_reader import read_json
from src.gsop.values.terminology.reaction_consts import ReactionEnum as re, \
    ReactionType as rt


# TODO: use real data
def element_level_multiplier(level: int, side: str = "character") -> float:
    # print(len(read_json()["level_multiplier"]))
    return read_json()["level_multiplier"][level][1]
    # return 1446.85  # this is simply lvl 90 data


def em_amplifying_reaction(em: int) -> float:
    return 2.78 * (em / (em + 1400))


def em_transformative_reaction(em: int) -> float:
    return 16.00 * (em / (em + 2000))


def em_shield(em: int) -> float:
    return 4.44 * (em / (em + 1400))


def em_effect_calc(em: int, reaction_type: re) -> float:
    reaction_category = reaction_type.reaction_type()
    if reaction_category == rt.AMPLIFYING_REACTION:
        return em_amplifying_reaction(em)
    elif reaction_category == rt.TRANSFORMATIVE_REACTION:
        return em_transformative_reaction(em)
    elif reaction_category == rt.CRYSTALLIZATION:
        return em_shield(em)
    else:  # not a valid type of reaction
        return -1


def transformative_reaction_dmg(em: int, reaction_type: re, level: int):
    return em_effect_calc(em, reaction_type) * element_level_multiplier(
        level) * reaction_type.coefficient()


if __name__ == '__main__':
    em = 720
    reaction = re.OVERLOADED
    lvl = 90
    # print(em_effect_calc(em, reaction))
    # print(element_level_multiplier(lvl))
    # print(reaction.coefficient())
    print(transformative_reaction_dmg(em, reaction, lvl) * 0.9)
    # reaction2 = re.MELT
    # print(em_effect_calc(em, reaction2))
