var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/customize-widgets/src/components/inserter/index.js
var inserter_exports = {};
__export(inserter_exports, {
  default: () => inserter_default
});
module.exports = __toCommonJS(inserter_exports);
var import_i18n = require("@wordpress/i18n");
var import_block_editor = require("@wordpress/block-editor");
var import_components = require("@wordpress/components");
var import_compose = require("@wordpress/compose");
var import_data = require("@wordpress/data");
var import_icons = require("@wordpress/icons");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function Inserter({ setIsOpened }) {
  const inserterTitleId = (0, import_compose.useInstanceId)(
    Inserter,
    "customize-widget-layout__inserter-panel-title"
  );
  const insertionPoint = (0, import_data.useSelect)(
    (select) => select(import_store.store).__experimentalGetInsertionPoint(),
    []
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      className: "customize-widgets-layout__inserter-panel",
      "aria-labelledby": inserterTitleId,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "customize-widgets-layout__inserter-panel-header", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "h2",
            {
              id: inserterTitleId,
              className: "customize-widgets-layout__inserter-panel-header-title",
              children: (0, import_i18n.__)("Add a block")
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              size: "small",
              icon: import_icons.closeSmall,
              onClick: () => setIsOpened(false),
              "aria-label": (0, import_i18n.__)("Close inserter")
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "customize-widgets-layout__inserter-panel-content", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_block_editor.__experimentalLibrary,
          {
            rootClientId: insertionPoint.rootClientId,
            __experimentalInsertionIndex: insertionPoint.insertionIndex,
            showInserterHelpPanel: true,
            onSelect: () => setIsOpened(false)
          }
        ) })
      ]
    }
  );
}
var inserter_default = Inserter;
//# sourceMappingURL=index.cjs.map
