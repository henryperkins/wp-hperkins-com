// packages/block-editor/src/components/link-control/link-preview.js
import clsx from "clsx";
import { __ } from "@wordpress/i18n";
import {
  Button,
  ExternalLink,
  __experimentalTruncate as Truncate,
  __experimentalHStack as HStack,
  Flex,
  privateApis as componentsPrivateApis
} from "@wordpress/components";
import { useCopyToClipboard } from "@wordpress/compose";
import { filterURLForDisplay, safeDecodeURI } from "@wordpress/url";
import {
  Icon,
  globe,
  info,
  linkOff,
  pencil,
  copySmall
} from "@wordpress/icons";
import { __unstableStripHTML as stripHTML } from "@wordpress/dom";
import { useDispatch, useSelect } from "@wordpress/data";
import { store as noticesStore } from "@wordpress/notices";
import { store as preferencesStore } from "@wordpress/preferences";
import { unlock } from "../../lock-unlock.mjs";
import { ViewerSlot } from "./viewer-slot.mjs";
import useRichUrlData from "./use-rich-url-data.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { Badge } = unlock(componentsPrivateApis);
function LinkPreview({
  value,
  onEditClick,
  hasRichPreviews = false,
  hasUnlinkControl = false,
  onRemove
}) {
  const showIconLabels = useSelect(
    (select) => select(preferencesStore).get("core", "showIconLabels"),
    []
  );
  const showRichPreviews = hasRichPreviews ? value?.url : null;
  const { richData, isFetching } = useRichUrlData(showRichPreviews);
  const hasRichData = richData && Object.keys(richData).length;
  const displayURL = value && filterURLForDisplay(safeDecodeURI(value.url), 24) || "";
  const isEmptyURL = !value?.url?.length;
  const displayTitle = !isEmptyURL && stripHTML(richData?.title || value?.title || displayURL);
  let icon;
  if (richData?.icon) {
    icon = /* @__PURE__ */ jsx("img", { src: richData?.icon, alt: "" });
  } else if (isEmptyURL) {
    icon = /* @__PURE__ */ jsx(Icon, { icon: info, size: 32 });
  } else {
    icon = /* @__PURE__ */ jsx(Icon, { icon: globe });
  }
  const { createNotice } = useDispatch(noticesStore);
  const ref = useCopyToClipboard(value.url, () => {
    createNotice("info", __("Link copied to clipboard."), {
      isDismissible: true,
      type: "snackbar"
    });
  });
  return /* @__PURE__ */ jsx(
    Flex,
    {
      role: "group",
      "aria-label": __("Manage link"),
      className: clsx("block-editor-link-control__preview", {
        "is-current": true,
        "is-rich": hasRichData,
        "is-fetching": !!isFetching,
        "is-preview": true,
        "is-error": isEmptyURL,
        "is-url-title": displayTitle === displayURL
      }),
      children: /* @__PURE__ */ jsxs(Flex, { gap: 0, align: "flex-start", children: [
        /* @__PURE__ */ jsxs(
          Flex,
          {
            className: "block-editor-link-control__link-information",
            role: "figure",
            "aria-label": (
              /* translators: Accessibility text for the link preview when editing a link. */
              __("Link information")
            ),
            justify: "start",
            align: "flex-start",
            children: [
              value?.image ? /* @__PURE__ */ jsx(
                Flex,
                {
                  className: "block-editor-link-control__preview-image",
                  justify: "center",
                  children: /* @__PURE__ */ jsx("img", { src: value?.image, alt: "" })
                }
              ) : /* @__PURE__ */ jsx(
                Flex,
                {
                  className: clsx(
                    "block-editor-link-control__preview-icon",
                    {
                      "is-image": richData?.icon
                    }
                  ),
                  justify: "center",
                  children: icon
                }
              ),
              /* @__PURE__ */ jsx(
                Flex,
                {
                  className: "block-editor-link-control__preview-details",
                  direction: "column",
                  gap: 2,
                  children: !isEmptyURL ? /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(
                      ExternalLink,
                      {
                        className: "block-editor-link-control__preview-title",
                        href: value.url,
                        children: /* @__PURE__ */ jsx(Truncate, { numberOfLines: 1, children: displayTitle })
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "block-editor-link-control__preview-info", children: /* @__PURE__ */ jsx(Truncate, { numberOfLines: 1, children: displayURL }) }),
                    value?.badges?.length > 0 && /* @__PURE__ */ jsx(
                      HStack,
                      {
                        className: "block-editor-link-control__preview-badges",
                        alignment: "left",
                        gap: 1,
                        children: value.badges.map(
                          (badge, index) => /* @__PURE__ */ jsx(
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
                  ] }) : /* @__PURE__ */ jsx("span", { className: "block-editor-link-control__preview-error-notice", children: __("Link is empty") })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            icon: pencil,
            label: __("Edit link"),
            onClick: onEditClick,
            size: "compact",
            showTooltip: !showIconLabels
          }
        ),
        hasUnlinkControl && /* @__PURE__ */ jsx(
          Button,
          {
            icon: linkOff,
            label: __("Remove link"),
            onClick: onRemove,
            size: "compact",
            showTooltip: !showIconLabels
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            icon: copySmall,
            label: __("Copy link"),
            ref,
            accessibleWhenDisabled: true,
            disabled: isEmptyURL,
            size: "compact",
            showTooltip: !showIconLabels
          }
        ),
        /* @__PURE__ */ jsx(ViewerSlot, { fillProps: value })
      ] })
    }
  );
}
export {
  LinkPreview as default
};
//# sourceMappingURL=link-preview.mjs.map
