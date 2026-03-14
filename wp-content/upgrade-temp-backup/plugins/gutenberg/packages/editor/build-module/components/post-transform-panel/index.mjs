// packages/editor/src/components/post-transform-panel/index.js
import { useSelect, useDispatch } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { PanelBody } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { __experimentalBlockPatternsList as BlockPatternsList } from "@wordpress/block-editor";
import { serialize } from "@wordpress/blocks";
import { store as editorStore } from "../../store/index.mjs";
import { useAvailablePatterns } from "./hooks.mjs";
import {
  TEMPLATE_POST_TYPE,
  TEMPLATE_PART_POST_TYPE
} from "../../store/constants.mjs";
import { jsx } from "react/jsx-runtime";
function TemplatesList({ availableTemplates, onSelect }) {
  if (!availableTemplates || availableTemplates?.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    BlockPatternsList,
    {
      label: __("Templates"),
      blockPatterns: availableTemplates,
      onClickPattern: onSelect,
      showTitlesAsTooltip: true
    }
  );
}
function PostTransform() {
  const { area, name, slug, postType, postId } = useSelect((select) => {
    const { getCurrentPostType, getCurrentPostId } = select(editorStore);
    const { getEditedEntityRecord } = select(coreStore);
    const type = getCurrentPostType();
    const id = getCurrentPostId();
    const record = getEditedEntityRecord("postType", type, id);
    return {
      area: record?.area,
      name: record?.name,
      slug: record?.slug,
      postType: type,
      postId: id
    };
  }, []);
  const { editEntityRecord } = useDispatch(coreStore);
  const availablePatterns = useAvailablePatterns({ area, name, slug });
  const onTemplateSelect = async (selectedTemplate) => {
    await editEntityRecord("postType", postType, postId, {
      blocks: selectedTemplate.blocks,
      content: serialize(selectedTemplate.blocks)
    });
  };
  if (!availablePatterns?.length) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    PanelBody,
    {
      title: __("Design"),
      initialOpen: postType === TEMPLATE_PART_POST_TYPE,
      children: /* @__PURE__ */ jsx(
        TemplatesList,
        {
          availableTemplates: availablePatterns,
          onSelect: onTemplateSelect
        }
      )
    }
  );
}
function PostTransformPanel() {
  const { postType } = useSelect((select) => {
    const { getCurrentPostType } = select(editorStore);
    return {
      postType: getCurrentPostType()
    };
  }, []);
  if (![TEMPLATE_PART_POST_TYPE, TEMPLATE_POST_TYPE].includes(postType)) {
    return null;
  }
  return /* @__PURE__ */ jsx(PostTransform, {});
}
export {
  PostTransformPanel as default
};
//# sourceMappingURL=index.mjs.map
