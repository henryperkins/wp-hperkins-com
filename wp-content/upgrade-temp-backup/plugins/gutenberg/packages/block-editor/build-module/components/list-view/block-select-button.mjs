// packages/block-editor/src/components/list-view/block-select-button.js
import clsx from "clsx";
import {
  __experimentalHStack as HStack,
  __experimentalTruncate as Truncate,
  Tooltip,
  privateApis as componentsPrivateApis
} from "@wordpress/components";
import { forwardRef } from "@wordpress/element";
import {
  Icon,
  lockSmall as lock,
  pinSmall,
  unseen,
  symbol
} from "@wordpress/icons";
import { SPACE, ENTER } from "@wordpress/keycodes";
import { useSelect } from "@wordpress/data";
import BlockIcon from "../block-icon/index.mjs";
import useBlockDisplayInformation from "../use-block-display-information/index.mjs";
import useBlockDisplayTitle from "../block-title/use-block-display-title.mjs";
import ListViewExpander from "./expander.mjs";
import { useBlockLock } from "../block-lock/index.mjs";
import useListViewImages from "./use-list-view-images.mjs";
import { store as blockEditorStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { getBlockVisibilityLabel } from "../block-visibility/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var { Badge } = unlock(componentsPrivateApis);
function ListViewBlockSelectButton({
  className,
  block: { clientId },
  onClick,
  onContextMenu,
  onMouseDown,
  onToggleExpanded,
  tabIndex,
  onFocus,
  onDragStart,
  onDragEnd,
  draggable,
  isExpanded,
  ariaDescribedBy
}, ref) {
  const blockInformation = useBlockDisplayInformation(clientId);
  const blockTitle = useBlockDisplayTitle({
    clientId,
    context: "list-view"
  });
  const { isLocked } = useBlockLock(clientId);
  const { hasPatternName, blockVisibility } = useSelect(
    (select) => {
      const { getBlockAttributes } = unlock(select(blockEditorStore));
      const attributes = getBlockAttributes(clientId);
      return {
        hasPatternName: !!attributes?.metadata?.patternName,
        blockVisibility: attributes?.metadata?.blockVisibility
      };
    },
    [clientId]
  );
  const shouldShowLockIcon = isLocked;
  const isSticky = blockInformation?.positionType === "sticky";
  const images = useListViewImages({ clientId, isExpanded });
  const visibilityLabel = getBlockVisibilityLabel(blockVisibility);
  const onDragStartHandler = (event) => {
    event.dataTransfer.clearData();
    onDragStart?.(event);
  };
  function onKeyDown(event) {
    if (event.keyCode === ENTER || event.keyCode === SPACE) {
      onClick(event);
    }
  }
  return /* @__PURE__ */ jsxs(
    "a",
    {
      className: clsx(
        "block-editor-list-view-block-select-button",
        className
      ),
      onClick,
      onContextMenu,
      onKeyDown,
      onMouseDown,
      ref,
      tabIndex,
      onFocus,
      onDragStart: onDragStartHandler,
      onDragEnd,
      draggable,
      href: `#block-${clientId}`,
      "aria-describedby": ariaDescribedBy,
      "aria-expanded": isExpanded,
      children: [
        /* @__PURE__ */ jsx(ListViewExpander, { onClick: onToggleExpanded }),
        /* @__PURE__ */ jsx(
          BlockIcon,
          {
            icon: hasPatternName ? symbol : blockInformation?.icon,
            showColors: true,
            context: "list-view"
          }
        ),
        /* @__PURE__ */ jsxs(
          HStack,
          {
            alignment: "center",
            className: "block-editor-list-view-block-select-button__label-wrapper",
            justify: "flex-start",
            spacing: 1,
            children: [
              /* @__PURE__ */ jsx("span", { className: "block-editor-list-view-block-select-button__title", children: /* @__PURE__ */ jsx(Truncate, { ellipsizeMode: "auto", children: blockTitle }) }),
              blockInformation?.anchor && /* @__PURE__ */ jsx("span", { className: "block-editor-list-view-block-select-button__anchor-wrapper", children: /* @__PURE__ */ jsx(Badge, { className: "block-editor-list-view-block-select-button__anchor", children: blockInformation.anchor }) }),
              isSticky && /* @__PURE__ */ jsx("span", { className: "block-editor-list-view-block-select-button__sticky", children: /* @__PURE__ */ jsx(Icon, { icon: pinSmall }) }),
              images.length ? /* @__PURE__ */ jsx(
                "span",
                {
                  className: "block-editor-list-view-block-select-button__images",
                  "aria-hidden": true,
                  children: images.map((image, index) => /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: "block-editor-list-view-block-select-button__image",
                      style: {
                        backgroundImage: `url(${image.url})`,
                        zIndex: images.length - index
                        // Ensure the first image is on top, and subsequent images are behind.
                      }
                    },
                    image.clientId
                  ))
                }
              ) : null,
              !!visibilityLabel && /* @__PURE__ */ jsx(Tooltip, { text: visibilityLabel, children: /* @__PURE__ */ jsx(
                "span",
                {
                  className: "block-editor-list-view-block-select-button__block-visibility",
                  "aria-hidden": "true",
                  children: /* @__PURE__ */ jsx(Icon, { icon: unseen })
                }
              ) }),
              shouldShowLockIcon && /* @__PURE__ */ jsx("span", { className: "block-editor-list-view-block-select-button__lock", children: /* @__PURE__ */ jsx(Icon, { icon: lock }) })
            ]
          }
        )
      ]
    }
  );
}
var block_select_button_default = forwardRef(ListViewBlockSelectButton);
export {
  block_select_button_default as default
};
//# sourceMappingURL=block-select-button.mjs.map
