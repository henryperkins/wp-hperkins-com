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

// packages/interface/src/components/complementary-area/index.js
var complementary_area_exports = {};
__export(complementary_area_exports, {
  default: () => complementary_area_default
});
module.exports = __toCommonJS(complementary_area_exports);
var import_clsx = __toESM(require("clsx"));
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_element = require("@wordpress/element");
var import_viewport = require("@wordpress/viewport");
var import_preferences = require("@wordpress/preferences");
var import_compose = require("@wordpress/compose");
var import_plugins = require("@wordpress/plugins");
var import_complementary_area_header = __toESM(require("../complementary-area-header/index.cjs"));
var import_complementary_area_more_menu_item = __toESM(require("../complementary-area-more-menu-item/index.cjs"));
var import_complementary_area_toggle = __toESM(require("../complementary-area-toggle/index.cjs"));
var import_pinned_items = __toESM(require("../pinned-items/index.cjs"));
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var ANIMATION_DURATION = 0.3;
function ComplementaryAreaSlot({ scope, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Slot, { name: `ComplementaryArea/${scope}`, ...props });
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
  const disableMotion = (0, import_compose.useReducedMotion)();
  const isMobileViewport = (0, import_compose.useViewportMatch)("medium", "<");
  const previousActiveArea = (0, import_compose.usePrevious)(activeArea);
  const previousIsActive = (0, import_compose.usePrevious)(isActive);
  const [, setState] = (0, import_element.useState)({});
  (0, import_element.useEffect)(() => {
    setState({});
  }, [isActive]);
  const transition = {
    type: "tween",
    duration: disableMotion || isMobileViewport || !!previousActiveArea && !!activeArea && activeArea !== previousActiveArea ? 0 : ANIMATION_DURATION,
    ease: [0.6, 0, 0.4, 1]
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Fill, { name: `ComplementaryArea/${scope}`, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__unstableAnimatePresence, { initial: false, children: (previousIsActive || isActive) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.__unstableMotion.div,
    {
      variants,
      initial: "closed",
      animate: isMobileViewport ? "mobileOpen" : "open",
      exit: "closed",
      transition,
      className: "interface-complementary-area__fill",
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
  const previousIsSmallRef = (0, import_element.useRef)(false);
  const shouldOpenWhenNotSmallRef = (0, import_element.useRef)(false);
  const { enableComplementaryArea, disableComplementaryArea } = (0, import_data.useDispatch)(import_store.store);
  (0, import_element.useEffect)(() => {
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
  closeLabel = (0, import_i18n.__)("Close plugin"),
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
  const context = (0, import_plugins.usePluginContext)();
  const icon = iconProp || context.icon;
  const identifier = identifierProp || `${context.name}/${name}`;
  const [isReady, setIsReady] = (0, import_element.useState)(false);
  const {
    isLoading,
    isActive,
    isPinned,
    activeArea,
    isSmall,
    isLarge,
    showIconLabels
  } = (0, import_data.useSelect)(
    (select) => {
      const {
        getActiveComplementaryArea,
        isComplementaryAreaLoading,
        isItemPinned
      } = select(import_store.store);
      const { get } = select(import_preferences.store);
      const _activeArea = getActiveComplementaryArea(scope);
      return {
        isLoading: isComplementaryAreaLoading(scope),
        isActive: _activeArea === identifier,
        isPinned: isItemPinned(scope, identifier),
        activeArea: _activeArea,
        isSmall: select(import_viewport.store).isViewportMatch("< medium"),
        isLarge: select(import_viewport.store).isViewportMatch("large"),
        showIconLabels: get("core", "showIconLabels")
      };
    },
    [identifier, scope]
  );
  const isMobileViewport = (0, import_compose.useViewportMatch)("medium", "<");
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
  } = (0, import_data.useDispatch)(import_store.store);
  (0, import_element.useEffect)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    isPinnable && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_pinned_items.default, { scope, children: isPinned && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_complementary_area_toggle.default,
      {
        scope,
        identifier,
        isPressed: isActive && (!showIconLabels || isLarge),
        "aria-expanded": isActive,
        "aria-disabled": isLoading,
        label: title,
        icon: showIconLabels ? import_icons.check : icon,
        showTooltip: !showIconLabels,
        variant: showIconLabels ? "tertiary" : void 0,
        size: "compact",
        shortcut: toggleShortcut
      }
    ) }),
    name && isPinnable && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_complementary_area_more_menu_item.default,
      {
        target: name,
        scope,
        icon,
        identifier,
        children: title
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      ComplementaryAreaFill,
      {
        activeArea,
        isActive,
        className: (0, import_clsx.default)("interface-complementary-area", className),
        scope,
        id: identifier.replace("/", ":"),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_complementary_area_header.default,
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
              children: header || /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "interface-complementary-area-header__title", children: title }),
                isPinnable && !isMobileViewport && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_components.Button,
                  {
                    className: "interface-complementary-area__pin-unpin-item",
                    icon: isPinned ? import_icons.starFilled : import_icons.starEmpty,
                    label: isPinned ? (0, import_i18n.__)("Unpin from toolbar") : (0, import_i18n.__)("Pin to toolbar"),
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
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Panel, { className: panelClassName, children })
        ]
      }
    )
  ] });
}
ComplementaryArea.Slot = ComplementaryAreaSlot;
var complementary_area_default = ComplementaryArea;
//# sourceMappingURL=index.cjs.map
