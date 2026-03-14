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

// packages/edit-site/src/components/editor/use-resolve-edited-entity.js
var use_resolve_edited_entity_exports = {};
__export(use_resolve_edited_entity_exports, {
  useResolveEditedEntity: () => useResolveEditedEntity,
  useSyncDeprecatedEntityIntoState: () => useSyncDeprecatedEntityIntoState
});
module.exports = __toCommonJS(use_resolve_edited_entity_exports);
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_router = require("@wordpress/router");
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_constants = require("../../utils/constants.cjs");
var { useLocation } = (0, import_lock_unlock.unlock)(import_router.privateApis);
var postTypesWithoutParentTemplate = [
  import_constants.ATTACHMENT_POST_TYPE,
  import_constants.TEMPLATE_POST_TYPE,
  import_constants.TEMPLATE_PART_POST_TYPE,
  import_constants.NAVIGATION_POST_TYPE,
  import_constants.PATTERN_TYPES.user
];
var authorizedPostTypes = ["page", "post"];
function getPostType(name) {
  let postType;
  if (name === "navigation-item") {
    postType = import_constants.NAVIGATION_POST_TYPE;
  } else if (name === "pattern-item") {
    postType = import_constants.PATTERN_TYPES.user;
  } else if (name === "template-part-item") {
    postType = import_constants.TEMPLATE_PART_POST_TYPE;
  } else if (name === "templates") {
    postType = import_constants.TEMPLATE_POST_TYPE;
  } else if (name === "template-item") {
    postType = import_constants.TEMPLATE_POST_TYPE;
  } else if (name === "page-item" || name === "pages") {
    postType = "page";
  } else if (name === "post-item" || name === "posts") {
    postType = "post";
  } else if (name === "attachment-item") {
    postType = import_constants.ATTACHMENT_POST_TYPE;
  }
  return postType;
}
function useResolveEditedEntity() {
  const { editEntityRecord } = (0, import_data.useDispatch)(import_core_data.store);
  const { hasEntityRecord } = (0, import_data.useSelect)(import_core_data.store);
  const { name, params = {}, query } = useLocation();
  const { postId = query?.postId } = params;
  const postType = getPostType(name, postId) ?? query?.postType;
  const { selectedBlock } = query;
  const appliedSelectionRef = (0, import_element.useRef)(null);
  const homePage = (0, import_data.useSelect)((select) => {
    const { getHomePage } = (0, import_lock_unlock.unlock)(select(import_core_data.store));
    return getHomePage();
  }, []);
  const resolvedTemplateId = (0, import_data.useSelect)(
    (select) => {
      if (postTypesWithoutParentTemplate.includes(postType) && postId) {
        return;
      }
      if (postId && postId.includes(",")) {
        return;
      }
      const { getTemplateId } = (0, import_lock_unlock.unlock)(select(import_core_data.store));
      if (postType && postId && authorizedPostTypes.includes(postType)) {
        return getTemplateId(postType, postId);
      }
      if (homePage?.postType === "page") {
        return getTemplateId("page", homePage?.postId);
      }
      if (homePage?.postType === "wp_template") {
        return homePage?.postId;
      }
    },
    [homePage, postId, postType]
  );
  const context = (0, import_element.useMemo)(() => {
    if (postTypesWithoutParentTemplate.includes(postType) && postId) {
      return {};
    }
    if (postType && postId && authorizedPostTypes.includes(postType)) {
      return { postType, postId };
    }
    if (homePage?.postType === "page") {
      return { postType: "page", postId: homePage?.postId };
    }
    return {};
  }, [homePage, postType, postId]);
  let entity;
  if (postTypesWithoutParentTemplate.includes(postType) && postId) {
    entity = { isReady: true, postType, postId, context };
  } else if (!!homePage) {
    entity = {
      isReady: resolvedTemplateId !== void 0,
      postType: import_constants.TEMPLATE_POST_TYPE,
      postId: resolvedTemplateId,
      context
    };
  } else {
    entity = { isReady: false };
  }
  if (selectedBlock && entity.isReady && appliedSelectionRef.current !== selectedBlock) {
    const selectionPostType = entity.context?.postId ? entity.context.postType : entity.postType;
    const selectionPostId = entity.context?.postId ? entity.context.postId : entity.postId;
    if (hasEntityRecord("postType", selectionPostType, selectionPostId)) {
      editEntityRecord(
        "postType",
        selectionPostType,
        selectionPostId,
        {
          selection: {
            selectionStart: { clientId: selectedBlock },
            selectionEnd: { clientId: selectedBlock }
          }
        },
        { undoIgnore: true }
      );
      appliedSelectionRef.current = selectedBlock;
    }
  }
  return entity;
}
function useSyncDeprecatedEntityIntoState({
  postType,
  postId,
  context,
  isReady
}) {
  const { setEditedEntity } = (0, import_data.useDispatch)(import_store.store);
  (0, import_element.useEffect)(() => {
    if (isReady) {
      setEditedEntity(postType, String(postId), context);
    }
  }, [isReady, postType, postId, context, setEditedEntity]);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useResolveEditedEntity,
  useSyncDeprecatedEntityIntoState
});
//# sourceMappingURL=use-resolve-edited-entity.cjs.map
