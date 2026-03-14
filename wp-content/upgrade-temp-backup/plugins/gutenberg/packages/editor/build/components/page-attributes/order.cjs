"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/components/page-attributes/order.js
var order_exports = {};
__export(order_exports, {
  default: () => PageAttributesOrderWithChecks
});
module.exports = __toCommonJS(order_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_post_type_support_check = __toESM(require("../post-type-support-check/index.cjs"));
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function PageAttributesOrder() {
  const order = (0, import_data.useSelect)(
    (select) => select(import_store.store).getEditedPostAttribute("menu_order") ?? 0,
    []
  );
  const { editPost } = (0, import_data.useDispatch)(import_store.store);
  const [orderInput, setOrderInput] = (0, import_element.useState)(null);
  const setUpdatedOrder = (value2) => {
    setOrderInput(value2);
    const newOrder = Number(value2);
    if (Number.isInteger(newOrder) && value2.trim?.() !== "") {
      editPost({ menu_order: newOrder });
    }
  };
  const value = orderInput ?? order;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Flex, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexBlock, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.__experimentalNumberControl,
    {
      __next40pxDefaultSize: true,
      label: (0, import_i18n.__)("Order"),
      help: (0, import_i18n.__)("Set the page order."),
      value,
      onChange: setUpdatedOrder,
      hideLabelFromVision: true,
      onBlur: () => {
        setOrderInput(null);
      }
    }
  ) }) });
}
function PageAttributesOrderWithChecks() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_type_support_check.default, { supportKeys: "page-attributes", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageAttributesOrder, {}) });
}
//# sourceMappingURL=order.cjs.map
