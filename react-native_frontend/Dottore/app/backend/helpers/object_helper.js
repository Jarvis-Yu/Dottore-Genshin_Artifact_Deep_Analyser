/**
 * Only copies one level.
 * @param {Object<string, Any>} object Object[string, primitive_type]
 * @returns {Object<string, Any>}
 */
export function copy_object(object) {
  const new_object = {};
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
export function get_or(object, key, alternative) {
  return (object[key] ? object[key] : alternative)
}

/**
 * @param {Object<string, A>} object 
 * @param {string} key 
 * @param {A} value 
 * @returns 
 */
export function set_if_exist(object, key, value) {
  if (object[key]) {
    object[key] = value
  }
  return object
}
