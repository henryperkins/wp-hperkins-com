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

// packages/editor/src/components/template-part-menu-items/index.js
var template_part_menu_items_exports = {};
__export(template_part_menu_items_exports, {
  default: () => TemplatePartMenuItems
});
module.exports = __toCommonJS(template_part_menu_items_exports);
var import_data = require("@wordpress/data");
var import_block_editor = require("@wordpress/block-editor");
var import_convert_to_regular = __toESM(require("./convert-to-regular.cjs"));
var import_convert_to_template_part = __toESM(require("./convert-to-template-part.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function TemplatePartMenuItems() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockSettingsMenuControls, { children: ({ selectedClientIds, onClose }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    TemplatePartConverterMenuItem,
    {
      clientIds: selectedClientIds,
      onClose
    }
  ) });
}
function TemplatePartConverterMenuItem({ clientIds, onClose }) {
  const { blocks } = (0, import_data.useSelect)(
    (select) => {
      const { getBlocksByClientId } = select(import_block_editor.store);
      return {
        blocks: getBlocksByClientId(clientIds)
      };
    },
    [clientIds]
  );
  if (blocks.length === 1 && blocks[0]?.name === "core/template-part") {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_convert_to_regular.default,
      {
        clientId: clientIds[0],
        onClose
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_convert_to_template_part.default, { clientIds, blocks });
}
//# sourceMappingURL=index.cjs.map
