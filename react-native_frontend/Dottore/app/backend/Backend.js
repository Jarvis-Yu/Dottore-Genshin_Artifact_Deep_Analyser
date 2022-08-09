const localHost = "http://localhost:41372";

/**
 * @returns \{data, ok}
 */
export async function getBackendJson({ route = "/" }) {
  console.log("getBackendJson(", localHost + route, ")");
  return await fetch(localHost + route, { method: "GET" })
    .then((resp) => resp.json())
    .then((resp_json) => {
      console.log("[i] Backend.getBackendJson:", resp_json);
      return { data: resp_json, ok: true };
    })
    .catch((error) => {
      console.log("[i] Backend.postBackendJson:", error);
      return { data: {}, ok: false };
    });
}

/**
 * @returns \{data, ok}
 */
export async function postBackendJson({ route = "/", args = {} }) {
  body = JSON.stringify(args)
  console.log("[i] Backend.postBackendJson.body:", body);
  const k = await fetch(localHost + route, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  })
    .then((resp) => resp.json())
    .then((resp_json) => {
      console.log("[i] Backend.postBackendJson:", resp_json);
      return { data: resp_json, ok: true };
    })
    .catch((error) => {
      console.log("[i] Backend.postBackendJson:", error);
      return { data: {}, ok: false };
    });
  return k;
}
