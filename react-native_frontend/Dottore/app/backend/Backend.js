import AsyncStorage from "@react-native-async-storage/async-storage";
import { Artifact } from "./artifact/artifact";
import { ArtifactAttrs } from "./artifact/artifact_attrs";
import { p_get_set, p_get_type, rarity_in_domain_runs } from "./artifact/rarity";
import { WeightedAttrs, WeightedAttrsPresets } from "./artifact/weighted_attrs";
import { Artifacts, ArtifactEnum_find_with_short_name } from "./consts/artifact_consts";
import { Attributes, AttributeEnum_find_with_short_name } from "./consts/attribute_consts";

const local = true;
const localHost = "http://localhost:41372";

const localRoutes = {
  "/artifact/types": () => {
    const retval = {};
    Object.keys(Artifacts).forEach((key) => {
      if (key !== "UNDEFINED") {
        retval[key] = { key };
      }
    });
    return retval;
  },
  "/artifact/subattrs": () => {
    const retval = [];
    Object.keys(Artifacts.FLOWER.subattr_weights_readonly).forEach((key) => {
      retval.push(key);
    });
    return retval;
  },
  "/artifact/type-to-mainattrs": ({ args }) => {
    const retval = {};
    // if (!args.type) {
    //   return retval;
    // }
    const artifact_type = args.type;
    const artifact = Artifacts[artifact_type];
    if (artifact) {
      Object.keys(artifact.mainattr_weights_readonly).forEach((mainattr) => {
        retval[mainattr] = {
          key: mainattr,
        };
      });
    }
    return retval;
  },
  "/artifact/mainattr-to-subattrs": ({ args }) => {
    const retval = {};
    // if (!args.mainattr) {
    //   return retval;
    // }
    const artifact_mainattr = args.mainattr;
    const true_artifact_mainattr = Attributes[artifact_mainattr];
    const max_scale = 10;
    const min_scale = 7;
    const artifact_subattrs = Artifacts.FLOWER.subattr_weights_readonly;
    Object.keys(artifact_subattrs).forEach((attr) => {
      const true_attr = Attributes[attr];
      if (true_attr.key !== artifact_mainattr) {
        const step = true_attr.subattr_step;
        const min_val = min_scale * step;
        const max_val = max_scale * step;
        retval[true_attr.key] = {
          key: true_attr.key,
          min_val,
          max_val,
          step,
          percent: max_val < 1,
          decimal_fixed: max_val < 1 ? 1 : 0,
        };
      }
    });
    return retval;
  },
  "/artifact/get_all_info": ({ args }) => {
    // if (!args.kind || !args.level || !args.mainattr || !args.subattrs) {
    //   return {};
    // }
    const artifact_kind = args.kind;
    const artifact_level = args.level;
    const artifact_mainattr = args.mainattr;
    const artifact_subattrs = new ArtifactAttrs();
    const existing_subattrs = args.subattrs;
    Object.keys(existing_subattrs).forEach((attr) => {
      const value = existing_subattrs[attr] / Attributes[attr].subattr_max_val;
      artifact_subattrs.add(attr, value);
    });
    const artifact_weights = new WeightedAttrs();
    artifact_weights.set(args.weights);

    const art = Artifact.rating_only_plan(
      artifact_level,
      artifact_kind,
      artifact_mainattr,
      artifact_subattrs,
      artifact_weights
    );
    const art_expect = art.expected_rating({ crit_based: true });
    const art_curr = art.current_rating({ crit_based: true });
    const art_extreme = art.extreme_rating({ crit_based: true });
    const art_relative = art.relative_p({});
    const art_runs = rarity_in_domain_runs(art_relative * p_get_set() * p_get_type());
    return {
      art_expect,
      art_extreme,
      art_curr,
      art_relative,
      art_runs,
    };
  },
};

function localHandler({ route = "/", args = {} }) {
  let data = undefined;
  if (localRoutes[route]) {
    data = localRoutes[route]({ args });
  }
  if (data !== undefined) {
    return { data, ok: true };
  } else {
    return { data: {}, ok: false };
  }
}

/**
 * @returns \{data, ok}
 */
export async function getBackendJson({ route = "/" }) {
  if (local) {
    return localHandler({ route });
  } else {
    return await fetch(localHost + route, { method: "GET" })
      .then((resp) => resp.json())
      .then((resp_json) => {
        // console.log("[i] Backend.getBackendJson:", resp_json);
        return { data: resp_json, ok: true };
      })
      .catch((error) => {
        // console.log("[i] Backend.postBackendJson:", error);
        return { data: {}, ok: false };
      });
  }
}

/**
 * @returns \{data, ok}
 */
export async function postBackendJson({ route = "/", args = {} }) {
  if (local) {
    return localHandler({ route, args });
  } else {
    body = JSON.stringify(args);
    // console.log("[i] Backend.postBackendJson.body:", body);
    const k = await fetch(localHost + route, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    })
      .then((resp) => resp.json())
      .then((resp_json) => {
        // console.log("[i] Backend.postBackendJson:", resp_json);
        return { data: resp_json, ok: true };
      })
      .catch((error) => {
        // console.log("[i] Backend.postBackendJson:", error);
        return { data: {}, ok: false };
      });
    return k;
  }
}

/**
 * @param {string} key
 * @param {string} value
 */
export async function localStore(key, value) {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.log("[!] local store failed");
  }
}

/**
 * @param {string} key
 * @param {*} alter
 */
export async function localGet(key, alter) {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
    return alter;
  } catch (e) {
    return alter;
  }
}
