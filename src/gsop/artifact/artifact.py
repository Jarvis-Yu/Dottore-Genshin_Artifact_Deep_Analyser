from typing import Dict

from src.gsop.values.terminology.attribute import AttributeEnum


class ArtifactAttrs:
    def __init__(self):
        self._attrs: Dict[AttributeEnum, float] = {}

    def set(self, attrs: Dict[AttributeEnum, float]):
        self._attrs = attrs.copy()

    def add(self, attr: AttributeEnum, scale: float = 1):
        self._attrs[attr] = self._attrs.setdefault(attr, 0) + scale

    def remove(self, attr: AttributeEnum):
        self._attrs.pop(attr, None)

    def force_update(self, attr: AttributeEnum, scale: float):
        self._attrs[attr] = scale

    def num_of_attrs(self):
        return len(self._attrs)

    def attrs(self):
        return self._attrs.keys()

    def has_attr(self, attr: AttributeEnum):
        return attr in self._attrs

    def get_scale(self, attr: AttributeEnum):
        return self._attrs[attr]

    def get_absolute_value(self, attr: AttributeEnum):
        val = attr.substat_max_val()
        if val == -1:
            return -1
        return self.get_scale(attr) * val

    def get_read_only(self):
        return self._attrs


class Artifact:
    def __init__(self):
        self._level = 0
        self._attrs = ArtifactAttrs()
        self._set = None
        self._mainstat = None
