// packages/edit-site/src/components/editor/use-resolve-edited-entity.js
import { useEffect, useMemo, useRef } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import { store as coreDataStore } from "@wordpress/core-data";
import { privateApis as routerPrivateApis } from "@wordpress/router";
import { store as editSiteStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import {
  ATTACHMENT_POST_TYPE,
  TEMPLATE_POST_TYPE,
  TEMPLATE_PART_POST_TYPE,
  NAVIGATION_POST_TYPE,
  PATTERN_TYPES
} from "../../utils/constants.mjs";
var { useLocation } = unlock(routerPrivateApis);
var postTypesWithoutParentTemplate = [
  ATTACHMENT_POST_TYPE,
  TEMPLATE_POST_TYPE,
  TEMPLATE_PART_POST_TYPE,
  NAVIGATION_POST_TYPE,
  PATTERN_TYPES.user
];
var authorizedPostTypes = ["page", "post"];
function getPostType(name) {
  let postType;
  if (name === "navigation-item") {
    postType = NAVIGATION_POST_TYPE;
  } else if (name === "pattern-item") {
    postType = PATTERN_TYPES.user;
  } else if (name === "template-part-item") {
    postType = TEMPLATE_PART_POST_TYPE;
  } else if (name === "templates") {
    postType = TEMPLATE_POST_TYPE;
  } else if (name === "template-item") {
    postType = TEMPLATE_POST_TYPE;
  } else if (name === "page-item" || name === "pages") {
    postType = "page";
  } else if (name === "post-item" || name === "posts") {
    postType = "post";
  } else if (name === "attachment-item") {
    postType = ATTACHMENT_POST_TYPE;
  }
  return postType;
}
function useResolveEditedEntity() {
  const { editEntityRecord } = useDispatch(coreDataStore);
  const { hasEntityRecord } = useSelect(coreDataStore);
  const { name, params = {}, query } = useLocation();
  const { postId = query?.postId } = params;
  const postType = getPostType(name, postId) ?? query?.postType;
  const { selectedBlock } = query;
  const appliedSelectionRef = useRef(null);
  const homePage = useSelect((select) => {
    const { getHomePage } = unlock(select(coreDataStore));
    return getHomePage();
  }, []);
  const resolvedTemplateId = useSelect(
    (select) => {
      if (postTypesWithoutParentTemplate.includes(postType) && postId) {
        return;
      }
      if (postId && postId.includes(",")) {
        return;
      }
      const { getTemplateId } = unlock(select(coreDataStore));
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
  const context = useMemo(() => {
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
      postType: TEMPLATE_POST_TYPE,
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
  const { setEditedEntity } = useDispatch(editSiteStore);
  useEffect(() => {
    if (isReady) {
      setEditedEntity(postType, String(postId), context);
    }
  }, [isReady, postType, postId, context, setEditedEntity]);
}
export {
  useResolveEditedEntity,
  useSyncDeprecatedEntityIntoState
};
//# sourceMappingURL=use-resolve-edited-entity.mjs.map
