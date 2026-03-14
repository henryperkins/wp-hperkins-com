// packages/fields/src/fields/page-title/view.tsx
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { privateApis as componentsPrivateApis } from "@wordpress/components";
import { BaseTitleView } from "../title/view.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
var { Badge } = unlock(componentsPrivateApis);
function PageTitleView({ item }) {
  const { frontPageId, postsPageId } = useSelect((select) => {
    const { getEntityRecord } = select(coreStore);
    const siteSettings = getEntityRecord(
      "root",
      "site"
    );
    return {
      frontPageId: siteSettings?.page_on_front,
      postsPageId: siteSettings?.page_for_posts
    };
  }, []);
  return /* @__PURE__ */ jsx(BaseTitleView, { item, className: "fields-field__page-title", children: [frontPageId, postsPageId].includes(item.id) && /* @__PURE__ */ jsx(Badge, { children: item.id === frontPageId ? __("Homepage") : __("Posts Page") }) });
}
export {
  PageTitleView as default
};
//# sourceMappingURL=view.mjs.map
