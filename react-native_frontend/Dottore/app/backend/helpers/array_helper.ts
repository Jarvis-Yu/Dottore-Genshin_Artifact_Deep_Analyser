export function sum_array(arr: number[]): number {
  return arr.reduce((acc, nxt) => acc + nxt, 0)
}