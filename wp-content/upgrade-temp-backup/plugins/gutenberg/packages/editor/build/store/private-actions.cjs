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
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/store/private-actions.js
var private_actions_exports = {};
__export(private_actions_exports, {
  createTemplate: () => createTemplate,
  hideBlockTypes: () => hideBlockTypes,
  removeTemplates: () => removeTemplates,
  resetStylesNavigation: () => resetStylesNavigation,
  restoreRevision: () => restoreRevision,
  revertTemplate: () => revertTemplate,
  saveDirtyEntities: () => saveDirtyEntities,
  selectNote: () => selectNote,
  setCanvasMinHeight: () => setCanvasMinHeight,
  setCurrentRevisionId: () => setCurrentRevisionId,
  setCurrentTemplateId: () => setCurrentTemplateId,
  setDefaultRenderingMode: () => setDefaultRenderingMode,
  setShowStylebook: () => setShowStylebook,
  setStylesPath: () => setStylesPath,
  showBlockTypes: () => showBlockTypes
});
module.exports = __toCommonJS(private_actions_exports);
var import_core_data = require("@wordpress/core-data");
var import_i18n = require("@wordpress/i18n");
var import_notices = require("@wordpress/notices");
var import_block_editor = require("@wordpress/block-editor");
var import_preferences = require("@wordpress/preferences");
var import_url = require("@wordpress/url");
var import_api_fetch = __toESM(require("@wordpress/api-fetch"));
var import_blocks = require("@wordpress/blocks");
var import_html_entities = require("@wordpress/html-entities");
var import_date = require("@wordpress/date");
var import_is_template_revertable = __toESM(require("./utils/is-template-revertable.cjs"));
__reExport(private_actions_exports, require("../dataviews/store/private-actions.cjs"), module.exports);
function setCurrentTemplateId(id) {
  return {
    type: "SET_CURRENT_TEMPLATE_ID",
    id
  };
}
var createTemplate = (template) => async ({ select, dispatch, registry }) => {
  const savedTemplate = await registry.dispatch(import_core_data.store).saveEntityRecord("postType", "wp_template", template);
  registry.dispatch(import_core_data.store).editEntityRecord(
    "postType",
    select.getCurrentPostType(),
    select.getCurrentPostId(),
    {
      template: savedTemplate.slug
    }
  );
  registry.dispatch(import_notices.store).createSuccessNotice(
    (0, import_i18n.__)("Custom template created. You're in template mode now."),
    {
      type: "snackbar",
      actions: [
        {
          label: (0, import_i18n.__)("Go back"),
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
  const existingBlockNames = registry.select(import_preferences.store).get("core", "hiddenBlockTypes") ?? [];
  const newBlockNames = existingBlockNames.filter(
    (type) => !(Array.isArray(blockNames) ? blockNames : [blockNames]).includes(type)
  );
  registry.dispatch(import_preferences.store).set("core", "hiddenBlockTypes", newBlockNames);
};
var hideBlockTypes = (blockNames) => ({ registry }) => {
  const existingBlockNames = registry.select(import_preferences.store).get("core", "hiddenBlockTypes") ?? [];
  const mergedBlockNames = /* @__PURE__ */ new Set([
    ...existingBlockNames,
    ...Array.isArray(blockNames) ? blockNames : [blockNames]
  ]);
  registry.dispatch(import_preferences.store).set("core", "hiddenBlockTypes", [...mergedBlockNames]);
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
  const homeUrl = registry.select(import_core_data.store).getEntityRecord("root", "__unstableBase")?.home;
  registry.dispatch(import_notices.store).removeNotice(saveNoticeId);
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
        registry.dispatch(import_core_data.store).editEntityRecord(kind, name, key, {
          status: "publish"
        });
      }
      pendingSavedRecords.push(
        registry.dispatch(import_core_data.store).saveEditedEntityRecord(kind, name, key)
      );
    }
  });
  if (siteItemsToSave.length) {
    pendingSavedRecords.push(
      registry.dispatch(import_core_data.store).__experimentalSaveSpecifiedEntityEdits(
        "root",
        "site",
        void 0,
        siteItemsToSave
      )
    );
  }
  registry.dispatch(import_block_editor.store).__unstableMarkLastChangeAsPersistent();
  Promise.all(pendingSavedRecords).then((values) => {
    return onSave ? onSave(values) : values;
  }).then((values) => {
    if (values.some((value) => typeof value === "undefined")) {
      registry.dispatch(import_notices.store).createErrorNotice((0, import_i18n.__)("Saving failed."));
    } else {
      registry.dispatch(import_notices.store).createSuccessNotice(
        successNoticeContent || (0, import_i18n.__)("Site updated."),
        {
          type: "snackbar",
          id: saveNoticeId,
          actions: [
            {
              label: (0, import_i18n.__)("View site"),
              url: homeUrl,
              openInNewTab: true
            }
          ]
        }
      );
    }
  }).catch(
    (error) => registry.dispatch(import_notices.store).createErrorNotice(
      `${(0, import_i18n.__)("Saving failed.")} ${error}`
    )
  );
};
var revertTemplate = (template, { allowUndo = true } = {}) => async ({ registry }) => {
  const noticeId = "edit-site-template-reverted";
  registry.dispatch(import_notices.store).removeNotice(noticeId);
  if (!(0, import_is_template_revertable.default)(template)) {
    registry.dispatch(import_notices.store).createErrorNotice((0, import_i18n.__)("This template is not revertable."), {
      type: "snackbar"
    });
    return;
  }
  try {
    const templateEntityConfig = registry.select(import_core_data.store).getEntityConfig("postType", template.type);
    if (!templateEntityConfig) {
      registry.dispatch(import_notices.store).createErrorNotice(
        (0, import_i18n.__)(
          "The editor has encountered an unexpected error. Please reload."
        ),
        { type: "snackbar" }
      );
      return;
    }
    const fileTemplatePath = (0, import_url.addQueryArgs)(
      `${templateEntityConfig.baseURL}/${template.id}`,
      { context: "edit", source: template.origin }
    );
    const fileTemplate = await (0, import_api_fetch.default)({ path: fileTemplatePath });
    if (!fileTemplate) {
      registry.dispatch(import_notices.store).createErrorNotice(
        (0, import_i18n.__)(
          "The editor has encountered an unexpected error. Please reload."
        ),
        { type: "snackbar" }
      );
      return;
    }
    const serializeBlocks = ({
      blocks: blocksForSerialization = []
    }) => (0, import_blocks.__unstableSerializeAndClean)(blocksForSerialization);
    const edited = registry.select(import_core_data.store).getEditedEntityRecord(
      "postType",
      template.type,
      template.id
    );
    registry.dispatch(import_core_data.store).editEntityRecord(
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
    const blocks = (0, import_blocks.parse)(fileTemplate?.content?.raw);
    registry.dispatch(import_core_data.store).editEntityRecord("postType", template.type, fileTemplate.id, {
      content: serializeBlocks,
      blocks,
      source: "theme"
    });
    if (allowUndo) {
      const undoRevert = () => {
        registry.dispatch(import_core_data.store).editEntityRecord(
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
      registry.dispatch(import_notices.store).createSuccessNotice((0, import_i18n.__)("Template reset."), {
        type: "snackbar",
        id: noticeId,
        actions: [
          {
            label: (0, import_i18n.__)("Undo"),
            onClick: undoRevert
          }
        ]
      });
    }
  } catch (error) {
    const errorMessage = error.message && error.code !== "unknown_error" ? error.message : (0, import_i18n.__)("Template revert failed. Please reload.");
    registry.dispatch(import_notices.store).createErrorNotice(errorMessage, { type: "snackbar" });
  }
};
var removeTemplates = (items) => async ({ registry }) => {
  const isResetting = items.every((item) => item?.has_theme_file);
  const promiseResult = await Promise.allSettled(
    items.map((item) => {
      return registry.dispatch(import_core_data.store).deleteEntityRecord(
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
      successMessage = isResetting ? (0, import_i18n.sprintf)(
        /* translators: %s: The template/part's name. */
        (0, import_i18n.__)('"%s" reset.'),
        (0, import_html_entities.decodeEntities)(title)
      ) : (0, import_i18n.sprintf)(
        /* translators: %s: The template/part's name. */
        (0, import_i18n._x)('"%s" deleted.', "template part"),
        (0, import_html_entities.decodeEntities)(title)
      );
    } else {
      successMessage = isResetting ? (0, import_i18n.__)("Items reset.") : (0, import_i18n.__)("Items deleted.");
    }
    registry.dispatch(import_notices.store).createSuccessNotice(successMessage, {
      type: "snackbar",
      id: "editor-template-deleted-success"
    });
  } else {
    let errorMessage;
    if (promiseResult.length === 1) {
      if (promiseResult[0].reason?.message) {
        errorMessage = promiseResult[0].reason.message;
      } else {
        errorMessage = isResetting ? (0, import_i18n.__)("An error occurred while reverting the item.") : (0, import_i18n.__)("An error occurred while deleting the item.");
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
        errorMessage = (0, import_i18n.__)(
          "An error occurred while deleting the items."
        );
      } else if (errorMessages.size === 1) {
        errorMessage = isResetting ? (0, import_i18n.sprintf)(
          /* translators: %s: an error message */
          (0, import_i18n.__)(
            "An error occurred while reverting the items: %s"
          ),
          [...errorMessages][0]
        ) : (0, import_i18n.sprintf)(
          /* translators: %s: an error message */
          (0, import_i18n.__)(
            "An error occurred while deleting the items: %s"
          ),
          [...errorMessages][0]
        );
      } else {
        errorMessage = isResetting ? (0, import_i18n.sprintf)(
          /* translators: %s: a list of comma separated error messages */
          (0, import_i18n.__)(
            "Some errors occurred while reverting the items: %s"
          ),
          [...errorMessages].join(",")
        ) : (0, import_i18n.sprintf)(
          /* translators: %s: a list of comma separated error messages */
          (0, import_i18n.__)(
            "Some errors occurred while deleting the items: %s"
          ),
          [...errorMessages].join(",")
        );
      }
    }
    registry.dispatch(import_notices.store).createErrorNotice(errorMessage, { type: "snackbar" });
  }
};
var setDefaultRenderingMode = (mode) => ({ select, registry }) => {
  const postType = select.getCurrentPostType();
  const theme = registry.select(import_core_data.store).getCurrentTheme()?.stylesheet;
  const renderingModes = registry.select(import_preferences.store).get("core", "renderingModes")?.[theme] ?? {};
  if (renderingModes[postType] === mode) {
    return;
  }
  const newModes = {
    [theme]: {
      ...renderingModes,
      [postType]: mode
    }
  };
  registry.dispatch(import_preferences.store).set("core", "renderingModes", newModes);
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
  const revision = registry.select(import_core_data.store).getRevision("postType", postType, postId, revisionId, {
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
  registry.dispatch(import_notices.store).createSuccessNotice(
    (0, import_i18n.sprintf)(
      /* translators: %s: Date and time of the revision. */
      (0, import_i18n.__)("Restored to revision from %s."),
      (0, import_date.dateI18n)((0, import_date.getSettings)().formats.datetime, revision.date)
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
  showBlockTypes,
  ...require("../dataviews/store/private-actions.cjs")
});
//# sourceMappingURL=private-actions.cjs.map
