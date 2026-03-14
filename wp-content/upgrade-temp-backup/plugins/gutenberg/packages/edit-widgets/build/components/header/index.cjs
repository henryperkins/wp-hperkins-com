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

// packages/edit-widgets/src/components/header/index.js
var header_exports = {};
__export(header_exports, {
  default: () => header_default
});
module.exports = __toCommonJS(header_exports);
var import_block_editor = require("@wordpress/block-editor");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_interface = require("@wordpress/interface");
var import_compose = require("@wordpress/compose");
var import_preferences = require("@wordpress/preferences");
var import_document_tools = __toESM(require("./document-tools/index.cjs"));
var import_save_button = __toESM(require("../save-button/index.cjs"));
var import_more_menu = __toESM(require("../more-menu/index.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function Header() {
  const isLargeViewport = (0, import_compose.useViewportMatch)("medium");
  const blockToolbarRef = (0, import_element.useRef)();
  const { hasFixedToolbar } = (0, import_data.useSelect)(
    (select) => ({
      hasFixedToolbar: !!select(import_preferences.store).get(
        "core/edit-widgets",
        "fixedToolbar"
      )
    }),
    []
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "edit-widgets-header", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "edit-widgets-header__navigable-toolbar-wrapper", children: [
      isLargeViewport && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { className: "edit-widgets-header__title", children: (0, import_i18n.__)("Widgets") }),
      !isLargeViewport && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.VisuallyHidden,
        {
          as: "h1",
          className: "edit-widgets-header__title",
          children: (0, import_i18n.__)("Widgets")
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_document_tools.default, {}),
      hasFixedToolbar && isLargeViewport && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "selected-block-tools-wrapper", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockToolbar, { hideDragHandle: true }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Popover.Slot,
          {
            ref: blockToolbarRef,
            name: "block-toolbar"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "edit-widgets-header__actions", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_interface.PinnedItems.Slot, { scope: "core/edit-widgets" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_save_button.default, {}),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_more_menu.default, {})
    ] })
  ] }) });
}
var header_default = Header;
//# sourceMappingURL=index.cjs.map
