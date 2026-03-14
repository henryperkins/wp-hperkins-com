// packages/customize-widgets/src/components/error-boundary/index.js
import { Component } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Button } from "@wordpress/components";
import { Warning } from "@wordpress/block-editor";
import { useCopyToClipboard } from "@wordpress/compose";
import { doAction } from "@wordpress/hooks";
import { jsx } from "react/jsx-runtime";
function CopyButton({ text, children }) {
  const ref = useCopyToClipboard(text);
  return /* @__PURE__ */ jsx(Button, { size: "compact", variant: "secondary", ref, children });
}
var ErrorBoundary = class extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      error: null
    };
  }
  componentDidCatch(error) {
    this.setState({ error });
    doAction("editor.ErrorBoundary.errorLogged", error);
  }
  render() {
    const { error } = this.state;
    if (!error) {
      return this.props.children;
    }
    return /* @__PURE__ */ jsx(
      Warning,
      {
        className: "customize-widgets-error-boundary",
        actions: [
          /* @__PURE__ */ jsx(CopyButton, { text: error.stack, children: __("Copy Error") }, "copy-error")
        ],
        children: __("The editor has encountered an unexpected error.")
      }
    );
  }
};
export {
  ErrorBoundary as default
};
//# sourceMappingURL=index.mjs.map
