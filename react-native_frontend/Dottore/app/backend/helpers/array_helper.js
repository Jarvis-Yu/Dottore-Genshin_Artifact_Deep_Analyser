/**
 * @param {Array<number>} arr 
 * @returns {number}
 */
export function sum_array(arr) {
  return arr.reduce((acc, nxt) => acc + nxt, 0)
}