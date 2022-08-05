import time

from python_backend.artifact.rating import p_subattr_combination
from python_backend.artifact.weighted_attrs import WeightedAttrs
from python_backend.consts.terminology.artifact_consts import ArtifactEnum, ALL_4_ATTR_COMB, \
    P_3_SUBATTRS_ART_DOMAIN, P_4_SUBATTRS_ART_DOMAIN, MAX_NUM_ATTRS
from python_backend.consts.terminology.attribute_consts import AttributeEnum


class _LSDResult:
    def __init__(self, result: dict):
        self._result = result
        pass


def leveled_subattrs_distribution(mainattr: AttributeEnum, lvl: int, weights: WeightedAttrs) -> _LSDResult:
    """
    Only work for artifacts above level 4.

    :return:
    """
    if lvl < 4:
        print("[!] Invalid request for leveled_subattrs_distribution: lvl too low")
        return _LSDResult({})
    weighted_subattrs = ArtifactEnum.FLOWER.subattr_weights()
    weighted_subattrs.pop(mainattr, None)
    curr_layer: dict = {}
    next_layer: dict = {}
    curr_level_covers: int = 7
    # Initialize for the sub-attrs of a random level 4 artifact
    for comb in ALL_4_ATTR_COMB:
        if mainattr not in comb:  # if this is a valid combination
            p_comb = p_subattr_combination(weighted_subattrs, comb)
            # initialize attributes
            attrs = []  # type is list[tuple[weight, scale]]
            attrs_count = {}
            for attr in comb:
                value = weights.get(attr)
                if value > 0:  # only record if it has value
                    attrs_count[value] = attrs_count.setdefault(value, 0) + 1
            for weight in attrs_count:
                attrs.append((weight, attrs_count[weight], attrs_count[weight]))
            attrs.sort(reverse=True)
            if len(attrs) > 0:
                key = tuple(attrs)
                # now attrs is in a situation of an originally 3-attr artifact
                curr_layer[key] = curr_layer.setdefault(key, 0) + P_3_SUBATTRS_ART_DOMAIN * p_comb
                # for original 4-attr artifact
                not_stronger_count = MAX_NUM_ATTRS
                len_attrs = len(attrs)
                # Calculate probability that weighted attribute is enhanced
                for i in range(len_attrs):
                    original_tuple = attrs[i]
                    weight = original_tuple[1]
                    attrs[i] = (original_tuple[0], original_tuple[1], original_tuple[2] + 1)
                    key = tuple(attrs)
                    p_chosen = weight / MAX_NUM_ATTRS
                    curr_layer[key] = curr_layer.setdefault(key, 0) \
                                      + P_4_SUBATTRS_ART_DOMAIN * p_comb * p_chosen
                    not_stronger_count -= weight
                    attrs[i] = original_tuple
                # Calculate probability that unweighted attribute is enhanced
                key = tuple(attrs)
                p_chosen = not_stronger_count / MAX_NUM_ATTRS
                curr_layer[key] = curr_layer.setdefault(key, 0) \
                                  + P_4_SUBATTRS_ART_DOMAIN * p_comb * p_chosen

    # Compute the sub-attrs for level 8+ artifacts if needed
    while curr_level_covers < lvl:
        for situation in curr_layer:
            not_stronger_count = MAX_NUM_ATTRS
            list_situation = list(situation)
            len_attrs = len(situation)
            p_situation = curr_layer[situation]
            # Calculate probability that weighted attribute is enhanced
            for i in range(len_attrs):
                original_tuple = list_situation[i]
                value = situation[i][0]
                weight = situation[i][1]
                scale = situation[i][2]
                list_situation[i] = (value, weight, scale + 1)
                key = tuple(list_situation)
                p_chosen = weight / MAX_NUM_ATTRS
                next_layer[key] = next_layer.setdefault(key, 0) + p_situation * p_chosen
                not_stronger_count -= weight
                list_situation[i] = original_tuple
            # Calculate probability that unweighted attribute is enhanced
            key = tuple(list_situation)
            p_chosen = not_stronger_count / MAX_NUM_ATTRS
            next_layer[key] = next_layer.setdefault(key, 0) + p_situation * p_chosen
        curr_layer = next_layer
        next_layer = {}
        curr_level_covers += 4

    # TEST PRINT
    total_p = 0
    print("<curr_layer>")
    for key in curr_layer:
        print("   ", key, curr_layer[key])
        total_p += curr_layer[key]
    print("</curr_layer>")
    print(total_p)
    print(len(curr_layer))

    return _LSDResult(curr_layer)


if __name__ == '__main__':
    start = time.time()
    f(AttributeEnum.ATK_FLAT, 20, WeightedAttrs.crit_atk_plan())
    end = time.time()
    print("time taken:", end - start)
