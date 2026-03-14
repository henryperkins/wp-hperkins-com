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

// packages/edit-site/src/components/block-editor/use-editor-iframe-props.js
var use_editor_iframe_props_exports = {};
__export(use_editor_iframe_props_exports, {
  default: () => useEditorIframeProps
});
module.exports = __toCommonJS(use_editor_iframe_props_exports);
var import_clsx = __toESM(require("clsx"));
var import_data = require("@wordpress/data");
var import_keycodes = require("@wordpress/keycodes");
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_editor = require("@wordpress/editor");
var import_router = require("@wordpress/router");
var import_url = require("@wordpress/url");
var import_lock_unlock = require("../../lock-unlock.cjs");
var { useLocation, useHistory } = (0, import_lock_unlock.unlock)(import_router.privateApis);
function useEditorIframeProps() {
  const { query, path } = useLocation();
  const history = useHistory();
  const { canvas = "view" } = query;
  const currentPostIsTrashed = (0, import_data.useSelect)((select) => {
    return select(import_editor.store).getCurrentPostAttribute("status") === "trash";
  }, []);
  const [isFocused, setIsFocused] = (0, import_element.useState)(false);
  (0, import_element.useEffect)(() => {
    if (canvas === "edit") {
      setIsFocused(false);
    }
  }, [canvas]);
  const viewModeIframeProps = {
    "aria-label": (0, import_i18n.__)("Edit"),
    "aria-disabled": currentPostIsTrashed,
    title: null,
    role: "button",
    tabIndex: 0,
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    onKeyDown: (event) => {
      const { keyCode } = event;
      if ((keyCode === import_keycodes.ENTER || keyCode === import_keycodes.SPACE) && !currentPostIsTrashed) {
        event.preventDefault();
        history.navigate((0, import_url.addQueryArgs)(path, { canvas: "edit" }), {
          transition: "canvas-mode-edit-transition"
        });
      }
    },
    onClick: () => history.navigate((0, import_url.addQueryArgs)(path, { canvas: "edit" }), {
      transition: "canvas-mode-edit-transition"
    }),
    onClickCapture: (event) => {
      if (currentPostIsTrashed) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    readonly: true
  };
  return {
    className: (0, import_clsx.default)("edit-site-visual-editor__editor-canvas", {
      "is-focused": isFocused && canvas === "view"
    }),
    ...canvas === "view" ? viewModeIframeProps : {}
  };
}
//# sourceMappingURL=use-editor-iframe-props.cjs.map
