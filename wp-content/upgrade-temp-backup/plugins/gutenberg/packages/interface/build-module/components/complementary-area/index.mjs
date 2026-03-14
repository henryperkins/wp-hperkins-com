// packages/interface/src/components/complementary-area/index.js
import clsx from "clsx";
import {
  Button,
  Panel,
  Slot,
  Fill,
  __unstableMotion as motion,
  __unstableAnimatePresence as AnimatePresence
} from "@wordpress/components";
import { useDispatch, useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { check, starEmpty, starFilled } from "@wordpress/icons";
import { useEffect, useRef, useState } from "@wordpress/element";
import { store as viewportStore } from "@wordpress/viewport";
import { store as preferencesStore } from "@wordpress/preferences";
import {
  useReducedMotion,
  useViewportMatch,
  usePrevious
} from "@wordpress/compose";
import { usePluginContext } from "@wordpress/plugins";
import ComplementaryAreaHeader from "../complementary-area-header/index.mjs";
import ComplementaryAreaMoreMenuItem from "../complementary-area-more-menu-item/index.mjs";
import ComplementaryAreaToggle from "../complementary-area-toggle/index.mjs";
import PinnedItems from "../pinned-items/index.mjs";
import { store as interfaceStore } from "../../store/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var ANIMATION_DURATION = 0.3;
function ComplementaryAreaSlot({ scope, ...props }) {
  return /* @__PURE__ */ jsx(Slot, { name: `ComplementaryArea/${scope}`, ...props });
}
var SIDEBAR_WIDTH = 280;
var variants = {
  open: { width: SIDEBAR_WIDTH },
  closed: { width: 0 },
  mobileOpen: { width: "100vw" }
};
function ComplementaryAreaFill({
  activeArea,
  isActive,
  scope,
  children,
  className,
  id
}) {
  const disableMotion = useReducedMotion();
  const isMobileViewport = useViewportMatch("medium", "<");
  const previousActiveArea = usePrevious(activeArea);
  const previousIsActive = usePrevious(isActive);
  const [, setState] = useState({});
  useEffect(() => {
    setState({});
  }, [isActive]);
  const transition = {
    type: "tween",
    duration: disableMotion || isMobileViewport || !!previousActiveArea && !!activeArea && activeArea !== previousActiveArea ? 0 : ANIMATION_DURATION,
    ease: [0.6, 0, 0.4, 1]
  };
  return /* @__PURE__ */ jsx(Fill, { name: `ComplementaryArea/${scope}`, children: /* @__PURE__ */ jsx(AnimatePresence, { initial: false, children: (previousIsActive || isActive) && /* @__PURE__ */ jsx(
    motion.div,
    {
      variants,
      initial: "closed",
      animate: isMobileViewport ? "mobileOpen" : "open",
      exit: "closed",
      transition,
      className: "interface-complementary-area__fill",
      children: /* @__PURE__ */ jsx(
        "div",
        {
          id,
          className,
          style: {
            width: isMobileViewport ? "100vw" : SIDEBAR_WIDTH
          },
          children
        }
      )
    }
  ) }) });
}
function useAdjustComplementaryListener(scope, identifier, activeArea, isActive, isSmall) {
  const previousIsSmallRef = useRef(false);
  const shouldOpenWhenNotSmallRef = useRef(false);
  const { enableComplementaryArea, disableComplementaryArea } = useDispatch(interfaceStore);
  useEffect(() => {
    if (isActive && isSmall && !previousIsSmallRef.current) {
      disableComplementaryArea(scope);
      shouldOpenWhenNotSmallRef.current = true;
    } else if (
      // If there is a flag indicating the complementary area should be
      // enabled when we go from small to big window size and we are going
      // from a small to big window size.
      shouldOpenWhenNotSmallRef.current && !isSmall && previousIsSmallRef.current
    ) {
      shouldOpenWhenNotSmallRef.current = false;
      enableComplementaryArea(scope, identifier);
    } else if (
      // If the flag is indicating the current complementary should be
      // reopened but another complementary area becomes active, remove
      // the flag.
      shouldOpenWhenNotSmallRef.current && activeArea && activeArea !== identifier
    ) {
      shouldOpenWhenNotSmallRef.current = false;
    }
    if (isSmall !== previousIsSmallRef.current) {
      previousIsSmallRef.current = isSmall;
    }
  }, [
    isActive,
    isSmall,
    scope,
    identifier,
    activeArea,
    disableComplementaryArea,
    enableComplementaryArea
  ]);
}
function ComplementaryArea({
  children,
  className,
  closeLabel = __("Close plugin"),
  identifier: identifierProp,
  header,
  headerClassName,
  icon: iconProp,
  isPinnable = true,
  panelClassName,
  scope,
  name,
  title,
  toggleShortcut,
  isActiveByDefault
}) {
  const context = usePluginContext();
  const icon = iconProp || context.icon;
  const identifier = identifierProp || `${context.name}/${name}`;
  const [isReady, setIsReady] = useState(false);
  const {
    isLoading,
    isActive,
    isPinned,
    activeArea,
    isSmall,
    isLarge,
    showIconLabels
  } = useSelect(
    (select) => {
      const {
        getActiveComplementaryArea,
        isComplementaryAreaLoading,
        isItemPinned
      } = select(interfaceStore);
      const { get } = select(preferencesStore);
      const _activeArea = getActiveComplementaryArea(scope);
      return {
        isLoading: isComplementaryAreaLoading(scope),
        isActive: _activeArea === identifier,
        isPinned: isItemPinned(scope, identifier),
        activeArea: _activeArea,
        isSmall: select(viewportStore).isViewportMatch("< medium"),
        isLarge: select(viewportStore).isViewportMatch("large"),
        showIconLabels: get("core", "showIconLabels")
      };
    },
    [identifier, scope]
  );
  const isMobileViewport = useViewportMatch("medium", "<");
  useAdjustComplementaryListener(
    scope,
    identifier,
    activeArea,
    isActive,
    isSmall
  );
  const {
    enableComplementaryArea,
    disableComplementaryArea,
    pinItem,
    unpinItem
  } = useDispatch(interfaceStore);
  useEffect(() => {
    if (isActiveByDefault && activeArea === void 0 && !isSmall) {
      enableComplementaryArea(scope, identifier);
    } else if (activeArea === void 0 && isSmall) {
      disableComplementaryArea(scope, identifier);
    }
    setIsReady(true);
  }, [
    activeArea,
    isActiveByDefault,
    scope,
    identifier,
    isSmall,
    enableComplementaryArea,
    disableComplementaryArea
  ]);
  if (!isReady) {
    return;
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    isPinnable && /* @__PURE__ */ jsx(PinnedItems, { scope, children: isPinned && /* @__PURE__ */ jsx(
      ComplementaryAreaToggle,
      {
        scope,
        identifier,
        isPressed: isActive && (!showIconLabels || isLarge),
        "aria-expanded": isActive,
        "aria-disabled": isLoading,
        label: title,
        icon: showIconLabels ? check : icon,
        showTooltip: !showIconLabels,
        variant: showIconLabels ? "tertiary" : void 0,
        size: "compact",
        shortcut: toggleShortcut
      }
    ) }),
    name && isPinnable && /* @__PURE__ */ jsx(
      ComplementaryAreaMoreMenuItem,
      {
        target: name,
        scope,
        icon,
        identifier,
        children: title
      }
    ),
    /* @__PURE__ */ jsxs(
      ComplementaryAreaFill,
      {
        activeArea,
        isActive,
        className: clsx("interface-complementary-area", className),
        scope,
        id: identifier.replace("/", ":"),
        children: [
          /* @__PURE__ */ jsx(
            ComplementaryAreaHeader,
            {
              className: headerClassName,
              closeLabel,
              onClose: () => disableComplementaryArea(scope),
              toggleButtonProps: {
                label: closeLabel,
                size: "compact",
                shortcut: toggleShortcut,
                scope,
                identifier
              },
              children: header || /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("h2", { className: "interface-complementary-area-header__title", children: title }),
                isPinnable && !isMobileViewport && /* @__PURE__ */ jsx(
                  Button,
                  {
                    className: "interface-complementary-area__pin-unpin-item",
                    icon: isPinned ? starFilled : starEmpty,
                    label: isPinned ? __("Unpin from toolbar") : __("Pin to toolbar"),
                    onClick: () => (isPinned ? unpinItem : pinItem)(
                      scope,
                      identifier
                    ),
                    isPressed: isPinned,
                    "aria-expanded": isPinned,
                    size: "compact"
                  }
                )
              ] })
            }
          ),
          /* @__PURE__ */ jsx(Panel, { className: panelClassName, children })
        ]
      }
    )
  ] });
}
ComplementaryArea.Slot = ComplementaryAreaSlot;
var complementary_area_default = ComplementaryArea;
export {
  complementary_area_default as default
};
//# sourceMappingURL=index.mjs.map
