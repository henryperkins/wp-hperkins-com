// packages/format-library/src/link/use-link-instance-key.js
var weakMap = /* @__PURE__ */ new WeakMap();
var id = -1;
var prefix = "link-control-instance";
function getKey(_id) {
  return `${prefix}-${_id}`;
}
function useLinkInstanceKey(instance) {
  if (!instance) {
    return;
  }
  if (weakMap.has(instance)) {
    return getKey(weakMap.get(instance));
  }
  id += 1;
  weakMap.set(instance, id);
  return getKey(id);
}
var use_link_instance_key_default = useLinkInstanceKey;
export {
  use_link_instance_key_default as default
};
//# sourceMappingURL=use-link-instance-key.mjs.map
