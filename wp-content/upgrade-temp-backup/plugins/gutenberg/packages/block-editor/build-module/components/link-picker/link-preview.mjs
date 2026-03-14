// packages/block-editor/src/components/link-picker/link-preview.js
import {
  __experimentalTruncate as Truncate,
  __experimentalHStack as HStack,
  __experimentalVStack as VStack,
  FlexItem,
  privateApis as componentsPrivateApis
} from "@wordpress/components";
import { Icon, chevronDown } from "@wordpress/icons";
import { unlock } from "../../lock-unlock.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var { Badge } = unlock(componentsPrivateApis);
function LinkPreview({ title, url, image, badges }) {
  return /* @__PURE__ */ jsxs(HStack, { justify: "space-between", alignment: "top", children: [
    /* @__PURE__ */ jsx(FlexItem, { className: "link-preview-button__content", children: /* @__PURE__ */ jsxs(HStack, { alignment: "top", children: [
      image && /* @__PURE__ */ jsx(FlexItem, { className: "link-preview-button__image-container", children: /* @__PURE__ */ jsx(
        "img",
        {
          className: "link-preview-button__image",
          src: image,
          alt: ""
        }
      ) }),
      /* @__PURE__ */ jsxs(
        VStack,
        {
          className: "link-preview-button__details",
          alignment: "topLeft",
          children: [
            /* @__PURE__ */ jsx(
              Truncate,
              {
                numberOfLines: 1,
                className: "link-preview-button__title",
                children: title
              }
            ),
            url && /* @__PURE__ */ jsx(
              Truncate,
              {
                numberOfLines: 1,
                className: "link-preview-button__hint",
                children: url
              }
            ),
            badges && badges.length > 0 && /* @__PURE__ */ jsx(
              HStack,
              {
                className: "link-preview-button__badges",
                alignment: "left",
                children: badges.map((badge) => /* @__PURE__ */ jsx(
                  Badge,
                  {
                    intent: badge.intent,
                    children: badge.label
                  },
                  `${badge.label}|${badge.intent}`
                ))
              }
            )
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx(Icon, { icon: chevronDown, className: "link-preview-button__icon" })
  ] });
}
export {
  LinkPreview
};
//# sourceMappingURL=link-preview.mjs.map
