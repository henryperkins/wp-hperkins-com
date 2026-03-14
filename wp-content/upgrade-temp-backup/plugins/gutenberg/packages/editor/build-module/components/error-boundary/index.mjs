// packages/editor/src/components/error-boundary/index.js
import { Component } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import {
  Button,
  __experimentalHStack as HStack,
  __experimentalText as Text
} from "@wordpress/components";
import { select } from "@wordpress/data";
import { useCopyToClipboard } from "@wordpress/compose";
import { doAction } from "@wordpress/hooks";
import { store as editorStore } from "../../store/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function getContent() {
  try {
    return select(editorStore).getEditedPostContent();
  } catch (error) {
  }
}
function CopyButton({ text, children, variant = "secondary" }) {
  const ref = useCopyToClipboard(text);
  return /* @__PURE__ */ jsx(Button, { __next40pxDefaultSize: true, variant, ref, children });
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
    const { error } = this.state;
    const { canCopyContent = false } = this.props;
    if (!error) {
      return this.props.children;
    }
    return /* @__PURE__ */ jsxs(
      HStack,
      {
        className: "editor-error-boundary",
        alignment: "baseline",
        spacing: 4,
        justify: "space-between",
        expanded: false,
        wrap: true,
        children: [
          /* @__PURE__ */ jsx(Text, { as: "p", children: __("The editor has encountered an unexpected error.") }),
          /* @__PURE__ */ jsxs(HStack, { expanded: false, children: [
            canCopyContent && /* @__PURE__ */ jsx(CopyButton, { text: getContent, children: __("Copy contents") }),
            /* @__PURE__ */ jsx(CopyButton, { variant: "primary", text: error?.stack, children: __("Copy error") })
          ] })
        ]
      }
    );
  }
};
var error_boundary_default = ErrorBoundary;
export {
  error_boundary_default as default
};
//# sourceMappingURL=index.mjs.map
