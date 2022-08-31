export const WEIGHTS_PLANS = {
  common_atk_crit_plan: {
    ATK_FLAT: 0.3,
    ATK_PCT: 0.8,
    CRIT_RATE: 1,
    CRIT_DMG: 1,
    EM: 0.3,
    ER: 0.3,
  },
  common_def_crit_plan: {
    DEF_FLAT: 0.3,
    DEF_PCT: 0.8,
    CRIT_RATE: 1,
    CRIT_DMG: 1,
    ER: 0.3,
  },
  common_hp_crit_plan: {
    HP_FLAT: 0.3,
    HP_PCT: 0.8,
    CRIT_RATE: 1,
    CRIT_DMG: 1,
    EM: 0.3,
    ER: 0.3,
  },
  crit_only_plan: {
    CRIT_RATE: 1,
    CRIT_DMG: 1,
  },
};

function generateSelection() {
  const dict = {};
  Object.keys(WEIGHTS_PLANS).forEach((key) => {
    dict[key] = { key };
  });
  return dict;
}

export const WEIGHTS_PLANS_SELECT = generateSelection();
