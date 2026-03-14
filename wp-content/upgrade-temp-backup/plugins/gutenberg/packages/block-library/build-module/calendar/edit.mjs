// packages/block-library/src/calendar/edit.js
import memoize from "memize";
import { calendar as icon } from "@wordpress/icons";
import { Placeholder, Spinner } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { useServerSideRender } from "@wordpress/server-side-render";
import { useBlockProps } from "@wordpress/block-editor";
import { store as coreStore } from "@wordpress/core-data";
import { __, sprintf } from "@wordpress/i18n";
import { useDisabled } from "@wordpress/compose";
import HtmlRenderer from "../utils/html-renderer.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var getYearMonth = memoize((date) => {
  if (!date) {
    return {};
  }
  const dateObj = new Date(date);
  return {
    year: dateObj.getFullYear(),
    month: dateObj.getMonth() + 1
  };
});
function CalendarEdit({ attributes, name }) {
  const { date, hasPosts, hasPostsResolved } = useSelect((select) => {
    const { getEntityRecords, hasFinishedResolution } = select(coreStore);
    const singlePublishedPostQuery = {
      status: "publish",
      per_page: 1
    };
    const posts = getEntityRecords(
      "postType",
      "post",
      singlePublishedPostQuery
    );
    const postsResolved = hasFinishedResolution("getEntityRecords", [
      "postType",
      "post",
      singlePublishedPostQuery
    ]);
    let _date;
    const editorSelectors = select("core/editor");
    if (editorSelectors) {
      const postType = editorSelectors.getEditedPostAttribute("type");
      if (postType === "post") {
        _date = editorSelectors.getEditedPostAttribute("date");
      }
    }
    return {
      date: _date,
      hasPostsResolved: postsResolved,
      hasPosts: postsResolved && posts?.length === 1
    };
  }, []);
  const { content, status, error } = useServerSideRender({
    attributes: {
      ...attributes,
      ...getYearMonth(date)
    },
    block: name
  });
  const disabledRef = useDisabled();
  const blockProps = useBlockProps({ ref: disabledRef });
  if (!hasPosts) {
    return /* @__PURE__ */ jsx("div", { ...blockProps, children: /* @__PURE__ */ jsx(Placeholder, { icon, label: __("Calendar"), children: !hasPostsResolved ? /* @__PURE__ */ jsx(Spinner, {}) : __("No published posts found.") }) });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    status === "loading" && /* @__PURE__ */ jsx("div", { ...blockProps, children: /* @__PURE__ */ jsx(Spinner, {}) }),
    status === "error" && /* @__PURE__ */ jsx("div", { ...blockProps, children: /* @__PURE__ */ jsx("p", { children: sprintf(
      /* translators: %s: error message returned when rendering the block. */
      __("Error: %s"),
      error
    ) }) }),
    status === "success" && /* @__PURE__ */ jsx(HtmlRenderer, { wrapperProps: blockProps, html: content })
  ] });
}
export {
  CalendarEdit as default
};
//# sourceMappingURL=edit.mjs.map
