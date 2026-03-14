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

// packages/block-library/src/icon/components/custom-inserter/index.js
var custom_inserter_exports = {};
__export(custom_inserter_exports, {
  default: () => CustomInserterModal
});
module.exports = __toCommonJS(custom_inserter_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_compose = require("@wordpress/compose");
var import_icon_grid = __toESM(require("./icon-grid.cjs"));
var import_search_patterns = require("../../../utils/search-patterns.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function CustomInserterModal({
  icons = [],
  setInserterOpen,
  attributes,
  setAttributes
}) {
  const [searchInput, setSearchInput] = (0, import_element.useState)("");
  const debouncedSetSearchInput = (0, import_compose.useDebounce)(setSearchInput, 300);
  const setIcon = (0, import_element.useCallback)(
    (name) => {
      setAttributes({
        icon: name
      });
      setInserterOpen(false);
    },
    [setAttributes, setInserterOpen]
  );
  const filteredIcons = (0, import_element.useMemo)(() => {
    if (searchInput) {
      const input = (0, import_search_patterns.normalizeSearchInput)(searchInput);
      return icons.filter((icon) => {
        const iconName = (0, import_search_patterns.normalizeSearchInput)(icon.name);
        const iconLabel = (0, import_search_patterns.normalizeSearchInput)(icon.label);
        return iconName.includes(input) || iconLabel.includes(input);
      });
    }
    return icons;
  }, [searchInput, icons]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Modal,
    {
      className: "wp-block-icon__inserter-modal",
      title: (0, import_i18n.__)("Icon library"),
      onRequestClose: () => setInserterOpen(false),
      isFullScreen: true,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "wp-block-icon__inserter", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "wp-block-icon__inserter-header", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.SearchControl,
          {
            value: searchInput,
            onChange: debouncedSetSearchInput
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_icon_grid.default,
          {
            icons: filteredIcons,
            onChange: setIcon,
            attributes
          }
        )
      ] })
    }
  );
}
//# sourceMappingURL=index.cjs.map
