"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/block-library/src/navigation-link/shared/invalid-draft-display.js
var invalid_draft_display_exports = {};
__export(invalid_draft_display_exports, {
  InvalidDraftDisplay: () => InvalidDraftDisplay
});
module.exports = __toCommonJS(invalid_draft_display_exports);
var import_clsx = __toESM(require("clsx"));
var import_i18n = require("@wordpress/i18n");
var import_html_entities = require("@wordpress/html-entities");
var import_jsx_runtime = require("react/jsx-runtime");
function InvalidDraftDisplay({
  label,
  isInvalid,
  isDraft,
  className = "wp-block-navigation-link__label"
}) {
  if (!isInvalid && !isDraft) {
    return null;
  }
  const statusText = isInvalid ? (
    /* translators: Indicating that the navigation link is Invalid. */
    (0, import_i18n.__)("Invalid")
  ) : (
    /* translators: Indicating that the navigation link is a Draft. */
    (0, import_i18n.__)("Draft")
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "div",
    {
      className: (0, import_clsx.default)(
        "wp-block-navigation-link__placeholder-text",
        className,
        {
          "is-invalid": isInvalid,
          "is-draft": isDraft
        }
      ),
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
        // Some attributes are stored in an escaped form. It's a legacy issue.
        // Ideally they would be stored in a raw, unescaped form.
        // Unescape is used here to "recover" the escaped characters
        // so they display without encoding.
        // See `updateAttributes` for more details.
        children: `${(0, import_html_entities.decodeEntities)(label)} (${statusText})`.trim()
      })
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InvalidDraftDisplay
});
//# sourceMappingURL=invalid-draft-display.cjs.map
