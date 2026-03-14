// packages/edit-post/src/components/welcome-guide/image.js
import { jsx, jsxs } from "react/jsx-runtime";
function WelcomeGuideImage({ nonAnimatedSrc, animatedSrc }) {
  return /* @__PURE__ */ jsxs("picture", { className: "edit-post-welcome-guide__image", children: [
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
//# sourceMappingURL=image.mjs.map
