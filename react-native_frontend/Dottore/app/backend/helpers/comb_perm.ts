/**
 * Generate all combinations of an array.
 * Credit: https://stackoverflow.com/a/61418166
 * @param {Array} sourceArray - Array of input elements.
 * @param {number} comboLength - Desired length of combinations.
 * @return {Array} Array of combination arrays.
 */
export function generateCombinations<T>(sourceArray: T[], comboLength: number): T[][] {
  const sourceLength = sourceArray.length;
  if (comboLength > sourceLength) return [];

  const combos: T[][] = []; // Stores valid combinations as they are generated.

  // Accepts a partial combination, an index into sourceArray,
  // and the number of elements required to be added to create a full-length combination.
  // Called recursively to build combinations, adding subsequent elements at each call depth.
  const makeNextCombos = (workingCombo: T[], currentIndex: number, remainingCount: number) => {
    const oneAwayFromComboLength = remainingCount == 1;

    // For each element that remaines to be added to the working combination.
    for (let sourceIndex = currentIndex; sourceIndex < sourceLength; sourceIndex++) {
      // Get next (possibly partial) combination.
      const next = [...workingCombo, sourceArray[sourceIndex]];

      if (oneAwayFromComboLength) {
        // Combo of right length found, save it.
        combos.push(next);
      } else {
        // Otherwise go deeper to add more elements to the current partial combination.
        makeNextCombos(next, sourceIndex + 1, remainingCount - 1);
      }
    }
  };

  makeNextCombos([], 0, comboLength);
  return combos;
}

/**
 * Credit: https://stackoverflow.com/a/37580979
 * @param {Array<A>} permutation
 * @returns {Array<Array<A>>}
 */
export function permute<T>(permutation: T[]): T[][] {
  var length = permutation.length,
    result = [permutation.slice()],
    c = new Array(length).fill(0),
    i = 1,
    k,
    p;

  while (i < length) {
    if (c[i] < i) {
      k = i % 2 && c[i];
      p = permutation[i];
      permutation[i] = permutation[k];
      permutation[k] = p;
      ++c[i];
      i = 1;
      result.push(permutation.slice());
    } else {
      c[i] = 0;
      ++i;
    }
  }
  return result;
}

/**
 * Credit: https://stackoverflow.com/a/20871714
 * @param {Array<A>} inputArr
 * @returns {Array<Array<A>>}
 */
function permutator<T>(inputArr: T[]): T[][] {
  var results: T[][] = [];

  function permute(arr: T[], memo: T[] = []): T[][] {
    var cur: T[];

    for (var i = 0; i < arr.length; i++) {
      cur = arr.splice(i, 1);
      if (arr.length === 0) {
        results.push(memo.concat(cur));
      }
      permute(arr.slice(), memo.concat(cur));
      arr.splice(i, 0, cur[0]);
    }

    return results;
  }

  return permute(inputArr);
}
