// packages/editor/src/components/post-actions/actions.js
import { useDispatch, useSelect } from "@wordpress/data";
import { useMemo, useEffect } from "@wordpress/element";
import { store as coreStore } from "@wordpress/core-data";
import { store as editorStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { useSetAsHomepageAction } from "./set-as-homepage.mjs";
import { useSetAsPostsPageAction } from "./set-as-posts-page.mjs";
import { jsx } from "react/jsx-runtime";
function usePostActions({ postType, onActionPerformed, context }) {
  const { defaultActions } = useSelect(
    (select) => {
      const { getEntityActions } = unlock(select(editorStore));
      return {
        defaultActions: getEntityActions("postType", postType)
      };
    },
    [postType]
  );
  const shouldShowHomepageActions = useSelect(
    (select) => {
      if (postType !== "page") {
        return false;
      }
      const { getDefaultTemplateId, getEntityRecord, canUser } = select(coreStore);
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
  const setAsHomepageAction = useSetAsHomepageAction();
  const setAsPostsPageAction = useSetAsPostsPageAction();
  const { registerPostTypeSchema } = unlock(useDispatch(editorStore));
  useEffect(() => {
    registerPostTypeSchema(postType);
  }, [registerPostTypeSchema, postType]);
  return useMemo(() => {
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
              return /* @__PURE__ */ jsx(
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
export {
  usePostActions
};
//# sourceMappingURL=actions.mjs.map
