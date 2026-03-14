// packages/fields/src/fields/template/template-edit.tsx
import { useCallback, useMemo } from "@wordpress/element";
import { store as coreStore } from "@wordpress/core-data";
import { SelectControl } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { getItemTitle } from "../../actions/utils.mjs";
import { useDefaultTemplateLabel } from "./hooks.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
var EMPTY_ARRAY = [];
var TemplateEdit = ({
  data,
  field,
  onChange
}) => {
  const { id } = field;
  const postType = data.type;
  const postId = typeof data.id === "number" ? data.id : parseInt(data.id, 10);
  const slug = data.slug;
  const { templates, canSwitchTemplate } = useSelect(
    (select) => {
      const allTemplates = select(coreStore).getEntityRecords(
        "postType",
        "wp_template",
        {
          per_page: -1,
          post_type: postType
        }
      ) ?? EMPTY_ARRAY;
      const { getHomePage, getPostsPageId } = unlock(
        select(coreStore)
      );
      const singlePostId = String(postId);
      const isPostsPage = singlePostId !== void 0 && getPostsPageId() === singlePostId;
      const isFrontPage = singlePostId !== void 0 && postType === "page" && getHomePage()?.postId === singlePostId;
      return {
        templates: allTemplates,
        canSwitchTemplate: !isPostsPage && !isFrontPage
      };
    },
    [postId, postType]
  );
  const defaultTemplateLabel = useDefaultTemplateLabel(
    postType,
    postId,
    slug
  );
  const value = field.getValue({ item: data });
  const onChangeControl = useCallback(
    (newValue) => onChange({
      [id]: newValue
    }),
    [id, onChange]
  );
  const options = useMemo(() => {
    const templateOptions = templates.map((template) => ({
      label: getItemTitle(template),
      value: template.slug
    }));
    return [
      { label: defaultTemplateLabel, value: "" },
      ...templateOptions
    ];
  }, [templates, defaultTemplateLabel]);
  return /* @__PURE__ */ jsx(
    SelectControl,
    {
      __next40pxDefaultSize: true,
      label: __("Template"),
      hideLabelFromVision: true,
      value,
      options,
      onChange: onChangeControl,
      disabled: !canSwitchTemplate
    }
  );
};
export {
  TemplateEdit
};
//# sourceMappingURL=template-edit.mjs.map
