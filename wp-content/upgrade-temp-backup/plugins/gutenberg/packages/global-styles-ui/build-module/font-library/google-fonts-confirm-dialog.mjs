// packages/global-styles-ui/src/font-library/google-fonts-confirm-dialog.tsx
import { __ } from "@wordpress/i18n";
import {
  Button,
  Card,
  CardBody,
  __experimentalHeading as Heading,
  __experimentalText as Text,
  __experimentalSpacer as Spacer
} from "@wordpress/components";
import { jsx, jsxs } from "react/jsx-runtime";
function GoogleFontsConfirmDialog() {
  const handleConfirm = () => {
    window.localStorage.setItem(
      "wp-font-library-google-fonts-permission",
      "true"
    );
    window.dispatchEvent(new Event("storage"));
  };
  return /* @__PURE__ */ jsx("div", { className: "font-library__google-fonts-confirm", children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardBody, { children: [
    /* @__PURE__ */ jsx(Heading, { level: 2, children: __("Connect to Google Fonts") }),
    /* @__PURE__ */ jsx(Spacer, { margin: 6 }),
    /* @__PURE__ */ jsx(Text, { as: "p", children: __(
      "To install fonts from Google you must give permission to connect directly to Google servers. The fonts you install will be downloaded from Google and stored on your site. Your site will then use these locally-hosted fonts."
    ) }),
    /* @__PURE__ */ jsx(Spacer, { margin: 3 }),
    /* @__PURE__ */ jsx(Text, { as: "p", children: __(
      "You can alternatively upload files directly on the Upload tab."
    ) }),
    /* @__PURE__ */ jsx(Spacer, { margin: 6 }),
    /* @__PURE__ */ jsx(
      Button,
      {
        __next40pxDefaultSize: true,
        variant: "primary",
        onClick: handleConfirm,
        children: __("Allow access to Google Fonts")
      }
    )
  ] }) }) });
}
var google_fonts_confirm_dialog_default = GoogleFontsConfirmDialog;
export {
  google_fonts_confirm_dialog_default as default
};
//# sourceMappingURL=google-fonts-confirm-dialog.mjs.map
