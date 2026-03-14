// packages/editor/src/components/post-featured-image/panel.js
import { __ } from "@wordpress/i18n";
import { PanelBody } from "@wordpress/components";
import { useSelect, useDispatch } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { store as editorStore } from "../../store/index.mjs";
import PostFeaturedImage from "./index.mjs";
import PostFeaturedImageCheck from "./check.mjs";
import { jsx } from "react/jsx-runtime";
var PANEL_NAME = "featured-image";
function PostFeaturedImagePanel({ withPanelBody = true }) {
  const { postType, isEnabled, isOpened } = useSelect((select) => {
    const {
      getEditedPostAttribute,
      isEditorPanelEnabled,
      isEditorPanelOpened
    } = select(editorStore);
    const { getPostType } = select(coreStore);
    return {
      postType: getPostType(getEditedPostAttribute("type")),
      isEnabled: isEditorPanelEnabled(PANEL_NAME),
      isOpened: isEditorPanelOpened(PANEL_NAME)
    };
  }, []);
  const { toggleEditorPanelOpened } = useDispatch(editorStore);
  if (!isEnabled) {
    return null;
  }
  if (!withPanelBody) {
    return /* @__PURE__ */ jsx(PostFeaturedImageCheck, { children: /* @__PURE__ */ jsx(PostFeaturedImage, {}) });
  }
  return /* @__PURE__ */ jsx(PostFeaturedImageCheck, { children: /* @__PURE__ */ jsx(
    PanelBody,
    {
      title: postType?.labels?.featured_image ?? __("Featured image"),
      opened: isOpened,
      onToggle: () => toggleEditorPanelOpened(PANEL_NAME),
      children: /* @__PURE__ */ jsx(PostFeaturedImage, {})
    }
  ) });
}
export {
  PostFeaturedImagePanel as default
};
//# sourceMappingURL=panel.mjs.map
