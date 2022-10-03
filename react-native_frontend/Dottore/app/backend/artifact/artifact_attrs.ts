import { Attributes_key } from "../consts/attribute_consts";
import { AVG_SUBATTR_RATIO } from "../consts/attribute_consts";
import { copy_object, get_or } from "../helpers/object_helper";

type attributes_type = { [key in Attributes_key]?: number };

export class ArtifactAttrs {
  #attrs: attributes_type;
  constructor() {
    this.#attrs = {};
  }

  set(attrs: attributes_type): ArtifactAttrs {
    this.#attrs = copy_object(attrs);
    return this;
  }

  set_avg(attrs: Attributes_key[]): ArtifactAttrs {
    const dictionary: attributes_type = {};
    attrs.forEach((key) => {
      dictionary[key] = AVG_SUBATTR_RATIO;
    });
    return this.set(dictionary);
  }

  add(attr: Attributes_key, scale: number): void {
    this.#attrs[attr] = get_or(this.#attrs, attr, 0) + scale;
  }

  get num_of_attrs(): number {
    return Object.keys(this.#attrs).length;
  }

  get attrs(): Attributes_key[] {
    return <Attributes_key[]> Object.keys(this.#attrs);
  }

  get_scale(attr: Attributes_key): number {
    return get_or(this.#attrs, attr, 0);
  }
}
