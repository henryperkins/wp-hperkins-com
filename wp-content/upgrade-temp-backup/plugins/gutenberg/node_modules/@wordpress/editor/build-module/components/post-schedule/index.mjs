// packages/editor/src/components/post-schedule/index.js
import { parseISO, endOfMonth, startOfMonth } from "date-fns";
import { getSettings } from "@wordpress/date";
import { _x } from "@wordpress/i18n";
import { useDispatch, useSelect } from "@wordpress/data";
import { privateApis as blockEditorPrivateApis } from "@wordpress/block-editor";
import { useState, useMemo } from "@wordpress/element";
import { store as coreStore } from "@wordpress/core-data";
import { store as editorStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
var { PrivatePublishDateTimePicker } = unlock(blockEditorPrivateApis);
function PostSchedule(props) {
  return /* @__PURE__ */ jsx(
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
  const { postDate, postType } = useSelect(
    (select) => ({
      postDate: select(editorStore).getEditedPostAttribute("date"),
      postType: select(editorStore).getCurrentPostType()
    }),
    []
  );
  const { editPost } = useDispatch(editorStore);
  const onUpdateDate = (date) => editPost({ date });
  const [previewedMonth, setPreviewedMonth] = useState(
    startOfMonth(new Date(postDate))
  );
  const eventsByPostType = useSelect(
    (select) => select(coreStore).getEntityRecords("postType", postType, {
      status: "publish,future",
      after: startOfMonth(previewedMonth).toISOString(),
      before: endOfMonth(previewedMonth).toISOString(),
      exclude: [select(editorStore).getCurrentPostId()],
      per_page: 100,
      _fields: "id,date"
    }),
    [previewedMonth, postType]
  );
  const events = useMemo(
    () => (eventsByPostType || []).map(({ date: eventDate }) => ({
      date: new Date(eventDate)
    })),
    [eventsByPostType]
  );
  const settings = getSettings();
  const is12HourTime = /a(?!\\)/i.test(
    settings.formats.time.toLowerCase().replace(/\\\\/g, "").split("").reverse().join("")
    // Reverse the string and test for "a" not followed by a slash.
  );
  return /* @__PURE__ */ jsx(
    PrivatePublishDateTimePicker,
    {
      currentDate: postDate,
      onChange: onUpdateDate,
      is12Hour: is12HourTime,
      dateOrder: (
        /* translators: Order of day, month, and year. Available formats are 'dmy', 'mdy', and 'ymd'. */
        _x("dmy", "date order")
      ),
      events,
      onMonthPreviewed: (date) => setPreviewedMonth(parseISO(date)),
      onClose,
      isCompact,
      showPopoverHeaderActions
    }
  );
}
export {
  PrivatePostSchedule,
  PostSchedule as default
};
//# sourceMappingURL=index.mjs.map
