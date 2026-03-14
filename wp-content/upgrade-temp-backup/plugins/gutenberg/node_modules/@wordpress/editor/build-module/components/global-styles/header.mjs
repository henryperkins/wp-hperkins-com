// packages/editor/src/components/global-styles/header.js
import {
  __experimentalHStack as HStack,
  __experimentalVStack as VStack,
  __experimentalSpacer as Spacer,
  __experimentalHeading as Heading,
  __experimentalView as View,
  Navigator
} from "@wordpress/components";
import { isRTL, __ } from "@wordpress/i18n";
import { chevronRight, chevronLeft } from "@wordpress/icons";
import { jsx, jsxs } from "react/jsx-runtime";
function ScreenHeader({ title, description, onBack }) {
  return /* @__PURE__ */ jsxs(VStack, { spacing: 0, children: [
    /* @__PURE__ */ jsx(View, { children: /* @__PURE__ */ jsx(Spacer, { marginBottom: 0, paddingX: 4, paddingY: 3, children: /* @__PURE__ */ jsxs(HStack, { spacing: 2, children: [
      /* @__PURE__ */ jsx(
        Navigator.BackButton,
        {
          icon: isRTL() ? chevronRight : chevronLeft,
          size: "small",
          label: __("Back"),
          onClick: onBack
        }
      ),
      /* @__PURE__ */ jsx(Spacer, { children: /* @__PURE__ */ jsx(
        Heading,
        {
          className: "editor-global-styles-header",
          level: 2,
          size: 13,
          children: title
        }
      ) })
    ] }) }) }),
    description && /* @__PURE__ */ jsx("p", { className: "editor-global-styles-header__description", children: description })
  ] });
}
var header_default = ScreenHeader;
export {
  header_default as default
};
//# sourceMappingURL=header.mjs.map
