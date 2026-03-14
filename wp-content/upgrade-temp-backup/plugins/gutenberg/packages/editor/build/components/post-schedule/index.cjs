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

// packages/editor/src/components/post-schedule/index.js
var post_schedule_exports = {};
__export(post_schedule_exports, {
  PrivatePostSchedule: () => PrivatePostSchedule,
  default: () => PostSchedule
});
module.exports = __toCommonJS(post_schedule_exports);
var import_date_fns = require("date-fns");
var import_date = require("@wordpress/date");
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_block_editor = require("@wordpress/block-editor");
var import_element = require("@wordpress/element");
var import_core_data = require("@wordpress/core-data");
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { PrivatePublishDateTimePicker } = (0, import_lock_unlock.unlock)(import_block_editor.privateApis);
function PostSchedule(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    PrivatePostSchedule,
    {
      ...props,
      showPopoverHeaderActions: true,
      isCompact: false
    }
  );
}
function PrivatePostSchedule({
  onClose,
  showPopoverHeaderActions,
  isCompact
}) {
  const { postDate, postType } = (0, import_data.useSelect)(
    (select) => ({
      postDate: select(import_store.store).getEditedPostAttribute("date"),
      postType: select(import_store.store).getCurrentPostType()
    }),
    []
  );
  const { editPost } = (0, import_data.useDispatch)(import_store.store);
  const onUpdateDate = (date) => editPost({ date });
  const [previewedMonth, setPreviewedMonth] = (0, import_element.useState)(
    (0, import_date_fns.startOfMonth)(new Date(postDate))
  );
  const eventsByPostType = (0, import_data.useSelect)(
    (select) => select(import_core_data.store).getEntityRecords("postType", postType, {
      status: "publish,future",
      after: (0, import_date_fns.startOfMonth)(previewedMonth).toISOString(),
      before: (0, import_date_fns.endOfMonth)(previewedMonth).toISOString(),
      exclude: [select(import_store.store).getCurrentPostId()],
      per_page: 100,
      _fields: "id,date"
    }),
    [previewedMonth, postType]
  );
  const events = (0, import_element.useMemo)(
    () => (eventsByPostType || []).map(({ date: eventDate }) => ({
      date: new Date(eventDate)
    })),
    [eventsByPostType]
  );
  const settings = (0, import_date.getSettings)();
  const is12HourTime = /a(?!\\)/i.test(
    settings.formats.time.toLowerCase().replace(/\\\\/g, "").split("").reverse().join("")
    // Reverse the string and test for "a" not followed by a slash.
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    PrivatePublishDateTimePicker,
    {
      currentDate: postDate,
      onChange: onUpdateDate,
      is12Hour: is12HourTime,
      dateOrder: (
        /* translators: Order of day, month, and year. Available formats are 'dmy', 'mdy', and 'ymd'. */
        (0, import_i18n._x)("dmy", "date order")
      ),
      events,
      onMonthPreviewed: (date) => setPreviewedMonth((0, import_date_fns.parseISO)(date)),
      onClose,
      isCompact,
      showPopoverHeaderActions
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PrivatePostSchedule
});
//# sourceMappingURL=index.cjs.map
