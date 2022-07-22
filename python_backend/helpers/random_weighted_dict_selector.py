from random import random
from typing import Dict


def wd_total_weight(dictionary: Dict):
    """
    Function name stands for `weighted dict total weight`

    :param dictionary: Dict[Any, int/float]
    :return: the sum of weights
    """
    return sum(dictionary.values())


def wd_p_key(dictionary: Dict, key):
    """
    Function name stands for `weighted dict probability key`

    :param dictionary: Dict[Any, int/float]
    :return: The probability that the key will be selected based on the weights.
    """
    return dictionary[key] / wd_total_weight(dictionary)


def rwd_select(dictionary: Dict):
    """
    Function name stands for `random weighted dict select`

    :param dictionary: Dict[Any, int/float]
    :return: A random key from the dictionary based on the weights.
    """
    total_weight = sum(dictionary.values())
    if total_weight == 0:
        return -1
    random_val = random() * total_weight
    for key in dictionary:
        random_val -= dictionary[key]
        if random_val < 0:
            return key
