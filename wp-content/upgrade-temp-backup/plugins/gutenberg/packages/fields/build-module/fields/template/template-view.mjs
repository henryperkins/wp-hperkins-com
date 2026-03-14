// packages/fields/src/fields/template/template-view.tsx
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { getItemTitle } from "../../actions/utils.mjs";
import { useDefaultTemplateLabel } from "./hooks.mjs";
import { Fragment, jsx } from "react/jsx-runtime";
var TemplateView = ({
  item,
  field
}) => {
  const postType = item.type;
  const slug = item.slug;
  const postId = item.id;
  const templateSlug = field.getValue({ item });
  const defaultTemplateLabel = useDefaultTemplateLabel(
    postType,
    postId,
    slug
  );
  const templateLabel = useSelect(
    (select) => {
      if (!templateSlug) {
        return;
      }
      const allTemplates = select(
        coreStore
      ).getEntityRecords("postType", "wp_template", {
        per_page: -1,
        post_type: postType
      });
      const match = allTemplates?.find(
        (t) => t.slug === templateSlug
      );
      return match ? getItemTitle(match) : void 0;
    },
    [postType, templateSlug]
  );
  return /* @__PURE__ */ jsx(Fragment, { children: templateLabel ?? defaultTemplateLabel });
};
export {
  TemplateView
};
//# sourceMappingURL=template-view.mjs.map
