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

// packages/editor/src/components/page-attributes/parent.js
var parent_exports = {};
__export(parent_exports, {
  PageAttributesParent: () => PageAttributesParent,
  ParentRow: () => ParentRow,
  default: () => parent_default,
  getItemPriority: () => getItemPriority
});
module.exports = __toCommonJS(parent_exports);
var import_remove_accents = __toESM(require("remove-accents"));
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_compose = require("@wordpress/compose");
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_html_entities = require("@wordpress/html-entities");
var import_core_data = require("@wordpress/core-data");
var import_block_editor = require("@wordpress/block-editor");
var import_url = require("@wordpress/url");
var import_post_panel_row = __toESM(require("../post-panel-row/index.cjs"));
var import_terms = require("../../utils/terms.cjs");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function getTitle(post) {
  return post?.title?.rendered ? (0, import_html_entities.decodeEntities)(post.title.rendered) : `#${post.id} (${(0, import_i18n.__)("no title")})`;
}
var getItemPriority = (name, searchValue) => {
  const normalizedName = (0, import_remove_accents.default)(name || "").toLowerCase();
  const normalizedSearch = (0, import_remove_accents.default)(searchValue || "").toLowerCase();
  if (normalizedName === normalizedSearch) {
    return 0;
  }
  if (normalizedName.startsWith(normalizedSearch)) {
    return normalizedName.length;
  }
  return Infinity;
};
function PageAttributesParent() {
  const { editPost } = (0, import_data.useDispatch)(import_store.store);
  const [fieldValue, setFieldValue] = (0, import_element.useState)(false);
  const {
    isHierarchical,
    parentPostId,
    parentPostTitle,
    pageItems,
    isLoading
  } = (0, import_data.useSelect)(
    (select) => {
      const {
        getPostType,
        getEntityRecords,
        getEntityRecord,
        isResolving
      } = select(import_core_data.store);
      const { getCurrentPostId, getEditedPostAttribute } = select(import_store.store);
      const postTypeSlug = getEditedPostAttribute("type");
      const pageId = getEditedPostAttribute("parent");
      const pType = getPostType(postTypeSlug);
      const postId = getCurrentPostId();
      const postIsHierarchical = pType?.hierarchical ?? false;
      const query = {
        per_page: 100,
        exclude: postId,
        parent_exclude: postId,
        orderby: "menu_order",
        order: "asc",
        _fields: "id,title,parent"
      };
      if (!!fieldValue) {
        query.search = fieldValue;
        query.orderby = "relevance";
      }
      const parentPost = pageId ? getEntityRecord("postType", postTypeSlug, pageId) : null;
      return {
        isHierarchical: postIsHierarchical,
        parentPostId: pageId,
        parentPostTitle: parentPost ? getTitle(parentPost) : "",
        pageItems: postIsHierarchical ? getEntityRecords("postType", postTypeSlug, query) : null,
        isLoading: postIsHierarchical ? isResolving("getEntityRecords", [
          "postType",
          postTypeSlug,
          query
        ]) : false
      };
    },
    [fieldValue]
  );
  const parentOptions = (0, import_element.useMemo)(() => {
    const getOptionsFromTree = (tree2, level = 0) => {
      const mappedNodes = tree2.map((treeNode) => [
        {
          value: treeNode.id,
          label: "\u2014 ".repeat(level) + (0, import_html_entities.decodeEntities)(treeNode.name),
          rawName: treeNode.name
        },
        ...getOptionsFromTree(treeNode.children || [], level + 1)
      ]);
      const sortedNodes = mappedNodes.sort(([a], [b]) => {
        const priorityA = getItemPriority(a.rawName, fieldValue);
        const priorityB = getItemPriority(b.rawName, fieldValue);
        return priorityA >= priorityB ? 1 : -1;
      });
      return sortedNodes.flat();
    };
    if (!pageItems) {
      return [];
    }
    let tree = pageItems.map((item) => ({
      id: item.id,
      parent: item.parent,
      name: getTitle(item)
    }));
    if (!fieldValue) {
      tree = (0, import_terms.buildTermsTree)(tree);
    }
    const opts = getOptionsFromTree(tree);
    const optsHasParent = opts.find(
      (item) => item.value === parentPostId
    );
    if (parentPostTitle && !optsHasParent) {
      opts.unshift({
        value: parentPostId,
        label: parentPostTitle
      });
    }
    return opts;
  }, [pageItems, fieldValue, parentPostTitle, parentPostId]);
  if (!isHierarchical) {
    return null;
  }
  const handleKeydown = (inputValue) => {
    setFieldValue(inputValue);
  };
  const handleChange = (selectedPostId) => {
    editPost({ parent: selectedPostId });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.ComboboxControl,
    {
      __next40pxDefaultSize: true,
      className: "editor-page-attributes__parent",
      label: (0, import_i18n.__)("Parent"),
      help: (0, import_i18n.__)("Choose a parent page."),
      value: parentPostId,
      options: parentOptions,
      onFilterValueChange: (0, import_compose.debounce)(handleKeydown, 300),
      onChange: handleChange,
      hideLabelFromVision: true,
      isLoading
    }
  );
}
function PostParentToggle({ isOpen, onClick }) {
  const parentPost = (0, import_data.useSelect)((select) => {
    const { getEditedPostAttribute } = select(import_store.store);
    const parentPostId = getEditedPostAttribute("parent");
    if (!parentPostId) {
      return null;
    }
    const { getEntityRecord } = select(import_core_data.store);
    const postTypeSlug = getEditedPostAttribute("type");
    return getEntityRecord("postType", postTypeSlug, parentPostId);
  }, []);
  const parentTitle = (0, import_element.useMemo)(
    () => !parentPost ? (0, import_i18n.__)("None") : getTitle(parentPost),
    [parentPost]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Button,
    {
      size: "compact",
      className: "editor-post-parent__panel-toggle",
      variant: "tertiary",
      "aria-expanded": isOpen,
      "aria-label": (
        // translators: %s: Current post parent.
        (0, import_i18n.sprintf)((0, import_i18n.__)("Change parent: %s"), parentTitle)
      ),
      onClick,
      children: parentTitle
    }
  );
}
function ParentRow() {
  const homeUrl = (0, import_data.useSelect)((select) => {
    return select(import_core_data.store).getEntityRecord("root", "__unstableBase")?.home;
  }, []);
  const [popoverAnchor, setPopoverAnchor] = (0, import_element.useState)(null);
  const popoverProps = (0, import_element.useMemo)(
    () => ({
      // Anchor the popover to the middle of the entire row so that it doesn't
      // move around when the label changes.
      anchor: popoverAnchor,
      placement: "left-start",
      offset: 36,
      shift: true
    }),
    [popoverAnchor]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_panel_row.default, { label: (0, import_i18n.__)("Parent"), ref: setPopoverAnchor, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Dropdown,
    {
      popoverProps,
      className: "editor-post-parent__panel-dropdown",
      contentClassName: "editor-post-parent__panel-dialog",
      focusOnMount: true,
      renderToggle: ({ isOpen, onToggle }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostParentToggle, { isOpen, onClick: onToggle }),
      renderContent: ({ onClose }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "editor-post-parent", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_block_editor.__experimentalInspectorPopoverHeader,
          {
            title: (0, import_i18n.__)("Parent"),
            onClose
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
          (0, import_element.createInterpolateElement)(
            (0, import_i18n.sprintf)(
              /* translators: %s: The home URL of the WordPress installation without the scheme. */
              (0, import_i18n.__)(
                'Child pages inherit characteristics from their parent, such as URL structure. For instance, if "Pricing" is a child of "Services", its URL would be %s<wbr />/services<wbr />/pricing.'
              ),
              (0, import_url.filterURLForDisplay)(homeUrl).replace(
                /([/.])/g,
                "<wbr />$1"
              )
            ),
            {
              wbr: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("wbr", {})
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: (0, import_element.createInterpolateElement)(
            (0, import_i18n.__)(
              "They also show up as sub-items in the default navigation menu. <a>Learn more.</a>"
            ),
            {
              a: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_components.ExternalLink,
                {
                  href: (0, import_i18n.__)(
                    "https://wordpress.org/documentation/article/page-post-settings-sidebar/#page-attributes"
                  )
                }
              )
            }
          ) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageAttributesParent, {})
      ] })
    }
  ) });
}
var parent_default = PageAttributesParent;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PageAttributesParent,
  ParentRow,
  getItemPriority
});
//# sourceMappingURL=parent.cjs.map
