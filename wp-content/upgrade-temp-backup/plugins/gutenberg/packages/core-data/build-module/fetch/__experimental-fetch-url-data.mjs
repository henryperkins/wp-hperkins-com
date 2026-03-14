// packages/core-data/src/fetch/__experimental-fetch-url-data.js
import apiFetch from "@wordpress/api-fetch";
import {
  addQueryArgs,
  prependHTTP,
  isURL,
  getProtocol,
  isValidProtocol
} from "@wordpress/url";
var CACHE = /* @__PURE__ */ new Map();
var fetchUrlData = async (url, options = {}) => {
  const endpoint = "/wp-block-editor/v1/url-details";
  const args = {
    url: prependHTTP(url)
  };
  if (!isURL(url)) {
    return Promise.reject(`${url} is not a valid URL.`);
  }
  const protocol = getProtocol(url);
  if (!protocol || !isValidProtocol(protocol) || !protocol.startsWith("http") || !/^https?:\/\/[^\/\s]/i.test(url)) {
    return Promise.reject(
      `${url} does not have a valid protocol. URLs must be "http" based`
    );
  }
  if (CACHE.has(url)) {
    return CACHE.get(url);
  }
  return apiFetch({
    path: addQueryArgs(endpoint, args),
    ...options
  }).then((res) => {
    CACHE.set(url, res);
    return res;
  });
};
var experimental_fetch_url_data_default = fetchUrlData;
export {
  experimental_fetch_url_data_default as default
};
//# sourceMappingURL=__experimental-fetch-url-data.mjs.map
