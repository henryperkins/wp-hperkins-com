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

// packages/block-editor/src/components/block-card/index.js
var block_card_exports = {};
__export(block_card_exports, {
  default: () => block_card_default
});
module.exports = __toCommonJS(block_card_exports);
var import_clsx = __toESM(require("clsx"));
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_deprecated = __toESM(require("@wordpress/deprecated"));
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_blocks = require("@wordpress/blocks");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_store = require("../../store/index.cjs");
var import_block_icon = __toESM(require("../block-icon/index.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var { Badge } = (0, import_lock_unlock.unlock)(import_components.privateApis);
function OptionalParentSelectButton({ children, onClick }) {
  if (!onClick) {
    return children;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Button,
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
    (0, import_deprecated.default)("`blockType` property in `BlockCard component`", {
      since: "5.7",
      alternative: "`title, icon and description` properties"
    });
    ({ title, icon, description } = blockType);
  }
  const { parentBlockClientId, parentBlockName } = (0, import_data.useSelect)(
    (select) => {
      if (parentClientId || isChild || !allowParentNavigation) {
        return {};
      }
      const { getBlockParents, getBlockName } = select(import_store.store);
      const parents = getBlockParents(clientId, false);
      const foundParentId = parents.find((parentId) => {
        const parentName = getBlockName(parentId);
        return parentName === "core/navigation" || (0, import_blocks.hasBlockSupport)(parentName, "listView");
      });
      return {
        parentBlockClientId: foundParentId,
        parentBlockName: foundParentId ? getBlockName(foundParentId) : null
      };
    },
    [clientId, allowParentNavigation, isChild, parentClientId]
  );
  const { selectBlock } = (0, import_data.useDispatch)(import_store.store);
  const TitleElement = parentClientId ? "div" : "h2";
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "div",
    {
      className: (0, import_clsx.default)(
        "block-editor-block-card",
        {
          "is-parent": parentClientId,
          "is-child": isChild
        },
        className
      ),
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { justify: "flex-start", spacing: 0, children: [
          parentBlockClientId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              onClick: () => selectBlock(parentBlockClientId),
              label: parentBlockName ? (0, import_i18n.sprintf)(
                /* translators: %s: The name of the parent block. */
                (0, import_i18n.__)('Go to "%s" block'),
                (0, import_blocks.getBlockType)(parentBlockName)?.title
              ) : (0, import_i18n.__)("Go to parent block"),
              style: (
                // TODO: This style override is also used in ToolsPanelHeader.
                // It should be supported out-of-the-box by Button.
                { minWidth: 24, padding: 0 }
              ),
              icon: (0, import_i18n.isRTL)() ? import_icons.chevronRight : import_icons.chevronLeft,
              size: "small"
            }
          ),
          isChild && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "block-editor-block-card__child-indicator-icon", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Icon, { icon: (0, import_i18n.isRTL)() ? import_icons.arrowLeft : import_icons.arrowRight }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            OptionalParentSelectButton,
            {
              onClick: parentClientId ? () => {
                selectBlock(parentClientId);
              } : void 0,
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_icon.default, { icon, showColors: true }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 1, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TitleElement, { className: "block-editor-block-card__title", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "block-editor-block-card__name", children: !!name?.length ? name : title }),
                    !parentClientId && !isChild && !!name?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: title })
                  ] }),
                  children
                ] })
              ]
            }
          )
        ] }),
        !parentClientId && !isChild && description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { className: "block-editor-block-card__description", children: description })
      ] })
    }
  );
}
var block_card_default = BlockCard;
//# sourceMappingURL=index.cjs.map
