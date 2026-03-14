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

// packages/nux/src/store/actions.js
var actions_exports = {};
__export(actions_exports, {
  disableTips: () => disableTips,
  dismissTip: () => dismissTip,
  enableTips: () => enableTips,
  triggerGuide: () => triggerGuide
});
module.exports = __toCommonJS(actions_exports);
function triggerGuide(tipIds) {
  return {
    type: "TRIGGER_GUIDE",
    tipIds
  };
}
function dismissTip(id) {
  return {
    type: "DISMISS_TIP",
    id
  };
}
function disableTips() {
  return {
    type: "DISABLE_TIPS"
  };
}
function enableTips() {
  return {
    type: "ENABLE_TIPS"
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  disableTips,
  dismissTip,
  enableTips,
  triggerGuide
});
//# sourceMappingURL=actions.cjs.map
