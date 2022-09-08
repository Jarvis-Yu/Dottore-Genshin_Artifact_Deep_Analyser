/**
 * @param {Object<string, number>} dictionary
 * @returns {number}
 */
export function wd_total_weight(dictionary: { [key: string]: number }): number {
  return Object.values(dictionary).reduce((acc, nxt) => acc + nxt, 0);
}

/**
 * @param {Object<string, number>} dictionary
 * @param {string} key
 * @returns {number}
 */
export function wd_p_key(dictionary: { [key: string]: number }, key: string): number {
  if (key in dictionary) {
    return dictionary[key] / wd_total_weight(dictionary);
  } else {
    return 0;
  }
}
