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

// packages/fields/src/fields/parent/parent-edit.tsx
var parent_edit_exports = {};
__export(parent_edit_exports, {
  PageAttributesParent: () => PageAttributesParent,
  ParentEdit: () => ParentEdit,
  getItemPriority: () => getItemPriority
});
module.exports = __toCommonJS(parent_edit_exports);
var import_remove_accents = __toESM(require("remove-accents"));
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_core_data = require("@wordpress/core-data");
var import_compose = require("@wordpress/compose");
var import_html_entities = require("@wordpress/html-entities");
var import_i18n = require("@wordpress/i18n");
var import_url = require("@wordpress/url");
var import_utils = require("./utils.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
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
function PageAttributesParent({
  data,
  onChangeControl
}) {
  const [fieldValue, setFieldValue] = (0, import_element.useState)(null);
  const pageId = data.parent;
  const postId = data.id;
  const postTypeSlug = data.type;
  const { parentPostTitle, pageItems, isHierarchical } = (0, import_data.useSelect)(
    (select) => {
      const { getEntityRecord, getEntityRecords, getPostType } = select(import_core_data.store);
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
        parentPostTitle: parentPost ? (0, import_utils.getTitleWithFallbackName)(parentPost) : "",
        pageItems: postIsHierarchical ? getEntityRecords(
          "postType",
          postTypeSlug,
          query
        ) : null
      };
    },
    [fieldValue, pageId, postId, postTypeSlug]
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
      name: (0, import_utils.getTitleWithFallbackName)(item)
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.ComboboxControl,
    {
      __next40pxDefaultSize: true,
      label: (0, import_i18n.__)("Parent"),
      help: (0, import_i18n.__)("Choose a parent page."),
      value: pageId?.toString(),
      options: parentOptions,
      onFilterValueChange: (0, import_compose.debounce)(
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
  const homeUrl = (0, import_data.useSelect)((select) => {
    return select(import_core_data.store).getEntityRecord("root", "__unstableBase")?.home;
  }, []);
  const onChangeControl = (0, import_element.useCallback)(
    (newValue) => onChange({
      [id]: newValue
    }),
    [id, onChange]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("fieldset", { className: "fields-controls__parent", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
    (0, import_element.createInterpolateElement)(
      (0, import_i18n.sprintf)(
        /* translators: %1$s The home URL of the WordPress installation without the scheme. */
        (0, import_i18n.__)(
          'Child pages inherit characteristics from their parent, such as URL structure. For instance, if "Pricing" is a child of "Services", its URL would be %1$s<wbr />/services<wbr />/pricing.'
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
            ),
            children: void 0
          }
        )
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      PageAttributesParent,
      {
        data,
        onChangeControl
      }
    )
  ] }) });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PageAttributesParent,
  ParentEdit,
  getItemPriority
});
//# sourceMappingURL=parent-edit.cjs.map
