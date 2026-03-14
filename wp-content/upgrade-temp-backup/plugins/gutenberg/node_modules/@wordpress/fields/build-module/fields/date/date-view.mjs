// packages/fields/src/fields/date/date-view.tsx
import { __, sprintf } from "@wordpress/i18n";
import { createInterpolateElement } from "@wordpress/element";
import { dateI18n, getDate, getSettings } from "@wordpress/date";
import { jsx } from "react/jsx-runtime";
var getFormattedDate = (dateToDisplay) => dateI18n(
  getSettings().formats.datetimeAbbreviated,
  getDate(dateToDisplay)
);
var DateView = ({ item }) => {
  const isDraftOrPrivate = ["draft", "private"].includes(
    item.status ?? ""
  );
  if (isDraftOrPrivate) {
    return createInterpolateElement(
      sprintf(
        /* translators: %s: page creation or modification date. */
        __("<span>Modified: <time>%s</time></span>"),
        getFormattedDate(item.date ?? null)
      ),
      {
        span: /* @__PURE__ */ jsx("span", {}),
        time: /* @__PURE__ */ jsx("time", {})
      }
    );
  }
  const isScheduled = item.status === "future";
  if (isScheduled) {
    return createInterpolateElement(
      sprintf(
        /* translators: %s: page creation date */
        __("<span>Scheduled: <time>%s</time></span>"),
        getFormattedDate(item.date ?? null)
      ),
      {
        span: /* @__PURE__ */ jsx("span", {}),
        time: /* @__PURE__ */ jsx("time", {})
      }
    );
  }
  const isPublished = item.status === "publish";
  if (isPublished) {
    return createInterpolateElement(
      sprintf(
        /* translators: %s: page creation time */
        __("<span>Published: <time>%s</time></span>"),
        getFormattedDate(item.date ?? null)
      ),
      {
        span: /* @__PURE__ */ jsx("span", {}),
        time: /* @__PURE__ */ jsx("time", {})
      }
    );
  }
  const dateToDisplay = getDate(item.modified ?? null) > getDate(item.date ?? null) ? item.modified : item.date;
  const isPending = item.status === "pending";
  if (isPending) {
    return createInterpolateElement(
      sprintf(
        /* translators: %s: page creation or modification date. */
        __("<span>Modified: <time>%s</time></span>"),
        getFormattedDate(dateToDisplay ?? null)
      ),
      {
        span: /* @__PURE__ */ jsx("span", {}),
        time: /* @__PURE__ */ jsx("time", {})
      }
    );
  }
  return /* @__PURE__ */ jsx("time", { children: getFormattedDate(item.date ?? null) });
};
var date_view_default = DateView;
export {
  date_view_default as default
};
//# sourceMappingURL=date-view.mjs.map
