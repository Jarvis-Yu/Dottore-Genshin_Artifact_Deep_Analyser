# tmp
from typing import Dict

from python_backend.consts.terminology.attribute_consts import AttributeEnum


class Buff:
    def __init__(self, source: str, buff: Dict[AttributeEnum, float]):
        self.BUFF: Dict[AttributeEnum, float] = buff
        self.SOURCE = source


class YaeMiko:
    _base_stats: Dict[AttributeEnum, float] = {
        AttributeEnum.HP_FLAT: 10372,
        AttributeEnum.ATK_FLAT: 340,
        AttributeEnum.DEF_FLAT: 569,
        AttributeEnum.CRIT_RATE: 0.242,
        AttributeEnum.CRIT_DMG: 0.5,
        AttributeEnum.EM: 0,
        AttributeEnum.ELECTRO_DB: 0,
    }
    _buffs: Dict[str, Buff] = {}

    def update_buff(self, buff: Buff):
        self._buffs[buff.SOURCE] = buff
        return self

    def base_atk(self) -> float:
        base_atk = self._base_stats.setdefault(AttributeEnum.ATK_FLAT, 0)
        if "weapon_base" in self._buffs.keys():
            base_atk += self._buffs["weapon_base"].BUFF.setdefault(AttributeEnum.ATK_FLAT)
        return base_atk

    def actual_atk(self) -> float:
        atk_pct = self._base_stats.setdefault(AttributeEnum.ATK_PCT, 0)
        atk_flat = 0
        for buff_name in self._buffs:
            atk_pct += self._buffs[buff_name].BUFF.setdefault(AttributeEnum.ATK_PCT, 0)
            if buff_name != "weapon_base":
                atk_flat += self._buffs[buff_name].BUFF.setdefault(AttributeEnum.ATK_FLAT, 0)
        return self.base_atk() * (1 + atk_pct) + atk_flat

    def crit_rate(self) -> float:
        cr = self._base_stats.setdefault(AttributeEnum.CRIT_RATE, 0)
        for buff_name in self._buffs:
            cr += self._buffs[buff_name].BUFF.setdefault(AttributeEnum.CRIT_RATE, 0)
        return cr

    def crit_dmg(self) -> float:
        cd = self._base_stats.setdefault(AttributeEnum.CRIT_DMG, 0)
        for buff_name in self._buffs:
            cd += self._buffs[buff_name].BUFF.setdefault(AttributeEnum.CRIT_DMG, 0)
        return cd

    def electro_db(self) -> float:
        electro_db = self._base_stats.setdefault(AttributeEnum.ELECTRO_DB, 0)
        for buff_name in self._buffs:
            electro_db += self._buffs[buff_name].BUFF.setdefault(AttributeEnum.ELECTRO_DB, 0)
        return electro_db

    def em(self) -> float:
        em = self._base_stats.setdefault(AttributeEnum.EM, 0)
        for buff_name in self._buffs:
            em += self._buffs[buff_name].BUFF.setdefault(AttributeEnum.EM, 0)
        return em

    def skill_expectation(self) -> float:
        return self.actual_atk() * (1 + self.crit_rate() * self.crit_dmg()) * (
                1 + self.electro_db() + 0.0015 * self.em())


if __name__ == '__main__':
    def best_allocation(character: YaeMiko, attr_num):
        buff = Buff("tmp_artifact", {})
        character.update_buff(buff)
        base_cr = character.crit_rate()
        base_cd = character.crit_dmg()
        u_num = attr_num + 1
        best_buff = buff.BUFF.copy()
        best_exp = character.skill_expectation()
        for n_atk in range(u_num):
            rest1 = attr_num - n_atk + 1
            buff.BUFF[AttributeEnum.ATK_PCT] = n_atk * AttributeEnum.ATK_PCT.subattr_max_val()
            for n_2c in range(rest1):
                quota = n_2c * AttributeEnum.CRIT_DMG.subattr_max_val()
                cr = 0
                cd = 0
                if base_cr * 2 < base_cd:
                    diff = base_cd - base_cr * 2
                    cr += min(quota, diff) / 2
                    quota -= min(quota, diff)
                else:
                    diff = base_cr * 2 - base_cd
                    cd += min(quota, diff)
                    quota -= min(quota, diff)
                catch = 1 - base_cr - cr
                if quota <= catch * 3:
                    potion = quota / 2
                    cr += potion / 2
                    cd += potion
                else:
                    quota -= 2 * (1 - base_cr - cr)
                    cr = 1 - base_cr
                    cd += quota
                buff.BUFF[AttributeEnum.CRIT_RATE] = cr
                buff.BUFF[AttributeEnum.CRIT_DMG] = cd
                buff.BUFF[AttributeEnum.EM] = (
                                                      rest1 - 1 - n_2c) * AttributeEnum.EM.subattr_max_val()
                exp = character.skill_expectation()
                if exp > best_exp:
                    best_buff = buff.BUFF.copy()
                    best_exp = exp
        character.update_buff(Buff("tmp_artifact", {}))
        return best_buff, best_exp


    yae = YaeMiko()
    yae.update_buff(Buff("weapon_base", {AttributeEnum.ATK_FLAT: 608})).update_buff(
        Buff("weapon_buff",
             {AttributeEnum.CRIT_DMG: 0.662, AttributeEnum.ELECTRO_DB: 0.48})).update_buff(
        Buff("C4", {AttributeEnum.ELECTRO_DB: 0.2}))
    for attr_num in range(0, 100):
        v_buff, v_exp = best_allocation(yae, attr_num)
        yae.update_buff(Buff("tmp_artifact", v_buff))
        print("%d : %.1f : %.1f : %.1f%% : %.1f%% : %.1f" % (
            attr_num, v_exp, yae.actual_atk(), 100 * yae.crit_rate(), 100 * yae.crit_dmg(),
            yae.em()))
        # print(attr_num, ":", v_exp, ":", yae.actual_atk(), ":", yae.crit_rate(), ":",
        #       yae.crit_dmg(), ":", yae.em())
