// packages/editor/src/components/page-attributes/parent.js
import removeAccents from "remove-accents";
import { __, sprintf } from "@wordpress/i18n";
import {
  Button,
  Dropdown,
  ComboboxControl,
  ExternalLink
} from "@wordpress/components";
import { debounce } from "@wordpress/compose";
import {
  createInterpolateElement,
  useState,
  useMemo
} from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import { decodeEntities } from "@wordpress/html-entities";
import { store as coreStore } from "@wordpress/core-data";
import { __experimentalInspectorPopoverHeader as InspectorPopoverHeader } from "@wordpress/block-editor";
import { filterURLForDisplay } from "@wordpress/url";
import PostPanelRow from "../post-panel-row/index.mjs";
import { buildTermsTree } from "../../utils/terms.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function getTitle(post) {
  return post?.title?.rendered ? decodeEntities(post.title.rendered) : `#${post.id} (${__("no title")})`;
}
var getItemPriority = (name, searchValue) => {
  const normalizedName = removeAccents(name || "").toLowerCase();
  const normalizedSearch = removeAccents(searchValue || "").toLowerCase();
  if (normalizedName === normalizedSearch) {
    return 0;
  }
  if (normalizedName.startsWith(normalizedSearch)) {
    return normalizedName.length;
  }
  return Infinity;
};
function PageAttributesParent() {
  const { editPost } = useDispatch(editorStore);
  const [fieldValue, setFieldValue] = useState(false);
  const {
    isHierarchical,
    parentPostId,
    parentPostTitle,
    pageItems,
    isLoading
  } = useSelect(
    (select) => {
      const {
        getPostType,
        getEntityRecords,
        getEntityRecord,
        isResolving
      } = select(coreStore);
      const { getCurrentPostId, getEditedPostAttribute } = select(editorStore);
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
  const parentOptions = useMemo(() => {
    const getOptionsFromTree = (tree2, level = 0) => {
      const mappedNodes = tree2.map((treeNode) => [
        {
          value: treeNode.id,
          label: "\u2014 ".repeat(level) + decodeEntities(treeNode.name),
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
      tree = buildTermsTree(tree);
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
  return /* @__PURE__ */ jsx(
    ComboboxControl,
    {
      __next40pxDefaultSize: true,
      className: "editor-page-attributes__parent",
      label: __("Parent"),
      help: __("Choose a parent page."),
      value: parentPostId,
      options: parentOptions,
      onFilterValueChange: debounce(handleKeydown, 300),
      onChange: handleChange,
      hideLabelFromVision: true,
      isLoading
    }
  );
}
function PostParentToggle({ isOpen, onClick }) {
  const parentPost = useSelect((select) => {
    const { getEditedPostAttribute } = select(editorStore);
    const parentPostId = getEditedPostAttribute("parent");
    if (!parentPostId) {
      return null;
    }
    const { getEntityRecord } = select(coreStore);
    const postTypeSlug = getEditedPostAttribute("type");
    return getEntityRecord("postType", postTypeSlug, parentPostId);
  }, []);
  const parentTitle = useMemo(
    () => !parentPost ? __("None") : getTitle(parentPost),
    [parentPost]
  );
  return /* @__PURE__ */ jsx(
    Button,
    {
      size: "compact",
      className: "editor-post-parent__panel-toggle",
      variant: "tertiary",
      "aria-expanded": isOpen,
      "aria-label": (
        // translators: %s: Current post parent.
        sprintf(__("Change parent: %s"), parentTitle)
      ),
      onClick,
      children: parentTitle
    }
  );
}
function ParentRow() {
  const homeUrl = useSelect((select) => {
    return select(coreStore).getEntityRecord("root", "__unstableBase")?.home;
  }, []);
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const popoverProps = useMemo(
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
  return /* @__PURE__ */ jsx(PostPanelRow, { label: __("Parent"), ref: setPopoverAnchor, children: /* @__PURE__ */ jsx(
    Dropdown,
    {
      popoverProps,
      className: "editor-post-parent__panel-dropdown",
      contentClassName: "editor-post-parent__panel-dialog",
      focusOnMount: true,
      renderToggle: ({ isOpen, onToggle }) => /* @__PURE__ */ jsx(PostParentToggle, { isOpen, onClick: onToggle }),
      renderContent: ({ onClose }) => /* @__PURE__ */ jsxs("div", { className: "editor-post-parent", children: [
        /* @__PURE__ */ jsx(
          InspectorPopoverHeader,
          {
            title: __("Parent"),
            onClose
          }
        ),
        /* @__PURE__ */ jsxs("div", { children: [
          createInterpolateElement(
            sprintf(
              /* translators: %s: The home URL of the WordPress installation without the scheme. */
              __(
                'Child pages inherit characteristics from their parent, such as URL structure. For instance, if "Pricing" is a child of "Services", its URL would be %s<wbr />/services<wbr />/pricing.'
              ),
              filterURLForDisplay(homeUrl).replace(
                /([/.])/g,
                "<wbr />$1"
              )
            ),
            {
              wbr: /* @__PURE__ */ jsx("wbr", {})
            }
          ),
          /* @__PURE__ */ jsx("p", { children: createInterpolateElement(
            __(
              "They also show up as sub-items in the default navigation menu. <a>Learn more.</a>"
            ),
            {
              a: /* @__PURE__ */ jsx(
                ExternalLink,
                {
                  href: __(
                    "https://wordpress.org/documentation/article/page-post-settings-sidebar/#page-attributes"
                  )
                }
              )
            }
          ) })
        ] }),
        /* @__PURE__ */ jsx(PageAttributesParent, {})
      ] })
    }
  ) });
}
var parent_default = PageAttributesParent;
export {
  PageAttributesParent,
  ParentRow,
  parent_default as default,
  getItemPriority
};
//# sourceMappingURL=parent.mjs.map
