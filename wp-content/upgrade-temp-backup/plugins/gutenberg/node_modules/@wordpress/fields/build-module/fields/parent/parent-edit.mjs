// packages/fields/src/fields/parent/parent-edit.tsx
import removeAccents from "remove-accents";
import { ComboboxControl, ExternalLink } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import {
  createInterpolateElement,
  useCallback,
  useMemo,
  useState
} from "@wordpress/element";
import { store as coreStore } from "@wordpress/core-data";
import { debounce } from "@wordpress/compose";
import { decodeEntities } from "@wordpress/html-entities";
import { __, sprintf } from "@wordpress/i18n";
import { filterURLForDisplay } from "@wordpress/url";
import { getTitleWithFallbackName } from "./utils.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function buildTermsTree(flatTerms) {
  const flatTermsWithParentAndChildren = flatTerms.map((term) => {
    return {
      children: [],
      ...term
    };
  });
  if (flatTermsWithParentAndChildren.some(
    ({ parent }) => parent === null || parent === void 0
  )) {
    return flatTermsWithParentAndChildren;
  }
  const termsByParent = flatTermsWithParentAndChildren.reduce(
    (acc, term) => {
      const { parent } = term;
      if (!acc[parent]) {
        acc[parent] = [];
      }
      acc[parent].push(term);
      return acc;
    },
    {}
  );
  const fillWithChildren = (terms) => {
    return terms.map((term) => {
      const children = termsByParent[term.id];
      return {
        ...term,
        children: children && children.length ? fillWithChildren(children) : []
      };
    });
  };
  return fillWithChildren(termsByParent["0"] || []);
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
function PageAttributesParent({
  data,
  onChangeControl
}) {
  const [fieldValue, setFieldValue] = useState(null);
  const pageId = data.parent;
  const postId = data.id;
  const postTypeSlug = data.type;
  const { parentPostTitle, pageItems, isHierarchical } = useSelect(
    (select) => {
      const { getEntityRecord, getEntityRecords, getPostType } = select(coreStore);
      const postTypeInfo = getPostType(postTypeSlug);
      const postIsHierarchical = postTypeInfo?.hierarchical && postTypeInfo.viewable;
      const parentPost = pageId ? getEntityRecord(
        "postType",
        postTypeSlug,
        pageId
      ) : null;
      const query = {
        per_page: 100,
        exclude: postId,
        parent_exclude: postId,
        orderby: "menu_order",
        order: "asc",
        _fields: "id,title,parent",
        ...fieldValue !== null && {
          // Perform a search by relevance when the field is changed.
          search: fieldValue,
          orderby: "relevance"
        }
      };
      return {
        isHierarchical: postIsHierarchical,
        parentPostTitle: parentPost ? getTitleWithFallbackName(parentPost) : "",
        pageItems: postIsHierarchical ? getEntityRecords(
          "postType",
          postTypeSlug,
          query
        ) : null
      };
    },
    [fieldValue, pageId, postId, postTypeSlug]
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
        const priorityA = getItemPriority(
          a.rawName,
          fieldValue ?? ""
        );
        const priorityB = getItemPriority(
          b.rawName,
          fieldValue ?? ""
        );
        return priorityA >= priorityB ? 1 : -1;
      });
      return sortedNodes.flat();
    };
    if (!pageItems) {
      return [];
    }
    let tree = pageItems.map((item) => ({
      id: item.id,
      parent: item.parent ?? null,
      name: getTitleWithFallbackName(item)
    }));
    if (!fieldValue) {
      tree = buildTermsTree(tree);
    }
    const opts = getOptionsFromTree(tree);
    const optsHasParent = opts.find((item) => item.value === pageId);
    if (pageId && parentPostTitle && !optsHasParent) {
      opts.unshift({
        value: pageId,
        label: parentPostTitle,
        rawName: ""
      });
    }
    return opts.map((option) => ({
      ...option,
      value: option.value.toString()
    }));
  }, [pageItems, fieldValue, parentPostTitle, pageId]);
  if (!isHierarchical) {
    return null;
  }
  const handleKeydown = (inputValue) => {
    setFieldValue(inputValue);
  };
  const handleChange = (selectedPostId) => {
    if (selectedPostId) {
      return onChangeControl(parseInt(selectedPostId, 10) ?? 0);
    }
    onChangeControl(0);
  };
  return /* @__PURE__ */ jsx(
    ComboboxControl,
    {
      __next40pxDefaultSize: true,
      label: __("Parent"),
      help: __("Choose a parent page."),
      value: pageId?.toString(),
      options: parentOptions,
      onFilterValueChange: debounce(
        (value) => handleKeydown(value),
        300
      ),
      onChange: handleChange,
      hideLabelFromVision: true
    }
  );
}
var ParentEdit = ({
  data,
  field,
  onChange
}) => {
  const { id } = field;
  const homeUrl = useSelect((select) => {
    return select(coreStore).getEntityRecord("root", "__unstableBase")?.home;
  }, []);
  const onChangeControl = useCallback(
    (newValue) => onChange({
      [id]: newValue
    }),
    [id, onChange]
  );
  return /* @__PURE__ */ jsx("fieldset", { className: "fields-controls__parent", children: /* @__PURE__ */ jsxs("div", { children: [
    createInterpolateElement(
      sprintf(
        /* translators: %1$s The home URL of the WordPress installation without the scheme. */
        __(
          'Child pages inherit characteristics from their parent, such as URL structure. For instance, if "Pricing" is a child of "Services", its URL would be %1$s<wbr />/services<wbr />/pricing.'
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
            ),
            children: void 0
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsx(
      PageAttributesParent,
      {
        data,
        onChangeControl
      }
    )
  ] }) });
};
export {
  PageAttributesParent,
  ParentEdit,
  getItemPriority
};
//# sourceMappingURL=parent-edit.mjs.map
