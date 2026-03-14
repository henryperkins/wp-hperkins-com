// packages/block-directory/src/store/utils/get-plugin-url.js
function getPluginUrl(block) {
  if (!block) {
    return false;
  }
  const link = block.links["wp:plugin"] || block.links.self;
  if (link && link.length) {
    return link[0].href;
  }
  return false;
}
export {
  getPluginUrl as default
};
//# sourceMappingURL=get-plugin-url.mjs.map
