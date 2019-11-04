const load_local_data = async path => {
  let result;

  try {
    result = await $.getJSON(path);
    return result;
  } catch (error) {
    console.error(error);
  }
  return;
};

const load_live_data = async (endpoint, q) => {
  let api_query =
    window.api_conf.odpt.api_url +
    endpoint +
    "?" +
    window.api_conf.odpt.pre +
    window.api_conf.odpt.value +
    (q ? "&" + q.join("&") : "");

  let result;
  try {
    result = await $.getJSON(api_query);
    return result;
  } catch (error) {
    console.error(error);
  }
  return;
};

export { load_local_data, load_live_data };
