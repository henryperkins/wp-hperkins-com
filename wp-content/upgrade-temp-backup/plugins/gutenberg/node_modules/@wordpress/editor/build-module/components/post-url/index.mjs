// packages/editor/src/components/post-url/index.js
import { useSelect, useDispatch } from "@wordpress/data";
import { safeDecodeURIComponent, cleanForSlug } from "@wordpress/url";
import { useState, createInterpolateElement } from "@wordpress/element";
import { __experimentalInspectorPopoverHeader as InspectorPopoverHeader } from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";
import {
  ExternalLink,
  Button,
  __experimentalInputControl as InputControl,
  __experimentalInputControlPrefixWrapper as InputControlPrefixWrapper,
  __experimentalInputControlSuffixWrapper as InputControlSuffixWrapper,
  __experimentalVStack as VStack
} from "@wordpress/components";
import { store as noticesStore } from "@wordpress/notices";
import { copySmall } from "@wordpress/icons";
import { store as coreStore } from "@wordpress/core-data";
import { useCopyToClipboard, useInstanceId } from "@wordpress/compose";
import { store as editorStore } from "../../store/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function PostURL({ onClose }) {
  const {
    isEditable,
    postSlug,
    postLink,
    permalinkPrefix,
    permalinkSuffix,
    permalink
  } = useSelect((select) => {
    const post = select(editorStore).getCurrentPost();
    const postTypeSlug = select(editorStore).getCurrentPostType();
    const postType = select(coreStore).getPostType(postTypeSlug);
    const permalinkParts = select(editorStore).getPermalinkParts();
    const hasPublishAction = post?._links?.["wp:action-publish"] ?? false;
    return {
      isEditable: select(editorStore).isPermalinkEditable() && hasPublishAction,
      postSlug: safeDecodeURIComponent(
        select(editorStore).getEditedPostSlug()
      ),
      viewPostLabel: postType?.labels.view_item,
      postLink: post.link,
      permalinkPrefix: permalinkParts?.prefix,
      permalinkSuffix: permalinkParts?.suffix,
      permalink: safeDecodeURIComponent(
        select(editorStore).getPermalink()
      )
    };
  }, []);
  const { editPost } = useDispatch(editorStore);
  const { createNotice } = useDispatch(noticesStore);
  const [forceEmptyField, setForceEmptyField] = useState(false);
  const copyButtonRef = useCopyToClipboard(permalink, () => {
    createNotice("info", __("Copied Permalink to clipboard."), {
      isDismissible: true,
      type: "snackbar"
    });
  });
  const postUrlSlugDescriptionId = "editor-post-url__slug-description-" + useInstanceId(PostURL);
  return /* @__PURE__ */ jsxs("div", { className: "editor-post-url", children: [
    /* @__PURE__ */ jsx(
      InspectorPopoverHeader,
      {
        title: __("Slug"),
        onClose
      }
    ),
    /* @__PURE__ */ jsxs(VStack, { spacing: 3, children: [
      isEditable && /* @__PURE__ */ jsx("p", { className: "editor-post-url__intro", children: createInterpolateElement(
        __(
          "<span>Customize the last part of the Permalink.</span> <a>Learn more.</a>"
        ),
        {
          span: /* @__PURE__ */ jsx("span", { id: postUrlSlugDescriptionId }),
          a: /* @__PURE__ */ jsx(
            ExternalLink,
            {
              href: __(
                "https://wordpress.org/documentation/article/page-post-settings-sidebar/#permalink"
              )
            }
          )
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { children: [
        isEditable && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            InputControl,
            {
              __next40pxDefaultSize: true,
              prefix: /* @__PURE__ */ jsx(InputControlPrefixWrapper, { children: "/" }),
              suffix: /* @__PURE__ */ jsx(InputControlSuffixWrapper, { variant: "control", children: /* @__PURE__ */ jsx(
                Button,
                {
                  icon: copySmall,
                  ref: copyButtonRef,
                  size: "small",
                  label: "Copy"
                }
              ) }),
              label: __("Slug"),
              hideLabelFromVision: true,
              value: forceEmptyField ? "" : postSlug,
              autoComplete: "off",
              spellCheck: "false",
              type: "text",
              className: "editor-post-url__input",
              onChange: (newValue) => {
                editPost({ slug: newValue });
                if (!newValue) {
                  if (!forceEmptyField) {
                    setForceEmptyField(true);
                  }
                  return;
                }
                if (forceEmptyField) {
                  setForceEmptyField(false);
                }
              },
              onBlur: (event) => {
                editPost({
                  slug: cleanForSlug(
                    event.target.value
                  )
                });
                if (forceEmptyField) {
                  setForceEmptyField(false);
                }
              },
              "aria-describedby": postUrlSlugDescriptionId
            }
          ),
          /* @__PURE__ */ jsxs("p", { className: "editor-post-url__permalink", children: [
            /* @__PURE__ */ jsx("span", { className: "editor-post-url__permalink-visual-label", children: __("Permalink:") }),
            /* @__PURE__ */ jsxs(
              ExternalLink,
              {
                className: "editor-post-url__link",
                href: postLink,
                target: "_blank",
                children: [
                  /* @__PURE__ */ jsx("span", { className: "editor-post-url__link-prefix", children: permalinkPrefix }),
                  /* @__PURE__ */ jsx("span", { className: "editor-post-url__link-slug", children: postSlug }),
                  /* @__PURE__ */ jsx("span", { className: "editor-post-url__link-suffix", children: permalinkSuffix })
                ]
              }
            )
          ] })
        ] }),
        !isEditable && /* @__PURE__ */ jsx(
          ExternalLink,
          {
            className: "editor-post-url__link",
            href: postLink,
            target: "_blank",
            children: postLink
          }
        )
      ] })
    ] })
  ] });
}
export {
  PostURL as default
};
//# sourceMappingURL=index.mjs.map
