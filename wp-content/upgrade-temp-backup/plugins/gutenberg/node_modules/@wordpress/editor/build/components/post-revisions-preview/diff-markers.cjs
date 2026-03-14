"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/components/post-revisions-preview/diff-markers.js
var diff_markers_exports = {};
__export(diff_markers_exports, {
  useDiffMarkers: () => useDiffMarkers
});
module.exports = __toCommonJS(diff_markers_exports);
var import_element = require("@wordpress/element");
var import_compose = require("@wordpress/compose");
var import_data = require("@wordpress/data");
var import_block_editor = require("@wordpress/block-editor");
var import_i18n = require("@wordpress/i18n");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { useBlockElementRef } = (0, import_lock_unlock.unlock)(import_block_editor.privateApis);
function collectDiffBlocks(blocks) {
  const result = [];
  for (const block of blocks) {
    if (block.__revisionDiffStatus) {
      result.push({
        clientId: block.clientId,
        status: block.__revisionDiffStatus
      });
    }
    if (block.innerBlocks?.length) {
      result.push(...collectDiffBlocks(block.innerBlocks));
    }
  }
  return result;
}
var STATUS_LABELS = {
  added: (0, import_i18n.__)("Go to added block"),
  removed: (0, import_i18n.__)("Go to removed block"),
  modified: (0, import_i18n.__)("Go to modified block")
};
function calculatePosition(el) {
  if (!el) {
    return null;
  }
  const doc = el.ownerDocument;
  const scrollHeight = doc.documentElement.scrollHeight;
  const rect = el.getBoundingClientRect();
  const scrollTop = doc.documentElement.scrollTop;
  const top = rect.top + scrollTop;
  return {
    top: top / scrollHeight * 100,
    height: rect.height / scrollHeight * 100
  };
}
function DiffMarkerButton({ clientId, status, subscribe }) {
  const blockRef = (0, import_element.useRef)();
  useBlockElementRef(clientId, blockRef);
  const [position, setPosition] = (0, import_element.useState)(
    () => calculatePosition(blockRef.current)
  );
  (0, import_element.useEffect)(() => {
    return subscribe(() => {
      setPosition(calculatePosition(blockRef.current));
    });
  }, [subscribe]);
  (0, import_element.useEffect)(() => {
    setPosition(calculatePosition(blockRef.current));
  }, [status]);
  if (!position) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "button",
    {
      className: `revision-diff-marker is-${status}`,
      style: {
        top: `${position.top}%`,
        height: `${Math.max(position.height, 0.5)}%`
      },
      onClick: () => blockRef.current?.focus(),
      "aria-label": STATUS_LABELS[status]
    }
  );
}
function useDiffMarkers() {
  const [isMounted, setIsMounted] = (0, import_element.useState)(false);
  const subscribersRef = (0, import_element.useRef)(/* @__PURE__ */ new Set());
  const blocks = (0, import_data.useSelect)(
    (select) => select(import_block_editor.store).getBlocks(),
    []
  );
  const diffBlocks = (0, import_element.useMemo)(() => collectDiffBlocks(blocks), [blocks]);
  const subscribe = (0, import_element.useCallback)((callback) => {
    subscribersRef.current.add(callback);
    return () => subscribersRef.current.delete(callback);
  }, []);
  const contentRef = (0, import_compose.useRefEffect)((element) => {
    const { ownerDocument } = element;
    const { defaultView } = ownerDocument;
    const resizeObserver = new defaultView.ResizeObserver(() => {
      subscribersRef.current.forEach((cb) => cb());
    });
    resizeObserver.observe(ownerDocument.body);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);
  return [
    (0, import_compose.useMergeRefs)([contentRef, setIsMounted]),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "div",
      {
        className: "revision-diff-markers",
        role: "navigation",
        "aria-label": (0, import_i18n.__)("Diff markers"),
        children: isMounted && diffBlocks.map(({ clientId, status }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          DiffMarkerButton,
          {
            clientId,
            status,
            subscribe
          },
          clientId
        ))
      },
      "diff-markers"
    )
  ];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useDiffMarkers
});
//# sourceMappingURL=diff-markers.cjs.map
