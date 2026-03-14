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

// packages/edit-site/src/components/dataviews-actions/index.js
var dataviews_actions_exports = {};
__export(dataviews_actions_exports, {
  useEditPostAction: () => useEditPostAction,
  useQuickEditPostAction: () => useQuickEditPostAction,
  useSetActiveTemplateAction: () => useSetActiveTemplateAction
});
module.exports = __toCommonJS(dataviews_actions_exports);
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_element = require("@wordpress/element");
var import_router = require("@wordpress/router");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_url = require("@wordpress/url");
var import_constants = require("../../utils/constants.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var { useLocation, useHistory } = (0, import_lock_unlock.unlock)(import_router.privateApis);
var useSetActiveTemplateAction = () => {
  const activeTheme = (0, import_data.useSelect)(
    (select) => select(import_core_data.store).getCurrentTheme()
  );
  const { getEntityRecord } = (0, import_data.useSelect)(import_core_data.store);
  const { editEntityRecord, saveEditedEntityRecord } = (0, import_data.useDispatch)(import_core_data.store);
  return (0, import_element.useMemo)(
    () => ({
      id: "set-active-template",
      label(items) {
        return items.some((item) => item._isActive) ? (0, import_i18n.__)("Deactivate") : (0, import_i18n.__)("Activate");
      },
      isPrimary: true,
      icon: import_icons.pencil,
      isEligible(item) {
        if (item.theme !== activeTheme.stylesheet) {
          return false;
        }
        if (typeof item.id !== "number") {
          return item._isActive === false;
        }
        return true;
      },
      async callback(items) {
        const deactivate = items.some((item) => item._isActive);
        const activeTemplates = {
          ...await getEntityRecord("root", "site").active_templates ?? {}
        };
        for (const item of items) {
          if (deactivate) {
            delete activeTemplates[item.slug];
          } else {
            activeTemplates[item.slug] = item.id;
          }
        }
        await editEntityRecord("root", "site", void 0, {
          active_templates: activeTemplates
        });
        await saveEditedEntityRecord("root", "site");
      }
    }),
    [
      editEntityRecord,
      saveEditedEntityRecord,
      getEntityRecord,
      activeTheme
    ]
  );
};
var useEditPostAction = () => {
  const history = useHistory();
  return (0, import_element.useMemo)(
    () => ({
      id: "edit-post",
      label: (0, import_i18n.__)("Edit"),
      icon: import_icons.pencil,
      isEligible(post) {
        if (post.status === "trash") {
          return false;
        }
        return post.type !== import_constants.PATTERN_TYPES.theme;
      },
      callback(items) {
        const post = items[0];
        history.navigate(`/${post.type}/${post.id}?canvas=edit`);
      }
    }),
    [history]
  );
};
var useQuickEditPostAction = () => {
  const history = useHistory();
  const { path, query } = useLocation();
  return (0, import_element.useMemo)(
    () => ({
      id: "quick-edit",
      label: (0, import_i18n.__)("Quick Edit"),
      icon: import_icons.drawerRight,
      isPrimary: true,
      supportsBulk: true,
      isEligible(post) {
        if (post.status === "trash") {
          return false;
        }
        return post.type === "page";
      },
      callback(items) {
        history.navigate(
          (0, import_url.addQueryArgs)(path, {
            ...query,
            quickEdit: true,
            postId: items.map((item) => item.id).join(",")
          })
        );
      }
    }),
    [history, path, query]
  );
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useEditPostAction,
  useQuickEditPostAction,
  useSetActiveTemplateAction
});
//# sourceMappingURL=index.cjs.map
