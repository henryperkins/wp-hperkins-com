// packages/editor/src/components/post-publish-panel/prepublish.js
import { __ } from "@wordpress/i18n";
import { Icon, PanelBody } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { wordpress } from "@wordpress/icons";
import { filterURLForDisplay } from "@wordpress/url";
import { store as coreStore } from "@wordpress/core-data";
import { decodeEntities } from "@wordpress/html-entities";
import PostVisibility from "../post-visibility/index.mjs";
import PostVisibilityLabel from "../post-visibility/label.mjs";
import PostSchedule from "../post-schedule/index.mjs";
import PostScheduleLabel from "../post-schedule/label.mjs";
import MaybeTagsPanel from "./maybe-tags-panel.mjs";
import MaybePostFormatPanel from "./maybe-post-format-panel.mjs";
import { store as editorStore } from "../../store/index.mjs";
import MaybeCategoryPanel from "./maybe-category-panel.mjs";
import MaybeUploadMedia from "./maybe-upload-media.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function PostPublishPanelPrepublish({ children }) {
  const {
    isBeingScheduled,
    isRequestingSiteIcon,
    hasPublishAction,
    siteIconUrl,
    siteTitle,
    siteHome
  } = useSelect((select) => {
    const { getCurrentPost, isEditedPostBeingScheduled } = select(editorStore);
    const { getEntityRecord, isResolving } = select(coreStore);
    const siteData = getEntityRecord("root", "__unstableBase", void 0) || {};
    return {
      hasPublishAction: getCurrentPost()._links?.["wp:action-publish"] ?? false,
      isBeingScheduled: isEditedPostBeingScheduled(),
      isRequestingSiteIcon: isResolving("getEntityRecord", [
        "root",
        "__unstableBase",
        void 0
      ]),
      siteIconUrl: siteData.site_icon_url,
      siteTitle: siteData.name,
      siteHome: siteData.home && filterURLForDisplay(siteData.home)
    };
  }, []);
  let siteIcon = /* @__PURE__ */ jsx(Icon, { className: "components-site-icon", size: "36px", icon: wordpress });
  if (siteIconUrl) {
    siteIcon = /* @__PURE__ */ jsx(
      "img",
      {
        alt: __("Site Icon"),
        className: "components-site-icon",
        src: siteIconUrl
      }
    );
  }
  if (isRequestingSiteIcon) {
    siteIcon = null;
  }
  let prePublishTitle, prePublishBodyText;
  if (!hasPublishAction) {
    prePublishTitle = __("Are you ready to submit for review?");
    prePublishBodyText = __(
      "Your work will be reviewed and then approved."
    );
  } else if (isBeingScheduled) {
    prePublishTitle = __("Are you ready to schedule?");
    prePublishBodyText = __(
      "Your work will be published at the specified date and time."
    );
  } else {
    prePublishTitle = __("Are you ready to publish?");
    prePublishBodyText = __(
      "Double-check your settings before publishing."
    );
  }
  return /* @__PURE__ */ jsxs("div", { className: "editor-post-publish-panel__prepublish", children: [
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("strong", { children: prePublishTitle }) }),
    /* @__PURE__ */ jsx("p", { children: prePublishBodyText }),
    /* @__PURE__ */ jsxs("div", { className: "components-site-card", children: [
      siteIcon,
      /* @__PURE__ */ jsxs("div", { className: "components-site-info", children: [
        /* @__PURE__ */ jsx("span", { className: "components-site-name", children: decodeEntities(siteTitle) || __("(Untitled)") }),
        /* @__PURE__ */ jsx("span", { className: "components-site-home", children: siteHome })
      ] })
    ] }),
    /* @__PURE__ */ jsx(MaybeUploadMedia, {}),
    hasPublishAction && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        PanelBody,
        {
          initialOpen: false,
          title: [
            __("Visibility:"),
            /* @__PURE__ */ jsx(
              "span",
              {
                className: "editor-post-publish-panel__link",
                children: /* @__PURE__ */ jsx(PostVisibilityLabel, {})
              },
              "label"
            )
          ],
          children: /* @__PURE__ */ jsx(PostVisibility, {})
        }
      ),
      /* @__PURE__ */ jsx(
        PanelBody,
        {
          initialOpen: false,
          title: [
            __("Publish:"),
            /* @__PURE__ */ jsx(
              "span",
              {
                className: "editor-post-publish-panel__link",
                children: /* @__PURE__ */ jsx(PostScheduleLabel, {})
              },
              "label"
            )
          ],
          children: /* @__PURE__ */ jsx(PostSchedule, {})
        }
      )
    ] }),
    /* @__PURE__ */ jsx(MaybePostFormatPanel, {}),
    /* @__PURE__ */ jsx(MaybeTagsPanel, {}),
    /* @__PURE__ */ jsx(MaybeCategoryPanel, {}),
    children
  ] });
}
var prepublish_default = PostPublishPanelPrepublish;
export {
  prepublish_default as default
};
//# sourceMappingURL=prepublish.mjs.map
