//Monkey patching fetch, borrowed from Thomas Frank

let oldFetch = fetch;
fetch = async function (...args) {
  let rawResult = await oldFetch(...args);
  // monkey patch the json method of the rawResult
  let oldJson = rawResult.json;
  rawResult.json = async function () {
    let data = await oldJson.apply(rawResult);

    // Remove all tag signs - replace < with &lt; and > with &gt;
    // protect ourself agains XSS attacks
    json = JSON.stringify(data);
    json = json.replace(/</g, "&lt;");
    json = json.replace(/>/g, "&gt;");
    data = JSON.parse(json);

    return data;
  };
  return rawResult;
};
