// packages/notices/src/components/inline-notices/index.tsx
import clsx from "clsx";
import { NoticeList } from "@wordpress/components";
import { useDispatch, useSelect } from "@wordpress/data";
import { store as noticesStore } from "../../store/index.mjs";

// packages/notices/src/components/inline-notices/style.scss
if (typeof document !== "undefined" && process.env.NODE_ENV !== "test" && !document.head.querySelector("style[data-wp-hash='51ef33823e']")) {
  const style = document.createElement("style");
  style.setAttribute("data-wp-hash", "51ef33823e");
  style.appendChild(document.createTextNode(".components-notices__dismissible,.components-notices__pinned{color:#1e1e1e}.components-notices__dismissible .components-notice,.components-notices__pinned .components-notice{border-bottom:1px solid #0003;box-sizing:border-box;min-height:64px;padding:0 12px}.components-notices__dismissible .components-notice .components-notice__dismiss,.components-notices__pinned .components-notice .components-notice__dismiss{margin-top:12px}"));
  document.head.appendChild(style);
}

// packages/notices/src/components/inline-notices/index.tsx
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function InlineNotices({
  children,
  pinnedNoticesClassName,
  dismissibleNoticesClassName,
  context
}) {
  const notices = useSelect(
    (select) => select(noticesStore).getNotices(context),
    [context]
  );
  const { removeNotice } = useDispatch(noticesStore);
  const dismissibleNotices = notices.filter(
    ({ isDismissible, type }) => isDismissible && type === "default"
  );
  const nonDismissibleNotices = notices.filter(
    ({ isDismissible, type }) => !isDismissible && type === "default"
  );
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      NoticeList,
      {
        notices: nonDismissibleNotices,
        className: clsx(
          "components-notices__pinned",
          pinnedNoticesClassName
        )
      }
    ),
    /* @__PURE__ */ jsx(
      NoticeList,
      {
        notices: dismissibleNotices,
        className: clsx(
          "components-notices__dismissible",
          dismissibleNoticesClassName
        ),
        onRemove: (id) => removeNotice(id, context),
        children
      }
    )
  ] });
}
export {
  InlineNotices as default
};
//# sourceMappingURL=index.mjs.map
