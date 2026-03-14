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

// packages/editor/src/components/post-author/panel.js
var panel_exports = {};
__export(panel_exports, {
  PostAuthor: () => PostAuthor,
  default: () => panel_default
});
module.exports = __toCommonJS(panel_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_html_entities = require("@wordpress/html-entities");
var import_block_editor = require("@wordpress/block-editor");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_check = __toESM(require("./check.cjs"));
var import_index = __toESM(require("./index.cjs"));
var import_post_panel_row = __toESM(require("../post-panel-row/index.cjs"));
var import_constants = require("./constants.cjs");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function PostAuthorToggle({ isOpen, onClick }) {
  const { postAuthor } = (0, import_data.useSelect)((select) => {
    const id = select(import_store.store).getEditedPostAttribute("author");
    return {
      postAuthor: select(import_core_data.store).getUser(id, import_constants.BASE_QUERY)
    };
  }, []);
  const authorName = (0, import_html_entities.decodeEntities)(postAuthor?.name) || (0, import_i18n.__)("(No author)");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Button,
    {
      size: "compact",
      variant: "tertiary",
      "aria-expanded": isOpen,
      "aria-label": (
        // translators: %s: Author name.
        (0, import_i18n.sprintf)((0, import_i18n.__)("Change author: %s"), authorName)
      ),
      onClick,
      children: authorName
    }
  );
}
function PostAuthor() {
  const [popoverAnchor, setPopoverAnchor] = (0, import_element.useState)(null);
  const popoverProps = (0, import_element.useMemo)(
    () => ({
      // Anchor the popover to the middle of the entire row so that it doesn't
      // move around when the label changes.
      anchor: popoverAnchor,
      placement: "left-start",
      offset: 36,
      shift: true
    }),
    [popoverAnchor]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_check.default, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_panel_row.default, { label: (0, import_i18n.__)("Author"), ref: setPopoverAnchor, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Dropdown,
    {
      popoverProps,
      contentClassName: "editor-post-author__panel-dialog",
      focusOnMount: true,
      renderToggle: ({ isOpen, onToggle }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        PostAuthorToggle,
        {
          isOpen,
          onClick: onToggle
        }
      ),
      renderContent: ({ onClose }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "editor-post-author", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_block_editor.__experimentalInspectorPopoverHeader,
          {
            title: (0, import_i18n.__)("Author"),
            onClose
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_index.default, { onClose })
      ] })
    }
  ) }) });
}
var panel_default = PostAuthor;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PostAuthor
});
//# sourceMappingURL=panel.cjs.map
