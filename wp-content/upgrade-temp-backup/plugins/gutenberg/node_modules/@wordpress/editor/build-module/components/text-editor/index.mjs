// packages/editor/src/components/text-editor/index.js
import { Button } from "@wordpress/components";
import { useDispatch, useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { store as keyboardShortcutsStore } from "@wordpress/keyboard-shortcuts";
import { useEffect, useRef } from "@wordpress/element";
import { store as editorStore } from "../../store/index.mjs";
import PostTextEditor from "../post-text-editor/index.mjs";
import PostTitleRaw from "../post-title/post-title-raw.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function TextEditor({ autoFocus = false }) {
  const { switchEditorMode } = useDispatch(editorStore);
  const { shortcut, isRichEditingEnabled } = useSelect((select) => {
    const { getEditorSettings } = select(editorStore);
    const { getShortcutRepresentation } = select(keyboardShortcutsStore);
    return {
      shortcut: getShortcutRepresentation("core/editor/toggle-mode"),
      isRichEditingEnabled: getEditorSettings().richEditingEnabled
    };
  }, []);
  const titleRef = useRef();
  useEffect(() => {
    if (autoFocus) {
      return;
    }
    titleRef?.current?.focus();
  }, [autoFocus]);
  return /* @__PURE__ */ jsxs("div", { className: "editor-text-editor", children: [
    isRichEditingEnabled && /* @__PURE__ */ jsxs("div", { className: "editor-text-editor__toolbar", children: [
      /* @__PURE__ */ jsx("h2", { children: __("Editing code") }),
      /* @__PURE__ */ jsx(
        Button,
        {
          __next40pxDefaultSize: true,
          variant: "tertiary",
          onClick: () => switchEditorMode("visual"),
          shortcut,
          children: __("Exit code editor")
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "editor-text-editor__body", children: [
      /* @__PURE__ */ jsx(PostTitleRaw, { ref: titleRef }),
      /* @__PURE__ */ jsx(PostTextEditor, {})
    ] })
  ] });
}
export {
  TextEditor as default
};
//# sourceMappingURL=index.mjs.map
