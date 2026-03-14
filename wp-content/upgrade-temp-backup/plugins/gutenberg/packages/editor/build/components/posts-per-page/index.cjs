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

// packages/editor/src/components/posts-per-page/index.js
var posts_per_page_exports = {};
__export(posts_per_page_exports, {
  default: () => PostsPerPage
});
module.exports = __toCommonJS(posts_per_page_exports);
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_block_editor = require("@wordpress/block-editor");
var import_constants = require("../../store/constants.cjs");
var import_store = require("../../store/index.cjs");
var import_post_panel_row = __toESM(require("../post-panel-row/index.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function PostsPerPage() {
  const { editEntityRecord } = (0, import_data.useDispatch)(import_core_data.store);
  const { postsPerPage, isTemplate, postSlug } = (0, import_data.useSelect)((select) => {
    const { getEditedPostAttribute, getCurrentPostType } = select(import_store.store);
    const { getEditedEntityRecord, canUser } = select(import_core_data.store);
    const siteSettings = canUser("read", {
      kind: "root",
      name: "site"
    }) ? getEditedEntityRecord("root", "site") : void 0;
    return {
      isTemplate: getCurrentPostType() === import_constants.TEMPLATE_POST_TYPE,
      postSlug: getEditedPostAttribute("slug"),
      postsPerPage: siteSettings?.posts_per_page || 1
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
  if (!isTemplate || !["home", "index"].includes(postSlug)) {
    return null;
  }
  const setPostsPerPage = (newValue) => {
    editEntityRecord("root", "site", void 0, {
      posts_per_page: newValue
    });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_panel_row.default, { label: (0, import_i18n.__)("Posts per page"), ref: setPopoverAnchor, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Dropdown,
    {
      popoverProps,
      contentClassName: "editor-posts-per-page-dropdown__content",
      focusOnMount: true,
      renderToggle: ({ isOpen, onToggle }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.Button,
        {
          size: "compact",
          variant: "tertiary",
          "aria-expanded": isOpen,
          "aria-label": (0, import_i18n.__)("Change posts per page"),
          onClick: onToggle,
          children: postsPerPage
        }
      ),
      renderContent: ({ onClose }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_block_editor.__experimentalInspectorPopoverHeader,
          {
            title: (0, import_i18n.__)("Posts per page"),
            onClose
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.__experimentalNumberControl,
          {
            placeholder: 0,
            value: postsPerPage,
            size: "__unstable-large",
            spinControls: "custom",
            step: "1",
            min: "1",
            onChange: setPostsPerPage,
            label: (0, import_i18n.__)("Posts per page"),
            help: (0, import_i18n.__)(
              "Set the default number of posts to display on blog pages, including categories and tags. Some templates may override this setting."
            ),
            hideLabelFromVision: true
          }
        )
      ] })
    }
  ) });
}
//# sourceMappingURL=index.cjs.map
