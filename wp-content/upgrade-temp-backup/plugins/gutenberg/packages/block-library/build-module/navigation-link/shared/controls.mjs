// packages/block-library/src/navigation-link/shared/controls.js
import {
  Button,
  __experimentalToolsPanel as ToolsPanel,
  __experimentalToolsPanelItem as ToolsPanelItem,
  CheckboxControl,
  TextControl,
  TextareaControl
} from "@wordpress/components";
import { __, sprintf } from "@wordpress/i18n";
import { __unstableStripHTML as stripHTML } from "@wordpress/dom";
import {
  privateApis as blockEditorPrivateApis,
  store as blockEditorStore
} from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { external } from "@wordpress/icons";
import { useToolsPanelDropdownMenuProps } from "../../utils/hooks.mjs";
import { useHandleLinkChange } from "./use-handle-link-change.mjs";
import { useEntityBinding } from "./use-entity-binding.mjs";
import { getSuggestionsQuery } from "../link-ui/index.mjs";
import { useLinkPreview } from "./use-link-preview.mjs";
import { useIsInvalidLink } from "./use-is-invalid-link.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { LinkPicker, isHashLink, isRelativePath } = unlock(
  blockEditorPrivateApis
);
function getEntityTypeName(type, kind) {
  if (kind === "post-type") {
    switch (type) {
      case "post":
        return __("post");
      case "page":
        return __("page");
      default:
        return type || __("post");
    }
  }
  if (kind === "taxonomy") {
    switch (type) {
      case "category":
        return __("category");
      case "tag":
        return __("tag");
      default:
        return type || __("term");
    }
  }
  return type || __("item");
}
function Controls({
  attributes,
  setAttributes,
  clientId,
  isLinkEditable = true
}) {
  const { label, url, description, rel, opensInNewTab } = attributes;
  const dropdownMenuProps = useToolsPanelDropdownMenuProps();
  const { hasUrlBinding, isBoundEntityAvailable, entityRecord } = useEntityBinding({
    clientId,
    attributes
  });
  const [isInvalid, isDraft] = useIsInvalidLink(
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
  const handleLinkChange = useHandleLinkChange({
    clientId,
    attributes,
    setAttributes
  });
  const onNavigateToEntityRecord = useSelect(
    (select) => select(blockEditorStore).getSettings().onNavigateToEntityRecord,
    []
  );
  const homeUrl = useSelect((select) => {
    return select(coreStore).getEntityRecord("root", "__unstableBase")?.home;
  }, []);
  const blockEditingMode = useSelect(
    (select) => select(blockEditorStore).getBlockEditingMode(clientId),
    [clientId]
  );
  const isContentOnly = blockEditingMode === "contentOnly";
  const preview = useLinkPreview({
    url,
    entityRecord,
    type: attributes.type,
    hasBinding: hasUrlBinding,
    isEntityAvailable: isBoundEntityAvailable
  });
  const isViewableUrl = !!url && (!isHashLink(url) || isRelativePath(url) && !url.startsWith("/"));
  const viewUrl = isViewableUrl && url.startsWith("/") && homeUrl ? homeUrl + url : url;
  return /* @__PURE__ */ jsxs(
    ToolsPanel,
    {
      label: __("Settings"),
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
        /* @__PURE__ */ jsx(
          ToolsPanelItem,
          {
            hasValue: () => !!label,
            label: __("Text"),
            onDeselect: () => setAttributes({ label: "" }),
            isShownByDefault: true,
            children: /* @__PURE__ */ jsx(
              TextControl,
              {
                __next40pxDefaultSize: true,
                label: __("Text"),
                value: label ? stripHTML(label) : "",
                onChange: (labelValue) => {
                  setAttributes({ label: labelValue });
                },
                autoComplete: "off"
              }
            )
          }
        ),
        isLinkEditable && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            ToolsPanelItem,
            {
              hasValue: () => !!url,
              label: __("Link to"),
              onDeselect: () => setAttributes({
                url: void 0,
                id: void 0,
                kind: void 0,
                type: void 0
              }),
              isShownByDefault: true,
              children: /* @__PURE__ */ jsx(
                LinkPicker,
                {
                  preview,
                  onSelect: handleLinkChange,
                  suggestionsQuery: getSuggestionsQuery(
                    attributes.type,
                    attributes.kind
                  ),
                  label: __("Link to"),
                  help: helpText ? helpText : void 0
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(
            ToolsPanelItem,
            {
              hasValue: () => !!opensInNewTab,
              label: __("Open in new tab"),
              onDeselect: () => setAttributes({ opensInNewTab: false }),
              isShownByDefault: true,
              children: /* @__PURE__ */ jsx(
                CheckboxControl,
                {
                  label: __("Open in new tab"),
                  checked: opensInNewTab,
                  onChange: (value) => setAttributes({ opensInNewTab: value })
                }
              )
            }
          ),
          !!url && hasUrlBinding && isBoundEntityAvailable && entityRecord?.id && attributes.kind === "post-type" && onNavigateToEntityRecord && /* @__PURE__ */ jsx(
            Button,
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
              children: __("Edit")
            }
          ),
          isViewableUrl && /* @__PURE__ */ jsx(
            Button,
            {
              variant: "secondary",
              href: viewUrl,
              target: "_blank",
              icon: external,
              iconPosition: "right",
              __next40pxDefaultSize: true,
              className: "navigation-link-to__action-button",
              children: __("View")
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          ToolsPanelItem,
          {
            hasValue: () => !!description,
            label: __("Description"),
            onDeselect: () => setAttributes({ description: "" }),
            isShownByDefault: !isContentOnly,
            children: /* @__PURE__ */ jsx(
              TextareaControl,
              {
                label: __("Description"),
                value: description || "",
                onChange: (descriptionValue) => {
                  setAttributes({ description: descriptionValue });
                },
                help: __(
                  "The description will be displayed in the menu if the current theme supports it."
                )
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          ToolsPanelItem,
          {
            hasValue: () => !!rel,
            label: __("Rel attribute"),
            onDeselect: () => setAttributes({ rel: "" }),
            isShownByDefault: !isContentOnly,
            children: /* @__PURE__ */ jsx(
              TextControl,
              {
                __next40pxDefaultSize: true,
                label: __("Rel attribute"),
                value: rel || "",
                onChange: (relValue) => {
                  setAttributes({ rel: relValue });
                },
                autoComplete: "off",
                help: __(
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
  return __(
    "This link is invalid and will not appear on your site. Please update the link."
  );
}
function getDraftHelpText({ type, kind }) {
  const entityType = getEntityTypeName(type, kind);
  return sprintf(
    /* translators: %1$s is the entity type (e.g., "page", "post", "category") */
    __(
      "This link is to a draft %1$s and will not appear on your site until the %1$s is published."
    ),
    entityType
  );
}
export {
  Controls,
  getInvalidLinkHelpText
};
//# sourceMappingURL=controls.mjs.map
