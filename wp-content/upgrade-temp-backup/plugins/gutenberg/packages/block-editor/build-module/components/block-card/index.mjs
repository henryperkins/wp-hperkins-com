// packages/block-editor/src/components/block-card/index.js
import clsx from "clsx";
import {
  Button,
  Icon,
  __experimentalText as Text,
  __experimentalVStack as VStack,
  __experimentalHStack as HStack,
  privateApis as componentsPrivateApis
} from "@wordpress/components";
import { useDispatch, useSelect } from "@wordpress/data";
import deprecated from "@wordpress/deprecated";
import { __, sprintf, isRTL } from "@wordpress/i18n";
import {
  chevronLeft,
  chevronRight,
  arrowRight,
  arrowLeft
} from "@wordpress/icons";
import { getBlockType, hasBlockSupport } from "@wordpress/blocks";
import { unlock } from "../../lock-unlock.mjs";
import { store as blockEditorStore } from "../../store/index.mjs";
import BlockIcon from "../block-icon/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var { Badge } = unlock(componentsPrivateApis);
function OptionalParentSelectButton({ children, onClick }) {
  if (!onClick) {
    return children;
  }
  return /* @__PURE__ */ jsx(
    Button,
    {
      __next40pxDefaultSize: true,
      className: "block-editor-block-card__parent-select-button",
      onClick,
      children
    }
  );
}
function BlockCard({
  title,
  icon,
  description,
  blockType,
  className,
  name,
  allowParentNavigation,
  parentClientId,
  isChild,
  children,
  clientId
}) {
  if (blockType) {
    deprecated("`blockType` property in `BlockCard component`", {
      since: "5.7",
      alternative: "`title, icon and description` properties"
    });
    ({ title, icon, description } = blockType);
  }
  const { parentBlockClientId, parentBlockName } = useSelect(
    (select) => {
      if (parentClientId || isChild || !allowParentNavigation) {
        return {};
      }
      const { getBlockParents, getBlockName } = select(blockEditorStore);
      const parents = getBlockParents(clientId, false);
      const foundParentId = parents.find((parentId) => {
        const parentName = getBlockName(parentId);
        return parentName === "core/navigation" || hasBlockSupport(parentName, "listView");
      });
      return {
        parentBlockClientId: foundParentId,
        parentBlockName: foundParentId ? getBlockName(foundParentId) : null
      };
    },
    [clientId, allowParentNavigation, isChild, parentClientId]
  );
  const { selectBlock } = useDispatch(blockEditorStore);
  const TitleElement = parentClientId ? "div" : "h2";
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: clsx(
        "block-editor-block-card",
        {
          "is-parent": parentClientId,
          "is-child": isChild
        },
        className
      ),
      children: /* @__PURE__ */ jsxs(VStack, { children: [
        /* @__PURE__ */ jsxs(HStack, { justify: "flex-start", spacing: 0, children: [
          parentBlockClientId && /* @__PURE__ */ jsx(
            Button,
            {
              onClick: () => selectBlock(parentBlockClientId),
              label: parentBlockName ? sprintf(
                /* translators: %s: The name of the parent block. */
                __('Go to "%s" block'),
                getBlockType(parentBlockName)?.title
              ) : __("Go to parent block"),
              style: (
                // TODO: This style override is also used in ToolsPanelHeader.
                // It should be supported out-of-the-box by Button.
                { minWidth: 24, padding: 0 }
              ),
              icon: isRTL() ? chevronRight : chevronLeft,
              size: "small"
            }
          ),
          isChild && /* @__PURE__ */ jsx("span", { className: "block-editor-block-card__child-indicator-icon", children: /* @__PURE__ */ jsx(Icon, { icon: isRTL() ? arrowLeft : arrowRight }) }),
          /* @__PURE__ */ jsxs(
            OptionalParentSelectButton,
            {
              onClick: parentClientId ? () => {
                selectBlock(parentClientId);
              } : void 0,
              children: [
                /* @__PURE__ */ jsx(BlockIcon, { icon, showColors: true }),
                /* @__PURE__ */ jsxs(VStack, { spacing: 1, children: [
                  /* @__PURE__ */ jsxs(TitleElement, { className: "block-editor-block-card__title", children: [
                    /* @__PURE__ */ jsx("span", { className: "block-editor-block-card__name", children: !!name?.length ? name : title }),
                    !parentClientId && !isChild && !!name?.length && /* @__PURE__ */ jsx(Badge, { children: title })
                  ] }),
                  children
                ] })
              ]
            }
          )
        ] }),
        !parentClientId && !isChild && description && /* @__PURE__ */ jsx(Text, { className: "block-editor-block-card__description", children: description })
      ] })
    }
  );
}
var block_card_default = BlockCard;
export {
  block_card_default as default
};
//# sourceMappingURL=index.mjs.map
