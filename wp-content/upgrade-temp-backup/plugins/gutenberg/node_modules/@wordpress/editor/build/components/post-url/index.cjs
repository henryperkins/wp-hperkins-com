"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/components/post-url/index.js
var post_url_exports = {};
__export(post_url_exports, {
  default: () => PostURL
});
module.exports = __toCommonJS(post_url_exports);
var import_data = require("@wordpress/data");
var import_url = require("@wordpress/url");
var import_element = require("@wordpress/element");
var import_block_editor = require("@wordpress/block-editor");
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_notices = require("@wordpress/notices");
var import_icons = require("@wordpress/icons");
var import_core_data = require("@wordpress/core-data");
var import_compose = require("@wordpress/compose");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function PostURL({ onClose }) {
  const {
    isEditable,
    postSlug,
    postLink,
    permalinkPrefix,
    permalinkSuffix,
    permalink
  } = (0, import_data.useSelect)((select) => {
    const post = select(import_store.store).getCurrentPost();
    const postTypeSlug = select(import_store.store).getCurrentPostType();
    const postType = select(import_core_data.store).getPostType(postTypeSlug);
    const permalinkParts = select(import_store.store).getPermalinkParts();
    const hasPublishAction = post?._links?.["wp:action-publish"] ?? false;
    return {
      isEditable: select(import_store.store).isPermalinkEditable() && hasPublishAction,
      postSlug: (0, import_url.safeDecodeURIComponent)(
        select(import_store.store).getEditedPostSlug()
      ),
      viewPostLabel: postType?.labels.view_item,
      postLink: post.link,
      permalinkPrefix: permalinkParts?.prefix,
      permalinkSuffix: permalinkParts?.suffix,
      permalink: (0, import_url.safeDecodeURIComponent)(
        select(import_store.store).getPermalink()
      )
    };
  }, []);
  const { editPost } = (0, import_data.useDispatch)(import_store.store);
  const { createNotice } = (0, import_data.useDispatch)(import_notices.store);
  const [forceEmptyField, setForceEmptyField] = (0, import_element.useState)(false);
  const copyButtonRef = (0, import_compose.useCopyToClipboard)(permalink, () => {
    createNotice("info", (0, import_i18n.__)("Copied Permalink to clipboard."), {
      isDismissible: true,
      type: "snackbar"
    });
  });
  const postUrlSlugDescriptionId = "editor-post-url__slug-description-" + (0, import_compose.useInstanceId)(PostURL);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "editor-post-url", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_block_editor.__experimentalInspectorPopoverHeader,
      {
        title: (0, import_i18n.__)("Slug"),
        onClose
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 3, children: [
      isEditable && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "editor-post-url__intro", children: (0, import_element.createInterpolateElement)(
        (0, import_i18n.__)(
          "<span>Customize the last part of the Permalink.</span> <a>Learn more.</a>"
        ),
        {
          span: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { id: postUrlSlugDescriptionId }),
          a: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.ExternalLink,
            {
              href: (0, import_i18n.__)(
                "https://wordpress.org/documentation/article/page-post-settings-sidebar/#permalink"
              )
            }
          )
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        isEditable && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.__experimentalInputControl,
            {
              __next40pxDefaultSize: true,
              prefix: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalInputControlPrefixWrapper, { children: "/" }),
              suffix: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalInputControlSuffixWrapper, { variant: "control", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_components.Button,
                {
                  icon: import_icons.copySmall,
                  ref: copyButtonRef,
                  size: "small",
                  label: "Copy"
                }
              ) }),
              label: (0, import_i18n.__)("Slug"),
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
                  slug: (0, import_url.cleanForSlug)(
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
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "editor-post-url__permalink", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "editor-post-url__permalink-visual-label", children: (0, import_i18n.__)("Permalink:") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              import_components.ExternalLink,
              {
                className: "editor-post-url__link",
                href: postLink,
                target: "_blank",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "editor-post-url__link-prefix", children: permalinkPrefix }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "editor-post-url__link-slug", children: postSlug }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "editor-post-url__link-suffix", children: permalinkSuffix })
                ]
              }
            )
          ] })
        ] }),
        !isEditable && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.ExternalLink,
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
//# sourceMappingURL=index.cjs.map
