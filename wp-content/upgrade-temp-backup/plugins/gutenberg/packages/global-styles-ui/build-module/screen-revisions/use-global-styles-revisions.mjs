// packages/global-styles-ui/src/screen-revisions/use-global-styles-revisions.tsx
import { useSelect } from "@wordpress/data";
import {
  store as coreStore
} from "@wordpress/core-data";
import { useContext, useMemo } from "@wordpress/element";
import { GlobalStylesContext } from "../context.mjs";
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
  const { user: userConfig } = useContext(GlobalStylesContext);
  const _query = useMemo(
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
  } = useSelect(
    (select) => {
      const {
        __experimentalGetDirtyEntityRecords,
        getCurrentUser,
        getUsers,
        getRevisions,
        __experimentalGetCurrentGlobalStylesId,
        getEntityRecord,
        isResolving
      } = select(coreStore);
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
  return useMemo(() => {
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
export {
  useGlobalStylesRevisions as default
};
//# sourceMappingURL=use-global-styles-revisions.mjs.map
