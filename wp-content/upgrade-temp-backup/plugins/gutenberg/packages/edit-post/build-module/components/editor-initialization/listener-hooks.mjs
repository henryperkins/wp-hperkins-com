// packages/edit-post/src/components/editor-initialization/listener-hooks.js
import { useSelect } from "@wordpress/data";
import { useEffect, useRef } from "@wordpress/element";
import { store as editorStore } from "@wordpress/editor";
import { store as coreStore } from "@wordpress/core-data";
import {
  VIEW_AS_LINK_SELECTOR,
  VIEW_AS_PREVIEW_LINK_SELECTOR
} from "../../store/constants.mjs";
var useUpdatePostLinkListener = () => {
  const { isViewable, newPermalink } = useSelect((select) => {
    const { getPostType } = select(coreStore);
    const { getCurrentPost, getEditedPostAttribute } = select(editorStore);
    const postType = getPostType(getEditedPostAttribute("type"));
    return {
      isViewable: postType?.viewable,
      newPermalink: getCurrentPost().link
    };
  }, []);
  const nodeToUpdateRef = useRef();
  useEffect(() => {
    nodeToUpdateRef.current = document.querySelector(VIEW_AS_PREVIEW_LINK_SELECTOR) || document.querySelector(VIEW_AS_LINK_SELECTOR);
  }, []);
  useEffect(() => {
    if (!newPermalink || !nodeToUpdateRef.current) {
      return;
    }
    if (!isViewable) {
      nodeToUpdateRef.current.style.display = "none";
      return;
    }
    nodeToUpdateRef.current.style.display = "";
    nodeToUpdateRef.current.setAttribute("href", newPermalink);
  }, [newPermalink, isViewable]);
};
export {
  useUpdatePostLinkListener
};
//# sourceMappingURL=listener-hooks.mjs.map
