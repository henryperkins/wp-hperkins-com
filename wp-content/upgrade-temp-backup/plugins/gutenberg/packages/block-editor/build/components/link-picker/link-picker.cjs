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

// packages/block-editor/src/components/link-picker/link-picker.js
var link_picker_exports = {};
__export(link_picker_exports, {
  LinkPicker: () => LinkPicker
});
module.exports = __toCommonJS(link_picker_exports);
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_link_control = __toESM(require("../link-control/index.cjs"));
var import_link_preview = require("./link-preview.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function LinkPicker({
  preview,
  onSelect,
  suggestionsQuery,
  label,
  help
}) {
  const [isOpen, setIsOpen] = (0, import_element.useState)(false);
  const instanceId = (0, import_element.useId)();
  const dialogTitleId = `link-picker-title-${instanceId}`;
  const dialogDescriptionId = `link-picker-description-${instanceId}`;
  const anchorRef = (0, import_element.useRef)(null);
  const { baseControlProps, controlProps } = (0, import_components.useBaseControlProps)({
    help
  });
  const handleChange = (newValue) => {
    setIsOpen(false);
    if (newValue) {
      const suggestion = {
        url: newValue.url,
        kind: newValue.kind,
        type: newValue.type,
        id: newValue.id,
        title: newValue.title
      };
      onSelect(suggestion);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.BaseControl, { ...baseControlProps, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.BaseControl.VisualLabel, { children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      import_components.Button,
      {
        ref: anchorRef,
        onClick: () => setIsOpen(!isOpen),
        "aria-haspopup": "dialog",
        "aria-expanded": isOpen,
        "aria-describedby": controlProps["aria-describedby"],
        variant: "secondary",
        __next40pxDefaultSize: true,
        className: "link-preview-button",
        children: [
          label && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.VisuallyHidden, { children: [
            label,
            ":"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_link_preview.LinkPreview,
            {
              title: preview.title || (0, import_i18n.__)("Add link"),
              url: preview.url,
              image: preview.image,
              badges: preview.badges
            }
          )
        ]
      }
    ),
    isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Popover,
      {
        anchor: anchorRef.current,
        onClose: () => setIsOpen(false),
        placement: "left-start",
        offset: 36,
        shift: true,
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "div",
          {
            role: "dialog",
            "aria-labelledby": dialogTitleId,
            "aria-describedby": dialogDescriptionId,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.VisuallyHidden, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { id: dialogTitleId, children: (0, import_i18n.__)("Select a link") }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { id: dialogDescriptionId, children: (0, import_i18n.__)(
                  "Search for and add a link to the navigation item."
                ) })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_link_control.default,
                {
                  value: null,
                  onChange: handleChange,
                  suggestionsQuery,
                  showInitialSuggestions: true,
                  forceIsEditingLink: true,
                  settings: []
                }
              )
            ]
          }
        )
      }
    )
  ] });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LinkPicker
});
//# sourceMappingURL=link-picker.cjs.map
