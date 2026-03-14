"use strict";
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

// packages/block-editor/src/components/inserter/get-appender-label.js
var get_appender_label_exports = {};
__export(get_appender_label_exports, {
  getAppenderLabel: () => getAppenderLabel
});
module.exports = __toCommonJS(get_appender_label_exports);
var MAX_APPENDER_LABEL_LENGTH = 50;
function getAppenderLabel(defaultBlock, defaultBlockType) {
  if (!defaultBlock || !defaultBlock.attributes || !defaultBlockType?.__experimentalLabel) {
    return null;
  }
  const result = defaultBlockType.__experimentalLabel(
    defaultBlock.attributes,
    { context: "appender" }
  );
  if (typeof result === "string" && result.length < MAX_APPENDER_LABEL_LENGTH && result.length > 0) {
    return result;
  }
  return null;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getAppenderLabel
});
//# sourceMappingURL=get-appender-label.cjs.map
