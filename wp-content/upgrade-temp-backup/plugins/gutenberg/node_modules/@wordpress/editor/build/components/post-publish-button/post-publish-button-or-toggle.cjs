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

// packages/editor/src/components/post-publish-button/post-publish-button-or-toggle.js
var post_publish_button_or_toggle_exports = {};
__export(post_publish_button_or_toggle_exports, {
  default: () => PostPublishButtonOrToggle
});
module.exports = __toCommonJS(post_publish_button_or_toggle_exports);
var import_compose = require("@wordpress/compose");
var import_data = require("@wordpress/data");
var import_index = __toESM(require("./index.cjs"));
var import_store = require("../../store/index.cjs");
var import_constants = require("../../store/constants.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var IS_TOGGLE = "toggle";
var IS_BUTTON = "button";
function PostPublishButtonOrToggle({
  forceIsDirty,
  setEntitiesSavedStatesCallback
}) {
  let component;
  const isSmallerThanMediumViewport = (0, import_compose.useViewportMatch)("medium", "<");
  const { togglePublishSidebar } = (0, import_data.useDispatch)(import_store.store);
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
  } = (0, import_data.useSelect)((select) => {
    return {
      hasPublishAction: !!select(import_store.store).getCurrentPost()?._links?.["wp:action-publish"],
      isBeingScheduled: select(import_store.store).isEditedPostBeingScheduled(),
      isPending: select(import_store.store).isCurrentPostPending(),
      isPublished: select(import_store.store).isCurrentPostPublished(),
      isPublishSidebarEnabled: select(import_store.store).isPublishSidebarEnabled(),
      isPublishSidebarOpened: select(import_store.store).isPublishSidebarOpened(),
      isScheduled: select(import_store.store).isCurrentPostScheduled(),
      postStatus: select(import_store.store).getEditedPostAttribute("status"),
      postStatusHasChanged: select(import_store.store).getPostEdits()?.status,
      postType: select(import_store.store).getCurrentPostType()
    };
  }, []);
  if (postType === import_constants.ATTACHMENT_POST_TYPE) {
    component = IS_BUTTON;
  } else if (isPublished || postStatusHasChanged && !["future", "publish"].includes(postStatus) || isScheduled && isBeingScheduled || isPending && !hasPublishAction && !isSmallerThanMediumViewport) {
    component = IS_BUTTON;
  } else if (isSmallerThanMediumViewport || isPublishSidebarEnabled) {
    component = IS_TOGGLE;
  } else {
    component = IS_BUTTON;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_index.default,
    {
      forceIsDirty,
      isOpen: isPublishSidebarOpened,
      isToggle: component === IS_TOGGLE,
      onToggle: togglePublishSidebar,
      setEntitiesSavedStatesCallback
    }
  );
}
//# sourceMappingURL=post-publish-button-or-toggle.cjs.map
