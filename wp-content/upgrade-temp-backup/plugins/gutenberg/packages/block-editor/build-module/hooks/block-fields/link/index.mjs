// packages/block-editor/src/hooks/block-fields/link/index.js
import {
  Button,
  Icon,
  __experimentalGrid as Grid,
  Popover
} from "@wordpress/components";
import { useMemo, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { link } from "@wordpress/icons";
import { prependHTTP } from "@wordpress/url";
import LinkControl from "../../../components/link-control/index.mjs";
import { useInspectorPopoverPlacement } from "../use-inspector-popover-placement.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var NEW_TAB_REL = "noreferrer noopener";
var NEW_TAB_TARGET = "_blank";
var NOFOLLOW_REL = "nofollow";
function getUpdatedLinkAttributes({
  rel = "",
  url = "",
  opensInNewTab,
  nofollow
}) {
  let newLinkTarget;
  let updatedRel = rel;
  if (opensInNewTab) {
    newLinkTarget = NEW_TAB_TARGET;
    updatedRel = updatedRel?.includes(NEW_TAB_REL) ? updatedRel : updatedRel + ` ${NEW_TAB_REL}`;
  } else {
    const relRegex = new RegExp(`\\b${NEW_TAB_REL}\\s*`, "g");
    updatedRel = updatedRel?.replace(relRegex, "").trim();
  }
  if (nofollow) {
    updatedRel = updatedRel?.includes(NOFOLLOW_REL) ? updatedRel : (updatedRel + ` ${NOFOLLOW_REL}`).trim();
  } else {
    const relRegex = new RegExp(`\\b${NOFOLLOW_REL}\\s*`, "g");
    updatedRel = updatedRel?.replace(relRegex, "").trim();
  }
  return {
    url: prependHTTP(url),
    linkTarget: newLinkTarget,
    rel: updatedRel || void 0
  };
}
function Link({ data, field, onChange }) {
  const [isLinkControlOpen, setIsLinkControlOpen] = useState(false);
  const { popoverProps } = useInspectorPopoverPlacement({
    isControl: true
  });
  const value = field.getValue({ item: data });
  const url = value?.url;
  const rel = value?.rel || "";
  const target = value?.linkTarget;
  const opensInNewTab = target === NEW_TAB_TARGET;
  const nofollow = rel === NOFOLLOW_REL;
  const linkValue = useMemo(
    () => ({ url, opensInNewTab, nofollow }),
    [url, opensInNewTab, nofollow]
  );
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Button,
      {
        __next40pxDefaultSize: true,
        className: "block-editor-content-only-controls__link",
        onClick: () => {
          setIsLinkControlOpen(true);
        },
        children: /* @__PURE__ */ jsxs(
          Grid,
          {
            rowGap: 0,
            columnGap: 8,
            templateColumns: "24px 1fr",
            className: "block-editor-content-only-controls__link-row",
            children: [
              url && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Icon, { icon: link, size: 24 }),
                /* @__PURE__ */ jsx("span", { className: "block-editor-content-only-controls__link-title", children: url })
              ] }),
              !url && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(
                  Icon,
                  {
                    icon: link,
                    size: 24,
                    style: { opacity: 0.3 }
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "block-editor-content-only-controls__link-title", children: __("Link") })
              ] })
            ]
          }
        )
      }
    ),
    isLinkControlOpen && /* @__PURE__ */ jsx(
      Popover,
      {
        onClose: () => {
          setIsLinkControlOpen(false);
        },
        ...popoverProps ?? {},
        children: /* @__PURE__ */ jsx(
          LinkControl,
          {
            value: linkValue,
            onChange: (newValues) => {
              const updatedAttrs = getUpdatedLinkAttributes({
                rel,
                ...newValues
              });
              onChange(
                field.setValue({
                  item: data,
                  value: updatedAttrs
                })
              );
            },
            onRemove: () => {
              onChange(
                field.setValue({
                  item: data,
                  value: {}
                })
              );
            }
          }
        )
      }
    )
  ] });
}
export {
  NEW_TAB_REL,
  NEW_TAB_TARGET,
  NOFOLLOW_REL,
  Link as default,
  getUpdatedLinkAttributes
};
//# sourceMappingURL=index.mjs.map
