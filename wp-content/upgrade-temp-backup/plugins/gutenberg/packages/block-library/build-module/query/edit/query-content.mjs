// packages/block-library/src/query/edit/query-content.js
import { useSelect, useDispatch } from "@wordpress/data";
import { useInstanceId } from "@wordpress/compose";
import { useEffect, useCallback } from "@wordpress/element";
import {
  InspectorControls,
  useBlockProps,
  store as blockEditorStore,
  useInnerBlocksProps,
  privateApis as blockEditorPrivateApis
} from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";
import { store as coreStore } from "@wordpress/core-data";
import EnhancedPaginationControl from "./inspector-controls/enhanced-pagination-control.mjs";
import { unlock } from "../../lock-unlock.mjs";
import QueryInspectorControls from "./inspector-controls/index.mjs";
import EnhancedPaginationModal from "./enhanced-pagination-modal.mjs";
import { getQueryContextFromTemplate } from "../utils.mjs";
import QueryToolbar from "./query-toolbar.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { HTMLElementControl } = unlock(blockEditorPrivateApis);
var DEFAULTS_POSTS_PER_PAGE = 3;
var TEMPLATE = [["core/post-template"]];
function QueryContent({
  attributes,
  setAttributes,
  clientId,
  context,
  name,
  isSelected
}) {
  const {
    queryId,
    query,
    enhancedPagination,
    tagName: TagName = "div",
    query: { inherit } = {}
  } = attributes;
  const { templateSlug } = context;
  const { isSingular } = getQueryContextFromTemplate(templateSlug);
  const { __unstableMarkNextChangeAsNotPersistent } = useDispatch(blockEditorStore);
  const instanceId = useInstanceId(QueryContent);
  const blockProps = useBlockProps();
  const innerBlocksProps = useInnerBlocksProps(blockProps, {
    template: TEMPLATE
  });
  const { postsPerPage } = useSelect((select) => {
    const { getSettings } = select(blockEditorStore);
    const { getEntityRecord, getEntityRecordEdits, canUser } = select(coreStore);
    const settingPerPage = canUser("read", {
      kind: "root",
      name: "site"
    }) ? +getEntityRecord("root", "site")?.posts_per_page : +getSettings().postsPerPage;
    const editedSettingPerPage = +getEntityRecordEdits("root", "site")?.posts_per_page;
    return {
      postsPerPage: editedSettingPerPage || settingPerPage || DEFAULTS_POSTS_PER_PAGE
    };
  }, []);
  const updateQuery = useCallback(
    (newQuery) => setAttributes((prevAttributes) => ({
      query: { ...prevAttributes.query, ...newQuery }
    })),
    [setAttributes]
  );
  useEffect(() => {
    const newQuery = {};
    if (inherit && query.perPage !== postsPerPage) {
      newQuery.perPage = postsPerPage;
    } else if (!query.perPage && postsPerPage) {
      newQuery.perPage = postsPerPage;
    }
    if (!!Object.keys(newQuery).length) {
      __unstableMarkNextChangeAsNotPersistent();
      updateQuery(newQuery);
    }
  }, [
    query.perPage,
    inherit,
    postsPerPage,
    __unstableMarkNextChangeAsNotPersistent,
    updateQuery
  ]);
  useEffect(() => {
    if (!Number.isFinite(queryId)) {
      __unstableMarkNextChangeAsNotPersistent();
      setAttributes({ queryId: instanceId });
    }
  }, [
    queryId,
    instanceId,
    __unstableMarkNextChangeAsNotPersistent,
    setAttributes
  ]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    isSelected && /* @__PURE__ */ jsx(
      QueryToolbar,
      {
        clientId,
        attributes,
        hasInnerBlocks: true
      }
    ),
    /* @__PURE__ */ jsx(
      EnhancedPaginationModal,
      {
        attributes,
        setAttributes,
        clientId
      }
    ),
    /* @__PURE__ */ jsx(InspectorControls, { children: /* @__PURE__ */ jsx(
      QueryInspectorControls,
      {
        name,
        attributes,
        setQuery: updateQuery,
        setAttributes,
        clientId,
        isSingular
      }
    ) }),
    /* @__PURE__ */ jsxs(InspectorControls, { group: "advanced", children: [
      /* @__PURE__ */ jsx(
        HTMLElementControl,
        {
          tagName: TagName,
          onChange: (value) => setAttributes({ tagName: value }),
          clientId,
          options: [
            { label: __("Default (<div>)"), value: "div" },
            { label: "<main>", value: "main" },
            { label: "<section>", value: "section" },
            { label: "<aside>", value: "aside" }
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        EnhancedPaginationControl,
        {
          enhancedPagination,
          setAttributes,
          clientId
        }
      )
    ] }),
    /* @__PURE__ */ jsx(TagName, { ...innerBlocksProps })
  ] });
}
export {
  QueryContent as default
};
//# sourceMappingURL=query-content.mjs.map
