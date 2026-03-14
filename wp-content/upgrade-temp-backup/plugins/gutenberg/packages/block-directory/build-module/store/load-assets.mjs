// packages/block-directory/src/store/load-assets.js
import apiFetch from "@wordpress/api-fetch";
var loadAsset = (el) => {
  return new Promise((resolve, reject) => {
    const newNode = document.createElement(el.nodeName);
    ["id", "rel", "src", "href", "type"].forEach((attr) => {
      if (el[attr]) {
        newNode[attr] = el[attr];
      }
    });
    if (el.innerHTML) {
      newNode.appendChild(document.createTextNode(el.innerHTML));
    }
    newNode.onload = () => resolve(true);
    newNode.onerror = () => reject(new Error("Error loading asset."));
    document.body.appendChild(newNode);
    if ("link" === newNode.nodeName.toLowerCase() || "script" === newNode.nodeName.toLowerCase() && !newNode.src) {
      resolve();
    }
  });
};
async function loadAssets() {
  const response = await apiFetch({
    url: document.location.href,
    parse: false
  });
  const data = await response.text();
  const doc = new window.DOMParser().parseFromString(data, "text/html");
  const newAssets = Array.from(
    doc.querySelectorAll('link[rel="stylesheet"],script')
  ).filter((asset) => asset.id && !document.getElementById(asset.id));
  for (const newAsset of newAssets) {
    await loadAsset(newAsset);
  }
}
export {
  loadAsset,
  loadAssets
};
//# sourceMappingURL=load-assets.mjs.map
