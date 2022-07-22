from typing import Dict

from python_backend.values.terminology.attribute_consts import AttributeEnum


class WeightedAttrs:
    def __init__(self):
        self._weighted_attrs: Dict[AttributeEnum, float] = {}

    def set(self, weighted_attrs: Dict[AttributeEnum, float]):
        """
        The weights should be from 0 to 1
        """
        self._weighted_attrs: Dict[AttributeEnum, float] = weighted_attrs.copy()
        return self

    def add(self, weighted_attr: AttributeEnum, weight: float = 1) -> bool:
        """
        :param weight: from 0 to 1
        """
        if weighted_attr not in self._weighted_attrs.keys():
            self._weighted_attrs[weighted_attr] = weight
            return True
        else:
            return False

    def remove(self, weighted_attr: AttributeEnum) -> bool:
        if weighted_attr in self._weighted_attrs.keys():
            self._weighted_attrs.pop(weighted_attr)
            return True
        else:
            return False

    def update(self, weighted_attr: AttributeEnum, weight: float):
        if weighted_attr in self._weighted_attrs.keys():
            self._weighted_attrs[weighted_attr] = weight
            return True
        else:
            return False

    def force_update(self, weighted_attr: AttributeEnum, weight: float):
        self._weighted_attrs[weighted_attr] = weight

    def get(self, weighted_attr: AttributeEnum):
        return self._weighted_attrs.get(weighted_attr, 0)

    def attrs(self):
        return self._weighted_attrs.keys()

    @classmethod
    def crit_atk_er_em_plan(cls):
        weights = WeightedAttrs()
        weights.set({
            AttributeEnum.CRIT_RATE: 1,
            AttributeEnum.CRIT_DMG: 1,
            AttributeEnum.ATK_PCT: 0.8,
            AttributeEnum.ATK_FLAT: 0.3,
            AttributeEnum.ER: 0.6,
            AttributeEnum.EM: 0.7,
        })
        return weights

    @classmethod
    def crit_plan(cls):
        weights = WeightedAttrs()
        weights.set({
            AttributeEnum.CRIT_RATE: 1,
            AttributeEnum.CRIT_DMG: 1,
        })
        return weights

    @classmethod
    def crit_atk_plan(cls):
        weights = WeightedAttrs()
        weights.set({
            AttributeEnum.CRIT_RATE: 1,
            AttributeEnum.CRIT_DMG: 1,
            AttributeEnum.ATK_PCT: 0.8,
            AttributeEnum.ATK_FLAT: 0.3,
        })
        return weights

    @classmethod
    def crit_def_plan(cls):
        weights = WeightedAttrs()
        weights.set({
            AttributeEnum.CRIT_RATE: 1,
            AttributeEnum.CRIT_DMG: 1,
            AttributeEnum.DEF_PCT: 0.8,
            AttributeEnum.DEF_FLAT: 0.3,
        })
        return weights

if __name__ == '__main__':
    print("A")

