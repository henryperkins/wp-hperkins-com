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

// packages/editor/src/components/post-revisions-preview/revisions-canvas.js
var revisions_canvas_exports = {};
__export(revisions_canvas_exports, {
  default: () => RevisionsCanvas
});
module.exports = __toCommonJS(revisions_canvas_exports);
var import_clsx = __toESM(require("clsx"));
var import_components = require("@wordpress/components");
var import_block_editor = require("@wordpress/block-editor");
var import_blocks = require("@wordpress/blocks");
var import_core_data = require("@wordpress/core-data");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_hooks = require("@wordpress/hooks");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_store = require("../../store/index.cjs");
var import_visual_editor = __toESM(require("../visual-editor/index.cjs"));
var import_diff_format_types = require("./diff-format-types.cjs");
var import_diff_markers = require("./diff-markers.cjs");
var import_preserve_client_ids = require("./preserve-client-ids.cjs");
var import_block_diff = require("./block-diff.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { ExperimentalBlockEditorProvider, usePrivateStyleOverride } = (0, import_lock_unlock.unlock)(
  import_block_editor.privateApis
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
    const enhancedClassName = (0, import_clsx.default)(className, {
      "is-revision-added": diffStatus === "added",
      "is-revision-removed": diffStatus === "removed",
      "is-revision-modified": diffStatus === "modified"
    });
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockListBlock, { ...props, className: enhancedClassName });
  };
}
var FILTER_NAME = "editor/revisions-canvas/withRevisionDiffClasses";
(0, import_hooks.addFilter)("editor.BlockListBlock", FILTER_NAME, withRevisionDiffClasses);
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
  const [contentRef, diffMarkers] = (0, import_diff_markers.useDiffMarkers)();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_visual_editor.default, { contentRef }),
    showDiff && diffMarkers
  ] });
}
function RevisionsCanvas({ showDiff }) {
  (0, import_element.useEffect)(() => {
    (0, import_diff_format_types.registerDiffFormatTypes)();
    return () => {
      (0, import_diff_format_types.unregisterDiffFormatTypes)();
    };
  }, []);
  const { revision, previousRevision, postType, blockEditorSettings } = (0, import_data.useSelect)((select) => {
    const {
      getCurrentRevision,
      getPreviousRevision,
      getCurrentPostType
    } = (0, import_lock_unlock.unlock)(select(import_store.store));
    return {
      revision: getCurrentRevision(),
      previousRevision: getPreviousRevision(),
      postType: getCurrentPostType(),
      blockEditorSettings: select(import_block_editor.store).getSettings()
    };
  }, []);
  const previousBlocksRef = (0, import_element.useRef)([]);
  const blocks = (0, import_element.useMemo)(() => {
    const currentContent = revision?.content?.raw ?? "";
    let parsedBlocks;
    if (showDiff) {
      const previousContent = previousRevision?.content?.raw || "";
      parsedBlocks = (0, import_block_diff.diffRevisionContent)(
        currentContent,
        previousContent
      );
    } else {
      parsedBlocks = (0, import_blocks.parse)(currentContent);
    }
    if (postType === "wp_navigation") {
      parsedBlocks = [
        (0, import_blocks.createBlock)(
          "core/navigation",
          { templateLock: false },
          parsedBlocks
        )
      ];
    }
    const blocksWithStableIds = (0, import_preserve_client_ids.preserveClientIds)(
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
  const settings = (0, import_element.useMemo)(
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
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_core_data.EntityProvider, { revisionId: revision.id, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      ExperimentalBlockEditorProvider,
      {
        value: blocks,
        settings,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiffStyleOverrides, { showDiff }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "editor-revisions-canvas__content", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CanvasContent, { showDiff }) })
        ]
      }
    ) })
  ) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "editor-revisions-canvas__loading", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Spinner, {}) });
}
//# sourceMappingURL=revisions-canvas.cjs.map
