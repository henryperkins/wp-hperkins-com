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

// packages/edit-site/src/components/site-editor-routes/styles.js
var styles_exports = {};
__export(styles_exports, {
  stylesRoute: () => stylesRoute
});
module.exports = __toCommonJS(styles_exports);
var import_router = require("@wordpress/router");
var import_editor = require("@wordpress/editor");
var import_url = require("@wordpress/url");
var import_editor2 = __toESM(require("../editor/index.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_sidebar_navigation_screen_global_styles = __toESM(require("../sidebar-navigation-screen-global-styles/index.cjs"));
var import_sidebar_global_styles = __toESM(require("../sidebar-global-styles/index.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var { useLocation, useHistory } = (0, import_lock_unlock.unlock)(import_router.privateApis);
var { StyleBookPreview } = (0, import_lock_unlock.unlock)(import_editor.privateApis);
function MobileGlobalStylesUI() {
  const { query = {} } = useLocation();
  const { canvas } = query;
  if (canvas === "edit") {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_editor2.default, {});
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_sidebar_global_styles.default, {});
}
function StylesPreviewArea() {
  const { path, query } = useLocation();
  const history = useHistory();
  const isStylebook = query.preview === "stylebook";
  const section = query.section ?? "/";
  const onChangeSection = (updatedSection) => {
    history.navigate(
      (0, import_url.addQueryArgs)(path, {
        section: updatedSection
      })
    );
  };
  if (isStylebook) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      StyleBookPreview,
      {
        path: section,
        onPathChange: onChangeSection
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_editor2.default, {});
}
var stylesRoute = {
  name: "styles",
  path: "/styles",
  areas: {
    content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_sidebar_global_styles.default, {}),
    sidebar: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_sidebar_navigation_screen_global_styles.default, { backPath: "/" }),
    preview: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StylesPreviewArea, {}),
    mobile: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileGlobalStylesUI, {})
  },
  widths: {
    content: 380
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  stylesRoute
});
//# sourceMappingURL=styles.cjs.map
