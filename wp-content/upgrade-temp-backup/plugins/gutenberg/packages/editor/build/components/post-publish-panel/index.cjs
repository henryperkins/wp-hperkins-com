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

// packages/editor/src/components/post-publish-panel/index.js
var post_publish_panel_exports = {};
__export(post_publish_panel_exports, {
  PostPublishPanel: () => PostPublishPanel,
  default: () => post_publish_panel_default
});
module.exports = __toCommonJS(post_publish_panel_exports);
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_compose = require("@wordpress/compose");
var import_icons = require("@wordpress/icons");
var import_core_data = require("@wordpress/core-data");
var import_post_publish_button = __toESM(require("../post-publish-button/index.cjs"));
var import_prepublish = __toESM(require("./prepublish.cjs"));
var import_postpublish = __toESM(require("./postpublish.cjs"));
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var PostPublishPanel = class extends import_element.Component {
  constructor() {
    super(...arguments);
    this.onSubmit = this.onSubmit.bind(this);
    this.cancelButtonNode = (0, import_element.createRef)();
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
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "editor-post-publish-panel", ...propsForPanel, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "editor-post-publish-panel__header", children: isPostPublish ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.Button,
        {
          size: "compact",
          onClick: onClose,
          icon: import_icons.closeSmall,
          label: (0, import_i18n.__)("Close panel")
        }
      ) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "editor-post-publish-panel__header-cancel-button", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            ref: this.cancelButtonNode,
            accessibleWhenDisabled: true,
            disabled: isSavingNonPostEntityChanges,
            onClick: onClose,
            variant: "secondary",
            size: "compact",
            children: (0, import_i18n.__)("Cancel")
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "editor-post-publish-panel__header-publish-button", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_post_publish_button.default,
          {
            onSubmit: this.onSubmit,
            forceIsDirty
          }
        ) })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "editor-post-publish-panel__content", children: [
        isPrePublish && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_prepublish.default, { children: PrePublishExtension && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrePublishExtension, {}) }),
        isPostPublish && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_postpublish.default, { focusOnMount: true, children: PostPublishExtension && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostPublishExtension, {}) }),
        isSaving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Spinner, {})
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "editor-post-publish-panel__footer", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.CheckboxControl,
        {
          label: (0, import_i18n.__)("Always show pre-publish checks."),
          checked: isPublishSidebarEnabled,
          onChange: onTogglePublishSidebar
        }
      ) })
    ] });
  }
};
var post_publish_panel_default = (0, import_compose.compose)([
  (0, import_data.withSelect)((select) => {
    const { getPostType } = select(import_core_data.store);
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
    } = select(import_store.store);
    const { isPublishSidebarEnabled } = select(import_store.store);
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
  (0, import_data.withDispatch)((dispatch, { isPublishSidebarEnabled }) => {
    const { disablePublishSidebar, enablePublishSidebar } = dispatch(import_store.store);
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
  import_components.withFocusReturn,
  import_components.withConstrainedTabbing
])(PostPublishPanel);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PostPublishPanel
});
//# sourceMappingURL=index.cjs.map
