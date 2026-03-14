"use strict";
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

// packages/fields/src/fields/date/date-view.tsx
var date_view_exports = {};
__export(date_view_exports, {
  default: () => date_view_default
});
module.exports = __toCommonJS(date_view_exports);
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_date = require("@wordpress/date");
var import_jsx_runtime = require("react/jsx-runtime");
var getFormattedDate = (dateToDisplay) => (0, import_date.dateI18n)(
  (0, import_date.getSettings)().formats.datetimeAbbreviated,
  (0, import_date.getDate)(dateToDisplay)
);
var DateView = ({ item }) => {
  const isDraftOrPrivate = ["draft", "private"].includes(
    item.status ?? ""
  );
  if (isDraftOrPrivate) {
    return (0, import_element.createInterpolateElement)(
      (0, import_i18n.sprintf)(
        /* translators: %s: page creation or modification date. */
        (0, import_i18n.__)("<span>Modified: <time>%s</time></span>"),
        getFormattedDate(item.date ?? null)
      ),
      {
        span: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
        time: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {})
      }
    );
  }
  const isScheduled = item.status === "future";
  if (isScheduled) {
    return (0, import_element.createInterpolateElement)(
      (0, import_i18n.sprintf)(
        /* translators: %s: page creation date */
        (0, import_i18n.__)("<span>Scheduled: <time>%s</time></span>"),
        getFormattedDate(item.date ?? null)
      ),
      {
        span: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
        time: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {})
      }
    );
  }
  const isPublished = item.status === "publish";
  if (isPublished) {
    return (0, import_element.createInterpolateElement)(
      (0, import_i18n.sprintf)(
        /* translators: %s: page creation time */
        (0, import_i18n.__)("<span>Published: <time>%s</time></span>"),
        getFormattedDate(item.date ?? null)
      ),
      {
        span: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
        time: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {})
      }
    );
  }
  const dateToDisplay = (0, import_date.getDate)(item.modified ?? null) > (0, import_date.getDate)(item.date ?? null) ? item.modified : item.date;
  const isPending = item.status === "pending";
  if (isPending) {
    return (0, import_element.createInterpolateElement)(
      (0, import_i18n.sprintf)(
        /* translators: %s: page creation or modification date. */
        (0, import_i18n.__)("<span>Modified: <time>%s</time></span>"),
        getFormattedDate(dateToDisplay ?? null)
      ),
      {
        span: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
        time: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {})
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", { children: getFormattedDate(item.date ?? null) });
};
var date_view_default = DateView;
//# sourceMappingURL=date-view.cjs.map
