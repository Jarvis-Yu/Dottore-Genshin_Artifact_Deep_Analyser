import { AVG_SUBATTR_RATIO } from "../consts/attribute_consts";
import { copy_object } from "../helpers/copy_object";

export class ArtifactAttrs {
  #attrs;
  constructor() {
    this.#attrs = {};
  }

  /**
   * @param {Object<string, number>} attrs Object<AttributeEnum, float>
   * @returns {ArtifactAttrs}
   */
  set(attrs) {
    this.#attrs = copy_object(attrs);
    return this;
  }

  /**
   *
   * @param {Array<string>} attrs Array[AttributeEnum]
   * @returns {ArtifactAttrs}
   */
  set_avg(attrs) {
    const dictionary = {};
    attrs.forEach((key) => {
      dictionary[key] = AVG_SUBATTR_RATIO;
    });
    return this.set(dictionary);
  }

  /**
   * @param {string} attr AttributeEnum
   * @param {number} scale
   */
  add(attr, scale) {
    this.#attrs[attr] = (this.#attrs[attr] ? this.#attrs[attr] : 0) + scale;
  }

  get num_of_attrs() {
    return Object.keys(this.#attrs).length
  }

  get attrs() {
    return Object.keys(this.#attrs)
  }

  /**
   * @param {string} attr AttributeEnum
   */
  get_scale(attr) {
    return this.#attrs[attr]
  }
}
