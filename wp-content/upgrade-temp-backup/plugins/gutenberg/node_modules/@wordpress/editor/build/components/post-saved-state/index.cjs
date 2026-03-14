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

// packages/editor/src/components/post-saved-state/index.js
var post_saved_state_exports = {};
__export(post_saved_state_exports, {
  default: () => PostSavedState
});
module.exports = __toCommonJS(post_saved_state_exports);
var import_clsx = __toESM(require("clsx"));
var import_components = require("@wordpress/components");
var import_compose = require("@wordpress/compose");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_keycodes = require("@wordpress/keycodes");
var import_preferences = require("@wordpress/preferences");
var import_post_status = require("../post-status/index.cjs");
var import_store = require("../../store/index.cjs");
var import_constants = require("../../store/constants.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function PostSavedState({ forceIsDirty }) {
  const [forceSavedMessage, setForceSavedMessage] = (0, import_element.useState)(false);
  const isLargeViewport = (0, import_compose.useViewportMatch)("small");
  const {
    isAutosaving,
    isDirty,
    isNew,
    isPublished,
    isSaveable,
    isSaving,
    isScheduled,
    hasPublishAction,
    showIconLabels,
    postStatus,
    postStatusHasChanged,
    postType
  } = (0, import_data.useSelect)(
    (select) => {
      const {
        isEditedPostNew,
        isCurrentPostPublished,
        isCurrentPostScheduled,
        isEditedPostDirty,
        isSavingPost,
        isEditedPostSaveable,
        getCurrentPost,
        isAutosavingPost,
        getEditedPostAttribute,
        getPostEdits
      } = select(import_store.store);
      const { get } = select(import_preferences.store);
      return {
        isAutosaving: isAutosavingPost(),
        isDirty: forceIsDirty || isEditedPostDirty(),
        isNew: isEditedPostNew(),
        isPublished: isCurrentPostPublished(),
        isSaving: isSavingPost(),
        isSaveable: isEditedPostSaveable(),
        isScheduled: isCurrentPostScheduled(),
        hasPublishAction: getCurrentPost()?._links?.["wp:action-publish"] ?? false,
        showIconLabels: get("core", "showIconLabels"),
        postStatus: getEditedPostAttribute("status"),
        postStatusHasChanged: !!getPostEdits()?.status,
        postType: select(import_store.store).getCurrentPostType()
      };
    },
    [forceIsDirty]
  );
  const isPending = postStatus === "pending";
  const { savePost } = (0, import_data.useDispatch)(import_store.store);
  const wasSaving = (0, import_compose.usePrevious)(isSaving);
  (0, import_element.useEffect)(() => {
    let timeoutId;
    if (wasSaving && !isSaving) {
      setForceSavedMessage(true);
      timeoutId = setTimeout(() => {
        setForceSavedMessage(false);
      }, 1e3);
    }
    return () => clearTimeout(timeoutId);
  }, [isSaving]);
  if (postType === import_constants.ATTACHMENT_POST_TYPE) {
    return null;
  }
  if (!hasPublishAction && isPending) {
    return null;
  }
  const isIneligibleStatus = !["pending", "draft", "auto-draft"].includes(postStatus) && import_post_status.STATUS_OPTIONS.map(({ value }) => value).includes(postStatus);
  if (isPublished || isScheduled || isIneligibleStatus || postStatusHasChanged && ["pending", "draft"].includes(postStatus)) {
    return null;
  }
  const label = isPending ? (0, import_i18n.__)("Save as pending") : (0, import_i18n.__)("Save draft");
  const shortLabel = (0, import_i18n.__)("Save");
  const isSaved = forceSavedMessage || !isNew && !isDirty;
  const isSavedState = isSaving || isSaved;
  const isDisabled = isSaving || isSaved || !isSaveable;
  let text;
  if (isSaving) {
    text = isAutosaving ? (0, import_i18n.__)("Autosaving") : (0, import_i18n.__)("Saving");
  } else if (isSaved) {
    text = (0, import_i18n.__)("Saved");
  } else if (isLargeViewport) {
    text = label;
  } else if (showIconLabels) {
    text = shortLabel;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.Button,
    {
      className: isSaveable || isSaving ? (0, import_clsx.default)({
        "editor-post-save-draft": !isSavedState,
        "editor-post-saved-state": isSavedState,
        "is-saving": isSaving,
        "is-autosaving": isAutosaving,
        "is-saved": isSaved,
        [(0, import_components.__unstableGetAnimateClassName)({
          type: "loading"
        })]: isSaving
      }) : void 0,
      onClick: isDisabled ? void 0 : () => savePost(),
      shortcut: isDisabled ? void 0 : import_keycodes.displayShortcut.primary("s"),
      variant: "tertiary",
      size: "compact",
      icon: isLargeViewport ? void 0 : import_icons.cloudUpload,
      label: text || label,
      "aria-disabled": isDisabled,
      children: [
        isSavedState && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_icons.Icon, { icon: isSaved ? import_icons.check : import_icons.cloud }),
        text
      ]
    }
  );
}
//# sourceMappingURL=index.cjs.map
