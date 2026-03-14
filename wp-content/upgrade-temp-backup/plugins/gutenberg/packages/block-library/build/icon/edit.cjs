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

// packages/block-library/src/icon/edit.js
var edit_exports = {};
__export(edit_exports, {
  Edit: () => Edit,
  default: () => edit_default
});
module.exports = __toCommonJS(edit_exports);
var import_clsx = __toESM(require("clsx"));
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_block_editor = require("@wordpress/block-editor");
var import_element = require("@wordpress/element");
var import_primitives = require("@wordpress/primitives");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_hooks = require("../utils/hooks.cjs");
var import_html_renderer = __toESM(require("../utils/html-renderer.cjs"));
var import_components2 = require("./components/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var IconPlaceholder = ({ className, style }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
  import_primitives.SVG,
  {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 60 60",
    preserveAspectRatio: "none",
    fill: "none",
    "aria-hidden": "true",
    className: (0, import_clsx.default)("wp-block-icon__placeholder", className),
    style,
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_primitives.Rect, { width: "60", height: "60", fill: "currentColor", fillOpacity: 0.1 }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_primitives.Path,
        {
          vectorEffect: "non-scaling-stroke",
          stroke: "currentColor",
          strokeOpacity: 0.25,
          d: "M60 60 0 0"
        }
      )
    ]
  }
);
function Edit({ attributes, setAttributes }) {
  const { icon, ariaLabel } = attributes;
  const [isInserterOpen, setInserterOpen] = (0, import_element.useState)(false);
  const isContentOnlyMode = (0, import_block_editor.useBlockEditingMode)() === "contentOnly";
  const colorProps = (0, import_block_editor.__experimentalUseColorProps)(attributes);
  const spacingProps = (0, import_block_editor.__experimentalGetSpacingClassesAndStyles)(attributes);
  const borderProps = (0, import_block_editor.__experimentalUseBorderProps)(attributes);
  const dimensionsProps = (0, import_block_editor.getDimensionsClassesAndStyles)(attributes);
  const { selectedIcon, allIcons = [] } = (0, import_data.useSelect)(
    (select) => {
      const { getEntityRecord, getEntityRecords } = select(import_core_data.store);
      return {
        selectedIcon: icon ? getEntityRecord("root", "icon", icon) : null,
        allIcons: isInserterOpen ? getEntityRecords("root", "icon", {
          per_page: -1
        }) : void 0
      };
    },
    [isInserterOpen, icon]
  );
  const iconToDisplay = selectedIcon?.content || "";
  const blockControls = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockControls, { group: isContentOnlyMode ? "inline" : "other", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.ToolbarButton,
      {
        onClick: () => {
          setInserterOpen(true);
        },
        children: icon ? (0, import_i18n.__)("Replace") : (0, import_i18n.__)("Choose icon")
      }
    ) }),
    isContentOnlyMode && icon && // Add some extra controls for content attributes when content only mode is active.
    // With content only mode active, the inspector is hidden, so users need another way
    // to edit these attributes.
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockControls, { group: "other", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.ToolbarGroup, { className: "components-toolbar-group", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.DropdownMenu,
      {
        icon: "",
        popoverProps: {
          className: "is-alternate"
        },
        text: (0, import_i18n.__)("Label"),
        children: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.TextControl,
          {
            className: "wp-block-icon__toolbar-content",
            label: (0, import_i18n.__)("Label"),
            value: ariaLabel || "",
            onChange: (value) => setAttributes({ ariaLabel: value }),
            help: (0, import_i18n.__)(
              "Briefly describe the icon to help screen reader users. Leave blank for decorative icons."
            ),
            __next40pxDefaultSize: true
          }
        )
      }
    ) }) })
  ] });
  const dropdownMenuProps = (0, import_hooks.useToolsPanelDropdownMenuProps)();
  const inspectorControls = icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.InspectorControls, { group: "settings", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.__experimentalToolsPanel,
    {
      label: (0, import_i18n.__)("Settings"),
      resetAll: () => setAttributes({
        ariaLabel: void 0
      }),
      dropdownMenuProps,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.__experimentalToolsPanelItem,
        {
          label: (0, import_i18n.__)("Label"),
          isShownByDefault: true,
          hasValue: () => !!ariaLabel,
          onDeselect: () => setAttributes({ ariaLabel: void 0 }),
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.TextControl,
            {
              label: (0, import_i18n.__)("Label"),
              help: (0, import_i18n.__)(
                "Briefly describe the icon to help screen reader users. Leave blank for decorative icons."
              ),
              value: ariaLabel || "",
              onChange: (value) => setAttributes({ ariaLabel: value }),
              __next40pxDefaultSize: true
            }
          )
        }
      )
    }
  ) }) });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    blockControls,
    inspectorControls,
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ...(0, import_block_editor.useBlockProps)(), children: icon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_html_renderer.default,
      {
        html: iconToDisplay,
        wrapperProps: {
          className: (0, import_clsx.default)(
            colorProps.className,
            borderProps.className,
            spacingProps.className,
            dimensionsProps.className
          ),
          style: {
            ...colorProps.style,
            ...borderProps.style,
            ...spacingProps.style,
            ...dimensionsProps.style
          }
        }
      }
    ) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      IconPlaceholder,
      {
        className: (0, import_clsx.default)(
          borderProps.className,
          spacingProps.className,
          dimensionsProps.className
        ),
        style: {
          ...borderProps.style,
          ...spacingProps.style,
          ...dimensionsProps.style,
          height: "auto"
        }
      }
    ) }),
    isInserterOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components2.CustomInserterModal,
      {
        icons: allIcons,
        setInserterOpen,
        attributes,
        setAttributes
      }
    )
  ] });
}
var edit_default = Edit;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Edit
});
//# sourceMappingURL=edit.cjs.map
