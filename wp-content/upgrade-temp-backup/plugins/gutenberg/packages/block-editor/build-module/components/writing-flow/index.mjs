// packages/block-editor/src/components/writing-flow/index.js
import clsx from "clsx";
import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { useMergeRefs, useRefEffect } from "@wordpress/compose";
import { forwardRef } from "@wordpress/element";
import useMultiSelection from "./use-multi-selection.mjs";
import useTabNav from "./use-tab-nav.mjs";
import useArrowNav from "./use-arrow-nav.mjs";
import { usePreviewModeNav } from "./use-preview-mode-nav.mjs";
import useSelectAll from "./use-select-all.mjs";
import useDragSelection from "./use-drag-selection.mjs";
import useSelectionObserver from "./use-selection-observer.mjs";
import useClickSelection from "./use-click-selection.mjs";
import useInput from "./use-input.mjs";
import useClipboardHandler from "./use-clipboard-handler.mjs";
import { store as blockEditorStore } from "../../store/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function useWritingFlow() {
  const [before, ref, after] = useTabNav();
  const hasMultiSelection = useSelect(
    (select) => select(blockEditorStore).hasMultiSelection(),
    []
  );
  return [
    before,
    useMergeRefs([
      ref,
      useClipboardHandler(),
      useInput(),
      useDragSelection(),
      useSelectionObserver(),
      useClickSelection(),
      useMultiSelection(),
      useSelectAll(),
      useArrowNav(),
      usePreviewModeNav(),
      useRefEffect(
        (node) => {
          node.tabIndex = 0;
          node.dataset.hasMultiSelection = hasMultiSelection;
          if (!hasMultiSelection) {
            return () => {
              delete node.dataset.hasMultiSelection;
            };
          }
          node.setAttribute(
            "aria-label",
            __("Multiple selected blocks")
          );
          return () => {
            delete node.dataset.hasMultiSelection;
            node.removeAttribute("aria-label");
          };
        },
        [hasMultiSelection]
      )
    ]),
    after
  ];
}
function WritingFlow({ children, ...props }, forwardedRef) {
  const [before, ref, after] = useWritingFlow();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    before,
    /* @__PURE__ */ jsx(
      "div",
      {
        ...props,
        ref: useMergeRefs([ref, forwardedRef]),
        className: clsx(
          props.className,
          "block-editor-writing-flow"
        ),
        children
      }
    ),
    after
  ] });
}
var writing_flow_default = forwardRef(WritingFlow);
export {
  writing_flow_default as default,
  useWritingFlow
};
//# sourceMappingURL=index.mjs.map
