"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/block-library/src/navigation-link/shared/controls.js
var controls_exports = {};
__export(controls_exports, {
  Controls: () => Controls,
  getInvalidLinkHelpText: () => getInvalidLinkHelpText
});
module.exports = __toCommonJS(controls_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_dom = require("@wordpress/dom");
var import_block_editor = require("@wordpress/block-editor");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_icons = require("@wordpress/icons");
var import_hooks = require("../../utils/hooks.cjs");
var import_use_handle_link_change = require("./use-handle-link-change.cjs");
var import_use_entity_binding = require("./use-entity-binding.cjs");
var import_link_ui = require("../link-ui/index.cjs");
var import_use_link_preview = require("./use-link-preview.cjs");
var import_use_is_invalid_link = require("./use-is-invalid-link.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { LinkPicker, isHashLink, isRelativePath } = (0, import_lock_unlock.unlock)(
  import_block_editor.privateApis
);
function getEntityTypeName(type, kind) {
  if (kind === "post-type") {
    switch (type) {
      case "post":
        return (0, import_i18n.__)("post");
      case "page":
        return (0, import_i18n.__)("page");
      default:
        return type || (0, import_i18n.__)("post");
    }
  }
  if (kind === "taxonomy") {
    switch (type) {
      case "category":
        return (0, import_i18n.__)("category");
      case "tag":
        return (0, import_i18n.__)("tag");
      default:
        return type || (0, import_i18n.__)("term");
    }
  }
  return type || (0, import_i18n.__)("item");
}
function Controls({
  attributes,
  setAttributes,
  clientId,
  isLinkEditable = true
}) {
  const { label, url, description, rel, opensInNewTab } = attributes;
  const dropdownMenuProps = (0, import_hooks.useToolsPanelDropdownMenuProps)();
  const { hasUrlBinding, isBoundEntityAvailable, entityRecord } = (0, import_use_entity_binding.useEntityBinding)({
    clientId,
    attributes
  });
  const [isInvalid, isDraft] = (0, import_use_is_invalid_link.useIsInvalidLink)(
    attributes.kind,
    attributes.type,
    entityRecord?.id,
    hasUrlBinding
  );
  let helpText = "";
  if (isInvalid || hasUrlBinding && !isBoundEntityAvailable) {
    helpText = getInvalidLinkHelpText();
  } else if (isDraft) {
    helpText = getDraftHelpText({
      type: attributes.type,
      kind: attributes.kind
    });
  }
  const handleLinkChange = (0, import_use_handle_link_change.useHandleLinkChange)({
    clientId,
    attributes,
    setAttributes
  });
  const onNavigateToEntityRecord = (0, import_data.useSelect)(
    (select) => select(import_block_editor.store).getSettings().onNavigateToEntityRecord,
    []
  );
  const homeUrl = (0, import_data.useSelect)((select) => {
    return select(import_core_data.store).getEntityRecord("root", "__unstableBase")?.home;
  }, []);
  const blockEditingMode = (0, import_data.useSelect)(
    (select) => select(import_block_editor.store).getBlockEditingMode(clientId),
    [clientId]
  );
  const isContentOnly = blockEditingMode === "contentOnly";
  const preview = (0, import_use_link_preview.useLinkPreview)({
    url,
    entityRecord,
    type: attributes.type,
    hasBinding: hasUrlBinding,
    isEntityAvailable: isBoundEntityAvailable
  });
  const isViewableUrl = !!url && (!isHashLink(url) || isRelativePath(url) && !url.startsWith("/"));
  const viewUrl = isViewableUrl && url.startsWith("/") && homeUrl ? homeUrl + url : url;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.__experimentalToolsPanel,
    {
      label: (0, import_i18n.__)("Settings"),
      resetAll: () => {
        setAttributes({
          label: "",
          url: "",
          description: "",
          rel: "",
          opensInNewTab: false
        });
      },
      dropdownMenuProps,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.__experimentalToolsPanelItem,
          {
            hasValue: () => !!label,
            label: (0, import_i18n.__)("Text"),
            onDeselect: () => setAttributes({ label: "" }),
            isShownByDefault: true,
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.TextControl,
              {
                __next40pxDefaultSize: true,
                label: (0, import_i18n.__)("Text"),
                value: label ? (0, import_dom.__unstableStripHTML)(label) : "",
                onChange: (labelValue) => {
                  setAttributes({ label: labelValue });
                },
                autoComplete: "off"
              }
            )
          }
        ),
        isLinkEditable && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.__experimentalToolsPanelItem,
            {
              hasValue: () => !!url,
              label: (0, import_i18n.__)("Link to"),
              onDeselect: () => setAttributes({
                url: void 0,
                id: void 0,
                kind: void 0,
                type: void 0
              }),
              isShownByDefault: true,
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                LinkPicker,
                {
                  preview,
                  onSelect: handleLinkChange,
                  suggestionsQuery: (0, import_link_ui.getSuggestionsQuery)(
                    attributes.type,
                    attributes.kind
                  ),
                  label: (0, import_i18n.__)("Link to"),
                  help: helpText ? helpText : void 0
                }
              )
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.__experimentalToolsPanelItem,
            {
              hasValue: () => !!opensInNewTab,
              label: (0, import_i18n.__)("Open in new tab"),
              onDeselect: () => setAttributes({ opensInNewTab: false }),
              isShownByDefault: true,
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_components.CheckboxControl,
                {
                  label: (0, import_i18n.__)("Open in new tab"),
                  checked: opensInNewTab,
                  onChange: (value) => setAttributes({ opensInNewTab: value })
                }
              )
            }
          ),
          !!url && hasUrlBinding && isBoundEntityAvailable && entityRecord?.id && attributes.kind === "post-type" && onNavigateToEntityRecord && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              variant: "secondary",
              onClick: () => {
                onNavigateToEntityRecord({
                  postId: entityRecord.id,
                  postType: attributes.type
                });
              },
              __next40pxDefaultSize: true,
              className: "navigation-link-to__action-button",
              children: (0, import_i18n.__)("Edit")
            }
          ),
          isViewableUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              variant: "secondary",
              href: viewUrl,
              target: "_blank",
              icon: import_icons.external,
              iconPosition: "right",
              __next40pxDefaultSize: true,
              className: "navigation-link-to__action-button",
              children: (0, import_i18n.__)("View")
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.__experimentalToolsPanelItem,
          {
            hasValue: () => !!description,
            label: (0, import_i18n.__)("Description"),
            onDeselect: () => setAttributes({ description: "" }),
            isShownByDefault: !isContentOnly,
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.TextareaControl,
              {
                label: (0, import_i18n.__)("Description"),
                value: description || "",
                onChange: (descriptionValue) => {
                  setAttributes({ description: descriptionValue });
                },
                help: (0, import_i18n.__)(
                  "The description will be displayed in the menu if the current theme supports it."
                )
              }
            )
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.__experimentalToolsPanelItem,
          {
            hasValue: () => !!rel,
            label: (0, import_i18n.__)("Rel attribute"),
            onDeselect: () => setAttributes({ rel: "" }),
            isShownByDefault: !isContentOnly,
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.TextControl,
              {
                __next40pxDefaultSize: true,
                label: (0, import_i18n.__)("Rel attribute"),
                value: rel || "",
                onChange: (relValue) => {
                  setAttributes({ rel: relValue });
                },
                autoComplete: "off",
                help: (0, import_i18n.__)(
                  "The relationship of the linked URL as space-separated link types."
                )
              }
            )
          }
        )
      ]
    }
  );
}
function getInvalidLinkHelpText() {
  return (0, import_i18n.__)(
    "This link is invalid and will not appear on your site. Please update the link."
  );
}
function getDraftHelpText({ type, kind }) {
  const entityType = getEntityTypeName(type, kind);
  return (0, import_i18n.sprintf)(
    /* translators: %1$s is the entity type (e.g., "page", "post", "category") */
    (0, import_i18n.__)(
      "This link is to a draft %1$s and will not appear on your site until the %1$s is published."
    ),
    entityType
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Controls,
  getInvalidLinkHelpText
});
//# sourceMappingURL=controls.cjs.map
