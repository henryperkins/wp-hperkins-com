var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/format-library/src/link/use-link-instance-key.js
var use_link_instance_key_exports = {};
__export(use_link_instance_key_exports, {
  default: () => use_link_instance_key_default
});
module.exports = __toCommonJS(use_link_instance_key_exports);
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
//# sourceMappingURL=use-link-instance-key.cjs.map
