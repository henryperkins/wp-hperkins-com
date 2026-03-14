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

// packages/global-styles-ui/src/screen-revisions/use-global-styles-revisions.tsx
var use_global_styles_revisions_exports = {};
__export(use_global_styles_revisions_exports, {
  default: () => useGlobalStylesRevisions
});
module.exports = __toCommonJS(use_global_styles_revisions_exports);
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_element = require("@wordpress/element");
var import_context = require("../context.cjs");
var SITE_EDITOR_AUTHORS_QUERY = {
  per_page: -1,
  _fields: "id,name,avatar_urls",
  context: "view",
  capabilities: ["edit_theme_options"]
};
var DEFAULT_QUERY = { per_page: 100, page: 1 };
var EMPTY_ARRAY = [];
function useGlobalStylesRevisions({
  query
} = {}) {
  const { user: userConfig } = (0, import_element.useContext)(import_context.GlobalStylesContext);
  const _query = (0, import_element.useMemo)(
    () => ({ ...DEFAULT_QUERY, ...query }),
    [query]
  );
  const {
    authors,
    currentUser,
    isDirty,
    revisions,
    isLoadingGlobalStylesRevisions,
    revisionsCount
  } = (0, import_data.useSelect)(
    (select) => {
      const {
        __experimentalGetDirtyEntityRecords,
        getCurrentUser,
        getUsers,
        getRevisions,
        __experimentalGetCurrentGlobalStylesId,
        getEntityRecord,
        isResolving
      } = select(import_core_data.store);
      const dirtyEntityRecords = __experimentalGetDirtyEntityRecords() || [];
      const _currentUser = getCurrentUser();
      const _isDirty = dirtyEntityRecords.length > 0;
      const globalStylesId = __experimentalGetCurrentGlobalStylesId();
      const globalStyles = globalStylesId ? getEntityRecord(
        "root",
        "globalStyles",
        globalStylesId
      ) : void 0;
      const _revisionsCount = (
        // @ts-expect-error - _links is not typed in GlobalStylesRevision
        globalStyles?._links?.["version-history"]?.[0]?.count ?? 0
      );
      const globalStylesRevisions = globalStylesId ? getRevisions(
        "root",
        "globalStyles",
        globalStylesId,
        _query
      ) || EMPTY_ARRAY : EMPTY_ARRAY;
      const _authors = getUsers(SITE_EDITOR_AUTHORS_QUERY) || EMPTY_ARRAY;
      const _isResolving = globalStylesId ? isResolving("getRevisions", [
        "root",
        "globalStyles",
        globalStylesId,
        _query
      ]) : false;
      return {
        authors: _authors,
        currentUser: _currentUser,
        isDirty: _isDirty,
        revisions: globalStylesRevisions,
        isLoadingGlobalStylesRevisions: _isResolving,
        revisionsCount: _revisionsCount
      };
    },
    [_query]
  );
  return (0, import_element.useMemo)(() => {
    if (!authors.length || isLoadingGlobalStylesRevisions) {
      return {
        revisions: EMPTY_ARRAY,
        hasUnsavedChanges: isDirty,
        isLoading: true,
        revisionsCount
      };
    }
    const _modifiedRevisions = revisions.map((revision) => {
      return {
        ...revision,
        author: authors.find(
          (author) => author.id === revision.author
        )
      };
    });
    const fetchedRevisionsCount = revisions.length;
    if (fetchedRevisionsCount) {
      if (_modifiedRevisions[0].id !== "unsaved" && _query.page === 1) {
        _modifiedRevisions[0].isLatest = true;
      }
      if (isDirty && userConfig && Object.keys(userConfig).length > 0 && currentUser && _query.page === 1) {
        const unsavedRevision = {
          id: "unsaved",
          styles: userConfig?.styles,
          settings: userConfig?.settings,
          _links: userConfig?._links,
          author: {
            name: currentUser?.name || "",
            // @ts-expect-error - avatar_urls is not typed in User
            avatar_urls: currentUser?.avatar_urls || {}
          },
          modified: /* @__PURE__ */ new Date()
        };
        _modifiedRevisions.unshift(unsavedRevision);
      }
      if (_query.per_page && _query.page === Math.ceil(revisionsCount / _query.per_page)) {
        _modifiedRevisions.push({
          id: "parent",
          styles: {},
          settings: {}
        });
      }
    }
    return {
      revisions: _modifiedRevisions,
      hasUnsavedChanges: isDirty,
      isLoading: false,
      revisionsCount
    };
  }, [
    isDirty,
    revisions,
    currentUser,
    authors,
    userConfig,
    isLoadingGlobalStylesRevisions,
    revisionsCount,
    _query.page,
    _query.per_page
  ]);
}
//# sourceMappingURL=use-global-styles-revisions.cjs.map
