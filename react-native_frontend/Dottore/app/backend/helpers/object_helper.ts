/**
 * Only copies one level.
 * @param {Object<string, Any>} object Object[string, primitive_type]
 * @returns {Object<string, Any>}
 */
export function copy_object<T>(object: { [key: string]: T }): { [key: string]: T } {
  const new_object: { [key: string]: T } = {};
  Object.keys(object).forEach((key) => {
    new_object[key] = object[key];
  });
  return new_object;
}

/**
 * @param {Object<string, A>} object
 * @param {string} key
 * @param {A} alternative
 * @returns {A}
 */
export function get_or<T>(object: { [key: string]: T }, key: string, alternative: T): T {
  return key in object ? object[key] : alternative;
}

/**
 * @param {Object<string, A>} object
 * @param {string} key
 * @param {A} value
 * @returns
 */
export function set_if_exist<T>(
  object: { [key: string]: T },
  key: string,
  value: T
): { [key: string]: T } {
  if (key in object) {
    object[key] = value;
  }
  return object;
}
