// packages/editor/src/components/global-styles-sidebar/welcome-guide-image.js
import { jsx, jsxs } from "react/jsx-runtime";
function WelcomeGuideImage({ nonAnimatedSrc, animatedSrc }) {
  return /* @__PURE__ */ jsxs("picture", { className: "editor-welcome-guide__image", children: [
    /* @__PURE__ */ jsx(
      "source",
      {
        srcSet: nonAnimatedSrc,
        media: "(prefers-reduced-motion: reduce)"
      }
    ),
    /* @__PURE__ */ jsx("img", { src: animatedSrc, width: "312", height: "240", alt: "" })
  ] });
}
export {
  WelcomeGuideImage as default
};
//# sourceMappingURL=welcome-guide-image.mjs.map
