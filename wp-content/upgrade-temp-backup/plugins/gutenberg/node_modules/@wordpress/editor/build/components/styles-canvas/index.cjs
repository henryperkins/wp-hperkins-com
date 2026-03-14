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

// packages/editor/src/components/styles-canvas/index.js
var styles_canvas_exports = {};
__export(styles_canvas_exports, {
  default: () => StylesCanvas,
  getStylesCanvasTitle: () => getStylesCanvasTitle
});
module.exports = __toCommonJS(styles_canvas_exports);
var import_components = require("@wordpress/components");
var import_keycodes = require("@wordpress/keycodes");
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_icons = require("@wordpress/icons");
var import_compose = require("@wordpress/compose");
var import_preferences = require("@wordpress/preferences");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_style_book = __toESM(require("./style-book.cjs"));
var import_revisions = __toESM(require("./revisions.cjs"));
var import_store = require("../../store/index.cjs");
var import_resizable_editor = __toESM(require("../resizable-editor/index.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function getStylesCanvasTitle(path, showStylebook) {
  if (showStylebook) {
    return (0, import_i18n.__)("Style Book");
  }
  if (path?.startsWith("/revisions")) {
    return (0, import_i18n.__)("Style Revisions");
  }
  return "";
}
function StylesCanvas() {
  const { stylesPath, showStylebook, showListViewByDefault } = (0, import_data.useSelect)(
    (select) => {
      const { getStylesPath, getShowStylebook } = (0, import_lock_unlock.unlock)(
        select(import_store.store)
      );
      const _showListViewByDefault = select(import_preferences.store).get(
        "core",
        "showListViewByDefault"
      );
      return {
        stylesPath: getStylesPath(),
        showStylebook: getShowStylebook(),
        showListViewByDefault: _showListViewByDefault
      };
    },
    []
  );
  const { resetStylesNavigation, setStylesPath } = (0, import_lock_unlock.unlock)(
    (0, import_data.useDispatch)(import_store.store)
  );
  const { setIsListViewOpened } = (0, import_data.useDispatch)(import_store.store);
  const focusOnMountRef = (0, import_compose.useFocusOnMount)("firstElement");
  const sectionFocusReturnRef = (0, import_compose.useFocusReturn)();
  let content = null;
  if (showStylebook) {
    content = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_style_book.default,
      {
        path: stylesPath,
        onPathChange: setStylesPath,
        ref: sectionFocusReturnRef
      }
    );
  } else if (stylesPath?.startsWith("/revisions")) {
    content = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_revisions.default,
      {
        path: stylesPath,
        ref: sectionFocusReturnRef
      }
    );
  }
  const title = getStylesCanvasTitle(stylesPath, showStylebook);
  const onCloseCanvas = () => {
    setIsListViewOpened(showListViewByDefault);
    resetStylesNavigation();
  };
  const closeOnEscape = (event) => {
    if (event.keyCode === import_keycodes.ESCAPE && !event.defaultPrevented) {
      event.preventDefault();
      onCloseCanvas();
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "editor-styles-canvas", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_resizable_editor.default, { enableResizing: false, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "section",
    {
      className: "editor-styles-canvas__section",
      ref: focusOnMountRef,
      onKeyDown: closeOnEscape,
      "aria-label": title,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            size: "compact",
            className: "editor-styles-canvas__close-button",
            icon: import_icons.closeSmall,
            label: (0, import_i18n.__)("Close"),
            onClick: onCloseCanvas
          }
        ),
        content
      ]
    }
  ) }) });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getStylesCanvasTitle
});
//# sourceMappingURL=index.cjs.map
