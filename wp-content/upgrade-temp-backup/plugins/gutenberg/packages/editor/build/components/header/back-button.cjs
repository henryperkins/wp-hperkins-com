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

// packages/editor/src/components/header/back-button.js
var back_button_exports = {};
__export(back_button_exports, {
  default: () => back_button_default,
  useHasBackButton: () => useHasBackButton
});
module.exports = __toCommonJS(back_button_exports);
var import_components = require("@wordpress/components");
var import_jsx_runtime = require("react/jsx-runtime");
var slotName = "__experimentalMainDashboardButton";
var useHasBackButton = () => {
  const fills = (0, import_components.__experimentalUseSlotFills)(slotName);
  return Boolean(fills && fills.length);
};
var { Fill, Slot } = (0, import_components.createSlotFill)(slotName);
var BackButton = Fill;
var BackButtonSlot = () => {
  const fills = (0, import_components.__experimentalUseSlotFills)(slotName);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    Slot,
    {
      bubblesVirtually: true,
      fillProps: { length: !fills ? 0 : fills.length }
    }
  );
};
BackButton.Slot = BackButtonSlot;
var back_button_default = BackButton;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useHasBackButton
});
//# sourceMappingURL=back-button.cjs.map
