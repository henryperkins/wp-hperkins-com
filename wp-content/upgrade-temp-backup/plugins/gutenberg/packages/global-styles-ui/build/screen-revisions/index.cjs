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

// packages/global-styles-ui/src/screen-revisions/index.tsx
var screen_revisions_exports = {};
__export(screen_revisions_exports, {
  default: () => screen_revisions_default
});
module.exports = __toCommonJS(screen_revisions_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_global_styles_engine = require("@wordpress/global-styles-engine");
var import_screen_header = require("../screen-header.cjs");
var import_context = require("../context.cjs");
var import_use_global_styles_revisions = __toESM(require("./use-global-styles-revisions.cjs"));
var import_revisions_buttons = __toESM(require("./revisions-buttons.cjs"));
var import_pagination = __toESM(require("../pagination/index.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var PAGE_SIZE = 10;
function ScreenRevisions({ onClose } = {}) {
  const { user: currentEditorGlobalStyles, onChange: setUserConfig } = (0, import_element.useContext)(import_context.GlobalStylesContext);
  const { params, goTo } = (0, import_components.useNavigator)();
  const { revisionId } = params;
  const [currentPage, setCurrentPage] = (0, import_element.useState)(1);
  const { revisions, isLoading, hasUnsavedChanges, revisionsCount } = (0, import_use_global_styles_revisions.default)({
    query: {
      per_page: PAGE_SIZE,
      page: currentPage
    }
  });
  const numPages = Math.ceil(revisionsCount / PAGE_SIZE);
  const [
    isLoadingRevisionWithUnsavedChanges,
    setIsLoadingRevisionWithUnsavedChanges
  ] = (0, import_element.useState)(false);
  const currentlySelectedRevision = (0, import_element.useMemo)(() => {
    if (!revisionId) {
      return currentEditorGlobalStyles;
    }
    const revision = revisions.find(
      (rev) => String(rev.id) === String(revisionId)
    );
    return revision || currentEditorGlobalStyles;
  }, [revisionId, revisions, currentEditorGlobalStyles]);
  const selectedRevisionMatchesEditorStyles = (0, import_global_styles_engine.areGlobalStylesEqual)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_screen_header.ScreenHeader,
      {
        title: revisionsCount ? (0, import_i18n.sprintf)(
          // translators: %d: number of revisions.
          (0, import_i18n.__)("Revisions (%d)"),
          revisionsCount
        ) : (0, import_i18n.__)("Revisions"),
        description: (0, import_i18n.__)(
          `Click on previously saved styles to preview them. To restore a selected version to the editor, hit "Apply." When you're ready, use the Save button to save your changes.`
        ),
        onBack: onCloseRevisions
      }
    ),
    !hasRevisions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Spinner, { className: "global-styles-ui-screen-revisions__loading" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_revisions_buttons.default,
      {
        onChange: handleRevisionSelect,
        selectedRevisionId: currentlySelectedRevisionId,
        userRevisions: revisions,
        canApplyRevision: isLoadButtonEnabled,
        onApplyRevision: () => hasUnsavedChanges ? setIsLoadingRevisionWithUnsavedChanges(true) : restoreRevision(currentlySelectedRevision)
      }
    ),
    numPages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "global-styles-ui-screen-revisions__footer", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_pagination.default,
      {
        className: "global-styles-ui-screen-revisions__pagination",
        currentPage,
        numPages,
        changePage: setCurrentPage,
        totalItems: revisionsCount,
        disabled: isLoading,
        label: (0, import_i18n.__)("Global Styles pagination")
      }
    ) }),
    isLoadingRevisionWithUnsavedChanges && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.__experimentalConfirmDialog,
      {
        isOpen: isLoadingRevisionWithUnsavedChanges,
        confirmButtonText: (0, import_i18n.__)("Apply"),
        onConfirm: () => restoreRevision(currentlySelectedRevision),
        onCancel: () => setIsLoadingRevisionWithUnsavedChanges(false),
        size: "medium",
        children: (0, import_i18n.__)(
          "Are you sure you want to apply this revision? Any unsaved changes will be lost."
        )
      }
    )
  ] });
}
var screen_revisions_default = ScreenRevisions;
//# sourceMappingURL=index.cjs.map
