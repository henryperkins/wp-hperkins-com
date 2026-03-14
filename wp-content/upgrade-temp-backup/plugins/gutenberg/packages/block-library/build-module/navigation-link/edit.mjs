// packages/block-library/src/navigation-link/edit.js
import clsx from "clsx";
import { createBlock } from "@wordpress/blocks";
import { useSelect, useDispatch } from "@wordpress/data";
import {
  ToolbarButton,
  ToolbarGroup,
  VisuallyHidden
} from "@wordpress/components";
import { displayShortcut, isKeyboardEvent } from "@wordpress/keycodes";
import { __, sprintf } from "@wordpress/i18n";
import {
  BlockControls,
  InspectorControls,
  RichText,
  useBlockProps,
  store as blockEditorStore,
  getColorClassName,
  useInnerBlocksProps
} from "@wordpress/block-editor";
import { isURL, prependHTTP } from "@wordpress/url";
import { useState, useEffect, useRef, useCallback } from "@wordpress/element";
import { link as linkIcon, addSubmenu } from "@wordpress/icons";
import { useMergeRefs, useInstanceId } from "@wordpress/compose";
import { getColors } from "../navigation/edit/utils.mjs";
import {
  Controls,
  LinkUI,
  useEntityBinding,
  getInvalidLinkHelpText,
  useHandleLinkChange,
  useIsInvalidLink,
  InvalidDraftDisplay,
  useEnableLinkStatusValidation,
  useIsDraggingWithin,
  selectLabelText
} from "./shared/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var DEFAULT_BLOCK = { name: "core/navigation-link" };
var NESTING_BLOCK_NAMES = [
  "core/navigation-link",
  "core/navigation-submenu"
];
function getMissingText(type) {
  let missingText = "";
  switch (type) {
    case "post":
      missingText = __("Select post");
      break;
    case "page":
      missingText = __("Select page");
      break;
    case "category":
      missingText = __("Select category");
      break;
    case "tag":
      missingText = __("Select tag");
      break;
    default:
      missingText = __("Add link");
  }
  return missingText;
}
function NavigationLinkEdit({
  attributes,
  isSelected,
  setAttributes,
  insertBlocksAfter,
  mergeBlocks,
  onReplace,
  context,
  clientId
}) {
  const { id, label, type, url, description, kind, metadata } = attributes;
  const { maxNestingLevel } = context;
  const {
    replaceBlock,
    __unstableMarkNextChangeAsNotPersistent,
    selectBlock
  } = useDispatch(blockEditorStore);
  const [isLinkOpen, setIsLinkOpen] = useState(isSelected && !url);
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const listItemRef = useRef(null);
  const isDraggingWithin = useIsDraggingWithin(listItemRef);
  const itemLabelPlaceholder = __("Add label\u2026");
  const ref = useRef();
  const linkUIref = useRef();
  const isNewLink = useRef(label === void 0);
  const shouldSelectSubmenuAppenderOnClose = useRef(false);
  const {
    isAtMaxNesting,
    isTopLevelLink,
    isParentOfSelectedBlock,
    hasChildren,
    parentBlockClientId,
    isSubmenu
  } = useSelect(
    (select) => {
      const {
        getBlockCount,
        getBlockName,
        getBlockRootClientId,
        hasSelectedInnerBlock,
        getBlockParentsByBlockName
      } = select(blockEditorStore);
      const rootClientId = getBlockRootClientId(clientId);
      const parentBlockName = getBlockName(rootClientId);
      const isTopLevel = parentBlockName === "core/navigation";
      const rootNavigationClientId = isTopLevel ? rootClientId : getBlockParentsByBlockName(
        clientId,
        "core/navigation"
      )[0];
      const parentBlockId = parentBlockName === "core/navigation-submenu" ? rootClientId : rootNavigationClientId;
      return {
        isAtMaxNesting: getBlockParentsByBlockName(clientId, NESTING_BLOCK_NAMES).length >= maxNestingLevel,
        isTopLevelLink: isTopLevel,
        isParentOfSelectedBlock: hasSelectedInnerBlock(
          clientId,
          true
        ),
        hasChildren: !!getBlockCount(clientId),
        parentBlockClientId: parentBlockId,
        isSubmenu: parentBlockName === "core/navigation-submenu"
      };
    },
    [clientId, maxNestingLevel]
  );
  const validateLinkStatus = useEnableLinkStatusValidation(clientId);
  const { getBlocks } = useSelect(blockEditorStore);
  const { hasUrlBinding, isBoundEntityAvailable, entityRecord } = useEntityBinding({
    clientId,
    attributes
  });
  const handleLinkChange = useHandleLinkChange({
    clientId,
    attributes,
    setAttributes
  });
  const [isInvalid, isDraft] = useIsInvalidLink(
    kind,
    type,
    id,
    validateLinkStatus
  );
  const transformToSubmenu = useCallback(() => {
    let innerBlocks = getBlocks(clientId);
    if (innerBlocks.length === 0) {
      innerBlocks = [createBlock("core/navigation-link")];
      selectBlock(innerBlocks[0].clientId);
    }
    const newSubmenu = createBlock(
      "core/navigation-submenu",
      attributes,
      innerBlocks
    );
    replaceBlock(clientId, newSubmenu);
  }, [getBlocks, clientId, selectBlock, replaceBlock, attributes]);
  useEffect(() => {
    if (isNewLink.current && isSelected) {
      selectBlock(parentBlockClientId);
    }
  }, []);
  useEffect(() => {
    if (hasChildren) {
      __unstableMarkNextChangeAsNotPersistent();
      transformToSubmenu();
    }
  }, [
    hasChildren,
    __unstableMarkNextChangeAsNotPersistent,
    transformToSubmenu
  ]);
  useEffect(() => {
    if (!isNewLink.current || !url || !isLinkOpen) {
      return;
    }
    isNewLink.current = false;
    if (isURL(prependHTTP(label)) && /^.+\.[a-z]+/.test(label)) {
      selectLabelText(ref);
    } else {
      selectBlock(clientId, null);
      if (isSubmenu) {
        const parentBlocks = getBlocks(parentBlockClientId);
        if (parentBlocks.length === 1 && parentBlocks[0].clientId === clientId) {
          shouldSelectSubmenuAppenderOnClose.current = true;
        }
      }
    }
  }, [url, isLinkOpen, isNewLink, label]);
  function removeLink() {
    setAttributes({
      url: void 0,
      label: void 0,
      id: void 0,
      kind: void 0,
      type: void 0,
      opensInNewTab: false
    });
    setIsLinkOpen(false);
  }
  const {
    textColor,
    customTextColor,
    backgroundColor,
    customBackgroundColor
  } = getColors(context, !isTopLevelLink);
  function onKeyDown(event) {
    if (isKeyboardEvent.primary(event, "k")) {
      event.preventDefault();
      event.stopPropagation();
      setIsLinkOpen(true);
    }
  }
  const instanceId = useInstanceId(NavigationLinkEdit);
  const hasMissingEntity = hasUrlBinding && !isBoundEntityAvailable;
  const missingEntityDescriptionId = hasMissingEntity ? sprintf("navigation-link-edit-%d-desc", instanceId) : void 0;
  const blockProps = useBlockProps({
    ref: useMergeRefs([setPopoverAnchor, listItemRef]),
    className: clsx("wp-block-navigation-item", {
      "is-editing": isSelected || isParentOfSelectedBlock,
      "is-dragging-within": isDraggingWithin,
      "has-link": !!url,
      "has-child": hasChildren,
      "has-text-color": !!textColor || !!customTextColor,
      [getColorClassName("color", textColor)]: !!textColor,
      "has-background": !!backgroundColor || customBackgroundColor,
      [getColorClassName("background-color", backgroundColor)]: !!backgroundColor
    }),
    "aria-describedby": missingEntityDescriptionId,
    "aria-invalid": hasMissingEntity,
    style: {
      color: !textColor && customTextColor,
      backgroundColor: !backgroundColor && customBackgroundColor
    },
    onKeyDown
  });
  const innerBlocksProps = useInnerBlocksProps(
    {
      ...blockProps,
      className: "remove-outline"
      // Remove the outline from the inner blocks container.
    },
    {
      defaultBlock: DEFAULT_BLOCK,
      directInsert: true,
      renderAppender: false
    }
  );
  const needsValidLink = !url && !(hasUrlBinding && isBoundEntityAvailable) || isInvalid || isDraft || hasUrlBinding && !isBoundEntityAvailable;
  if (needsValidLink) {
    blockProps.onClick = () => {
      setIsLinkOpen(true);
    };
  }
  const classes = clsx("wp-block-navigation-item__content", {
    "wp-block-navigation-link__placeholder": needsValidLink
  });
  const missingText = getMissingText(type);
  const invalidLinkHelpText = getInvalidLinkHelpText();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(BlockControls, { children: /* @__PURE__ */ jsxs(ToolbarGroup, { children: [
      /* @__PURE__ */ jsx(
        ToolbarButton,
        {
          name: "link",
          icon: linkIcon,
          title: __("Link"),
          shortcut: displayShortcut.primary("k"),
          onClick: () => {
            setIsLinkOpen(true);
          }
        }
      ),
      !isAtMaxNesting && /* @__PURE__ */ jsx(
        ToolbarButton,
        {
          name: "submenu",
          icon: addSubmenu,
          title: __("Add submenu"),
          onClick: transformToSubmenu
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx(InspectorControls, { group: "content", children: /* @__PURE__ */ jsx(
      Controls,
      {
        attributes,
        setAttributes,
        clientId
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { ...blockProps, children: [
      hasMissingEntity && /* @__PURE__ */ jsx(VisuallyHidden, { id: missingEntityDescriptionId, children: invalidLinkHelpText }),
      /* @__PURE__ */ jsxs("a", { className: classes, children: [
        !url && !metadata?.bindings?.url ? /* @__PURE__ */ jsx("div", { className: "wp-block-navigation-link__placeholder-text", children: /* @__PURE__ */ jsx("span", { children: missingText }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          !isInvalid && !isDraft && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              RichText,
              {
                ref,
                identifier: "label",
                className: "wp-block-navigation-item__label",
                value: label,
                onChange: (labelValue) => setAttributes({
                  label: labelValue
                }),
                onMerge: mergeBlocks,
                onReplace,
                __unstableOnSplitAtEnd: () => insertBlocksAfter(
                  createBlock(
                    "core/navigation-link"
                  )
                ),
                "aria-label": __(
                  "Navigation link text"
                ),
                placeholder: itemLabelPlaceholder,
                withoutInteractiveFormatting: true
              }
            ),
            description && /* @__PURE__ */ jsx("span", { className: "wp-block-navigation-item__description", children: description })
          ] }),
          (isInvalid || isDraft) && /* @__PURE__ */ jsx(
            InvalidDraftDisplay,
            {
              label,
              isInvalid,
              isDraft,
              className: "wp-block-navigation-link__label"
            }
          )
        ] }),
        isLinkOpen && /* @__PURE__ */ jsx(
          LinkUI,
          {
            ref: linkUIref,
            clientId,
            link: attributes,
            entity: {
              entityRecord,
              hasBinding: hasUrlBinding,
              isEntityAvailable: isBoundEntityAvailable
            },
            onClose: () => {
              setIsLinkOpen(false);
              if (!url && !hasUrlBinding) {
                onReplace([]);
                return;
              }
              if (shouldSelectSubmenuAppenderOnClose.current) {
                shouldSelectSubmenuAppenderOnClose.current = false;
                if (listItemRef.current?.nextElementSibling) {
                  const appenderButton = listItemRef.current.nextElementSibling.querySelector(
                    ".block-editor-button-block-appender"
                  );
                  if (appenderButton) {
                    appenderButton.focus();
                  }
                }
              }
            },
            anchor: popoverAnchor,
            onRemove: removeLink,
            onChange: handleLinkChange
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { ...innerBlocksProps })
    ] })
  ] });
}
export {
  NavigationLinkEdit as default
};
//# sourceMappingURL=edit.mjs.map
