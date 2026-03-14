// packages/edit-post/src/components/more-menu/manage-patterns-menu-item.js
import { MenuItem } from "@wordpress/components";
import { store as coreStore } from "@wordpress/core-data";
import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { addQueryArgs } from "@wordpress/url";
import { jsx } from "react/jsx-runtime";
function ManagePatternsMenuItem() {
  const url = useSelect((select) => {
    const { canUser } = select(coreStore);
    const defaultUrl = addQueryArgs("edit.php", {
      post_type: "wp_block"
    });
    const patternsUrl = addQueryArgs("site-editor.php", {
      p: "/pattern"
    });
    return canUser("create", {
      kind: "postType",
      name: "wp_template"
    }) ? patternsUrl : defaultUrl;
  }, []);
  return /* @__PURE__ */ jsx(MenuItem, { role: "menuitem", href: url, children: __("Manage patterns") });
}
var manage_patterns_menu_item_default = ManagePatternsMenuItem;
export {
  manage_patterns_menu_item_default as default
};
//# sourceMappingURL=manage-patterns-menu-item.mjs.map
