// packages/editor/src/components/post-publish-panel/index.js
import { __ } from "@wordpress/i18n";
import { Component, createRef } from "@wordpress/element";
import {
  Button,
  Spinner,
  CheckboxControl,
  withFocusReturn,
  withConstrainedTabbing
} from "@wordpress/components";
import { withSelect, withDispatch } from "@wordpress/data";
import { compose } from "@wordpress/compose";
import { closeSmall } from "@wordpress/icons";
import { store as coreStore } from "@wordpress/core-data";
import PostPublishButton from "../post-publish-button/index.mjs";
import PostPublishPanelPrepublish from "./prepublish.mjs";
import PostPublishPanelPostpublish from "./postpublish.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var PostPublishPanel = class extends Component {
  constructor() {
    super(...arguments);
    this.onSubmit = this.onSubmit.bind(this);
    this.cancelButtonNode = createRef();
  }
  componentDidMount() {
    this.timeoutID = setTimeout(() => {
      this.cancelButtonNode.current.focus();
    }, 0);
  }
  componentWillUnmount() {
    clearTimeout(this.timeoutID);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.isPublished && !this.props.isSaving && this.props.isDirty || this.props.currentPostId !== prevProps.currentPostId) {
      this.props.onClose();
    }
  }
  onSubmit() {
    const { onClose, hasPublishAction, isPostTypeViewable } = this.props;
    if (!hasPublishAction || !isPostTypeViewable) {
      onClose();
    }
  }
  render() {
    const {
      forceIsDirty,
      isBeingScheduled,
      isPublished,
      isPublishSidebarEnabled,
      isScheduled,
      isSaving,
      isSavingNonPostEntityChanges,
      onClose,
      onTogglePublishSidebar,
      PostPublishExtension,
      PrePublishExtension,
      currentPostId,
      ...additionalProps
    } = this.props;
    const {
      hasPublishAction,
      isDirty,
      isPostTypeViewable,
      ...propsForPanel
    } = additionalProps;
    const isPublishedOrScheduled = isPublished || isScheduled && isBeingScheduled;
    const isPrePublish = !isPublishedOrScheduled && !isSaving;
    const isPostPublish = isPublishedOrScheduled && !isSaving;
    return /* @__PURE__ */ jsxs("div", { className: "editor-post-publish-panel", ...propsForPanel, children: [
      /* @__PURE__ */ jsx("div", { className: "editor-post-publish-panel__header", children: isPostPublish ? /* @__PURE__ */ jsx(
        Button,
        {
          size: "compact",
          onClick: onClose,
          icon: closeSmall,
          label: __("Close panel")
        }
      ) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "editor-post-publish-panel__header-cancel-button", children: /* @__PURE__ */ jsx(
          Button,
          {
            ref: this.cancelButtonNode,
            accessibleWhenDisabled: true,
            disabled: isSavingNonPostEntityChanges,
            onClick: onClose,
            variant: "secondary",
            size: "compact",
            children: __("Cancel")
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "editor-post-publish-panel__header-publish-button", children: /* @__PURE__ */ jsx(
          PostPublishButton,
          {
            onSubmit: this.onSubmit,
            forceIsDirty
          }
        ) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "editor-post-publish-panel__content", children: [
        isPrePublish && /* @__PURE__ */ jsx(PostPublishPanelPrepublish, { children: PrePublishExtension && /* @__PURE__ */ jsx(PrePublishExtension, {}) }),
        isPostPublish && /* @__PURE__ */ jsx(PostPublishPanelPostpublish, { focusOnMount: true, children: PostPublishExtension && /* @__PURE__ */ jsx(PostPublishExtension, {}) }),
        isSaving && /* @__PURE__ */ jsx(Spinner, {})
      ] }),
      /* @__PURE__ */ jsx("div", { className: "editor-post-publish-panel__footer", children: /* @__PURE__ */ jsx(
        CheckboxControl,
        {
          label: __("Always show pre-publish checks."),
          checked: isPublishSidebarEnabled,
          onChange: onTogglePublishSidebar
        }
      ) })
    ] });
  }
};
var post_publish_panel_default = compose([
  withSelect((select) => {
    const { getPostType } = select(coreStore);
    const {
      getCurrentPost,
      getCurrentPostId,
      getEditedPostAttribute,
      isCurrentPostPublished,
      isCurrentPostScheduled,
      isEditedPostBeingScheduled,
      isEditedPostDirty,
      isAutosavingPost,
      isSavingPost,
      isSavingNonPostEntityChanges
    } = select(editorStore);
    const { isPublishSidebarEnabled } = select(editorStore);
    const postType = getPostType(getEditedPostAttribute("type"));
    return {
      hasPublishAction: getCurrentPost()._links?.["wp:action-publish"] ?? false,
      isPostTypeViewable: postType?.viewable,
      isBeingScheduled: isEditedPostBeingScheduled(),
      isDirty: isEditedPostDirty(),
      isPublished: isCurrentPostPublished(),
      isPublishSidebarEnabled: isPublishSidebarEnabled(),
      isSaving: isSavingPost() && !isAutosavingPost(),
      isSavingNonPostEntityChanges: isSavingNonPostEntityChanges(),
      isScheduled: isCurrentPostScheduled(),
      currentPostId: getCurrentPostId()
    };
  }),
  withDispatch((dispatch, { isPublishSidebarEnabled }) => {
    const { disablePublishSidebar, enablePublishSidebar } = dispatch(editorStore);
    return {
      onTogglePublishSidebar: () => {
        if (isPublishSidebarEnabled) {
          disablePublishSidebar();
        } else {
          enablePublishSidebar();
        }
      }
    };
  }),
  withFocusReturn,
  withConstrainedTabbing
])(PostPublishPanel);
export {
  PostPublishPanel,
  post_publish_panel_default as default
};
//# sourceMappingURL=index.mjs.map
