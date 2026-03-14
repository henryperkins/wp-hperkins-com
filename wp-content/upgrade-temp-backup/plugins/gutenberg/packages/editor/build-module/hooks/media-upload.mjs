// packages/editor/src/hooks/media-upload.js
import { Component } from "@wordpress/element";
import { addFilter } from "@wordpress/hooks";
import deprecated from "@wordpress/deprecated";
import {
  MediaUpload,
  privateApis as mediaUtilsPrivateApis
} from "@wordpress/media-utils";
import { unlock } from "../lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { MediaUploadModal: MediaUploadModalComponent } = unlock(
  mediaUtilsPrivateApis
);
var MediaUploadModalWrapper = class extends Component {
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
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      render({ open: this.openModal }),
      /* @__PURE__ */ jsx(
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
  addFilter(
    "editor.MediaUpload",
    "core/editor/components/media-upload",
    () => {
      deprecated("Extending MediaUpload as a class component", {
        since: "7.0",
        version: "7.2",
        hint: "MediaUpload will become a function component in WordPress 7.2 Please update any custom implementations to use function components instead."
      });
      return MediaUploadModalWrapper;
    }
  );
} else {
  addFilter(
    "editor.MediaUpload",
    "core/editor/components/media-upload",
    () => {
      return MediaUpload;
    }
  );
}
//# sourceMappingURL=media-upload.mjs.map
