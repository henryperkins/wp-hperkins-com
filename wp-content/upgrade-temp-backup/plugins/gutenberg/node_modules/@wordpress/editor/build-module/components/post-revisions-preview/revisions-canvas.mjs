// packages/editor/src/components/post-revisions-preview/revisions-canvas.js
import clsx from "clsx";
import { Spinner } from "@wordpress/components";
import {
  privateApis as blockEditorPrivateApis,
  store as blockEditorStore
} from "@wordpress/block-editor";
import { createBlock, parse } from "@wordpress/blocks";
import { EntityProvider } from "@wordpress/core-data";
import { useSelect } from "@wordpress/data";
import { useEffect, useMemo, useRef } from "@wordpress/element";
import { addFilter } from "@wordpress/hooks";
import { unlock } from "../../lock-unlock.mjs";
import { store as editorStore } from "../../store/index.mjs";
import VisualEditor from "../visual-editor/index.mjs";
import {
  registerDiffFormatTypes,
  unregisterDiffFormatTypes
} from "./diff-format-types.mjs";
import { useDiffMarkers } from "./diff-markers.mjs";
import { preserveClientIds } from "./preserve-client-ids.mjs";
import { diffRevisionContent } from "./block-diff.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { ExperimentalBlockEditorProvider, usePrivateStyleOverride } = unlock(
  blockEditorPrivateApis
);
var REVISION_REMOVED_FILTER_SVG = `
<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 0 0"
	width="0"
	height="0"
	focusable="false"
	role="none"
	aria-hidden="true"
	style="visibility: hidden; position: absolute; left: -9999px; overflow: hidden;"
>
	<defs>
		<filter id="revision-removed-filter" x="0" y="0" width="100%" height="100%">
			<!-- Desaturate and add red tint -->
			<feColorMatrix type="matrix"
				values="0.5 0.3 0.2 0 0.15
				        0.2 0.2 0.1 0 0
				        0.2 0.2 0.1 0 0
				        0   0   0   0.8 0"/>
		</filter>
	</defs>
</svg>
`;
var REVISION_DIFF_STYLES = `
	.is-revision-added {
		box-shadow: inset 0 0 0 9999px color-mix(in srgb, currentColor 5%, #00a32a 15%), 0 0 0 4px color-mix(in srgb, currentColor 5%, #00a32a 15%);
	}
	.is-revision-removed,
	.revision-diff-removed {
		text-decoration: line-through;
		filter: url(#revision-removed-filter);
	}
	.is-revision-modified {
		outline: 2px solid color-mix(in srgb, currentColor 30%, #dba617 70%) !important;
		outline-offset: 2px;
	}
	.revision-diff-added {
		background-color: color-mix(in srgb, currentColor 5%, #00a32a 15%);
		text-decoration: none;
	}
	.revision-diff-format-added {
		text-decoration: underline wavy color-mix(in srgb, currentColor 30%, #00a32a 70%);
		text-decoration-thickness: 2px;
	}
	.revision-diff-format-removed {
		text-decoration: underline wavy color-mix(in srgb, currentColor 20%, #d63638 80%);
		text-decoration-thickness: 2px;
	}
	.revision-diff-format-changed {
		text-decoration: underline wavy color-mix(in srgb, currentColor 30%, #dba617 70%);
		text-decoration-thickness: 2px;
	}
`;
function withRevisionDiffClasses(BlockListBlock) {
  return (props) => {
    const { block, className } = props;
    const diffStatus = block?.__revisionDiffStatus;
    const enhancedClassName = clsx(className, {
      "is-revision-added": diffStatus === "added",
      "is-revision-removed": diffStatus === "removed",
      "is-revision-modified": diffStatus === "modified"
    });
    return /* @__PURE__ */ jsx(BlockListBlock, { ...props, className: enhancedClassName });
  };
}
var FILTER_NAME = "editor/revisions-canvas/withRevisionDiffClasses";
addFilter("editor.BlockListBlock", FILTER_NAME, withRevisionDiffClasses);
function DiffStyleOverrides({ showDiff }) {
  usePrivateStyleOverride({
    css: showDiff ? REVISION_DIFF_STYLES : ""
  });
  usePrivateStyleOverride({
    assets: showDiff ? REVISION_REMOVED_FILTER_SVG : "",
    __unstableType: "svgs"
  });
  return null;
}
function CanvasContent({ showDiff }) {
  const [contentRef, diffMarkers] = useDiffMarkers();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(VisualEditor, { contentRef }),
    showDiff && diffMarkers
  ] });
}
function RevisionsCanvas({ showDiff }) {
  useEffect(() => {
    registerDiffFormatTypes();
    return () => {
      unregisterDiffFormatTypes();
    };
  }, []);
  const { revision, previousRevision, postType, blockEditorSettings } = useSelect((select) => {
    const {
      getCurrentRevision,
      getPreviousRevision,
      getCurrentPostType
    } = unlock(select(editorStore));
    return {
      revision: getCurrentRevision(),
      previousRevision: getPreviousRevision(),
      postType: getCurrentPostType(),
      blockEditorSettings: select(blockEditorStore).getSettings()
    };
  }, []);
  const previousBlocksRef = useRef([]);
  const blocks = useMemo(() => {
    const currentContent = revision?.content?.raw ?? "";
    let parsedBlocks;
    if (showDiff) {
      const previousContent = previousRevision?.content?.raw || "";
      parsedBlocks = diffRevisionContent(
        currentContent,
        previousContent
      );
    } else {
      parsedBlocks = parse(currentContent);
    }
    if (postType === "wp_navigation") {
      parsedBlocks = [
        createBlock(
          "core/navigation",
          { templateLock: false },
          parsedBlocks
        )
      ];
    }
    const blocksWithStableIds = preserveClientIds(
      parsedBlocks,
      previousBlocksRef.current
    );
    previousBlocksRef.current = blocksWithStableIds;
    return blocksWithStableIds;
  }, [
    revision?.content?.raw,
    previousRevision?.content?.raw,
    postType,
    showDiff
  ]);
  const settings = useMemo(
    () => ({
      ...blockEditorSettings,
      isPreviewMode: true
    }),
    [blockEditorSettings]
  );
  return revision ? (
    // EntityProvider without kind/type/id inherits those from the
    // parent context. Only revisionId is added so that useEntityProp
    // reads from the revision record instead of the current entity.
    /* @__PURE__ */ jsx(EntityProvider, { revisionId: revision.id, children: /* @__PURE__ */ jsxs(
      ExperimentalBlockEditorProvider,
      {
        value: blocks,
        settings,
        children: [
          /* @__PURE__ */ jsx(DiffStyleOverrides, { showDiff }),
          /* @__PURE__ */ jsx("div", { className: "editor-revisions-canvas__content", children: /* @__PURE__ */ jsx(CanvasContent, { showDiff }) })
        ]
      }
    ) })
  ) : /* @__PURE__ */ jsx("div", { className: "editor-revisions-canvas__loading", children: /* @__PURE__ */ jsx(Spinner, {}) });
}
export {
  RevisionsCanvas as default
};
//# sourceMappingURL=revisions-canvas.mjs.map
