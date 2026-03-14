// packages/block-library/src/breadcrumbs/edit.js
import { __, sprintf } from "@wordpress/i18n";
import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import {
  ToggleControl,
  TextControl,
  CheckboxControl,
  __experimentalToolsPanel as ToolsPanel,
  __experimentalToolsPanelItem as ToolsPanelItem,
  Spinner
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { useEffect, useRef, useState } from "@wordpress/element";
import { useServerSideRender } from "@wordpress/server-side-render";
import { useDisabled } from "@wordpress/compose";
import { useToolsPanelDropdownMenuProps } from "../utils/hooks.mjs";
import HtmlRenderer from "../utils/html-renderer.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var separatorDefaultValue = "/";
function BreadcrumbEdit({
  attributes,
  setAttributes,
  name,
  context: { postId, postType, templateSlug }
}) {
  const {
    separator,
    showHomeItem,
    showCurrentItem,
    prefersTaxonomy,
    showOnHomePage
  } = attributes;
  const {
    post,
    isPostTypeHierarchical,
    postTypeHasTaxonomies,
    hasTermsAssigned,
    isLoading
  } = useSelect(
    (select) => {
      if (!postType) {
        return {};
      }
      const _post = select(coreStore).getEntityRecord(
        "postType",
        postType,
        postId
      );
      const postTypeObject = select(coreStore).getPostType(postType);
      const _postTypeHasTaxonomies = postTypeObject && postTypeObject.taxonomies.length;
      let taxonomies;
      if (_postTypeHasTaxonomies) {
        taxonomies = select(coreStore).getTaxonomies({
          type: postType,
          per_page: -1
        });
      }
      return {
        post: _post,
        isPostTypeHierarchical: postTypeObject?.hierarchical,
        postTypeHasTaxonomies: _postTypeHasTaxonomies,
        hasTermsAssigned: _post && (taxonomies || []).filter(
          ({ visibility }) => visibility?.publicly_queryable
        ).some((taxonomy) => {
          return !!_post[taxonomy.rest_base]?.length;
        }),
        isLoading: postId && !_post || !postTypeObject || _postTypeHasTaxonomies && !taxonomies
      };
    },
    [postType, postId]
  );
  const [invalidationKey, setInvalidationKey] = useState(0);
  useEffect(() => {
    setInvalidationKey((c) => c + 1);
  }, [post]);
  const dropdownMenuProps = useToolsPanelDropdownMenuProps();
  const { content, status, error } = useServerSideRender({
    attributes,
    skipBlockSupportAttributes: true,
    block: name,
    urlQueryArgs: { post_id: postId, invalidationKey }
  });
  const prevContentRef = useRef("");
  useEffect(() => {
    if (status === "success") {
      prevContentRef.current = content;
    }
  }, [content, status]);
  const [showLoader, setShowLoader] = useState(false);
  useEffect(() => {
    if (status !== "loading") {
      return;
    }
    const timeout = setTimeout(() => {
      setShowLoader(true);
    }, 400);
    return () => {
      clearTimeout(timeout);
      setShowLoader(false);
    };
  }, [status]);
  const disabledRef = useDisabled();
  const blockProps = useBlockProps({ ref: disabledRef });
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { ...blockProps, children: /* @__PURE__ */ jsx(Spinner, {}) });
  }
  let _showTerms;
  if (!isPostTypeHierarchical && !post?.parent) {
    _showTerms = true;
  } else if (!postTypeHasTaxonomies) {
    _showTerms = false;
  } else {
    _showTerms = prefersTaxonomy;
  }
  let placeholder = null;
  const showPlaceholder = !postId || !postType || // When `templateSlug` is set only show placeholder if the post type is not.
  // This is needed because when we are showing the template in post editor we
  // want to show the real breadcrumbs if we have the post type.
  templateSlug && !postType || !_showTerms && !isPostTypeHierarchical || _showTerms && !hasTermsAssigned;
  if (showPlaceholder) {
    const placeholderItems = [];
    if (showHomeItem) {
      placeholderItems.push(__("Home"));
    }
    if (templateSlug && !postId) {
      placeholderItems.push(__("Page"));
    } else if (_showTerms) {
      placeholderItems.push(__("Category"));
    } else {
      placeholderItems.push(__("Ancestor"), __("Parent"));
    }
    placeholder = /* @__PURE__ */ jsx(
      "nav",
      {
        ...blockProps,
        style: {
          "--separator": `"${separator.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`,
          ...blockProps.style
        },
        children: /* @__PURE__ */ jsxs("ol", { children: [
          placeholderItems.map((text, index) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: `#breadcrumbs-pseudo-link-${index}`, children: text }) }, index)),
          showCurrentItem && /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("span", { "aria-current": "page", children: __("Current") }) })
        ] })
      }
    );
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(InspectorControls, { children: /* @__PURE__ */ jsxs(
      ToolsPanel,
      {
        label: __("Settings"),
        resetAll: () => {
          setAttributes({
            separator: separatorDefaultValue,
            showHomeItem: true,
            showCurrentItem: true
          });
        },
        dropdownMenuProps,
        children: [
          /* @__PURE__ */ jsx(
            ToolsPanelItem,
            {
              label: __("Show home breadcrumb"),
              isShownByDefault: true,
              hasValue: () => !showHomeItem,
              onDeselect: () => setAttributes({
                showHomeItem: true
              }),
              children: /* @__PURE__ */ jsx(
                ToggleControl,
                {
                  label: __("Show home breadcrumb"),
                  onChange: (value) => setAttributes({ showHomeItem: value }),
                  checked: showHomeItem
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(
            ToolsPanelItem,
            {
              label: __("Show current breadcrumb"),
              isShownByDefault: true,
              hasValue: () => !showCurrentItem,
              onDeselect: () => setAttributes({
                showCurrentItem: true
              }),
              children: /* @__PURE__ */ jsx(
                ToggleControl,
                {
                  label: __("Show current breadcrumb"),
                  onChange: (value) => setAttributes({ showCurrentItem: value }),
                  checked: showCurrentItem
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(
            ToolsPanelItem,
            {
              label: __("Separator"),
              isShownByDefault: true,
              hasValue: () => separator !== separatorDefaultValue,
              onDeselect: () => setAttributes({
                separator: separatorDefaultValue
              }),
              children: /* @__PURE__ */ jsx(
                TextControl,
                {
                  __next40pxDefaultSize: true,
                  autoComplete: "off",
                  label: __("Separator"),
                  value: separator,
                  onChange: (value) => setAttributes({ separator: value }),
                  onBlur: () => {
                    if (!separator) {
                      setAttributes({
                        separator: separatorDefaultValue
                      });
                    }
                  }
                }
              )
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs(InspectorControls, { group: "advanced", children: [
      /* @__PURE__ */ jsx(
        CheckboxControl,
        {
          label: __("Show on homepage"),
          checked: showOnHomePage,
          onChange: (value) => setAttributes({ showOnHomePage: value }),
          help: __(
            "If this breadcrumbs block appears in a template or template part that\u2019s shown on the homepage, enable this option to display the breadcrumb trail. Otherwise, this setting has no effect."
          )
        }
      ),
      /* @__PURE__ */ jsx(
        CheckboxControl,
        {
          label: __("Prefer taxonomy terms"),
          checked: prefersTaxonomy,
          onChange: (value) => setAttributes({ prefersTaxonomy: value }),
          help: __(
            "The exact type of breadcrumbs shown will vary automatically depending on the page in which this block is displayed. In the specific case of a hierarchical post type with taxonomies, the breadcrumbs can either reflect its post hierarchy (default) or the hierarchy of its assigned taxonomy terms."
          )
        }
      )
    ] }),
    status === "loading" && !showPlaceholder && (prevContentRef.current ? /* @__PURE__ */ jsx(
      HtmlRenderer,
      {
        wrapperProps: {
          ...blockProps,
          style: {
            ...blockProps.style,
            opacity: showLoader ? 0.3 : 1
          }
        },
        html: prevContentRef.current
      }
    ) : /* @__PURE__ */ jsx("div", { ...blockProps, children: /* @__PURE__ */ jsx(Spinner, {}) })),
    status === "error" && /* @__PURE__ */ jsx("div", { ...blockProps, children: /* @__PURE__ */ jsx("p", { children: sprintf(
      /* translators: %s: error message returned when rendering the block. */
      __("Error: %s"),
      error
    ) }) }),
    showPlaceholder && placeholder,
    !showPlaceholder && status === "success" && /* @__PURE__ */ jsx(HtmlRenderer, { wrapperProps: blockProps, html: content })
  ] });
}
export {
  BreadcrumbEdit as default
};
//# sourceMappingURL=edit.mjs.map
