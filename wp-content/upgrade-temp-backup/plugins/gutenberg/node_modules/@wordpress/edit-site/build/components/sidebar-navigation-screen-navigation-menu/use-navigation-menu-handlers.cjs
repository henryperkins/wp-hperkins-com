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

// packages/edit-site/src/components/sidebar-navigation-screen-navigation-menu/use-navigation-menu-handlers.js
var use_navigation_menu_handlers_exports = {};
__export(use_navigation_menu_handlers_exports, {
  default: () => useNavigationMenuHandlers
});
module.exports = __toCommonJS(use_navigation_menu_handlers_exports);
var import_core_data = require("@wordpress/core-data");
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_notices = require("@wordpress/notices");
var import_router = require("@wordpress/router");
var import__ = require("./index.cjs");
var import_constants = require("../../utils/constants.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var { useHistory } = (0, import_lock_unlock.unlock)(import_router.privateApis);
function useDeleteNavigationMenu() {
  const { deleteEntityRecord } = (0, import_data.useDispatch)(import_core_data.store);
  const { createSuccessNotice, createErrorNotice } = (0, import_data.useDispatch)(import_notices.store);
  const history = useHistory();
  const handleDelete = async (navigationMenu) => {
    const postId = navigationMenu?.id;
    try {
      await deleteEntityRecord(
        "postType",
        import__.postType,
        postId,
        {
          force: true
        },
        {
          throwOnError: true
        }
      );
      createSuccessNotice(
        (0, import_i18n.__)("Navigation Menu successfully deleted."),
        {
          type: "snackbar"
        }
      );
      history.navigate("/navigation");
    } catch (error) {
      createErrorNotice(
        (0, import_i18n.sprintf)(
          /* translators: %s: error message describing why the navigation menu could not be deleted. */
          (0, import_i18n.__)(`Unable to delete Navigation Menu (%s).`),
          error?.message
        ),
        {
          type: "snackbar"
        }
      );
    }
  };
  return handleDelete;
}
function useSaveNavigationMenu() {
  const { getEditedEntityRecord } = (0, import_data.useSelect)((select) => {
    const { getEditedEntityRecord: getEditedEntityRecordSelector } = select(import_core_data.store);
    return {
      getEditedEntityRecord: getEditedEntityRecordSelector
    };
  }, []);
  const {
    editEntityRecord,
    __experimentalSaveSpecifiedEntityEdits: saveSpecifiedEntityEdits
  } = (0, import_data.useDispatch)(import_core_data.store);
  const { createSuccessNotice, createErrorNotice } = (0, import_data.useDispatch)(import_notices.store);
  const handleSave = async (navigationMenu, edits) => {
    if (!edits) {
      return;
    }
    const postId = navigationMenu?.id;
    const originalRecord = getEditedEntityRecord(
      "postType",
      import_constants.NAVIGATION_POST_TYPE,
      postId
    );
    editEntityRecord("postType", import__.postType, postId, edits);
    const recordPropertiesToSave = Object.keys(edits);
    try {
      await saveSpecifiedEntityEdits(
        "postType",
        import__.postType,
        postId,
        recordPropertiesToSave,
        {
          throwOnError: true
        }
      );
      createSuccessNotice((0, import_i18n.__)("Renamed Navigation Menu"), {
        type: "snackbar"
      });
    } catch (error) {
      editEntityRecord("postType", import__.postType, postId, originalRecord);
      createErrorNotice(
        (0, import_i18n.sprintf)(
          /* translators: %s: error message describing why the navigation menu could not be renamed. */
          (0, import_i18n.__)(`Unable to rename Navigation Menu (%s).`),
          error?.message
        ),
        {
          type: "snackbar"
        }
      );
    }
  };
  return handleSave;
}
function useDuplicateNavigationMenu() {
  const history = useHistory();
  const { saveEntityRecord } = (0, import_data.useDispatch)(import_core_data.store);
  const { createSuccessNotice, createErrorNotice } = (0, import_data.useDispatch)(import_notices.store);
  const handleDuplicate = async (navigationMenu) => {
    const menuTitle = navigationMenu?.title?.rendered || navigationMenu?.slug;
    try {
      const savedRecord = await saveEntityRecord(
        "postType",
        import__.postType,
        {
          title: (0, import_i18n.sprintf)(
            /* translators: %s: Navigation menu title */
            (0, import_i18n._x)("%s (Copy)", "navigation menu"),
            menuTitle
          ),
          content: navigationMenu?.content?.raw,
          status: "publish"
        },
        {
          throwOnError: true
        }
      );
      if (savedRecord) {
        createSuccessNotice((0, import_i18n.__)("Duplicated Navigation Menu"), {
          type: "snackbar"
        });
        history.navigate(`/wp_navigation/${savedRecord.id}`);
      }
    } catch (error) {
      createErrorNotice(
        (0, import_i18n.sprintf)(
          /* translators: %s: error message describing why the navigation menu could not be deleted. */
          (0, import_i18n.__)(`Unable to duplicate Navigation Menu (%s).`),
          error?.message
        ),
        {
          type: "snackbar"
        }
      );
    }
  };
  return handleDuplicate;
}
function useNavigationMenuHandlers() {
  return {
    handleDelete: useDeleteNavigationMenu(),
    handleSave: useSaveNavigationMenu(),
    handleDuplicate: useDuplicateNavigationMenu()
  };
}
//# sourceMappingURL=use-navigation-menu-handlers.cjs.map
