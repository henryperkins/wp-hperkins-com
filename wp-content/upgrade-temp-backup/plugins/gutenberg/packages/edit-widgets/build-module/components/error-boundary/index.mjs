// packages/edit-widgets/src/components/error-boundary/index.js
import { Component } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Button } from "@wordpress/components";
import { Warning } from "@wordpress/block-editor";
import { useCopyToClipboard } from "@wordpress/compose";
import { doAction } from "@wordpress/hooks";
import { jsx } from "react/jsx-runtime";
function CopyButton({ text, children }) {
  const ref = useCopyToClipboard(text);
  return /* @__PURE__ */ jsx(Button, { __next40pxDefaultSize: true, variant: "secondary", ref, children });
}
function ErrorBoundaryWarning({ message, error }) {
  const actions = [
    /* @__PURE__ */ jsx(CopyButton, { text: error.stack, children: __("Copy Error") }, "copy-error")
  ];
  return /* @__PURE__ */ jsx(Warning, { className: "edit-widgets-error-boundary", actions, children: message });
}
var ErrorBoundary = class extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      error: null
    };
  }
  componentDidCatch(error) {
    doAction("editor.ErrorBoundary.errorLogged", error);
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (!this.state.error) {
      return this.props.children;
    }
    return /* @__PURE__ */ jsx(
      ErrorBoundaryWarning,
      {
        message: __(
          "The editor has encountered an unexpected error."
        ),
        error: this.state.error
      }
    );
  }
};
export {
  ErrorBoundary as default
};
//# sourceMappingURL=index.mjs.map
