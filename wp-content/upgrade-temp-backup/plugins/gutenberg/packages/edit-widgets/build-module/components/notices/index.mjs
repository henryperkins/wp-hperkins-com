// packages/edit-widgets/src/components/notices/index.js
import { InlineNotices, SnackbarNotices } from "@wordpress/notices";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function Notices() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      InlineNotices,
      {
        pinnedNoticesClassName: "edit-widgets-notices__pinned",
        dismissibleNoticesClassName: "edit-widgets-notices__dismissible"
      }
    ),
    /* @__PURE__ */ jsx(SnackbarNotices, { className: "edit-widgets-notices__snackbar" })
  ] });
}
var notices_default = Notices;
export {
  notices_default as default
};
//# sourceMappingURL=index.mjs.map
