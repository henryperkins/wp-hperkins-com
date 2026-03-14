"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// packages/editor/src/hooks/media-upload.js
var import_element = require("@wordpress/element");
var import_hooks = require("@wordpress/hooks");
var import_deprecated = __toESM(require("@wordpress/deprecated"));
var import_media_utils = require("@wordpress/media-utils");
var import_lock_unlock = require("../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { MediaUploadModal: MediaUploadModalComponent } = (0, import_lock_unlock.unlock)(
  import_media_utils.privateApis
);
var MediaUploadModalWrapper = class extends import_element.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  openModal() {
    this.setState({ isOpen: true });
  }
  closeModal() {
    this.setState({ isOpen: false });
    this.props.onClose?.();
  }
  render() {
    const {
      allowedTypes,
      multiple,
      value,
      onSelect,
      title,
      modalClass,
      render
    } = this.props;
    const { isOpen } = this.state;
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      render({ open: this.openModal }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        MediaUploadModalComponent,
        {
          allowedTypes,
          multiple,
          value,
          onSelect: (media) => {
            onSelect(media);
            this.closeModal();
          },
          onClose: this.closeModal,
          title,
          isOpen,
          modalClass
        }
      )
    ] });
  }
};
if (window.__experimentalDataViewsMediaModal) {
  (0, import_hooks.addFilter)(
    "editor.MediaUpload",
    "core/editor/components/media-upload",
    () => {
      (0, import_deprecated.default)("Extending MediaUpload as a class component", {
        since: "7.0",
        version: "7.2",
        hint: "MediaUpload will become a function component in WordPress 7.2 Please update any custom implementations to use function components instead."
      });
      return MediaUploadModalWrapper;
    }
  );
} else {
  (0, import_hooks.addFilter)(
    "editor.MediaUpload",
    "core/editor/components/media-upload",
    () => {
      return import_media_utils.MediaUpload;
    }
  );
}
//# sourceMappingURL=media-upload.cjs.map
