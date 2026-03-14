// packages/editor/src/store/private-actions.js
import { store as coreStore } from "@wordpress/core-data";
import { __, _x, sprintf } from "@wordpress/i18n";
import { store as noticesStore } from "@wordpress/notices";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { store as preferencesStore } from "@wordpress/preferences";
import { addQueryArgs } from "@wordpress/url";
import apiFetch from "@wordpress/api-fetch";
import { parse, __unstableSerializeAndClean } from "@wordpress/blocks";
import { decodeEntities } from "@wordpress/html-entities";
import { dateI18n, getSettings as getDateSettings } from "@wordpress/date";
import isTemplateRevertable from "./utils/is-template-revertable.mjs";
export * from "../dataviews/store/private-actions.mjs";
function setCurrentTemplateId(id) {
  return {
    type: "SET_CURRENT_TEMPLATE_ID",
    id
  };
}
var createTemplate = (template) => async ({ select, dispatch, registry }) => {
  const savedTemplate = await registry.dispatch(coreStore).saveEntityRecord("postType", "wp_template", template);
  registry.dispatch(coreStore).editEntityRecord(
    "postType",
    select.getCurrentPostType(),
    select.getCurrentPostId(),
    {
      template: savedTemplate.slug
    }
  );
  registry.dispatch(noticesStore).createSuccessNotice(
    __("Custom template created. You're in template mode now."),
    {
      type: "snackbar",
      actions: [
        {
          label: __("Go back"),
          onClick: () => dispatch.setRenderingMode(
            select.getEditorSettings().defaultRenderingMode
          )
        }
      ]
    }
  );
  return savedTemplate;
};
var showBlockTypes = (blockNames) => ({ registry }) => {
  const existingBlockNames = registry.select(preferencesStore).get("core", "hiddenBlockTypes") ?? [];
  const newBlockNames = existingBlockNames.filter(
    (type) => !(Array.isArray(blockNames) ? blockNames : [blockNames]).includes(type)
  );
  registry.dispatch(preferencesStore).set("core", "hiddenBlockTypes", newBlockNames);
};
var hideBlockTypes = (blockNames) => ({ registry }) => {
  const existingBlockNames = registry.select(preferencesStore).get("core", "hiddenBlockTypes") ?? [];
  const mergedBlockNames = /* @__PURE__ */ new Set([
    ...existingBlockNames,
    ...Array.isArray(blockNames) ? blockNames : [blockNames]
  ]);
  registry.dispatch(preferencesStore).set("core", "hiddenBlockTypes", [...mergedBlockNames]);
};
var saveDirtyEntities = ({
  onSave,
  dirtyEntityRecords = [],
  entitiesToSkip = [],
  close,
  successNoticeContent
} = {}) => ({ registry }) => {
  const PUBLISH_ON_SAVE_ENTITIES = [
    { kind: "postType", name: "wp_navigation" }
  ];
  const saveNoticeId = "site-editor-save-success";
  const homeUrl = registry.select(coreStore).getEntityRecord("root", "__unstableBase")?.home;
  registry.dispatch(noticesStore).removeNotice(saveNoticeId);
  const entitiesToSave = dirtyEntityRecords.filter(
    ({ kind, name, key, property }) => {
      return !entitiesToSkip.some(
        (elt) => elt.kind === kind && elt.name === name && elt.key === key && elt.property === property
      );
    }
  );
  close?.(entitiesToSave);
  const siteItemsToSave = [];
  const pendingSavedRecords = [];
  entitiesToSave.forEach(({ kind, name, key, property }) => {
    if ("root" === kind && "site" === name) {
      siteItemsToSave.push(property);
    } else {
      if (PUBLISH_ON_SAVE_ENTITIES.some(
        (typeToPublish) => typeToPublish.kind === kind && typeToPublish.name === name
      )) {
        registry.dispatch(coreStore).editEntityRecord(kind, name, key, {
          status: "publish"
        });
      }
      pendingSavedRecords.push(
        registry.dispatch(coreStore).saveEditedEntityRecord(kind, name, key)
      );
    }
  });
  if (siteItemsToSave.length) {
    pendingSavedRecords.push(
      registry.dispatch(coreStore).__experimentalSaveSpecifiedEntityEdits(
        "root",
        "site",
        void 0,
        siteItemsToSave
      )
    );
  }
  registry.dispatch(blockEditorStore).__unstableMarkLastChangeAsPersistent();
  Promise.all(pendingSavedRecords).then((values) => {
    return onSave ? onSave(values) : values;
  }).then((values) => {
    if (values.some((value) => typeof value === "undefined")) {
      registry.dispatch(noticesStore).createErrorNotice(__("Saving failed."));
    } else {
      registry.dispatch(noticesStore).createSuccessNotice(
        successNoticeContent || __("Site updated."),
        {
          type: "snackbar",
          id: saveNoticeId,
          actions: [
            {
              label: __("View site"),
              url: homeUrl,
              openInNewTab: true
            }
          ]
        }
      );
    }
  }).catch(
    (error) => registry.dispatch(noticesStore).createErrorNotice(
      `${__("Saving failed.")} ${error}`
    )
  );
};
var revertTemplate = (template, { allowUndo = true } = {}) => async ({ registry }) => {
  const noticeId = "edit-site-template-reverted";
  registry.dispatch(noticesStore).removeNotice(noticeId);
  if (!isTemplateRevertable(template)) {
    registry.dispatch(noticesStore).createErrorNotice(__("This template is not revertable."), {
      type: "snackbar"
    });
    return;
  }
  try {
    const templateEntityConfig = registry.select(coreStore).getEntityConfig("postType", template.type);
    if (!templateEntityConfig) {
      registry.dispatch(noticesStore).createErrorNotice(
        __(
          "The editor has encountered an unexpected error. Please reload."
        ),
        { type: "snackbar" }
      );
      return;
    }
    const fileTemplatePath = addQueryArgs(
      `${templateEntityConfig.baseURL}/${template.id}`,
      { context: "edit", source: template.origin }
    );
    const fileTemplate = await apiFetch({ path: fileTemplatePath });
    if (!fileTemplate) {
      registry.dispatch(noticesStore).createErrorNotice(
        __(
          "The editor has encountered an unexpected error. Please reload."
        ),
        { type: "snackbar" }
      );
      return;
    }
    const serializeBlocks = ({
      blocks: blocksForSerialization = []
    }) => __unstableSerializeAndClean(blocksForSerialization);
    const edited = registry.select(coreStore).getEditedEntityRecord(
      "postType",
      template.type,
      template.id
    );
    registry.dispatch(coreStore).editEntityRecord(
      "postType",
      template.type,
      template.id,
      {
        content: serializeBlocks,
        // Required to make the `undo` behave correctly.
        blocks: edited.blocks,
        // Required to revert the blocks in the editor.
        source: "custom"
        // required to avoid turning the editor into a dirty state
      },
      {
        undoIgnore: true
        // Required to merge this edit with the last undo level.
      }
    );
    const blocks = parse(fileTemplate?.content?.raw);
    registry.dispatch(coreStore).editEntityRecord("postType", template.type, fileTemplate.id, {
      content: serializeBlocks,
      blocks,
      source: "theme"
    });
    if (allowUndo) {
      const undoRevert = () => {
        registry.dispatch(coreStore).editEntityRecord(
          "postType",
          template.type,
          edited.id,
          {
            content: serializeBlocks,
            blocks: edited.blocks,
            source: "custom"
          }
        );
      };
      registry.dispatch(noticesStore).createSuccessNotice(__("Template reset."), {
        type: "snackbar",
        id: noticeId,
        actions: [
          {
            label: __("Undo"),
            onClick: undoRevert
          }
        ]
      });
    }
  } catch (error) {
    const errorMessage = error.message && error.code !== "unknown_error" ? error.message : __("Template revert failed. Please reload.");
    registry.dispatch(noticesStore).createErrorNotice(errorMessage, { type: "snackbar" });
  }
};
var removeTemplates = (items) => async ({ registry }) => {
  const isResetting = items.every((item) => item?.has_theme_file);
  const promiseResult = await Promise.allSettled(
    items.map((item) => {
      return registry.dispatch(coreStore).deleteEntityRecord(
        "postType",
        item.type,
        item.id,
        { force: true },
        { throwOnError: true }
      );
    })
  );
  if (promiseResult.every(({ status }) => status === "fulfilled")) {
    let successMessage;
    if (items.length === 1) {
      let title;
      if (typeof items[0].title === "string") {
        title = items[0].title;
      } else if (typeof items[0].title?.rendered === "string") {
        title = items[0].title?.rendered;
      } else if (typeof items[0].title?.raw === "string") {
        title = items[0].title?.raw;
      }
      successMessage = isResetting ? sprintf(
        /* translators: %s: The template/part's name. */
        __('"%s" reset.'),
        decodeEntities(title)
      ) : sprintf(
        /* translators: %s: The template/part's name. */
        _x('"%s" deleted.', "template part"),
        decodeEntities(title)
      );
    } else {
      successMessage = isResetting ? __("Items reset.") : __("Items deleted.");
    }
    registry.dispatch(noticesStore).createSuccessNotice(successMessage, {
      type: "snackbar",
      id: "editor-template-deleted-success"
    });
  } else {
    let errorMessage;
    if (promiseResult.length === 1) {
      if (promiseResult[0].reason?.message) {
        errorMessage = promiseResult[0].reason.message;
      } else {
        errorMessage = isResetting ? __("An error occurred while reverting the item.") : __("An error occurred while deleting the item.");
      }
    } else {
      const errorMessages = /* @__PURE__ */ new Set();
      const failedPromises = promiseResult.filter(
        ({ status }) => status === "rejected"
      );
      for (const failedPromise of failedPromises) {
        if (failedPromise.reason?.message) {
          errorMessages.add(failedPromise.reason.message);
        }
      }
      if (errorMessages.size === 0) {
        errorMessage = __(
          "An error occurred while deleting the items."
        );
      } else if (errorMessages.size === 1) {
        errorMessage = isResetting ? sprintf(
          /* translators: %s: an error message */
          __(
            "An error occurred while reverting the items: %s"
          ),
          [...errorMessages][0]
        ) : sprintf(
          /* translators: %s: an error message */
          __(
            "An error occurred while deleting the items: %s"
          ),
          [...errorMessages][0]
        );
      } else {
        errorMessage = isResetting ? sprintf(
          /* translators: %s: a list of comma separated error messages */
          __(
            "Some errors occurred while reverting the items: %s"
          ),
          [...errorMessages].join(",")
        ) : sprintf(
          /* translators: %s: a list of comma separated error messages */
          __(
            "Some errors occurred while deleting the items: %s"
          ),
          [...errorMessages].join(",")
        );
      }
    }
    registry.dispatch(noticesStore).createErrorNotice(errorMessage, { type: "snackbar" });
  }
};
var setDefaultRenderingMode = (mode) => ({ select, registry }) => {
  const postType = select.getCurrentPostType();
  const theme = registry.select(coreStore).getCurrentTheme()?.stylesheet;
  const renderingModes = registry.select(preferencesStore).get("core", "renderingModes")?.[theme] ?? {};
  if (renderingModes[postType] === mode) {
    return;
  }
  const newModes = {
    [theme]: {
      ...renderingModes,
      [postType]: mode
    }
  };
  registry.dispatch(preferencesStore).set("core", "renderingModes", newModes);
};
function setStylesPath(path) {
  return {
    type: "SET_STYLES_PATH",
    path
  };
}
function setShowStylebook(show) {
  return {
    type: "SET_SHOW_STYLEBOOK",
    show
  };
}
function resetStylesNavigation() {
  return {
    type: "RESET_STYLES_NAVIGATION"
  };
}
function setCanvasMinHeight(minHeight) {
  return {
    type: "SET_CANVAS_MIN_HEIGHT",
    minHeight
  };
}
function setCurrentRevisionId(revisionId) {
  return {
    type: "SET_CURRENT_REVISION_ID",
    revisionId
  };
}
var restoreRevision = (revisionId) => async ({ select, dispatch, registry }) => {
  const postType = select.getCurrentPostType();
  const postId = select.getCurrentPostId();
  const revision = registry.select(coreStore).getRevision("postType", postType, postId, revisionId, {
    context: "edit"
  });
  if (!revision) {
    return;
  }
  const edits = {
    blocks: void 0,
    content: revision.content.raw
  };
  if (revision.title?.raw !== void 0) {
    edits.title = revision.title.raw;
  }
  if (revision.excerpt?.raw !== void 0) {
    edits.excerpt = revision.excerpt.raw;
  }
  if (revision.meta !== void 0) {
    edits.meta = revision.meta;
  }
  dispatch.editPost(edits);
  dispatch.setCurrentRevisionId(null);
  await dispatch.savePost();
  registry.dispatch(noticesStore).createSuccessNotice(
    sprintf(
      /* translators: %s: Date and time of the revision. */
      __("Restored to revision from %s."),
      dateI18n(getDateSettings().formats.datetime, revision.date)
    ),
    {
      type: "snackbar",
      id: "editor-revision-restored"
    }
  );
};
function selectNote(noteId, options = { focus: false }) {
  return {
    type: "SELECT_NOTE",
    noteId,
    options
  };
}
export {
  createTemplate,
  hideBlockTypes,
  removeTemplates,
  resetStylesNavigation,
  restoreRevision,
  revertTemplate,
  saveDirtyEntities,
  selectNote,
  setCanvasMinHeight,
  setCurrentRevisionId,
  setCurrentTemplateId,
  setDefaultRenderingMode,
  setShowStylebook,
  setStylesPath,
  showBlockTypes
};
//# sourceMappingURL=private-actions.mjs.map
