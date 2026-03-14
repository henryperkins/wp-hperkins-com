// packages/editor/src/components/post-revisions-preview/diff-markers.js
import {
  useState,
  useMemo,
  useRef,
  useCallback,
  useEffect
} from "@wordpress/element";
import { useRefEffect, useMergeRefs } from "@wordpress/compose";
import { useSelect } from "@wordpress/data";
import {
  privateApis as blockEditorPrivateApis,
  store as blockEditorStore
} from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";
import { unlock } from "../../lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
var { useBlockElementRef } = unlock(blockEditorPrivateApis);
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
  added: __("Go to added block"),
  removed: __("Go to removed block"),
  modified: __("Go to modified block")
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
  const blockRef = useRef();
  useBlockElementRef(clientId, blockRef);
  const [position, setPosition] = useState(
    () => calculatePosition(blockRef.current)
  );
  useEffect(() => {
    return subscribe(() => {
      setPosition(calculatePosition(blockRef.current));
    });
  }, [subscribe]);
  useEffect(() => {
    setPosition(calculatePosition(blockRef.current));
  }, [status]);
  if (!position) {
    return null;
  }
  return /* @__PURE__ */ jsx(
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
  const [isMounted, setIsMounted] = useState(false);
  const subscribersRef = useRef(/* @__PURE__ */ new Set());
  const blocks = useSelect(
    (select) => select(blockEditorStore).getBlocks(),
    []
  );
  const diffBlocks = useMemo(() => collectDiffBlocks(blocks), [blocks]);
  const subscribe = useCallback((callback) => {
    subscribersRef.current.add(callback);
    return () => subscribersRef.current.delete(callback);
  }, []);
  const contentRef = useRefEffect((element) => {
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
    useMergeRefs([contentRef, setIsMounted]),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "revision-diff-markers",
        role: "navigation",
        "aria-label": __("Diff markers"),
        children: isMounted && diffBlocks.map(({ clientId, status }) => /* @__PURE__ */ jsx(
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
export {
  useDiffMarkers
};
//# sourceMappingURL=diff-markers.mjs.map
