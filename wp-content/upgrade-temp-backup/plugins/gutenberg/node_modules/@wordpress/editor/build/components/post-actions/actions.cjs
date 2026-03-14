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

// packages/editor/src/components/post-actions/actions.js
var actions_exports = {};
__export(actions_exports, {
  usePostActions: () => usePostActions
});
module.exports = __toCommonJS(actions_exports);
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_core_data = require("@wordpress/core-data");
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_set_as_homepage = require("./set-as-homepage.cjs");
var import_set_as_posts_page = require("./set-as-posts-page.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function usePostActions({ postType, onActionPerformed, context }) {
  const { defaultActions } = (0, import_data.useSelect)(
    (select) => {
      const { getEntityActions } = (0, import_lock_unlock.unlock)(select(import_store.store));
      return {
        defaultActions: getEntityActions("postType", postType)
      };
    },
    [postType]
  );
  const shouldShowHomepageActions = (0, import_data.useSelect)(
    (select) => {
      if (postType !== "page") {
        return false;
      }
      const { getDefaultTemplateId, getEntityRecord, canUser } = select(import_core_data.store);
      const canUpdateSettings = canUser("update", {
        kind: "root",
        name: "site"
      });
      if (!canUpdateSettings) {
        return false;
      }
      const frontPageTemplateId = getDefaultTemplateId({
        slug: "front-page"
      });
      if (!frontPageTemplateId) {
        return true;
      }
      const frontPageTemplate = getEntityRecord(
        "postType",
        "wp_template",
        frontPageTemplateId
      );
      if (!frontPageTemplate) {
        return true;
      }
      return frontPageTemplate.slug !== "front-page";
    },
    [postType]
  );
  const setAsHomepageAction = (0, import_set_as_homepage.useSetAsHomepageAction)();
  const setAsPostsPageAction = (0, import_set_as_posts_page.useSetAsPostsPageAction)();
  const { registerPostTypeSchema } = (0, import_lock_unlock.unlock)((0, import_data.useDispatch)(import_store.store));
  (0, import_element.useEffect)(() => {
    registerPostTypeSchema(postType);
  }, [registerPostTypeSchema, postType]);
  return (0, import_element.useMemo)(() => {
    let actions = [...defaultActions];
    if (shouldShowHomepageActions) {
      actions.push(setAsHomepageAction, setAsPostsPageAction);
    }
    actions = actions.sort(
      (a, b) => b.id === "move-to-trash" ? -1 : 0
    );
    actions = actions.filter((action) => {
      if (!action.context) {
        return true;
      }
      return action.context === context;
    });
    if (onActionPerformed) {
      for (let i = 0; i < actions.length; ++i) {
        if (actions[i].callback) {
          const existingCallback = actions[i].callback;
          actions[i] = {
            ...actions[i],
            callback: (items, argsObject) => {
              existingCallback(items, {
                ...argsObject,
                onActionPerformed: (_items) => {
                  if (argsObject?.onActionPerformed) {
                    argsObject.onActionPerformed(_items);
                  }
                  onActionPerformed(
                    actions[i].id,
                    _items
                  );
                }
              });
            }
          };
        }
        if (actions[i].RenderModal) {
          const ExistingRenderModal = actions[i].RenderModal;
          actions[i] = {
            ...actions[i],
            RenderModal: (props) => {
              return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                ExistingRenderModal,
                {
                  ...props,
                  onActionPerformed: (_items) => {
                    if (props.onActionPerformed) {
                      props.onActionPerformed(_items);
                    }
                    onActionPerformed(
                      actions[i].id,
                      _items
                    );
                  }
                }
              );
            }
          };
        }
      }
    }
    return actions;
  }, [
    context,
    defaultActions,
    onActionPerformed,
    setAsHomepageAction,
    setAsPostsPageAction,
    shouldShowHomepageActions
  ]);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  usePostActions
});
//# sourceMappingURL=actions.cjs.map
