// packages/editor/src/components/post-publish-button/post-publish-button-or-toggle.js
import { useViewportMatch } from "@wordpress/compose";
import { useDispatch, useSelect } from "@wordpress/data";
import PostPublishButton from "./index.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { ATTACHMENT_POST_TYPE } from "../../store/constants.mjs";
import { jsx } from "react/jsx-runtime";
var IS_TOGGLE = "toggle";
var IS_BUTTON = "button";
function PostPublishButtonOrToggle({
  forceIsDirty,
  setEntitiesSavedStatesCallback
}) {
  let component;
  const isSmallerThanMediumViewport = useViewportMatch("medium", "<");
  const { togglePublishSidebar } = useDispatch(editorStore);
  const {
    hasPublishAction,
    isBeingScheduled,
    isPending,
    isPublished,
    isPublishSidebarEnabled,
    isPublishSidebarOpened,
    isScheduled,
    postStatus,
    postStatusHasChanged,
    postType
  } = useSelect((select) => {
    return {
      hasPublishAction: !!select(editorStore).getCurrentPost()?._links?.["wp:action-publish"],
      isBeingScheduled: select(editorStore).isEditedPostBeingScheduled(),
      isPending: select(editorStore).isCurrentPostPending(),
      isPublished: select(editorStore).isCurrentPostPublished(),
      isPublishSidebarEnabled: select(editorStore).isPublishSidebarEnabled(),
      isPublishSidebarOpened: select(editorStore).isPublishSidebarOpened(),
      isScheduled: select(editorStore).isCurrentPostScheduled(),
      postStatus: select(editorStore).getEditedPostAttribute("status"),
      postStatusHasChanged: select(editorStore).getPostEdits()?.status,
      postType: select(editorStore).getCurrentPostType()
    };
  }, []);
  if (postType === ATTACHMENT_POST_TYPE) {
    component = IS_BUTTON;
  } else if (isPublished || postStatusHasChanged && !["future", "publish"].includes(postStatus) || isScheduled && isBeingScheduled || isPending && !hasPublishAction && !isSmallerThanMediumViewport) {
    component = IS_BUTTON;
  } else if (isSmallerThanMediumViewport || isPublishSidebarEnabled) {
    component = IS_TOGGLE;
  } else {
    component = IS_BUTTON;
  }
  return /* @__PURE__ */ jsx(
    PostPublishButton,
    {
      forceIsDirty,
      isOpen: isPublishSidebarOpened,
      isToggle: component === IS_TOGGLE,
      onToggle: togglePublishSidebar,
      setEntitiesSavedStatesCallback
    }
  );
}
export {
  PostPublishButtonOrToggle as default
};
//# sourceMappingURL=post-publish-button-or-toggle.mjs.map
