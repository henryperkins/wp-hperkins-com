// packages/block-editor/src/components/inserter/media-tab/media-tab.js
import { __ } from "@wordpress/i18n";
import { useViewportMatch } from "@wordpress/compose";
import { Button } from "@wordpress/components";
import { useCallback, useMemo } from "@wordpress/element";
import { MediaCategoryPanel } from "./media-panel.mjs";
import MediaUploadCheck from "../../media-upload/check.mjs";
import MediaUpload from "../../media-upload/index.mjs";
import { useMediaCategories } from "./hooks.mjs";
import { getBlockAndPreviewFromMedia } from "./utils.mjs";
import MobileTabNavigation from "../mobile-tab-navigation.mjs";
import CategoryTabs from "../category-tabs/index.mjs";
import InserterNoResults from "../no-results.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var ALLOWED_MEDIA_TYPES = ["image", "video", "audio"];
function MediaTab({
  rootClientId,
  selectedCategory,
  onSelectCategory,
  onInsert,
  children
}) {
  const mediaCategories = useMediaCategories(rootClientId);
  const isMobile = useViewportMatch("medium", "<");
  const baseCssClass = "block-editor-inserter__media-tabs";
  const onSelectMedia = useCallback(
    (media) => {
      if (!media?.url) {
        return;
      }
      const mediaType = window.__experimentalDataViewsMediaModal && media.mime_type ? media.mime_type.split("/")[0] : media.type;
      const [block] = getBlockAndPreviewFromMedia(media, mediaType);
      onInsert(block);
    },
    [onInsert]
  );
  const categories = useMemo(
    () => mediaCategories.map((mediaCategory) => ({
      ...mediaCategory,
      label: mediaCategory.labels.name
    })),
    [mediaCategories]
  );
  if (!categories.length) {
    return /* @__PURE__ */ jsx(InserterNoResults, {});
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    !isMobile && /* @__PURE__ */ jsxs("div", { className: `${baseCssClass}-container`, children: [
      /* @__PURE__ */ jsx(
        CategoryTabs,
        {
          categories,
          selectedCategory,
          onSelectCategory,
          children
        }
      ),
      /* @__PURE__ */ jsx(MediaUploadCheck, { children: /* @__PURE__ */ jsx(
        MediaUpload,
        {
          multiple: false,
          onSelect: onSelectMedia,
          allowedTypes: ALLOWED_MEDIA_TYPES,
          render: ({ open }) => /* @__PURE__ */ jsx(
            Button,
            {
              __next40pxDefaultSize: true,
              onClick: (event) => {
                event.target.focus();
                open();
              },
              className: "block-editor-inserter__media-library-button",
              variant: "secondary",
              "data-unstable-ignore-focus-outside-for-relatedtarget": ".media-modal",
              children: __("Open Media Library")
            }
          )
        }
      ) })
    ] }),
    isMobile && /* @__PURE__ */ jsx(MobileTabNavigation, { categories, children: (category) => /* @__PURE__ */ jsx(
      MediaCategoryPanel,
      {
        onInsert,
        rootClientId,
        category
      }
    ) })
  ] });
}
var media_tab_default = MediaTab;
export {
  media_tab_default as default
};
//# sourceMappingURL=media-tab.mjs.map
