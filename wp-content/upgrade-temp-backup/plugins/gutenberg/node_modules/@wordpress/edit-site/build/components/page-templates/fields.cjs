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

// packages/edit-site/src/components/page-templates/fields.js
var fields_exports = {};
__export(fields_exports, {
  activeField: () => activeField,
  authorField: () => authorField,
  descriptionField: () => descriptionField,
  previewField: () => previewField,
  slugField: () => slugField,
  useThemeField: () => useThemeField
});
module.exports = __toCommonJS(fields_exports);
var import_clsx = __toESM(require("clsx"));
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_html_entities = require("@wordpress/html-entities");
var import_blocks = require("@wordpress/blocks");
var import_block_editor = require("@wordpress/block-editor");
var import_editor = require("@wordpress/editor");
var import_core_data = require("@wordpress/core-data");
var import_data = require("@wordpress/data");
var import_hooks = require("./hooks.cjs");
var import_utils = require("../add-new-template/utils.cjs");
var import_use_pattern_settings = __toESM(require("../page-patterns/use-pattern-settings.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { Badge } = (0, import_lock_unlock.unlock)(import_components.privateApis);
var { useEntityRecordsWithPermissions } = (0, import_lock_unlock.unlock)(import_core_data.privateApis);
var { useStyle } = (0, import_lock_unlock.unlock)(import_editor.privateApis);
function useAllDefaultTemplateTypes() {
  const defaultTemplateTypes = (0, import_utils.useDefaultTemplateTypes)();
  const { records: staticRecords } = useEntityRecordsWithPermissions(
    "root",
    "registeredTemplate"
  );
  return [
    ...defaultTemplateTypes,
    ...staticRecords?.filter((record) => !record.is_custom).map((record) => {
      return {
        slug: record.slug,
        title: record.title.rendered,
        description: record.description
      };
    })
  ];
}
function PreviewField({ item }) {
  const settings = (0, import_use_pattern_settings.default)();
  const backgroundColor = useStyle("color.background") ?? "white";
  const blocks = (0, import_element.useMemo)(() => {
    return (0, import_blocks.parse)(item.content.raw);
  }, [item.content.raw]);
  const isEmpty = !blocks?.length;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_editor.EditorProvider, { post: item, settings, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      className: "page-templates-preview-field",
      style: { backgroundColor },
      children: [
        isEmpty && (0, import_i18n.__)("Empty template"),
        !isEmpty && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockPreview.Async, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockPreview, { blocks }) })
      ]
    }
  ) });
}
var previewField = {
  label: (0, import_i18n.__)("Preview"),
  id: "preview",
  render: PreviewField,
  enableSorting: false
};
var descriptionField = {
  label: (0, import_i18n.__)("Description"),
  id: "description",
  render: window?.__experimentalTemplateActivate ? function RenderDescription({ item }) {
    const defaultTemplateTypes = useAllDefaultTemplateTypes();
    const defaultTemplateType = defaultTemplateTypes.find(
      (type) => type.slug === item.slug
    );
    return item.description ? (0, import_html_entities.decodeEntities)(item.description) : defaultTemplateType?.description;
  } : ({ item }) => {
    return item.description && (0, import_html_entities.decodeEntities)(item.description);
  },
  enableSorting: false,
  enableGlobalSearch: true
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
    !imageUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fields-controls__author-icon", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Icon, { icon }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "fields-controls__author-name", children: text })
  ] });
}
var authorField = {
  label: (0, import_i18n.__)("Author"),
  id: "author",
  getValue: ({ item }) => item.author_text ?? item.author,
  render: AuthorField
};
var activeField = {
  label: (0, import_i18n.__)("Status"),
  id: "active",
  type: "boolean",
  getValue: ({ item }) => item._isActive,
  render: function Render({ item }) {
    const activeLabel = item._isCustom ? (0, import_i18n._x)("Active when used", "template") : (0, import_i18n._x)("Active", "template");
    const activeIntent = item._isCustom ? "info" : "success";
    const isActive = item._isActive;
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { intent: isActive ? activeIntent : "default", children: isActive ? activeLabel : (0, import_i18n._x)("Inactive", "template") });
  }
};
var useThemeField = () => {
  const activeTheme = (0, import_data.useSelect)(
    (select) => select(import_core_data.store).getCurrentTheme()
  );
  return (0, import_element.useMemo)(
    () => ({
      label: (0, import_i18n.__)("Compatible Theme"),
      id: "theme",
      getValue: ({ item }) => item.theme,
      render: function Render3({ item }) {
        if (item.theme === activeTheme.stylesheet) {
          return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { intent: "success", children: item.theme });
        }
        return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { intent: "error", children: item.theme });
      }
    }),
    [activeTheme]
  );
};
var slugField = {
  label: (0, import_i18n.__)("Template Type"),
  id: "slug",
  getValue: ({ item }) => item.slug,
  render: function Render2({ item }) {
    const defaultTemplateTypes = useAllDefaultTemplateTypes();
    const defaultTemplateType = defaultTemplateTypes.find(
      (type) => type.slug === item.slug
    );
    return defaultTemplateType?.title || (0, import_i18n._x)("Custom", "template type");
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activeField,
  authorField,
  descriptionField,
  previewField,
  slugField,
  useThemeField
});
//# sourceMappingURL=fields.cjs.map
