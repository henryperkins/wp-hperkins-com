"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/components/post-publish-button/index.js
var post_publish_button_exports = {};
__export(post_publish_button_exports, {
  PostPublishButton: () => PostPublishButton,
  default: () => post_publish_button_default
});
module.exports = __toCommonJS(post_publish_button_exports);
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_compose = require("@wordpress/compose");
var import_label = __toESM(require("./label.cjs"));
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var noop = () => {
};
var PostPublishButton = class extends import_element.Component {
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
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Button,
      {
        ...componentProps,
        className: `${componentProps.className} editor-post-publish-button__button`,
        size: "compact",
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_label.default, {})
      }
    ) });
  }
};
var post_publish_button_default = (0, import_compose.compose)([
  (0, import_data.withSelect)((select) => {
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
    } = select(import_store.store);
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
  (0, import_data.withDispatch)((dispatch) => {
    const { editPost, savePost } = dispatch(import_store.store);
    return {
      savePostStatus: (status) => {
        editPost({ status }, { undoIgnore: true });
        savePost();
      }
    };
  })
])(PostPublishButton);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PostPublishButton
});
//# sourceMappingURL=index.cjs.map
