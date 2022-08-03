const localHost = "http://localhost:41372";

/**
 * @returns \{data, ok}
 */
export async function getBackendJson({ route = "/" }) {
  return await fetch(localHost + route, { method: "GET" })
    .then((resp) => resp.json())
    .then((resp_json) => {
      console.log("[i] Backend.getBackendJson:", resp_json);
      return { data: resp_json, ok: true };
    })
    .catch((resp) => {
      return { data: {}, ok: false };
    });
}

/**
 * @returns \{data, ok}
 */
export async function postBackendJson({ route = "/", args = {} }) {
  const k = await fetch(localHost + route, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  })
    .then((resp) => resp.json())
    .then((resp_json) => {
      console.log("[i] Backend.postBackendJson:", resp_json);
      return { data: resp_json, ok: true };
    })
    .catch((resp) => {
      return { data: {}, ok: false };
    });
  return k;
}
