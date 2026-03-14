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

// packages/block-editor/src/components/inserter/media-tab/media-tab.js
var media_tab_exports = {};
__export(media_tab_exports, {
  default: () => media_tab_default
});
module.exports = __toCommonJS(media_tab_exports);
var import_i18n = require("@wordpress/i18n");
var import_compose = require("@wordpress/compose");
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_media_panel = require("./media-panel.cjs");
var import_check = __toESM(require("../../media-upload/check.cjs"));
var import_media_upload = __toESM(require("../../media-upload/index.cjs"));
var import_hooks = require("./hooks.cjs");
var import_utils = require("./utils.cjs");
var import_mobile_tab_navigation = __toESM(require("../mobile-tab-navigation.cjs"));
var import_category_tabs = __toESM(require("../category-tabs/index.cjs"));
var import_no_results = __toESM(require("../no-results.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var ALLOWED_MEDIA_TYPES = ["image", "video", "audio"];
function MediaTab({
  rootClientId,
  selectedCategory,
  onSelectCategory,
  onInsert,
  children
}) {
  const mediaCategories = (0, import_hooks.useMediaCategories)(rootClientId);
  const isMobile = (0, import_compose.useViewportMatch)("medium", "<");
  const baseCssClass = "block-editor-inserter__media-tabs";
  const onSelectMedia = (0, import_element.useCallback)(
    (media) => {
      if (!media?.url) {
        return;
      }
      const mediaType = window.__experimentalDataViewsMediaModal && media.mime_type ? media.mime_type.split("/")[0] : media.type;
      const [block] = (0, import_utils.getBlockAndPreviewFromMedia)(media, mediaType);
      onInsert(block);
    },
    [onInsert]
  );
  const categories = (0, import_element.useMemo)(
    () => mediaCategories.map((mediaCategory) => ({
      ...mediaCategory,
      label: mediaCategory.labels.name
    })),
    [mediaCategories]
  );
  if (!categories.length) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_no_results.default, {});
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    !isMobile && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: `${baseCssClass}-container`, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_category_tabs.default,
        {
          categories,
          selectedCategory,
          onSelectCategory,
          children
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_check.default, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_media_upload.default,
        {
          multiple: false,
          onSelect: onSelectMedia,
          allowedTypes: ALLOWED_MEDIA_TYPES,
          render: ({ open }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              __next40pxDefaultSize: true,
              onClick: (event) => {
                event.target.focus();
                open();
              },
              className: "block-editor-inserter__media-library-button",
              variant: "secondary",
              "data-unstable-ignore-focus-outside-for-relatedtarget": ".media-modal",
              children: (0, import_i18n.__)("Open Media Library")
            }
          )
        }
      ) })
    ] }),
    isMobile && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_mobile_tab_navigation.default, { categories, children: (category) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_media_panel.MediaCategoryPanel,
      {
        onInsert,
        rootClientId,
        category
      }
    ) })
  ] });
}
var media_tab_default = MediaTab;
//# sourceMappingURL=media-tab.cjs.map
