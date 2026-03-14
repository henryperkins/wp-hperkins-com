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

// packages/editor/src/components/post-url/panel.js
var panel_exports = {};
__export(panel_exports, {
  default: () => PostURLPanel
});
module.exports = __toCommonJS(panel_exports);
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_url = require("@wordpress/url");
var import_core_data = require("@wordpress/core-data");
var import_check = __toESM(require("./check.cjs"));
var import_index = __toESM(require("./index.cjs"));
var import_post_panel_row = __toESM(require("../post-panel-row/index.cjs"));
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function PostURLPanel() {
  const { isFrontPage } = (0, import_data.useSelect)((select) => {
    const { getCurrentPostId } = select(import_store.store);
    const { getEditedEntityRecord, canUser } = select(import_core_data.store);
    const siteSettings = canUser("read", {
      kind: "root",
      name: "site"
    }) ? getEditedEntityRecord("root", "site") : void 0;
    const _id = getCurrentPostId();
    return {
      isFrontPage: siteSettings?.page_on_front === _id
    };
  }, []);
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
  const label = isFrontPage ? (0, import_i18n.__)("Link") : (0, import_i18n.__)("Slug");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_check.default, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_post_panel_row.default, { label, ref: setPopoverAnchor, children: [
    !isFrontPage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Dropdown,
      {
        popoverProps,
        className: "editor-post-url__panel-dropdown",
        contentClassName: "editor-post-url__panel-dialog",
        focusOnMount: true,
        renderToggle: ({ isOpen, onToggle }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          PostURLToggle,
          {
            isOpen,
            onClick: onToggle
          }
        ),
        renderContent: ({ onClose }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_index.default, { onClose })
      }
    ),
    isFrontPage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FrontPageLink, {})
  ] }) });
}
function PostURLToggle({ isOpen, onClick }) {
  const { slug } = (0, import_data.useSelect)((select) => {
    return {
      slug: select(import_store.store).getEditedPostSlug()
    };
  }, []);
  const decodedSlug = (0, import_url.safeDecodeURIComponent)(slug);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Button,
    {
      size: "compact",
      className: "editor-post-url__panel-toggle",
      variant: "tertiary",
      "aria-expanded": isOpen,
      "aria-label": (
        // translators: %s: Current post link.
        (0, import_i18n.sprintf)((0, import_i18n.__)("Change link: %s"), decodedSlug)
      ),
      onClick,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: decodedSlug })
    }
  );
}
function FrontPageLink() {
  const { postLink } = (0, import_data.useSelect)((select) => {
    const { getCurrentPost } = select(import_store.store);
    return {
      postLink: getCurrentPost()?.link
    };
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.ExternalLink,
    {
      className: "editor-post-url__front-page-link",
      href: postLink,
      target: "_blank",
      children: postLink
    }
  );
}
//# sourceMappingURL=panel.cjs.map
