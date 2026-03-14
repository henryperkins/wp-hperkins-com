"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/components/post-publish-panel/postpublish.js
var postpublish_exports = {};
__export(postpublish_exports, {
  default: () => PostPublishPanelPostpublish
});
module.exports = __toCommonJS(postpublish_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_url = require("@wordpress/url");
var import_html_entities = require("@wordpress/html-entities");
var import_compose = require("@wordpress/compose");
var import_core_data = require("@wordpress/core-data");
var import_icons = require("@wordpress/icons");
var import_label = __toESM(require("../post-schedule/label.cjs"));
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
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
  const [showCopyConfirmation, setShowCopyConfirmation] = (0, import_element.useState)(false);
  const timeoutIdRef = (0, import_element.useRef)();
  const ref = (0, import_compose.useCopyToClipboard)(text, () => {
    setShowCopyConfirmation(true);
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
    timeoutIdRef.current = setTimeout(() => {
      setShowCopyConfirmation(false);
    }, 4e3);
  });
  (0, import_element.useEffect)(() => {
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Button, { __next40pxDefaultSize: true, variant: "secondary", ref, children: showCopyConfirmation ? (0, import_i18n.__)("Copied!") : (0, import_i18n.__)("Copy") });
}
function PostPublishPanelPostpublish({
  focusOnMount,
  children
}) {
  const { post, postType, isScheduled } = (0, import_data.useSelect)((select) => {
    const {
      getEditedPostAttribute,
      getCurrentPost,
      isCurrentPostScheduled
    } = select(import_store.store);
    const { getPostType } = select(import_core_data.store);
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
  const addLink = (0, import_url.addQueryArgs)("post-new.php", {
    post_type: post.type
  });
  const postLinkRef = (0, import_element.useCallback)(
    (node) => {
      if (focusOnMount && node) {
        node.focus();
      }
    },
    [focusOnMount]
  );
  const postPublishNonLinkHeader = isScheduled ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    (0, import_i18n.__)("is now scheduled. It will go live on"),
    " ",
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_label.default, {}),
    "."
  ] }) : (0, import_i18n.__)("is now live.");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "post-publish-panel__postpublish", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.PanelBody, { className: "post-publish-panel__postpublish-header", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.ExternalLink, { ref: postLinkRef, href: link, children: (0, import_html_entities.decodeEntities)(post.title) || (0, import_i18n.__)("(no title)") }),
      " ",
      postPublishNonLinkHeader
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.PanelBody, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "post-publish-panel__postpublish-subheader", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: (0, import_i18n.__)("What\u2019s next?") }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "post-publish-panel__postpublish-post-address-container", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.TextControl,
          {
            __next40pxDefaultSize: true,
            className: "post-publish-panel__postpublish-post-address",
            readOnly: true,
            label: (0, import_i18n.sprintf)(
              /* translators: %s: post type singular name */
              (0, import_i18n.__)("%s address"),
              postLabel
            ),
            value: (0, import_url.safeDecodeURIComponent)(link),
            onFocus: (event) => event.target.select()
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "post-publish-panel__postpublish-post-address__copy-button-wrap", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, { text: link }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "post-publish-panel__postpublish-buttons", children: [
        !isScheduled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          import_components.Button,
          {
            variant: "primary",
            href: link,
            __next40pxDefaultSize: true,
            icon: import_icons.external,
            iconPosition: "right",
            target: "_blank",
            children: [
              viewPostLabel,
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.VisuallyHidden, {
                as: "span",
                /* translators: accessibility text */
                children: (0, import_i18n.__)("(opens in a new tab)")
              })
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
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
//# sourceMappingURL=postpublish.cjs.map
