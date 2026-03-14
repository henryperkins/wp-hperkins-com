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

// packages/editor/src/components/post-schedule/label.js
var label_exports = {};
__export(label_exports, {
  default: () => PostScheduleLabel,
  getFullPostScheduleLabel: () => getFullPostScheduleLabel,
  getPostScheduleLabel: () => getPostScheduleLabel,
  usePostScheduleLabel: () => usePostScheduleLabel
});
module.exports = __toCommonJS(label_exports);
var import_i18n = require("@wordpress/i18n");
var import_date = require("@wordpress/date");
var import_data = require("@wordpress/data");
var import_store = require("../../store/index.cjs");
function PostScheduleLabel(props) {
  return usePostScheduleLabel(props);
}
function usePostScheduleLabel({ full = false } = {}) {
  const { date, isFloating } = (0, import_data.useSelect)(
    (select) => ({
      date: select(import_store.store).getEditedPostAttribute("date"),
      isFloating: select(import_store.store).isEditedPostDateFloating()
    }),
    []
  );
  return full ? getFullPostScheduleLabel(date) : getPostScheduleLabel(date, { isFloating });
}
function getFullPostScheduleLabel(dateAttribute) {
  const date = (0, import_date.getDate)(dateAttribute);
  const timezoneAbbreviation = getTimezoneAbbreviation();
  const formattedDate = (0, import_date.dateI18n)(
    // translators: Use a non-breaking space between 'g:i' and 'a' if appropriate.
    (0, import_i18n._x)("F j, Y g:i\xA0a", "post schedule full date format"),
    date
  );
  return (0, import_i18n.isRTL)() ? `${timezoneAbbreviation} ${formattedDate}` : `${formattedDate} ${timezoneAbbreviation}`;
}
function getPostScheduleLabel(dateAttribute, { isFloating = false, now = /* @__PURE__ */ new Date() } = {}) {
  if (!dateAttribute || isFloating) {
    return (0, import_i18n.__)("Immediately");
  }
  if (!isTimezoneSameAsSiteTimezone(now)) {
    return getFullPostScheduleLabel(dateAttribute);
  }
  const date = (0, import_date.getDate)(dateAttribute);
  if (isSameDay(date, now)) {
    return (0, import_i18n.sprintf)(
      // translators: %s: Time of day the post is scheduled for.
      (0, import_i18n.__)("Today at %s"),
      // translators: If using a space between 'g:i' and 'a', use a non-breaking space.
      (0, import_date.dateI18n)((0, import_i18n._x)("g:i\xA0a", "post schedule time format"), date)
    );
  }
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (isSameDay(date, tomorrow)) {
    return (0, import_i18n.sprintf)(
      // translators: %s: Time of day the post is scheduled for.
      (0, import_i18n.__)("Tomorrow at %s"),
      // translators: If using a space between 'g:i' and 'a', use a non-breaking space.
      (0, import_date.dateI18n)((0, import_i18n._x)("g:i\xA0a", "post schedule time format"), date)
    );
  }
  if (date.getFullYear() === now.getFullYear()) {
    return (0, import_date.dateI18n)(
      // translators: If using a space between 'g:i' and 'a', use a non-breaking space.
      (0, import_i18n._x)("F j g:i\xA0a", "post schedule date format without year"),
      date
    );
  }
  return (0, import_date.dateI18n)(
    // translators: Use a non-breaking space between 'g:i' and 'a' if appropriate.
    (0, import_i18n._x)("F j, Y g:i\xA0a", "post schedule full date format"),
    date
  );
}
function getTimezoneAbbreviation() {
  const { timezone } = (0, import_date.getSettings)();
  if (timezone.abbr && isNaN(Number(timezone.abbr))) {
    return timezone.abbr;
  }
  const symbol = timezone.offset < 0 ? "" : "+";
  return `UTC${symbol}${timezone.offsetFormatted}`;
}
function isTimezoneSameAsSiteTimezone(date) {
  const { timezone } = (0, import_date.getSettings)();
  const siteOffset = Number(timezone.offset);
  const dateOffset = -1 * (date.getTimezoneOffset() / 60);
  return siteOffset === dateOffset;
}
function isSameDay(left, right) {
  return left.getDate() === right.getDate() && left.getMonth() === right.getMonth() && left.getFullYear() === right.getFullYear();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getFullPostScheduleLabel,
  getPostScheduleLabel,
  usePostScheduleLabel
});
//# sourceMappingURL=label.cjs.map
