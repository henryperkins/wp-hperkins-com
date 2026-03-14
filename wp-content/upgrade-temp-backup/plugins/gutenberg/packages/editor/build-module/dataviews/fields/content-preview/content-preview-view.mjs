// packages/editor/src/dataviews/fields/content-preview/content-preview-view.tsx
import { __ } from "@wordpress/i18n";
import {
  BlockPreview
} from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
import { useEntityBlockEditor, store as coreStore } from "@wordpress/core-data";
import { EditorProvider } from "../../../components/provider/index.mjs";
import { useStyle } from "../../../components/global-styles/index.mjs";
import { unlock } from "../../../lock-unlock.mjs";
import { store as editorStore } from "../../../store/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function PostPreviewContainer({
  template,
  post
}) {
  const [backgroundColor = "white"] = useStyle("color.background");
  const [postBlocks] = useEntityBlockEditor("postType", post.type, {
    id: post.id
  });
  const [templateBlocks] = useEntityBlockEditor(
    "postType",
    template?.type,
    {
      id: template?.id
    }
  );
  const blocks = template && templateBlocks ? templateBlocks : postBlocks;
  const isEmpty = !blocks?.length;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "editor-fields-content-preview",
      style: {
        backgroundColor
      },
      children: [
        isEmpty && /* @__PURE__ */ jsx("span", { className: "editor-fields-content-preview__empty", children: __("Empty content") }),
        !isEmpty && /* @__PURE__ */ jsx(BlockPreview.Async, { children: /* @__PURE__ */ jsx(BlockPreview, { blocks }) })
      ]
    }
  );
}
function PostPreviewView({ item }) {
  const { settings, template } = useSelect(
    (select) => {
      const { canUser, getPostType, getTemplateId, getEntityRecord } = unlock(select(coreStore));
      const canViewTemplate = canUser("read", {
        kind: "postType",
        name: "wp_template"
      });
      const _settings = select(editorStore).getEditorSettings();
      const supportsTemplateMode = _settings.supportsTemplateMode;
      const isViewable = getPostType(item.type)?.viewable ?? false;
      const templateId = supportsTemplateMode && isViewable && canViewTemplate ? getTemplateId(item.type, item.id) : null;
      return {
        settings: _settings,
        template: templateId ? getEntityRecord("postType", "wp_template", templateId) : void 0
      };
    },
    [item.type, item.id]
  );
  return /* @__PURE__ */ jsx(
    EditorProvider,
    {
      post: item,
      settings,
      __unstableTemplate: template,
      children: /* @__PURE__ */ jsx(PostPreviewContainer, { template, post: item })
    }
  );
}
export {
  PostPreviewView as default
};
//# sourceMappingURL=content-preview-view.mjs.map
