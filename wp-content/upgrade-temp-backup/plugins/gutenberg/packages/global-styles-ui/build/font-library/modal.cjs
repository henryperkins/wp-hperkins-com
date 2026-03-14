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

// packages/global-styles-ui/src/font-library/modal.tsx
var modal_exports = {};
__export(modal_exports, {
  default: () => modal_default
});
module.exports = __toCommonJS(modal_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_core_data = require("@wordpress/core-data");
var import_data = require("@wordpress/data");
var import_installed_fonts = __toESM(require("./installed-fonts.cjs"));
var import_font_collection = __toESM(require("./font-collection.cjs"));
var import_upload_fonts = __toESM(require("./upload-fonts.cjs"));
var import_lock_unlock = require("../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { Tabs } = (0, import_lock_unlock.unlock)(import_components.privateApis);
var DEFAULT_TAB = {
  id: "installed-fonts",
  title: (0, import_i18n._x)("Library", "Font library")
};
var UPLOAD_TAB = {
  id: "upload-fonts",
  title: (0, import_i18n._x)("Upload", "noun")
};
var tabsFromCollections = (collections) => collections.map(({ slug, name }) => ({
  id: slug,
  title: collections.length === 1 && slug === "google-fonts" ? (0, import_i18n.__)("Install Fonts") : name
}));
function FontLibraryModal({
  onRequestClose,
  defaultTabId = "installed-fonts"
}) {
  const { records: collections = [] } = (0, import_core_data.useEntityRecords)("root", "fontCollection", {
    _fields: "slug,name,description"
  });
  const canUserCreate = (0, import_data.useSelect)((select) => {
    return select(import_core_data.store).canUser("create", {
      kind: "postType",
      name: "wp_font_family"
    });
  }, []);
  const tabs = [DEFAULT_TAB];
  if (canUserCreate) {
    tabs.push(UPLOAD_TAB);
    tabs.push(...tabsFromCollections(collections || []));
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Modal,
    {
      title: (0, import_i18n.__)("Fonts"),
      onRequestClose,
      isFullScreen: true,
      className: "font-library-modal",
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, { defaultTabId, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "font-library-modal__tablist-container", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs.TabList, { children: tabs.map(({ id, title }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs.Tab, { tabId: id, children: title }, id)) }) }),
        tabs.map(({ id }) => {
          let contents;
          switch (id) {
            case "upload-fonts":
              contents = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_upload_fonts.default, {});
              break;
            case "installed-fonts":
              contents = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_installed_fonts.default, {});
              break;
            default:
              contents = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_font_collection.default, { slug: id });
          }
          return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            Tabs.TabPanel,
            {
              tabId: id,
              focusable: false,
              className: "font-library-modal__tab-panel",
              children: contents
            },
            id
          );
        })
      ] })
    }
  );
}
var modal_default = FontLibraryModal;
//# sourceMappingURL=modal.cjs.map
