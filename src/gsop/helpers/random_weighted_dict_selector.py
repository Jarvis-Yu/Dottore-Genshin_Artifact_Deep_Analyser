from typing import Dict

from src.gsop.values.terminology.artifact import ArtifactEnum
from random import random


def wd_total_weight(dictionary: Dict):
    return sum(dictionary.values())


def wd_p_key(dictionary: Dict, key):
    return dictionary[key] / wd_total_weight(dictionary)


def rwd_select(dictionary: Dict):
    total_weight = sum(dictionary.values())
    if total_weight == 0:
        return -1
    random_val = random() * total_weight
    for key in dictionary:
        random_val -= dictionary[key]
        if random_val < 0:
            return key


# tmp test only
if __name__ == '__main__':
    table = {}
    for i in range(110000):
        k = rwd_select(ArtifactEnum.GOBLET.substat_weights())
        table[k] = table.setdefault(k, 0) + 1
    for k in table:
        print(k, table[k])
    # print(rwd_select(ArtifactEnum.GOBLET.substat_weights()))
