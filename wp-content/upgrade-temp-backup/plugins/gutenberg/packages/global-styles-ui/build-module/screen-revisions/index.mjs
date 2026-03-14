// packages/global-styles-ui/src/screen-revisions/index.tsx
import { __, sprintf } from "@wordpress/i18n";
import {
  __experimentalConfirmDialog as ConfirmDialog,
  Spinner,
  useNavigator
} from "@wordpress/components";
import { useContext, useState, useMemo } from "@wordpress/element";
import { areGlobalStylesEqual } from "@wordpress/global-styles-engine";
import { ScreenHeader } from "../screen-header.mjs";
import { GlobalStylesContext } from "../context.mjs";
import useGlobalStylesRevisions from "./use-global-styles-revisions.mjs";
import RevisionsButtons from "./revisions-buttons.mjs";
import Pagination from "../pagination/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var PAGE_SIZE = 10;
function ScreenRevisions({ onClose } = {}) {
  const { user: currentEditorGlobalStyles, onChange: setUserConfig } = useContext(GlobalStylesContext);
  const { params, goTo } = useNavigator();
  const { revisionId } = params;
  const [currentPage, setCurrentPage] = useState(1);
  const { revisions, isLoading, hasUnsavedChanges, revisionsCount } = useGlobalStylesRevisions({
    query: {
      per_page: PAGE_SIZE,
      page: currentPage
    }
  });
  const numPages = Math.ceil(revisionsCount / PAGE_SIZE);
  const [
    isLoadingRevisionWithUnsavedChanges,
    setIsLoadingRevisionWithUnsavedChanges
  ] = useState(false);
  const currentlySelectedRevision = useMemo(() => {
    if (!revisionId) {
      return currentEditorGlobalStyles;
    }
    const revision = revisions.find(
      (rev) => String(rev.id) === String(revisionId)
    );
    return revision || currentEditorGlobalStyles;
  }, [revisionId, revisions, currentEditorGlobalStyles]);
  const selectedRevisionMatchesEditorStyles = areGlobalStylesEqual(
    currentlySelectedRevision,
    currentEditorGlobalStyles
  );
  const onCloseRevisions = () => {
    if (onClose) {
      onClose();
    }
  };
  const restoreRevision = (revision) => {
    setUserConfig(revision);
    setIsLoadingRevisionWithUnsavedChanges(false);
    onCloseRevisions();
  };
  const handleRevisionSelect = (revision) => {
    goTo(`/revisions/${revision.id}`);
  };
  const currentlySelectedRevisionId = (
    // @ts-expect-error: revision id is not present in the fallback (default object).
    currentlySelectedRevision?.id ?? revisions[0]?.id
  );
  const isLoadButtonEnabled = !!currentlySelectedRevisionId && currentlySelectedRevisionId !== "unsaved" && !selectedRevisionMatchesEditorStyles;
  const hasRevisions = !!revisions.length;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      ScreenHeader,
      {
        title: revisionsCount ? sprintf(
          // translators: %d: number of revisions.
          __("Revisions (%d)"),
          revisionsCount
        ) : __("Revisions"),
        description: __(
          `Click on previously saved styles to preview them. To restore a selected version to the editor, hit "Apply." When you're ready, use the Save button to save your changes.`
        ),
        onBack: onCloseRevisions
      }
    ),
    !hasRevisions && /* @__PURE__ */ jsx(Spinner, { className: "global-styles-ui-screen-revisions__loading" }),
    /* @__PURE__ */ jsx(
      RevisionsButtons,
      {
        onChange: handleRevisionSelect,
        selectedRevisionId: currentlySelectedRevisionId,
        userRevisions: revisions,
        canApplyRevision: isLoadButtonEnabled,
        onApplyRevision: () => hasUnsavedChanges ? setIsLoadingRevisionWithUnsavedChanges(true) : restoreRevision(currentlySelectedRevision)
      }
    ),
    numPages > 1 && /* @__PURE__ */ jsx("div", { className: "global-styles-ui-screen-revisions__footer", children: /* @__PURE__ */ jsx(
      Pagination,
      {
        className: "global-styles-ui-screen-revisions__pagination",
        currentPage,
        numPages,
        changePage: setCurrentPage,
        totalItems: revisionsCount,
        disabled: isLoading,
        label: __("Global Styles pagination")
      }
    ) }),
    isLoadingRevisionWithUnsavedChanges && /* @__PURE__ */ jsx(
      ConfirmDialog,
      {
        isOpen: isLoadingRevisionWithUnsavedChanges,
        confirmButtonText: __("Apply"),
        onConfirm: () => restoreRevision(currentlySelectedRevision),
        onCancel: () => setIsLoadingRevisionWithUnsavedChanges(false),
        size: "medium",
        children: __(
          "Are you sure you want to apply this revision? Any unsaved changes will be lost."
        )
      }
    )
  ] });
}
var screen_revisions_default = ScreenRevisions;
export {
  screen_revisions_default as default
};
//# sourceMappingURL=index.mjs.map
