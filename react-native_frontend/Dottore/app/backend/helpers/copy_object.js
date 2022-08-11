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
