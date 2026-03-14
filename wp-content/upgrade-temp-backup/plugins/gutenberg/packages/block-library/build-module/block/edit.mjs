// packages/block-library/src/block/edit.js
import clsx from "clsx";
import { useSelect, useDispatch } from "@wordpress/data";
import { useRef, useMemo } from "@wordpress/element";
import {
  useEntityRecord,
  store as coreStore,
  useEntityBlockEditor
} from "@wordpress/core-data";
import {
  Placeholder,
  Spinner,
  ToolbarButton,
  ToolbarGroup
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import {
  useInnerBlocksProps,
  RecursionProvider,
  useHasRecursion,
  useBlockProps,
  Warning,
  privateApis as blockEditorPrivateApis,
  store as blockEditorStore,
  BlockControls,
  InnerBlocks
} from "@wordpress/block-editor";
import { privateApis as patternsPrivateApis } from "@wordpress/patterns";
import { getBlockBindingsSource } from "@wordpress/blocks";
import { unlock } from "../lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { useLayoutClasses } = unlock(blockEditorPrivateApis);
var { isOverridableBlock } = unlock(patternsPrivateApis);
var fullAlignments = ["full", "wide", "left", "right"];
var useInferredLayout = (blocks, parentLayout) => {
  const initialInferredAlignmentRef = useRef();
  return useMemo(() => {
    if (!blocks?.length) {
      return {};
    }
    let alignment = initialInferredAlignmentRef.current;
    if (alignment === void 0) {
      const isConstrained = parentLayout?.type === "constrained";
      const hasFullAlignment = blocks.some(
        (block) => fullAlignments.includes(block.attributes.align)
      );
      alignment = isConstrained && hasFullAlignment ? "full" : null;
      initialInferredAlignmentRef.current = alignment;
    }
    const layout = alignment ? parentLayout : void 0;
    return { alignment, layout };
  }, [blocks, parentLayout]);
};
function RecursionWarning() {
  const blockProps = useBlockProps();
  return /* @__PURE__ */ jsx("div", { ...blockProps, children: /* @__PURE__ */ jsx(Warning, { children: __("Block cannot be rendered inside itself.") }) });
}
var NOOP = () => {
};
function ReusableBlockEditRecursionWrapper(props) {
  const { ref } = props.attributes;
  const hasAlreadyRendered = useHasRecursion(ref);
  if (hasAlreadyRendered) {
    return /* @__PURE__ */ jsx(RecursionWarning, {});
  }
  return /* @__PURE__ */ jsx(RecursionProvider, { uniqueId: ref, children: /* @__PURE__ */ jsx(ReusableBlockEdit, { ...props }) });
}
function ReusableBlockControl({
  recordId,
  canOverrideBlocks,
  hasContent,
  handleEditOriginal,
  resetContent
}) {
  const canUserEdit = useSelect(
    (select) => !!select(coreStore).canUser("update", {
      kind: "postType",
      name: "wp_block",
      id: recordId
    }),
    [recordId]
  );
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    canUserEdit && !!handleEditOriginal && /* @__PURE__ */ jsx(BlockControls, { group: "other", children: /* @__PURE__ */ jsx(ToolbarGroup, { children: /* @__PURE__ */ jsx(ToolbarButton, { onClick: handleEditOriginal, children: __("Edit original") }) }) }),
    canOverrideBlocks && /* @__PURE__ */ jsx(BlockControls, { group: "other", children: /* @__PURE__ */ jsx(ToolbarGroup, { children: /* @__PURE__ */ jsx(
      ToolbarButton,
      {
        onClick: resetContent,
        disabled: !hasContent,
        children: __("Reset")
      }
    ) }) })
  ] });
}
var EMPTY_OBJECT = {};
function ReusableBlockEdit({
  name,
  attributes: { ref, content },
  __unstableParentLayout: parentLayout,
  setAttributes
}) {
  const { record, hasResolved } = useEntityRecord(
    "postType",
    "wp_block",
    ref
  );
  const [blocks] = useEntityBlockEditor("postType", "wp_block", {
    id: ref
  });
  const isMissing = hasResolved && !record;
  const { __unstableMarkLastChangeAsPersistent } = useDispatch(blockEditorStore);
  const {
    onNavigateToEntityRecord,
    hasPatternOverridesSource,
    supportedBlockTypesRaw
  } = useSelect((select) => {
    const { getSettings } = select(blockEditorStore);
    return {
      onNavigateToEntityRecord: getSettings().onNavigateToEntityRecord,
      hasPatternOverridesSource: !!getBlockBindingsSource(
        "core/pattern-overrides"
      ),
      supportedBlockTypesRaw: getSettings().__experimentalBlockBindingsSupportedAttributes || EMPTY_OBJECT
    };
  }, []);
  const canOverrideBlocks = useMemo(() => {
    const supportedBlockTypes = Object.keys(supportedBlockTypesRaw);
    const hasOverridableBlocks = (_blocks) => _blocks.some((block) => {
      if (supportedBlockTypes.includes(block.name) && isOverridableBlock(block)) {
        return true;
      }
      return hasOverridableBlocks(block.innerBlocks);
    });
    return hasPatternOverridesSource && hasOverridableBlocks(blocks);
  }, [hasPatternOverridesSource, blocks, supportedBlockTypesRaw]);
  const { alignment, layout } = useInferredLayout(blocks, parentLayout);
  const layoutClasses = useLayoutClasses({ layout }, name);
  const blockProps = useBlockProps({
    className: clsx(
      "block-library-block__reusable-block-container",
      layout && layoutClasses,
      { [`align${alignment}`]: alignment }
    )
  });
  const innerBlocksProps = useInnerBlocksProps(blockProps, {
    layout,
    value: blocks,
    onInput: NOOP,
    onChange: NOOP,
    renderAppender: blocks?.length ? void 0 : InnerBlocks.ButtonBlockAppender
  });
  const handleEditOriginal = () => {
    onNavigateToEntityRecord({
      postId: ref,
      postType: "wp_block"
    });
  };
  const resetContent = () => {
    if (content) {
      __unstableMarkLastChangeAsPersistent();
      setAttributes({ content: void 0 });
    }
  };
  let children = null;
  if (isMissing) {
    children = /* @__PURE__ */ jsx(Warning, { children: __("Block has been deleted or is unavailable.") });
  }
  if (!hasResolved) {
    children = /* @__PURE__ */ jsx(Placeholder, { children: /* @__PURE__ */ jsx(Spinner, {}) });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    hasResolved && !isMissing && /* @__PURE__ */ jsx(
      ReusableBlockControl,
      {
        recordId: ref,
        canOverrideBlocks,
        hasContent: !!content,
        handleEditOriginal: onNavigateToEntityRecord ? handleEditOriginal : void 0,
        resetContent
      }
    ),
    children === null ? /* @__PURE__ */ jsx("div", { ...innerBlocksProps }) : /* @__PURE__ */ jsx("div", { ...blockProps, children })
  ] });
}
export {
  ReusableBlockEditRecursionWrapper as default
};
//# sourceMappingURL=edit.mjs.map
