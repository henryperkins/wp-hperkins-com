// packages/block-library/src/quote/edit.js
import clsx from "clsx";
import { __ } from "@wordpress/i18n";
import {
  AlignmentControl,
  BlockControls,
  useBlockProps,
  useInnerBlocksProps,
  store as blockEditorStore
} from "@wordpress/block-editor";
import { BlockQuotation } from "@wordpress/components";
import { useDispatch, useRegistry } from "@wordpress/data";
import { Platform, useEffect } from "@wordpress/element";
import deprecated from "@wordpress/deprecated";
import { verse } from "@wordpress/icons";
import { migrateToQuoteV2 } from "./deprecated.mjs";
import { Caption } from "../utils/caption.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var isWebPlatform = Platform.OS === "web";
var TEMPLATE = [["core/paragraph", {}]];
var useMigrateOnLoad = (attributes, clientId) => {
  const registry = useRegistry();
  const { updateBlockAttributes, replaceInnerBlocks } = useDispatch(blockEditorStore);
  useEffect(() => {
    if (!attributes.value) {
      return;
    }
    const [newAttributes, newInnerBlocks] = migrateToQuoteV2(attributes);
    deprecated("Value attribute on the quote block", {
      since: "6.0",
      version: "6.5",
      alternative: "inner blocks"
    });
    registry.batch(() => {
      updateBlockAttributes(clientId, newAttributes);
      replaceInnerBlocks(clientId, newInnerBlocks);
    });
  }, [attributes.value]);
};
function QuoteEdit({
  attributes,
  setAttributes,
  insertBlocksAfter,
  clientId,
  className,
  style,
  isSelected
}) {
  const { textAlign, allowedBlocks } = attributes;
  useMigrateOnLoad(attributes, clientId);
  const blockProps = useBlockProps({
    className: clsx(className, {
      [`has-text-align-${textAlign}`]: textAlign
    }),
    ...!isWebPlatform && { style }
  });
  const innerBlocksProps = useInnerBlocksProps(blockProps, {
    template: TEMPLATE,
    templateInsertUpdatesSelection: true,
    __experimentalCaptureToolbars: true,
    renderAppender: false,
    allowedBlocks
  });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(BlockControls, { group: "block", children: /* @__PURE__ */ jsx(
      AlignmentControl,
      {
        value: textAlign,
        onChange: (nextAlign) => {
          setAttributes({ textAlign: nextAlign });
        }
      }
    ) }),
    /* @__PURE__ */ jsxs(BlockQuotation, { ...innerBlocksProps, children: [
      innerBlocksProps.children,
      /* @__PURE__ */ jsx(
        Caption,
        {
          attributeKey: "citation",
          tagName: isWebPlatform ? "cite" : "p",
          style: isWebPlatform && { display: "block" },
          isSelected,
          attributes,
          setAttributes,
          __unstableMobileNoFocusOnMount: true,
          icon: verse,
          label: __("Quote citation"),
          placeholder: (
            // translators: placeholder text used for the
            // citation
            __("Add citation")
          ),
          addLabel: __("Add citation"),
          removeLabel: __("Remove citation"),
          excludeElementClassName: true,
          className: "wp-block-quote__citation",
          insertBlocksAfter,
          ...!isWebPlatform ? { textAlign } : {}
        }
      )
    ] })
  ] });
}
export {
  QuoteEdit as default
};
//# sourceMappingURL=edit.mjs.map
