// packages/block-directory/src/components/block-ratings/stars.js
import { __, sprintf } from "@wordpress/i18n";
import { Icon, starEmpty, starFilled, starHalf } from "@wordpress/icons";
import { jsx, jsxs } from "react/jsx-runtime";
function Stars({ rating }) {
  const stars = Math.round(rating / 0.5) * 0.5;
  const fullStarCount = Math.floor(rating);
  const halfStarCount = Math.ceil(rating - fullStarCount);
  const emptyStarCount = 5 - (fullStarCount + halfStarCount);
  return /* @__PURE__ */ jsxs(
    "span",
    {
      "aria-label": sprintf(
        /* translators: %s: number of stars. */
        __("%s out of 5 stars"),
        stars
      ),
      children: [
        Array.from({ length: fullStarCount }).map((_, i) => /* @__PURE__ */ jsx(
          Icon,
          {
            className: "block-directory-block-ratings__star-full",
            icon: starFilled,
            size: 16
          },
          `full_stars_${i}`
        )),
        Array.from({ length: halfStarCount }).map((_, i) => /* @__PURE__ */ jsx(
          Icon,
          {
            className: "block-directory-block-ratings__star-half-full",
            icon: starHalf,
            size: 16
          },
          `half_stars_${i}`
        )),
        Array.from({ length: emptyStarCount }).map((_, i) => /* @__PURE__ */ jsx(
          Icon,
          {
            className: "block-directory-block-ratings__star-empty",
            icon: starEmpty,
            size: 16
          },
          `empty_stars_${i}`
        ))
      ]
    }
  );
}
var stars_default = Stars;
export {
  stars_default as default
};
//# sourceMappingURL=stars.mjs.map
