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

// packages/block-directory/src/components/block-ratings/stars.js
var stars_exports = {};
__export(stars_exports, {
  default: () => stars_default
});
module.exports = __toCommonJS(stars_exports);
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_jsx_runtime = require("react/jsx-runtime");
function Stars({ rating }) {
  const stars = Math.round(rating / 0.5) * 0.5;
  const fullStarCount = Math.floor(rating);
  const halfStarCount = Math.ceil(rating - fullStarCount);
  const emptyStarCount = 5 - (fullStarCount + halfStarCount);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "span",
    {
      "aria-label": (0, import_i18n.sprintf)(
        /* translators: %s: number of stars. */
        (0, import_i18n.__)("%s out of 5 stars"),
        stars
      ),
      children: [
        Array.from({ length: fullStarCount }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_icons.Icon,
          {
            className: "block-directory-block-ratings__star-full",
            icon: import_icons.starFilled,
            size: 16
          },
          `full_stars_${i}`
        )),
        Array.from({ length: halfStarCount }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_icons.Icon,
          {
            className: "block-directory-block-ratings__star-half-full",
            icon: import_icons.starHalf,
            size: 16
          },
          `half_stars_${i}`
        )),
        Array.from({ length: emptyStarCount }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_icons.Icon,
          {
            className: "block-directory-block-ratings__star-empty",
            icon: import_icons.starEmpty,
            size: 16
          },
          `empty_stars_${i}`
        ))
      ]
    }
  );
}
var stars_default = Stars;
//# sourceMappingURL=stars.cjs.map
