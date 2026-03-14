// packages/global-styles-ui/src/shadows-edit-panel.tsx
import clsx from "clsx";
import {
  __experimentalHStack as HStack,
  __experimentalVStack as VStack,
  __experimentalSpacer as Spacer,
  __experimentalItemGroup as ItemGroup,
  __experimentalInputControl as InputControl,
  __experimentalUnitControl as UnitControl,
  __experimentalGrid as Grid,
  __experimentalDropdownContentWrapper as DropdownContentWrapper,
  useNavigator,
  __experimentalToggleGroupControl as ToggleGroupControl,
  __experimentalToggleGroupControlOption as ToggleGroupControlOption,
  __experimentalConfirmDialog as ConfirmDialog,
  Dropdown,
  Button,
  Flex,
  FlexItem,
  ColorPalette,
  Modal,
  privateApis as componentsPrivateApis
} from "@wordpress/components";
import { __, sprintf } from "@wordpress/i18n";
import {
  plus,
  shadow as shadowIcon,
  reset,
  moreVertical
} from "@wordpress/icons";
import { useState, useMemo, useEffect, useRef } from "@wordpress/element";
import { Subtitle } from "./subtitle.mjs";
import { ScreenHeader } from "./screen-header.mjs";
import { ScreenBody } from "./screen-body.mjs";
import { defaultShadow } from "./shadows-panel.mjs";
import {
  getShadowParts,
  shadowStringToObject,
  shadowObjectToString
} from "./shadow-utils.mjs";
import { useSetting } from "./hooks.mjs";
import { unlock } from "./lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { Menu } = unlock(componentsPrivateApis);
var customShadowMenuItems = [
  {
    label: __("Rename"),
    action: "rename"
  },
  {
    label: __("Delete"),
    action: "delete"
  }
];
var presetShadowMenuItems = [
  {
    label: __("Reset"),
    action: "reset"
  }
];
function ShadowsEditPanel() {
  const { goBack, params } = useNavigator();
  const { category, slug } = params;
  const [shadows, setShadows] = useSetting(
    `shadow.presets.${category}`
  );
  useEffect(() => {
    const hasCurrentShadow = shadows?.some(
      (shadow) => shadow.slug === slug
    );
    if (!!slug && !hasCurrentShadow) {
      goBack();
    }
  }, [shadows, slug, goBack]);
  const [baseShadows] = useSetting(
    `shadow.presets.${category}`,
    void 0,
    "base"
  );
  const [selectedShadow, setSelectedShadow] = useState(
    () => (shadows || []).find((shadow) => shadow.slug === slug)
  );
  const baseSelectedShadow = useMemo(
    () => (baseShadows || []).find((b) => b.slug === slug),
    [baseShadows, slug]
  );
  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);
  const [shadowName, setShadowName] = useState(
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
  return !selectedShadow ? /* @__PURE__ */ jsx(ScreenHeader, { title: "" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(HStack, { justify: "space-between", children: [
      /* @__PURE__ */ jsx(ScreenHeader, { title: selectedShadow.name }),
      /* @__PURE__ */ jsx(FlexItem, { children: /* @__PURE__ */ jsx(Spacer, { marginTop: 2, marginBottom: 0, paddingX: 4, children: /* @__PURE__ */ jsxs(Menu, { children: [
        /* @__PURE__ */ jsx(
          Menu.TriggerButton,
          {
            render: /* @__PURE__ */ jsx(
              Button,
              {
                size: "small",
                icon: moreVertical,
                label: __("Menu")
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(Menu.Popover, { children: (category === "custom" ? customShadowMenuItems : presetShadowMenuItems).map((item) => /* @__PURE__ */ jsx(
          Menu.Item,
          {
            onClick: () => onMenuClick(item.action),
            disabled: item.action === "reset" && selectedShadow.shadow === baseSelectedShadow?.shadow,
            children: /* @__PURE__ */ jsx(Menu.ItemLabel, { children: item.label })
          },
          item.action
        )) })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxs(ScreenBody, { children: [
      /* @__PURE__ */ jsx(ShadowsPreview, { shadow: selectedShadow.shadow }),
      /* @__PURE__ */ jsx(
        ShadowEditor,
        {
          shadow: selectedShadow.shadow,
          onChange: onShadowChange
        }
      )
    ] }),
    isConfirmDialogVisible && /* @__PURE__ */ jsx(
      ConfirmDialog,
      {
        isOpen: true,
        onConfirm: () => {
          handleShadowDelete();
          setIsConfirmDialogVisible(false);
        },
        onCancel: () => {
          setIsConfirmDialogVisible(false);
        },
        confirmButtonText: __("Delete"),
        size: "medium",
        children: sprintf(
          /* translators: %s: Name of the shadow preset. */
          __(
            'Are you sure you want to delete "%s" shadow preset?'
          ),
          selectedShadow.name
        )
      }
    ),
    isRenameModalVisible && /* @__PURE__ */ jsx(
      Modal,
      {
        title: __("Rename"),
        onRequestClose: () => setIsRenameModalVisible(false),
        size: "small",
        children: /* @__PURE__ */ jsxs(
          "form",
          {
            onSubmit: (event) => {
              event.preventDefault();
              handleShadowRename(shadowName);
              setIsRenameModalVisible(false);
            },
            children: [
              /* @__PURE__ */ jsx(
                InputControl,
                {
                  __next40pxDefaultSize: true,
                  autoComplete: "off",
                  label: __("Name"),
                  placeholder: __("Shadow name"),
                  value: shadowName ?? "",
                  onChange: setShadowName
                }
              ),
              /* @__PURE__ */ jsx(Spacer, { marginBottom: 6 }),
              /* @__PURE__ */ jsxs(
                Flex,
                {
                  className: "block-editor-shadow-edit-modal__actions",
                  justify: "flex-end",
                  expanded: false,
                  children: [
                    /* @__PURE__ */ jsx(FlexItem, { children: /* @__PURE__ */ jsx(
                      Button,
                      {
                        __next40pxDefaultSize: true,
                        variant: "tertiary",
                        onClick: () => setIsRenameModalVisible(false),
                        children: __("Cancel")
                      }
                    ) }),
                    /* @__PURE__ */ jsx(FlexItem, { children: /* @__PURE__ */ jsx(
                      Button,
                      {
                        __next40pxDefaultSize: true,
                        variant: "primary",
                        type: "submit",
                        children: __("Save")
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
  return /* @__PURE__ */ jsx(Spacer, { marginBottom: 4, marginTop: -2, children: /* @__PURE__ */ jsx(
    HStack,
    {
      alignment: "center",
      justify: "center",
      className: "global-styles-ui__shadow-preview-panel",
      children: /* @__PURE__ */ jsx(
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
  const addShadowButtonRef = useRef(null);
  const shadowParts = useMemo(() => getShadowParts(shadow), [shadow]);
  const onChangeShadowPart = (index, part) => {
    const newShadowParts = [...shadowParts];
    newShadowParts[index] = part;
    onChange(newShadowParts.join(", "));
  };
  const onAddShadowPart = () => {
    onChange([...shadowParts, defaultShadow].join(", "));
  };
  const onRemoveShadowPart = (index) => {
    onChange(shadowParts.filter((p, i) => i !== index).join(", "));
    addShadowButtonRef.current?.focus();
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(VStack, { spacing: 2, children: /* @__PURE__ */ jsxs(HStack, { justify: "space-between", children: [
      /* @__PURE__ */ jsx(Subtitle, { level: 3, children: __("Shadows") }),
      /* @__PURE__ */ jsx(FlexItem, { className: "global-styles-ui__shadows-panel__options-container", children: /* @__PURE__ */ jsx(
        Button,
        {
          size: "small",
          icon: plus,
          label: __("Add shadow"),
          onClick: () => {
            onAddShadowPart();
          },
          ref: addShadowButtonRef
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsx(Spacer, {}),
    /* @__PURE__ */ jsx(ItemGroup, { isBordered: true, isSeparated: true, children: shadowParts.map((part, index) => /* @__PURE__ */ jsx(
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
  const shadowObj = useMemo(
    () => shadowStringToObject(shadow),
    [shadow]
  );
  const onShadowChange = (newShadow) => {
    onChange(shadowObjectToString(newShadow));
  };
  return /* @__PURE__ */ jsx(
    Dropdown,
    {
      popoverProps,
      className: "global-styles-ui__shadow-editor__dropdown",
      renderToggle: ({ onToggle, isOpen }) => {
        const toggleProps = {
          onClick: onToggle,
          className: clsx(
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
          className: clsx(
            "global-styles-ui__shadow-editor__remove-button",
            { "is-open": isOpen }
          ),
          label: __("Remove shadow")
        };
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              __next40pxDefaultSize: true,
              icon: shadowIcon,
              ...toggleProps,
              children: shadowObj.inset ? __("Inner shadow") : __("Drop shadow")
            }
          ),
          canRemove && /* @__PURE__ */ jsx(
            Button,
            {
              size: "small",
              icon: reset,
              ...removeButtonProps
            }
          )
        ] });
      },
      renderContent: () => /* @__PURE__ */ jsx(
        DropdownContentWrapper,
        {
          paddingSize: "medium",
          className: "global-styles-ui__shadow-editor__dropdown-content",
          children: /* @__PURE__ */ jsx(
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
  return /* @__PURE__ */ jsxs(VStack, { spacing: 4, className: "global-styles-ui__shadow-editor-panel", children: [
    /* @__PURE__ */ jsx(
      ColorPalette,
      {
        clearable: false,
        enableAlpha,
        __experimentalIsRenderedInSidebar,
        value: shadowObj.color,
        onChange: (value) => onShadowChange("color", value)
      }
    ),
    /* @__PURE__ */ jsxs(
      ToggleGroupControl,
      {
        label: __("Shadow Type"),
        value: shadowObj.inset ? "inset" : "outset",
        isBlock: true,
        onChange: (value) => onShadowChange("inset", value === "inset"),
        hideLabelFromVision: true,
        __next40pxDefaultSize: true,
        children: [
          /* @__PURE__ */ jsx(
            ToggleGroupControlOption,
            {
              value: "outset",
              label: __("Outset")
            }
          ),
          /* @__PURE__ */ jsx(
            ToggleGroupControlOption,
            {
              value: "inset",
              label: __("Inset")
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxs(Grid, { columns: 2, gap: 4, children: [
      /* @__PURE__ */ jsx(
        ShadowInputControl,
        {
          label: __("X Position"),
          value: shadowObj.x,
          onChange: (value) => onShadowChange("x", value)
        }
      ),
      /* @__PURE__ */ jsx(
        ShadowInputControl,
        {
          label: __("Y Position"),
          value: shadowObj.y,
          onChange: (value) => onShadowChange("y", value)
        }
      ),
      /* @__PURE__ */ jsx(
        ShadowInputControl,
        {
          label: __("Blur"),
          value: shadowObj.blur,
          onChange: (value) => onShadowChange("blur", value)
        }
      ),
      /* @__PURE__ */ jsx(
        ShadowInputControl,
        {
          label: __("Spread"),
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
  return /* @__PURE__ */ jsx(
    UnitControl,
    {
      label,
      __next40pxDefaultSize: true,
      value,
      onChange: onValueChange
    }
  );
}
export {
  ShadowsEditPanel as default
};
//# sourceMappingURL=shadows-edit-panel.mjs.map
