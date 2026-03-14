"use strict";
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

// packages/block-editor/src/components/block-toolbar/pattern-overrides-dropdown.js
var pattern_overrides_dropdown_exports = {};
__export(pattern_overrides_dropdown_exports, {
  default: () => PatternOverridesDropdown
});
module.exports = __toCommonJS(pattern_overrides_dropdown_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function PatternOverridesPopoverContent({ clientIds, blockTitle }) {
  const blockMetaName = (0, import_data.useSelect)(
    (select) => {
      const { getBlockAttributes } = select(import_store.store);
      return getBlockAttributes(clientIds?.[0])?.metadata?.name;
    },
    [clientIds]
  );
  const isSingleBlock = clientIds.length === 1;
  let description;
  if (isSingleBlock && blockMetaName) {
    description = (0, import_i18n.sprintf)(
      /* translators: 1: The block type's name. 2: The block's user-provided name (the same as the override name). */
      (0, import_i18n.__)('This %1$s is editable using the "%2$s" override.'),
      blockTitle.toLowerCase(),
      blockMetaName
    );
  } else {
    description = (0, import_i18n.__)("These blocks are editable using overrides.");
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { children: description });
}
function PatternOverridesDropdown({
  icon,
  clientIds,
  blockTitle,
  label
}) {
  const [isOpen, setIsOpen] = (0, import_element.useState)(false);
  const anchorRef = (0, import_element.useRef)();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.ToolbarButton,
      {
        ref: anchorRef,
        className: "block-editor-block-toolbar__pattern-overrides-indicator",
        icon,
        label,
        onClick: () => setIsOpen(!isOpen),
        "aria-expanded": isOpen
      }
    ),
    isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Popover,
      {
        anchor: anchorRef.current,
        onClose: () => setIsOpen(false),
        placement: "bottom-start",
        offset: 16,
        className: "block-editor-block-toolbar__pattern-overrides-popover",
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          PatternOverridesPopoverContent,
          {
            clientIds,
            blockTitle
          }
        )
      }
    )
  ] });
}
//# sourceMappingURL=pattern-overrides-dropdown.cjs.map
