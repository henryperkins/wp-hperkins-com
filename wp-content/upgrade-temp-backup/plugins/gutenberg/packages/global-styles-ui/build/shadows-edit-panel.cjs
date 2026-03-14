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

// packages/global-styles-ui/src/shadows-edit-panel.tsx
var shadows_edit_panel_exports = {};
__export(shadows_edit_panel_exports, {
  default: () => ShadowsEditPanel
});
module.exports = __toCommonJS(shadows_edit_panel_exports);
var import_clsx = __toESM(require("clsx"));
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_element = require("@wordpress/element");
var import_subtitle = require("./subtitle.cjs");
var import_screen_header = require("./screen-header.cjs");
var import_screen_body = require("./screen-body.cjs");
var import_shadows_panel = require("./shadows-panel.cjs");
var import_shadow_utils = require("./shadow-utils.cjs");
var import_hooks = require("./hooks.cjs");
var import_lock_unlock = require("./lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { Menu } = (0, import_lock_unlock.unlock)(import_components.privateApis);
var customShadowMenuItems = [
  {
    label: (0, import_i18n.__)("Rename"),
    action: "rename"
  },
  {
    label: (0, import_i18n.__)("Delete"),
    action: "delete"
  }
];
var presetShadowMenuItems = [
  {
    label: (0, import_i18n.__)("Reset"),
    action: "reset"
  }
];
function ShadowsEditPanel() {
  const { goBack, params } = (0, import_components.useNavigator)();
  const { category, slug } = params;
  const [shadows, setShadows] = (0, import_hooks.useSetting)(
    `shadow.presets.${category}`
  );
  (0, import_element.useEffect)(() => {
    const hasCurrentShadow = shadows?.some(
      (shadow) => shadow.slug === slug
    );
    if (!!slug && !hasCurrentShadow) {
      goBack();
    }
  }, [shadows, slug, goBack]);
  const [baseShadows] = (0, import_hooks.useSetting)(
    `shadow.presets.${category}`,
    void 0,
    "base"
  );
  const [selectedShadow, setSelectedShadow] = (0, import_element.useState)(
    () => (shadows || []).find((shadow) => shadow.slug === slug)
  );
  const baseSelectedShadow = (0, import_element.useMemo)(
    () => (baseShadows || []).find((b) => b.slug === slug),
    [baseShadows, slug]
  );
  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = (0, import_element.useState)(false);
  const [isRenameModalVisible, setIsRenameModalVisible] = (0, import_element.useState)(false);
  const [shadowName, setShadowName] = (0, import_element.useState)(
    selectedShadow?.name
  );
  if (!category || !slug) {
    return null;
  }
  const onShadowChange = (shadow) => {
    setSelectedShadow({ ...selectedShadow, shadow });
    const updatedShadows = shadows.map(
      (s) => s.slug === slug ? { ...selectedShadow, shadow } : s
    );
    setShadows(updatedShadows);
  };
  const onMenuClick = (action) => {
    if (action === "reset") {
      const updatedShadows = shadows.map(
        (s) => s.slug === slug ? baseSelectedShadow : s
      );
      setSelectedShadow(baseSelectedShadow);
      setShadows(updatedShadows);
    } else if (action === "delete") {
      setIsConfirmDialogVisible(true);
    } else if (action === "rename") {
      setIsRenameModalVisible(true);
    }
  };
  const handleShadowDelete = () => {
    setShadows(shadows.filter((s) => s.slug !== slug));
  };
  const handleShadowRename = (newName) => {
    if (!newName) {
      return;
    }
    const updatedShadows = shadows.map(
      (s) => s.slug === slug ? { ...selectedShadow, name: newName } : s
    );
    setSelectedShadow({ ...selectedShadow, name: newName });
    setShadows(updatedShadows);
  };
  return !selectedShadow ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_screen_header.ScreenHeader, { title: "" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { justify: "space-between", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_screen_header.ScreenHeader, { title: selectedShadow.name }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalSpacer, { marginTop: 2, marginBottom: 0, paddingX: 4, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Menu, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          Menu.TriggerButton,
          {
            render: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.Button,
              {
                size: "small",
                icon: import_icons.moreVertical,
                label: (0, import_i18n.__)("Menu")
              }
            )
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu.Popover, { children: (category === "custom" ? customShadowMenuItems : presetShadowMenuItems).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          Menu.Item,
          {
            onClick: () => onMenuClick(item.action),
            disabled: item.action === "reset" && selectedShadow.shadow === baseSelectedShadow?.shadow,
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu.ItemLabel, { children: item.label })
          },
          item.action
        )) })
      ] }) }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_screen_body.ScreenBody, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShadowsPreview, { shadow: selectedShadow.shadow }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        ShadowEditor,
        {
          shadow: selectedShadow.shadow,
          onChange: onShadowChange
        }
      )
    ] }),
    isConfirmDialogVisible && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.__experimentalConfirmDialog,
      {
        isOpen: true,
        onConfirm: () => {
          handleShadowDelete();
          setIsConfirmDialogVisible(false);
        },
        onCancel: () => {
          setIsConfirmDialogVisible(false);
        },
        confirmButtonText: (0, import_i18n.__)("Delete"),
        size: "medium",
        children: (0, import_i18n.sprintf)(
          /* translators: %s: Name of the shadow preset. */
          (0, import_i18n.__)(
            'Are you sure you want to delete "%s" shadow preset?'
          ),
          selectedShadow.name
        )
      }
    ),
    isRenameModalVisible && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Modal,
      {
        title: (0, import_i18n.__)("Rename"),
        onRequestClose: () => setIsRenameModalVisible(false),
        size: "small",
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "form",
          {
            onSubmit: (event) => {
              event.preventDefault();
              handleShadowRename(shadowName);
              setIsRenameModalVisible(false);
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_components.__experimentalInputControl,
                {
                  __next40pxDefaultSize: true,
                  autoComplete: "off",
                  label: (0, import_i18n.__)("Name"),
                  placeholder: (0, import_i18n.__)("Shadow name"),
                  value: shadowName ?? "",
                  onChange: setShadowName
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalSpacer, { marginBottom: 6 }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                import_components.Flex,
                {
                  className: "block-editor-shadow-edit-modal__actions",
                  justify: "flex-end",
                  expanded: false,
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      import_components.Button,
                      {
                        __next40pxDefaultSize: true,
                        variant: "tertiary",
                        onClick: () => setIsRenameModalVisible(false),
                        children: (0, import_i18n.__)("Cancel")
                      }
                    ) }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      import_components.Button,
                      {
                        __next40pxDefaultSize: true,
                        variant: "primary",
                        type: "submit",
                        children: (0, import_i18n.__)("Save")
                      }
                    ) })
                  ]
                }
              )
            ]
          }
        )
      }
    )
  ] });
}
function ShadowsPreview({ shadow }) {
  const shadowStyle = {
    boxShadow: shadow
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalSpacer, { marginBottom: 4, marginTop: -2, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.__experimentalHStack,
    {
      alignment: "center",
      justify: "center",
      className: "global-styles-ui__shadow-preview-panel",
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "div",
        {
          className: "global-styles-ui__shadow-preview-block",
          style: shadowStyle
        }
      )
    }
  ) });
}
function ShadowEditor({ shadow, onChange }) {
  const addShadowButtonRef = (0, import_element.useRef)(null);
  const shadowParts = (0, import_element.useMemo)(() => (0, import_shadow_utils.getShadowParts)(shadow), [shadow]);
  const onChangeShadowPart = (index, part) => {
    const newShadowParts = [...shadowParts];
    newShadowParts[index] = part;
    onChange(newShadowParts.join(", "));
  };
  const onAddShadowPart = () => {
    onChange([...shadowParts, import_shadows_panel.defaultShadow].join(", "));
  };
  const onRemoveShadowPart = (index) => {
    onChange(shadowParts.filter((p, i) => i !== index).join(", "));
    addShadowButtonRef.current?.focus();
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalVStack, { spacing: 2, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { justify: "space-between", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_subtitle.Subtitle, { level: 3, children: (0, import_i18n.__)("Shadows") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { className: "global-styles-ui__shadows-panel__options-container", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.Button,
        {
          size: "small",
          icon: import_icons.plus,
          label: (0, import_i18n.__)("Add shadow"),
          onClick: () => {
            onAddShadowPart();
          },
          ref: addShadowButtonRef
        }
      ) })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalSpacer, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalItemGroup, { isBordered: true, isSeparated: true, children: shadowParts.map((part, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      ShadowItem,
      {
        shadow: part,
        onChange: (value) => onChangeShadowPart(index, value),
        canRemove: shadowParts.length > 1,
        onRemove: () => onRemoveShadowPart(index)
      },
      index
    )) })
  ] });
}
function ShadowItem({
  shadow,
  onChange,
  canRemove,
  onRemove
}) {
  const popoverProps = {
    placement: "left-start",
    offset: 36,
    shift: true
  };
  const shadowObj = (0, import_element.useMemo)(
    () => (0, import_shadow_utils.shadowStringToObject)(shadow),
    [shadow]
  );
  const onShadowChange = (newShadow) => {
    onChange((0, import_shadow_utils.shadowObjectToString)(newShadow));
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Dropdown,
    {
      popoverProps,
      className: "global-styles-ui__shadow-editor__dropdown",
      renderToggle: ({ onToggle, isOpen }) => {
        const toggleProps = {
          onClick: onToggle,
          className: (0, import_clsx.default)(
            "global-styles-ui__shadow-editor__dropdown-toggle",
            { "is-open": isOpen }
          ),
          "aria-expanded": isOpen
        };
        const removeButtonProps = {
          onClick: () => {
            if (isOpen) {
              onToggle();
            }
            onRemove();
          },
          className: (0, import_clsx.default)(
            "global-styles-ui__shadow-editor__remove-button",
            { "is-open": isOpen }
          ),
          label: (0, import_i18n.__)("Remove shadow")
        };
        return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              __next40pxDefaultSize: true,
              icon: import_icons.shadow,
              ...toggleProps,
              children: shadowObj.inset ? (0, import_i18n.__)("Inner shadow") : (0, import_i18n.__)("Drop shadow")
            }
          ),
          canRemove && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              size: "small",
              icon: import_icons.reset,
              ...removeButtonProps
            }
          )
        ] });
      },
      renderContent: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.__experimentalDropdownContentWrapper,
        {
          paddingSize: "medium",
          className: "global-styles-ui__shadow-editor__dropdown-content",
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            ShadowPopover,
            {
              shadowObj,
              onChange: onShadowChange
            }
          )
        }
      )
    }
  );
}
function ShadowPopover({ shadowObj, onChange }) {
  const __experimentalIsRenderedInSidebar = true;
  const enableAlpha = true;
  const onShadowChange = (key, value) => {
    const newShadow = {
      ...shadowObj,
      [key]: value
    };
    onChange(newShadow);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 4, className: "global-styles-ui__shadow-editor-panel", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.ColorPalette,
      {
        clearable: false,
        enableAlpha,
        __experimentalIsRenderedInSidebar,
        value: shadowObj.color,
        onChange: (value) => onShadowChange("color", value)
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      import_components.__experimentalToggleGroupControl,
      {
        label: (0, import_i18n.__)("Shadow Type"),
        value: shadowObj.inset ? "inset" : "outset",
        isBlock: true,
        onChange: (value) => onShadowChange("inset", value === "inset"),
        hideLabelFromVision: true,
        __next40pxDefaultSize: true,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.__experimentalToggleGroupControlOption,
            {
              value: "outset",
              label: (0, import_i18n.__)("Outset")
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.__experimentalToggleGroupControlOption,
            {
              value: "inset",
              label: (0, import_i18n.__)("Inset")
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalGrid, { columns: 2, gap: 4, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        ShadowInputControl,
        {
          label: (0, import_i18n.__)("X Position"),
          value: shadowObj.x,
          onChange: (value) => onShadowChange("x", value)
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        ShadowInputControl,
        {
          label: (0, import_i18n.__)("Y Position"),
          value: shadowObj.y,
          onChange: (value) => onShadowChange("y", value)
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        ShadowInputControl,
        {
          label: (0, import_i18n.__)("Blur"),
          value: shadowObj.blur,
          onChange: (value) => onShadowChange("blur", value)
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        ShadowInputControl,
        {
          label: (0, import_i18n.__)("Spread"),
          value: shadowObj.spread,
          onChange: (value) => onShadowChange("spread", value)
        }
      )
    ] })
  ] });
}
function ShadowInputControl({
  label,
  value,
  onChange
}) {
  const onValueChange = (next) => {
    const isNumeric = next !== void 0 && !isNaN(parseFloat(next));
    const nextValue = isNumeric ? next : "0px";
    onChange(nextValue);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.__experimentalUnitControl,
    {
      label,
      __next40pxDefaultSize: true,
      value,
      onChange: onValueChange
    }
  );
}
//# sourceMappingURL=shadows-edit-panel.cjs.map
