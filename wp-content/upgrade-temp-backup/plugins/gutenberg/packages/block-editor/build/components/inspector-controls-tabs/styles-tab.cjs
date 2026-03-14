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

// packages/block-editor/src/components/inspector-controls-tabs/styles-tab.js
var styles_tab_exports = {};
__export(styles_tab_exports, {
  default: () => styles_tab_default
});
module.exports = __toCommonJS(styles_tab_exports);
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_block_styles = __toESM(require("../block-styles/index.cjs"));
var import_inspector_controls = __toESM(require("../inspector-controls/index.cjs"));
var import_border = require("../../hooks/border.cjs");
var import_utils = require("../../hooks/utils.cjs");
var import_store = require("../../store/index.cjs");
var import_color = require("../../hooks/color.cjs");
var import_color_panel = require("../global-styles/color-panel.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function SectionBlockColorControls({
  blockName,
  clientId,
  contentClientIds
}) {
  const settings = (0, import_utils.useBlockSettings)(blockName);
  const { updateBlockAttributes } = (0, import_data.useDispatch)(import_store.store);
  const { hasButtons, hasHeading } = (0, import_data.useSelect)(
    (select) => {
      const blockNames = select(import_store.store).getBlockNamesByClientId(
        contentClientIds
      );
      return {
        hasButtons: blockNames.includes("core/buttons"),
        hasHeading: blockNames.includes("core/heading")
      };
    },
    [contentClientIds]
  );
  const setAttributes = (newAttributes) => {
    updateBlockAttributes(clientId, newAttributes);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_color.ColorEdit,
    {
      clientId,
      name: blockName,
      settings,
      setAttributes,
      asWrapper: import_color_panel.ColorToolsPanel,
      label: (0, import_i18n.__)("Color"),
      defaultControls: {
        text: true,
        background: true,
        button: hasButtons,
        heading: hasHeading
      }
    }
  );
}
var StylesTab = ({
  blockName,
  clientId,
  hasBlockStyles,
  isSectionBlock,
  contentClientIds
}) => {
  const borderPanelLabel = (0, import_border.useBorderPanelLabel)({ blockName });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    hasBlockStyles && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_styles.default, { clientId }),
    isSectionBlock && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      SectionBlockColorControls,
      {
        blockName,
        clientId,
        contentClientIds
      }
    ),
    !isSectionBlock && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_inspector_controls.default.Slot,
        {
          group: "color",
          label: (0, import_i18n.__)("Color"),
          className: "color-block-support-panel__inner-wrapper"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_inspector_controls.default.Slot,
        {
          group: "background",
          label: (0, import_i18n.__)("Background image")
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_inspector_controls.default.Slot, { group: "filter" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_inspector_controls.default.Slot,
        {
          group: "typography",
          label: (0, import_i18n.__)("Typography")
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_inspector_controls.default.Slot,
        {
          group: "dimensions",
          label: (0, import_i18n.__)("Dimensions")
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_inspector_controls.default.Slot,
        {
          group: "border",
          label: borderPanelLabel
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_inspector_controls.default.Slot, { group: "styles" })
    ] })
  ] });
};
var styles_tab_default = StylesTab;
//# sourceMappingURL=styles-tab.cjs.map
