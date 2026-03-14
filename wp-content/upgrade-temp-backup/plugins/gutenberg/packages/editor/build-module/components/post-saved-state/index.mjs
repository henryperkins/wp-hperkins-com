// packages/editor/src/components/post-saved-state/index.js
import clsx from "clsx";
import {
  __unstableGetAnimateClassName as getAnimateClassName,
  Button
} from "@wordpress/components";
import { usePrevious, useViewportMatch } from "@wordpress/compose";
import { useDispatch, useSelect } from "@wordpress/data";
import { useEffect, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Icon, check, cloud, cloudUpload } from "@wordpress/icons";
import { displayShortcut } from "@wordpress/keycodes";
import { store as preferencesStore } from "@wordpress/preferences";
import { STATUS_OPTIONS } from "../post-status/index.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { ATTACHMENT_POST_TYPE } from "../../store/constants.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function PostSavedState({ forceIsDirty }) {
  const [forceSavedMessage, setForceSavedMessage] = useState(false);
  const isLargeViewport = useViewportMatch("small");
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
  } = useSelect(
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
      } = select(editorStore);
      const { get } = select(preferencesStore);
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
        postType: select(editorStore).getCurrentPostType()
      };
    },
    [forceIsDirty]
  );
  const isPending = postStatus === "pending";
  const { savePost } = useDispatch(editorStore);
  const wasSaving = usePrevious(isSaving);
  useEffect(() => {
    let timeoutId;
    if (wasSaving && !isSaving) {
      setForceSavedMessage(true);
      timeoutId = setTimeout(() => {
        setForceSavedMessage(false);
      }, 1e3);
    }
    return () => clearTimeout(timeoutId);
  }, [isSaving]);
  if (postType === ATTACHMENT_POST_TYPE) {
    return null;
  }
  if (!hasPublishAction && isPending) {
    return null;
  }
  const isIneligibleStatus = !["pending", "draft", "auto-draft"].includes(postStatus) && STATUS_OPTIONS.map(({ value }) => value).includes(postStatus);
  if (isPublished || isScheduled || isIneligibleStatus || postStatusHasChanged && ["pending", "draft"].includes(postStatus)) {
    return null;
  }
  const label = isPending ? __("Save as pending") : __("Save draft");
  const shortLabel = __("Save");
  const isSaved = forceSavedMessage || !isNew && !isDirty;
  const isSavedState = isSaving || isSaved;
  const isDisabled = isSaving || isSaved || !isSaveable;
  let text;
  if (isSaving) {
    text = isAutosaving ? __("Autosaving") : __("Saving");
  } else if (isSaved) {
    text = __("Saved");
  } else if (isLargeViewport) {
    text = label;
  } else if (showIconLabels) {
    text = shortLabel;
  }
  return /* @__PURE__ */ jsxs(
    Button,
    {
      className: isSaveable || isSaving ? clsx({
        "editor-post-save-draft": !isSavedState,
        "editor-post-saved-state": isSavedState,
        "is-saving": isSaving,
        "is-autosaving": isAutosaving,
        "is-saved": isSaved,
        [getAnimateClassName({
          type: "loading"
        })]: isSaving
      }) : void 0,
      onClick: isDisabled ? void 0 : () => savePost(),
      shortcut: isDisabled ? void 0 : displayShortcut.primary("s"),
      variant: "tertiary",
      size: "compact",
      icon: isLargeViewport ? void 0 : cloudUpload,
      label: text || label,
      "aria-disabled": isDisabled,
      children: [
        isSavedState && /* @__PURE__ */ jsx(Icon, { icon: isSaved ? check : cloud }),
        text
      ]
    }
  );
}
export {
  PostSavedState as default
};
//# sourceMappingURL=index.mjs.map
