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

// packages/edit-site/src/components/page-patterns/fields.js
var fields_exports = {};
__export(fields_exports, {
  patternStatusField: () => patternStatusField,
  previewField: () => previewField,
  templatePartAuthorField: () => templatePartAuthorField
});
module.exports = __toCommonJS(fields_exports);
var import_clsx = __toESM(require("clsx"));
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_block_editor = require("@wordpress/block-editor");
var import_icons = require("@wordpress/icons");
var import_blocks = require("@wordpress/blocks");
var import_editor = require("@wordpress/editor");
var import_constants = require("../../utils/constants.cjs");
var import_hooks = require("../page-templates/hooks.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { useStyle } = (0, import_lock_unlock.unlock)(import_editor.privateApis);
function PreviewField({ item }) {
  const descriptionId = (0, import_element.useId)();
  const description = item.description || item?.excerpt?.raw;
  const isTemplatePart = item.type === import_constants.TEMPLATE_PART_POST_TYPE;
  const backgroundColor = useStyle("color.background");
  const blocks = (0, import_element.useMemo)(() => {
    return item.blocks ?? (0, import_blocks.parse)(item.content.raw, {
      __unstableSkipMigrationLogs: true
    });
  }, [item?.content?.raw, item.blocks]);
  const isEmpty = !blocks?.length;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      className: "page-patterns-preview-field",
      style: { backgroundColor },
      "aria-describedby": !!description ? descriptionId : void 0,
      children: [
        isEmpty && isTemplatePart && (0, import_i18n.__)("Empty template part"),
        isEmpty && !isTemplatePart && (0, import_i18n.__)("Empty pattern"),
        !isEmpty && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockPreview.Async, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_block_editor.BlockPreview,
          {
            blocks,
            viewportWidth: item.viewportWidth
          }
        ) }),
        !!description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { hidden: true, id: descriptionId, children: description })
      ]
    }
  );
}
var previewField = {
  label: (0, import_i18n.__)("Preview"),
  id: "preview",
  render: PreviewField,
  enableSorting: false
};
var SYNC_FILTERS = [
  {
    value: import_constants.PATTERN_SYNC_TYPES.full,
    label: (0, import_i18n._x)("Synced", "pattern (singular)"),
    description: (0, import_i18n.__)("Patterns that are kept in sync across the site.")
  },
  {
    value: import_constants.PATTERN_SYNC_TYPES.unsynced,
    label: (0, import_i18n._x)("Not synced", "pattern (singular)"),
    description: (0, import_i18n.__)(
      "Patterns that can be changed freely without affecting the site."
    )
  }
];
var patternStatusField = {
  label: (0, import_i18n.__)("Sync status"),
  id: "sync-status",
  render: ({ item }) => {
    const syncStatus = "wp_pattern_sync_status" in item ? item.wp_pattern_sync_status || import_constants.PATTERN_SYNC_TYPES.full : import_constants.PATTERN_SYNC_TYPES.unsynced;
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "span",
      {
        className: `edit-site-patterns__field-sync-status-${syncStatus}`,
        children: SYNC_FILTERS.find(({ value }) => value === syncStatus).label
      }
    );
  },
  elements: SYNC_FILTERS,
  filterBy: {
    operators: [import_constants.OPERATOR_IS],
    isPrimary: true
  },
  enableSorting: false
};
function AuthorField({ item }) {
  const [isImageLoaded, setIsImageLoaded] = (0, import_element.useState)(false);
  const { text, icon, imageUrl } = (0, import_hooks.useAddedBy)(item.type, item.id);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { alignment: "left", spacing: 0, children: [
    imageUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "div",
      {
        className: (0, import_clsx.default)("fields-controls__author-avatar", {
          "is-loaded": isImageLoaded
        }),
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "img",
          {
            onLoad: () => setIsImageLoaded(true),
            alt: "",
            src: imageUrl
          }
        )
      }
    ),
    !imageUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fields-controls__author-icon", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_icons.Icon, { icon }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "fields-controls__author-name", children: text })
  ] });
}
var templatePartAuthorField = {
  label: (0, import_i18n.__)("Author"),
  id: "author",
  getValue: ({ item }) => item.author_text,
  render: AuthorField,
  filterBy: {
    isPrimary: true
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  patternStatusField,
  previewField,
  templatePartAuthorField
});
//# sourceMappingURL=fields.cjs.map
