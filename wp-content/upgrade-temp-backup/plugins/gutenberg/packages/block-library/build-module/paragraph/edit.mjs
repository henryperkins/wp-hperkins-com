// packages/block-library/src/paragraph/edit.js
import clsx from "clsx";
import { __, _x, isRTL } from "@wordpress/i18n";
import {
  ToolbarButton,
  ToggleControl,
  __experimentalToolsPanelItem as ToolsPanelItem
} from "@wordpress/components";
import {
  BlockControls,
  InspectorControls,
  RichText,
  useBlockProps,
  useSettings,
  useBlockEditingMode
} from "@wordpress/block-editor";
import { getBlockSupport } from "@wordpress/blocks";
import { formatLTR } from "@wordpress/icons";
import { useOnEnter } from "./use-enter.mjs";
import useDeprecatedAlign from "./deprecated-attributes.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function ParagraphRTLControl({ direction, setDirection }) {
  return isRTL() && /* @__PURE__ */ jsx(
    ToolbarButton,
    {
      icon: formatLTR,
      title: _x("Left to right", "editor button"),
      isActive: direction === "ltr",
      onClick: () => {
        setDirection(direction === "ltr" ? void 0 : "ltr");
      }
    }
  );
}
function hasDropCapDisabled(align) {
  return align === (isRTL() ? "left" : "right") || align === "center";
}
function DropCapControl({ clientId, attributes, setAttributes, name }) {
  const [isDropCapFeatureEnabled] = useSettings("typography.dropCap");
  if (!isDropCapFeatureEnabled) {
    return null;
  }
  const { style, dropCap } = attributes;
  const textAlign = style?.typography?.textAlign;
  let helpText;
  if (hasDropCapDisabled(textAlign)) {
    helpText = __("Not available for aligned text.");
  } else if (dropCap) {
    helpText = __("Showing large initial letter.");
  } else {
    helpText = __("Show a large initial letter.");
  }
  const isDropCapControlEnabledByDefault = getBlockSupport(
    name,
    "typography.defaultControls.dropCap",
    false
  );
  return /* @__PURE__ */ jsx(InspectorControls, { group: "typography", children: /* @__PURE__ */ jsx(
    ToolsPanelItem,
    {
      hasValue: () => !!dropCap,
      label: __("Drop cap"),
      isShownByDefault: isDropCapControlEnabledByDefault,
      onDeselect: () => setAttributes({ dropCap: false }),
      resetAllFilter: () => ({ dropCap: false }),
      panelId: clientId,
      children: /* @__PURE__ */ jsx(
        ToggleControl,
        {
          label: __("Drop cap"),
          checked: !!dropCap,
          onChange: () => setAttributes({ dropCap: !dropCap }),
          help: helpText,
          disabled: hasDropCapDisabled(textAlign)
        }
      )
    }
  ) });
}
function ParagraphBlock({
  attributes,
  mergeBlocks,
  onReplace,
  onRemove,
  setAttributes,
  clientId,
  isSelected: isSingleSelected,
  name
}) {
  const { content, direction, dropCap, placeholder, style } = attributes;
  const textAlign = style?.typography?.textAlign;
  useDeprecatedAlign(attributes.align, style, setAttributes);
  const blockProps = useBlockProps({
    ref: useOnEnter({ clientId, content }),
    className: clsx({
      "has-drop-cap": hasDropCapDisabled(textAlign) ? false : dropCap
    }),
    style: { direction }
  });
  const blockEditingMode = useBlockEditingMode();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    blockEditingMode === "default" && /* @__PURE__ */ jsx(BlockControls, { group: "block", children: /* @__PURE__ */ jsx(
      ParagraphRTLControl,
      {
        direction,
        setDirection: (newDirection) => setAttributes({ direction: newDirection })
      }
    ) }),
    isSingleSelected && /* @__PURE__ */ jsx(
      DropCapControl,
      {
        name,
        clientId,
        attributes,
        setAttributes
      }
    ),
    /* @__PURE__ */ jsx(
      RichText,
      {
        identifier: "content",
        tagName: "p",
        ...blockProps,
        value: content,
        onChange: (newContent) => setAttributes({ content: newContent }),
        onMerge: mergeBlocks,
        onReplace,
        onRemove,
        "aria-label": RichText.isEmpty(content) ? __(
          "Empty block; start writing or type forward slash to choose a block"
        ) : __("Block: Paragraph"),
        "data-empty": RichText.isEmpty(content),
        placeholder: placeholder || __("Type / to choose a block"),
        "data-custom-placeholder": placeholder ? true : void 0,
        __unstableEmbedURLOnPaste: true,
        __unstableAllowPrefixTransformations: true
      }
    )
  ] });
}
var edit_default = ParagraphBlock;
export {
  edit_default as default
};
//# sourceMappingURL=edit.mjs.map
