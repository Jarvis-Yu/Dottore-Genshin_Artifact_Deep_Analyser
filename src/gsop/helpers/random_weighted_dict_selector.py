from typing import Dict

from src.gsop.values.terminology.artifact import ArtifactEnum
from random import random


def rwd_select(dict: Dict):
    total_weight = sum(dict.values())
    if total_weight == 0:
        return -1
    random_val = random() * total_weight
    for key in dict:
        random_val -= dict[key]
        if random_val < 0:
            return key


# tmp test only
if __name__ == '__main__':
    table = {}
    for i in range(110000):
        k = rwd_select(ArtifactEnum.GOBLET.substat_weights())
        if k in table.keys():
            table[k] += 1
        else:
            table[k] = 1
    for k in table:
        print(k, table[k])
    # print(rwd_select(ArtifactEnum.GOBLET.substat_weights()))
