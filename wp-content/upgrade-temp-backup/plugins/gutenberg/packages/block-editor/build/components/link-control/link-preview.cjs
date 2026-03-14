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

// packages/block-editor/src/components/link-control/link-preview.js
var link_preview_exports = {};
__export(link_preview_exports, {
  default: () => LinkPreview
});
module.exports = __toCommonJS(link_preview_exports);
var import_clsx = __toESM(require("clsx"));
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_compose = require("@wordpress/compose");
var import_url = require("@wordpress/url");
var import_icons = require("@wordpress/icons");
var import_dom = require("@wordpress/dom");
var import_data = require("@wordpress/data");
var import_notices = require("@wordpress/notices");
var import_preferences = require("@wordpress/preferences");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_viewer_slot = require("./viewer-slot.cjs");
var import_use_rich_url_data = __toESM(require("./use-rich-url-data.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var { Badge } = (0, import_lock_unlock.unlock)(import_components.privateApis);
function LinkPreview({
  value,
  onEditClick,
  hasRichPreviews = false,
  hasUnlinkControl = false,
  onRemove
}) {
  const showIconLabels = (0, import_data.useSelect)(
    (select) => select(import_preferences.store).get("core", "showIconLabels"),
    []
  );
  const showRichPreviews = hasRichPreviews ? value?.url : null;
  const { richData, isFetching } = (0, import_use_rich_url_data.default)(showRichPreviews);
  const hasRichData = richData && Object.keys(richData).length;
  const displayURL = value && (0, import_url.filterURLForDisplay)((0, import_url.safeDecodeURI)(value.url), 24) || "";
  const isEmptyURL = !value?.url?.length;
  const displayTitle = !isEmptyURL && (0, import_dom.__unstableStripHTML)(richData?.title || value?.title || displayURL);
  let icon;
  if (richData?.icon) {
    icon = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: richData?.icon, alt: "" });
  } else if (isEmptyURL) {
    icon = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_icons.Icon, { icon: import_icons.info, size: 32 });
  } else {
    icon = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_icons.Icon, { icon: import_icons.globe });
  }
  const { createNotice } = (0, import_data.useDispatch)(import_notices.store);
  const ref = (0, import_compose.useCopyToClipboard)(value.url, () => {
    createNotice("info", (0, import_i18n.__)("Link copied to clipboard."), {
      isDismissible: true,
      type: "snackbar"
    });
  });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Flex,
    {
      role: "group",
      "aria-label": (0, import_i18n.__)("Manage link"),
      className: (0, import_clsx.default)("block-editor-link-control__preview", {
        "is-current": true,
        "is-rich": hasRichData,
        "is-fetching": !!isFetching,
        "is-preview": true,
        "is-error": isEmptyURL,
        "is-url-title": displayTitle === displayURL
      }),
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Flex, { gap: 0, align: "flex-start", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          import_components.Flex,
          {
            className: "block-editor-link-control__link-information",
            role: "figure",
            "aria-label": (
              /* translators: Accessibility text for the link preview when editing a link. */
              (0, import_i18n.__)("Link information")
            ),
            justify: "start",
            align: "flex-start",
            children: [
              value?.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_components.Flex,
                {
                  className: "block-editor-link-control__preview-image",
                  justify: "center",
                  children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: value?.image, alt: "" })
                }
              ) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_components.Flex,
                {
                  className: (0, import_clsx.default)(
                    "block-editor-link-control__preview-icon",
                    {
                      "is-image": richData?.icon
                    }
                  ),
                  justify: "center",
                  children: icon
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_components.Flex,
                {
                  className: "block-editor-link-control__preview-details",
                  direction: "column",
                  gap: 2,
                  children: !isEmptyURL ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      import_components.ExternalLink,
                      {
                        className: "block-editor-link-control__preview-title",
                        href: value.url,
                        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalTruncate, { numberOfLines: 1, children: displayTitle })
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "block-editor-link-control__preview-info", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalTruncate, { numberOfLines: 1, children: displayURL }) }),
                    value?.badges?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      import_components.__experimentalHStack,
                      {
                        className: "block-editor-link-control__preview-badges",
                        alignment: "left",
                        gap: 1,
                        children: value.badges.map(
                          (badge, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                            Badge,
                            {
                              intent: badge.intent,
                              children: badge.label
                            },
                            `${badge.label}|${badge.intent}|${index}`
                          )
                        )
                      }
                    )
                  ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "block-editor-link-control__preview-error-notice", children: (0, import_i18n.__)("Link is empty") })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            icon: import_icons.pencil,
            label: (0, import_i18n.__)("Edit link"),
            onClick: onEditClick,
            size: "compact",
            showTooltip: !showIconLabels
          }
        ),
        hasUnlinkControl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            icon: import_icons.linkOff,
            label: (0, import_i18n.__)("Remove link"),
            onClick: onRemove,
            size: "compact",
            showTooltip: !showIconLabels
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            icon: import_icons.copySmall,
            label: (0, import_i18n.__)("Copy link"),
            ref,
            accessibleWhenDisabled: true,
            disabled: isEmptyURL,
            size: "compact",
            showTooltip: !showIconLabels
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_viewer_slot.ViewerSlot, { fillProps: value })
      ] })
    }
  );
}
//# sourceMappingURL=link-preview.cjs.map
