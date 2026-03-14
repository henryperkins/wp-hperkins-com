// packages/editor/src/components/post-publish-button/index.js
import { Button } from "@wordpress/components";
import { Component } from "@wordpress/element";
import { withSelect, withDispatch } from "@wordpress/data";
import { compose } from "@wordpress/compose";
import PublishButtonLabel from "./label.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { Fragment, jsx } from "react/jsx-runtime";
var noop = () => {
};
var PostPublishButton = class extends Component {
  constructor(props) {
    super(props);
    this.createOnClick = this.createOnClick.bind(this);
    this.closeEntitiesSavedStates = this.closeEntitiesSavedStates.bind(this);
    this.state = {
      entitiesSavedStatesCallback: false
    };
  }
  createOnClick(callback) {
    return (...args) => {
      const { hasNonPostEntityChanges, setEntitiesSavedStatesCallback } = this.props;
      if (hasNonPostEntityChanges && setEntitiesSavedStatesCallback) {
        this.setState({
          entitiesSavedStatesCallback: () => callback(...args)
        });
        setEntitiesSavedStatesCallback(
          () => this.closeEntitiesSavedStates
        );
        return noop;
      }
      return callback(...args);
    };
  }
  closeEntitiesSavedStates(savedEntities) {
    const { postType, postId } = this.props;
    const { entitiesSavedStatesCallback } = this.state;
    this.setState({ entitiesSavedStatesCallback: false }, () => {
      if (savedEntities && savedEntities.some(
        (elt) => elt.kind === "postType" && elt.name === postType && elt.key === postId
      )) {
        entitiesSavedStatesCallback();
      }
    });
  }
  render() {
    const {
      forceIsDirty,
      hasPublishAction,
      isBeingScheduled,
      isOpen,
      isPostSavingLocked,
      isPublishable,
      isPublished,
      isSaveable,
      isSaving,
      isAutoSaving,
      isToggle,
      savePostStatus,
      onSubmit = noop,
      onToggle,
      visibility,
      hasNonPostEntityChanges,
      isSavingNonPostEntityChanges,
      postStatus,
      postStatusHasChanged
    } = this.props;
    const isButtonDisabled = (isSaving || !isSaveable || isPostSavingLocked || !isPublishable && !forceIsDirty) && (!hasNonPostEntityChanges || isSavingNonPostEntityChanges);
    const isToggleDisabled = (isPublished || isSaving || !isSaveable || !isPublishable && !forceIsDirty) && (!hasNonPostEntityChanges || isSavingNonPostEntityChanges);
    let publishStatus = "publish";
    if (postStatusHasChanged) {
      publishStatus = postStatus;
    } else if (!hasPublishAction) {
      publishStatus = "pending";
    } else if (visibility === "private") {
      publishStatus = "private";
    } else if (isBeingScheduled) {
      publishStatus = "future";
    }
    const onClickButton = () => {
      if (isButtonDisabled) {
        return;
      }
      onSubmit();
      savePostStatus(publishStatus);
    };
    const onClickToggle = () => {
      if (isToggleDisabled) {
        return;
      }
      onToggle();
    };
    const buttonProps = {
      "aria-disabled": isButtonDisabled,
      className: "editor-post-publish-button",
      isBusy: !isAutoSaving && isSaving,
      variant: "primary",
      onClick: this.createOnClick(onClickButton),
      "aria-haspopup": hasNonPostEntityChanges ? "dialog" : void 0
    };
    const toggleProps = {
      "aria-disabled": isToggleDisabled,
      "aria-expanded": isOpen,
      className: "editor-post-publish-panel__toggle",
      isBusy: isSaving && isPublished,
      variant: "primary",
      size: "compact",
      onClick: this.createOnClick(onClickToggle),
      "aria-haspopup": hasNonPostEntityChanges ? "dialog" : void 0
    };
    const componentProps = isToggle ? toggleProps : buttonProps;
    return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
      Button,
      {
        ...componentProps,
        className: `${componentProps.className} editor-post-publish-button__button`,
        size: "compact",
        children: /* @__PURE__ */ jsx(PublishButtonLabel, {})
      }
    ) });
  }
};
var post_publish_button_default = compose([
  withSelect((select) => {
    const {
      isSavingPost,
      isAutosavingPost,
      isEditedPostBeingScheduled,
      getEditedPostVisibility,
      isCurrentPostPublished,
      isEditedPostSaveable,
      isEditedPostPublishable,
      isPostSavingLocked,
      getCurrentPost,
      getCurrentPostType,
      getCurrentPostId,
      hasNonPostEntityChanges,
      isSavingNonPostEntityChanges,
      getEditedPostAttribute,
      getPostEdits
    } = select(editorStore);
    return {
      isSaving: isSavingPost(),
      isAutoSaving: isAutosavingPost(),
      isBeingScheduled: isEditedPostBeingScheduled(),
      visibility: getEditedPostVisibility(),
      isSaveable: isEditedPostSaveable(),
      isPostSavingLocked: isPostSavingLocked(),
      isPublishable: isEditedPostPublishable(),
      isPublished: isCurrentPostPublished(),
      hasPublishAction: getCurrentPost()._links?.["wp:action-publish"] ?? false,
      postType: getCurrentPostType(),
      postId: getCurrentPostId(),
      postStatus: getEditedPostAttribute("status"),
      postStatusHasChanged: getPostEdits()?.status,
      hasNonPostEntityChanges: hasNonPostEntityChanges(),
      isSavingNonPostEntityChanges: isSavingNonPostEntityChanges()
    };
  }),
  withDispatch((dispatch) => {
    const { editPost, savePost } = dispatch(editorStore);
    return {
      savePostStatus: (status) => {
        editPost({ status }, { undoIgnore: true });
        savePost();
      }
    };
  })
])(PostPublishButton);
export {
  PostPublishButton,
  post_publish_button_default as default
};
//# sourceMappingURL=index.mjs.map
