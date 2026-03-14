// packages/editor/src/components/autocompleters/user.js
import { useMemo } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function getUserLabel(user) {
  const avatar = user.avatar_urls && user.avatar_urls[24] ? /* @__PURE__ */ jsx(
    "img",
    {
      className: "editor-autocompleters__user-avatar",
      alt: "",
      src: user.avatar_urls[24]
    }
  ) : /* @__PURE__ */ jsx("span", { className: "editor-autocompleters__no-avatar" });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    avatar,
    /* @__PURE__ */ jsx("span", { className: "editor-autocompleters__user-name", children: user.name }),
    /* @__PURE__ */ jsx("span", { className: "editor-autocompleters__user-slug", children: user.slug })
  ] });
}
var user_default = {
  name: "users",
  className: "editor-autocompleters__user",
  triggerPrefix: "@",
  useItems(filterValue) {
    const users = useSelect(
      (select) => {
        const { getUsers } = select(coreStore);
        return getUsers({
          context: "view",
          search: encodeURIComponent(filterValue)
        });
      },
      [filterValue]
    );
    const options = useMemo(
      () => users ? users.map((user) => ({
        key: `user-${user.slug}`,
        value: user,
        label: getUserLabel(user)
      })) : [],
      [users]
    );
    return [options];
  },
  getOptionCompletion(user) {
    return `@${user.slug}`;
  }
};
export {
  user_default as default,
  getUserLabel
};
//# sourceMappingURL=user.mjs.map
