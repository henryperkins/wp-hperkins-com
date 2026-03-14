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

// packages/block-editor/src/components/list-view/block-select-button.js
var block_select_button_exports = {};
__export(block_select_button_exports, {
  default: () => block_select_button_default
});
module.exports = __toCommonJS(block_select_button_exports);
var import_clsx = __toESM(require("clsx"));
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_icons = require("@wordpress/icons");
var import_keycodes = require("@wordpress/keycodes");
var import_data = require("@wordpress/data");
var import_block_icon = __toESM(require("../block-icon/index.cjs"));
var import_use_block_display_information = __toESM(require("../use-block-display-information/index.cjs"));
var import_use_block_display_title = __toESM(require("../block-title/use-block-display-title.cjs"));
var import_expander = __toESM(require("./expander.cjs"));
var import_block_lock = require("../block-lock/index.cjs");
var import_use_list_view_images = __toESM(require("./use-list-view-images.cjs"));
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_block_visibility = require("../block-visibility/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { Badge } = (0, import_lock_unlock.unlock)(import_components.privateApis);
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
  const blockInformation = (0, import_use_block_display_information.default)(clientId);
  const blockTitle = (0, import_use_block_display_title.default)({
    clientId,
    context: "list-view"
  });
  const { isLocked } = (0, import_block_lock.useBlockLock)(clientId);
  const { hasPatternName, blockVisibility } = (0, import_data.useSelect)(
    (select) => {
      const { getBlockAttributes } = (0, import_lock_unlock.unlock)(select(import_store.store));
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
  const images = (0, import_use_list_view_images.default)({ clientId, isExpanded });
  const visibilityLabel = (0, import_block_visibility.getBlockVisibilityLabel)(blockVisibility);
  const onDragStartHandler = (event) => {
    event.dataTransfer.clearData();
    onDragStart?.(event);
  };
  function onKeyDown(event) {
    if (event.keyCode === import_keycodes.ENTER || event.keyCode === import_keycodes.SPACE) {
      onClick(event);
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "a",
    {
      className: (0, import_clsx.default)(
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
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_expander.default, { onClick: onToggleExpanded }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_block_icon.default,
          {
            icon: hasPatternName ? import_icons.symbol : blockInformation?.icon,
            showColors: true,
            context: "list-view"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          import_components.__experimentalHStack,
          {
            alignment: "center",
            className: "block-editor-list-view-block-select-button__label-wrapper",
            justify: "flex-start",
            spacing: 1,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "block-editor-list-view-block-select-button__title", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalTruncate, { ellipsizeMode: "auto", children: blockTitle }) }),
              blockInformation?.anchor && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "block-editor-list-view-block-select-button__anchor-wrapper", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { className: "block-editor-list-view-block-select-button__anchor", children: blockInformation.anchor }) }),
              isSticky && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "block-editor-list-view-block-select-button__sticky", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_icons.Icon, { icon: import_icons.pinSmall }) }),
              images.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "span",
                {
                  className: "block-editor-list-view-block-select-button__images",
                  "aria-hidden": true,
                  children: images.map((image, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
              !!visibilityLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Tooltip, { text: visibilityLabel, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "span",
                {
                  className: "block-editor-list-view-block-select-button__block-visibility",
                  "aria-hidden": "true",
                  children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_icons.Icon, { icon: import_icons.unseen })
                }
              ) }),
              shouldShowLockIcon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "block-editor-list-view-block-select-button__lock", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_icons.Icon, { icon: import_icons.lockSmall }) })
            ]
          }
        )
      ]
    }
  );
}
var block_select_button_default = (0, import_element.forwardRef)(ListViewBlockSelectButton);
//# sourceMappingURL=block-select-button.cjs.map
