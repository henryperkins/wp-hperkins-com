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

// packages/fields/src/fields/order/index.ts
var order_exports = {};
__export(order_exports, {
  default: () => order_default
});
module.exports = __toCommonJS(order_exports);
var import_i18n = require("@wordpress/i18n");
var orderField = {
  id: "menu_order",
  type: "integer",
  label: (0, import_i18n.__)("Order"),
  description: (0, import_i18n.__)("Determines the order of pages."),
  filterBy: false,
  isValid: {
    required: true
  }
};
var order_default = orderField;
//# sourceMappingURL=index.cjs.map
