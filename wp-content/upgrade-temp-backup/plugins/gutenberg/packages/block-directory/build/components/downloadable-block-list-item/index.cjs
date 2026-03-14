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

// packages/block-directory/src/components/downloadable-block-list-item/index.js
var downloadable_block_list_item_exports = {};
__export(downloadable_block_list_item_exports, {
  default: () => downloadable_block_list_item_default
});
module.exports = __toCommonJS(downloadable_block_list_item_exports);
var import_clsx = __toESM(require("clsx"));
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_html_entities = require("@wordpress/html-entities");
var import_blocks = require("@wordpress/blocks");
var import_data = require("@wordpress/data");
var import_block_ratings = __toESM(require("../block-ratings/index.cjs"));
var import_downloadable_block_icon = __toESM(require("../downloadable-block-icon/index.cjs"));
var import_downloadable_block_notice = __toESM(require("../downloadable-block-notice/index.cjs"));
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function getDownloadableBlockLabel({ title, rating, ratingCount }, { hasNotice, isInstalled, isInstalling }) {
  const stars = Math.round(rating / 0.5) * 0.5;
  if (!isInstalled && hasNotice) {
    return (0, import_i18n.sprintf)("Retry installing %s.", (0, import_html_entities.decodeEntities)(title));
  }
  if (isInstalled) {
    return (0, import_i18n.sprintf)("Add %s.", (0, import_html_entities.decodeEntities)(title));
  }
  if (isInstalling) {
    return (0, import_i18n.sprintf)("Installing %s.", (0, import_html_entities.decodeEntities)(title));
  }
  if (ratingCount < 1) {
    return (0, import_i18n.sprintf)("Install %s.", (0, import_html_entities.decodeEntities)(title));
  }
  return (0, import_i18n.sprintf)(
    /* translators: 1: block title, 2: average rating, 3: total ratings count. */
    (0, import_i18n._n)(
      "Install %1$s. %2$s stars with %3$s review.",
      "Install %1$s. %2$s stars with %3$s reviews.",
      ratingCount
    ),
    (0, import_html_entities.decodeEntities)(title),
    stars,
    ratingCount
  );
}
function DownloadableBlockListItem({ item, onClick }) {
  const { author, description, icon, rating, title } = item;
  const isInstalled = !!(0, import_blocks.getBlockType)(item.name);
  const { hasNotice, isInstalling, isInstallable } = (0, import_data.useSelect)(
    (select) => {
      const { getErrorNoticeForBlock, isInstalling: isBlockInstalling } = select(import_store.store);
      const notice = getErrorNoticeForBlock(item.id);
      const hasFatal = notice && notice.isFatal;
      return {
        hasNotice: !!notice,
        isInstalling: isBlockInstalling(item.id),
        isInstallable: !hasFatal
      };
    },
    [item]
  );
  let statusText = "";
  if (isInstalled) {
    statusText = (0, import_i18n.__)("Installed!");
  } else if (isInstalling) {
    statusText = (0, import_i18n.__)("Installing\u2026");
  }
  const itemLabel = getDownloadableBlockLabel(item, {
    hasNotice,
    isInstalled,
    isInstalling
  });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Tooltip, { placement: "top", text: itemLabel, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.Composite.Item,
    {
      className: (0, import_clsx.default)(
        "block-directory-downloadable-block-list-item",
        isInstalling && "is-installing"
      ),
      accessibleWhenDisabled: true,
      disabled: isInstalling || !isInstallable,
      onClick: (event) => {
        event.preventDefault();
        onClick();
      },
      "aria-label": itemLabel,
      type: "button",
      role: "option",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "block-directory-downloadable-block-list-item__icon", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_downloadable_block_icon.default, { icon, title }),
          isInstalling ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "block-directory-downloadable-block-list-item__spinner", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Spinner, {}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_ratings.default, { rating })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "block-directory-downloadable-block-list-item__details", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "block-directory-downloadable-block-list-item__title", children: (0, import_element.createInterpolateElement)(
            (0, import_i18n.sprintf)(
              /* translators: 1: block title. 2: author name. */
              (0, import_i18n.__)("%1$s <span>by %2$s</span>"),
              (0, import_html_entities.decodeEntities)(title),
              author
            ),
            {
              span: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "block-directory-downloadable-block-list-item__author" })
            }
          ) }),
          hasNotice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_downloadable_block_notice.default, { block: item }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "block-directory-downloadable-block-list-item__desc", children: !!statusText ? statusText : (0, import_html_entities.decodeEntities)(description) }),
            isInstallable && !(isInstalled || isInstalling) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.VisuallyHidden, { children: (0, import_i18n.__)("Install block") })
          ] })
        ] })
      ]
    }
  ) });
}
var downloadable_block_list_item_default = DownloadableBlockListItem;
//# sourceMappingURL=index.cjs.map
