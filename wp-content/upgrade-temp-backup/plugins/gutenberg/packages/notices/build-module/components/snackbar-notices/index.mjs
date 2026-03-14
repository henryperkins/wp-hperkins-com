// packages/notices/src/components/snackbar-notices/index.tsx
import clsx from "clsx";
import { SnackbarList } from "@wordpress/components";
import { useDispatch, useSelect } from "@wordpress/data";
import { store as noticesStore } from "../../store/index.mjs";
import { jsx } from "react/jsx-runtime";
var MAX_VISIBLE_NOTICES = -3;
function SnackbarNotices({
  className,
  context
}) {
  const notices = useSelect(
    (select) => select(noticesStore).getNotices(context),
    [context]
  );
  const { removeNotice } = useDispatch(noticesStore);
  const snackbarNotices = notices.filter(({ type }) => type === "snackbar").slice(MAX_VISIBLE_NOTICES);
  return /* @__PURE__ */ jsx(
    SnackbarList,
    {
      notices: snackbarNotices,
      className: clsx("components-notices__snackbar", className),
      onRemove: (id) => removeNotice(id, context)
    }
  );
}
export {
  SnackbarNotices as default
};
//# sourceMappingURL=index.mjs.map
