// packages/editor/src/components/styles-canvas/revisions.js
import { Disabled } from "@wordpress/components";
import {
  BlockList,
  privateApis as blockEditorPrivateApis,
  store as blockEditorStore,
  __unstableEditorStyles as EditorStyles,
  __unstableIframe as Iframe
} from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
import { useMemo, forwardRef } from "@wordpress/element";
import { useGlobalStylesRevisions } from "@wordpress/global-styles-ui";
import { mergeGlobalStyles } from "@wordpress/global-styles-engine";
import { useGlobalStyles } from "../global-styles/hooks.mjs";
import { useGlobalStylesOutputWithConfig } from "../../hooks/use-global-styles-output.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var {
  ExperimentalBlockEditorProvider,
  __unstableBlockStyleVariationOverridesWithConfig
} = unlock(blockEditorPrivateApis);
function isObjectEmpty(object) {
  return !object || Object.keys(object).length === 0;
}
function StylesCanvasRevisions({ path }, ref) {
  const blocks = useSelect((select) => {
    return select(blockEditorStore).getBlocks();
  }, []);
  const { user: userConfig, base: baseConfig } = useGlobalStyles();
  const { revisions, isLoading } = useGlobalStylesRevisions();
  const revisionId = useMemo(() => {
    const match = path?.match(/^\/revisions\/(.+)$/);
    return match ? match[1] : null;
  }, [path]);
  const selectedRevision = useMemo(() => {
    if (!revisionId || !revisions.length) {
      return null;
    }
    return revisions.find(
      (rev) => String(rev.id) === String(revisionId)
    );
  }, [revisionId, revisions]);
  const displayConfig = selectedRevision || userConfig;
  const mergedConfig = useMemo(() => {
    if (!isObjectEmpty(displayConfig) && !isObjectEmpty(baseConfig)) {
      return mergeGlobalStyles(baseConfig, displayConfig);
    }
    return {};
  }, [baseConfig, displayConfig]);
  const renderedBlocksArray = useMemo(
    () => Array.isArray(blocks) ? blocks : [blocks],
    [blocks]
  );
  const originalSettings = useSelect(
    (select) => select(blockEditorStore).getSettings(),
    []
  );
  const settings = useMemo(
    () => ({
      ...originalSettings,
      isPreviewMode: true
    }),
    [originalSettings]
  );
  const [globalStyles] = useGlobalStylesOutputWithConfig(mergedConfig);
  const editorStyles = !isObjectEmpty(globalStyles) && !isObjectEmpty(displayConfig) ? globalStyles : settings.styles;
  if (isLoading) {
    return null;
  }
  return /* @__PURE__ */ jsxs(
    Iframe,
    {
      ref,
      className: "editor-revisions__iframe",
      name: "revisions",
      tabIndex: 0,
      children: [
        /* @__PURE__ */ jsx("style", {
          // Forming a "block formatting context" to prevent margin collapsing.
          // @see https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context
          children: `.is-root-container { display: flow-root; }`
        }),
        /* @__PURE__ */ jsx(Disabled, { className: "editor-revisions__example-preview__content", children: /* @__PURE__ */ jsxs(
          ExperimentalBlockEditorProvider,
          {
            value: renderedBlocksArray,
            settings,
            children: [
              /* @__PURE__ */ jsx(BlockList, { renderAppender: false }),
              /* @__PURE__ */ jsx(EditorStyles, { styles: editorStyles }),
              /* @__PURE__ */ jsx(
                __unstableBlockStyleVariationOverridesWithConfig,
                {
                  config: mergedConfig
                }
              )
            ]
          }
        ) })
      ]
    }
  );
}
var revisions_default = forwardRef(StylesCanvasRevisions);
export {
  revisions_default as default
};
//# sourceMappingURL=revisions.mjs.map
