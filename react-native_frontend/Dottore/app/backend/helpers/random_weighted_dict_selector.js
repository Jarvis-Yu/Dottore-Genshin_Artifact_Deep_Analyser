/**
 * @param {Object<string, number>} dictionary
 * @returns {number}
 */
export function wd_total_weight(dictionary) {
  return Object.values(dictionary).reduce((acc, nxt) => acc + nxt, 0);
}

/**
 * @param {Object<string, number>} dictionary
 * @param {string} key
 * @returns {number}
 */
export function wd_p_key(dictionary, key) {
  if (dictionary[key]) {
    return dictionary[key] / wd_total_weight(dictionary);
  } else {
    return 0;
  }
}
