// packages/editor/src/components/post-view-link/index.js
import { __ } from "@wordpress/i18n";
import { Button } from "@wordpress/components";
import { external } from "@wordpress/icons";
import { store as coreStore } from "@wordpress/core-data";
import { useSelect } from "@wordpress/data";
import { store as preferencesStore } from "@wordpress/preferences";
import { store as editorStore } from "../../store/index.mjs";
import { jsx } from "react/jsx-runtime";
function PostViewLink() {
  const { hasLoaded, permalink, isPublished, label, showIconLabels } = useSelect((select) => {
    const postTypeSlug = select(editorStore).getCurrentPostType();
    const postType = select(coreStore).getPostType(postTypeSlug);
    const { get } = select(preferencesStore);
    return {
      permalink: select(editorStore).getPermalink(),
      isPublished: select(editorStore).isCurrentPostPublished(),
      label: postType?.labels.view_item,
      hasLoaded: !!postType,
      showIconLabels: get("core", "showIconLabels")
    };
  }, []);
  if (!isPublished || !permalink || !hasLoaded) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    Button,
    {
      icon: external,
      label: label || __("View post"),
      href: permalink,
      target: "_blank",
      showTooltip: !showIconLabels,
      size: "compact"
    }
  );
}
export {
  PostViewLink as default
};
//# sourceMappingURL=index.mjs.map
