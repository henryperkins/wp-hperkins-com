// packages/editor/src/components/post-publish-panel/postpublish.js
import {
  PanelBody,
  Button,
  TextControl,
  ExternalLink,
  VisuallyHidden
} from "@wordpress/components";
import { __, sprintf } from "@wordpress/i18n";
import { useCallback, useEffect, useState, useRef } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { addQueryArgs, safeDecodeURIComponent } from "@wordpress/url";
import { decodeEntities } from "@wordpress/html-entities";
import { useCopyToClipboard } from "@wordpress/compose";
import { store as coreStore } from "@wordpress/core-data";
import { external } from "@wordpress/icons";
import PostScheduleLabel from "../post-schedule/label.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var POSTNAME = "%postname%";
var PAGENAME = "%pagename%";
var getFuturePostUrl = (post) => {
  const { slug } = post;
  if (post.permalink_template.includes(POSTNAME)) {
    return post.permalink_template.replace(POSTNAME, slug);
  }
  if (post.permalink_template.includes(PAGENAME)) {
    return post.permalink_template.replace(PAGENAME, slug);
  }
  return post.permalink_template;
};
function CopyButton({ text }) {
  const [showCopyConfirmation, setShowCopyConfirmation] = useState(false);
  const timeoutIdRef = useRef();
  const ref = useCopyToClipboard(text, () => {
    setShowCopyConfirmation(true);
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
    timeoutIdRef.current = setTimeout(() => {
      setShowCopyConfirmation(false);
    }, 4e3);
  });
  useEffect(() => {
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);
  return /* @__PURE__ */ jsx(Button, { __next40pxDefaultSize: true, variant: "secondary", ref, children: showCopyConfirmation ? __("Copied!") : __("Copy") });
}
function PostPublishPanelPostpublish({
  focusOnMount,
  children
}) {
  const { post, postType, isScheduled } = useSelect((select) => {
    const {
      getEditedPostAttribute,
      getCurrentPost,
      isCurrentPostScheduled
    } = select(editorStore);
    const { getPostType } = select(coreStore);
    return {
      post: getCurrentPost(),
      postType: getPostType(getEditedPostAttribute("type")),
      isScheduled: isCurrentPostScheduled()
    };
  }, []);
  const postLabel = postType?.labels?.singular_name;
  const viewPostLabel = postType?.labels?.view_item;
  const addNewPostLabel = postType?.labels?.add_new_item;
  const link = post.status === "future" ? getFuturePostUrl(post) : post.link;
  const addLink = addQueryArgs("post-new.php", {
    post_type: post.type
  });
  const postLinkRef = useCallback(
    (node) => {
      if (focusOnMount && node) {
        node.focus();
      }
    },
    [focusOnMount]
  );
  const postPublishNonLinkHeader = isScheduled ? /* @__PURE__ */ jsxs(Fragment, { children: [
    __("is now scheduled. It will go live on"),
    " ",
    /* @__PURE__ */ jsx(PostScheduleLabel, {}),
    "."
  ] }) : __("is now live.");
  return /* @__PURE__ */ jsxs("div", { className: "post-publish-panel__postpublish", children: [
    /* @__PURE__ */ jsxs(PanelBody, { className: "post-publish-panel__postpublish-header", children: [
      /* @__PURE__ */ jsx(ExternalLink, { ref: postLinkRef, href: link, children: decodeEntities(post.title) || __("(no title)") }),
      " ",
      postPublishNonLinkHeader
    ] }),
    /* @__PURE__ */ jsxs(PanelBody, { children: [
      /* @__PURE__ */ jsx("p", { className: "post-publish-panel__postpublish-subheader", children: /* @__PURE__ */ jsx("strong", { children: __("What\u2019s next?") }) }),
      /* @__PURE__ */ jsxs("div", { className: "post-publish-panel__postpublish-post-address-container", children: [
        /* @__PURE__ */ jsx(
          TextControl,
          {
            __next40pxDefaultSize: true,
            className: "post-publish-panel__postpublish-post-address",
            readOnly: true,
            label: sprintf(
              /* translators: %s: post type singular name */
              __("%s address"),
              postLabel
            ),
            value: safeDecodeURIComponent(link),
            onFocus: (event) => event.target.select()
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "post-publish-panel__postpublish-post-address__copy-button-wrap", children: /* @__PURE__ */ jsx(CopyButton, { text: link }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "post-publish-panel__postpublish-buttons", children: [
        !isScheduled && /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "primary",
            href: link,
            __next40pxDefaultSize: true,
            icon: external,
            iconPosition: "right",
            target: "_blank",
            children: [
              viewPostLabel,
              /* @__PURE__ */ jsx(VisuallyHidden, {
                as: "span",
                /* translators: accessibility text */
                children: __("(opens in a new tab)")
              })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: isScheduled ? "primary" : "secondary",
            __next40pxDefaultSize: true,
            href: addLink,
            children: addNewPostLabel
          }
        )
      ] })
    ] }),
    children
  ] });
}
export {
  PostPublishPanelPostpublish as default
};
//# sourceMappingURL=postpublish.mjs.map
