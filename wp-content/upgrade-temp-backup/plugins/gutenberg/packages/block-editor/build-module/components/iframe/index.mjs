// packages/block-editor/src/components/iframe/index.js
import clsx from "clsx";
import { useState, createPortal, forwardRef } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import {
  useMergeRefs,
  useRefEffect,
  useDisabled,
  useViewportMatch
} from "@wordpress/compose";
import { __experimentalStyleProvider as StyleProvider } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { useWritingFlow } from "../writing-flow/index.mjs";
import { getCompatibilityStyles } from "./get-compatibility-styles.mjs";
import { useScaleCanvas } from "./use-scale-canvas.mjs";
import { store as blockEditorStore } from "../../store/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var ViewportWidthProvider = useViewportMatch.__experimentalWidthProvider;
function bubbleEvent(event, Constructor, frame) {
  const init = {};
  for (const key in event) {
    init[key] = event[key];
  }
  if (event instanceof frame.contentDocument.defaultView.MouseEvent) {
    const rect = frame.getBoundingClientRect();
    init.clientX += rect.left;
    init.clientY += rect.top;
  }
  const newEvent = new Constructor(event.type, init);
  if (init.defaultPrevented) {
    newEvent.preventDefault();
  }
  const cancelled = !frame.dispatchEvent(newEvent);
  if (cancelled) {
    event.preventDefault();
  }
}
function useBubbleEvents(iframeDocument) {
  return useRefEffect(() => {
    const { defaultView } = iframeDocument;
    if (!defaultView) {
      return;
    }
    const { frameElement } = defaultView;
    const html = iframeDocument.documentElement;
    const eventTypes = ["dragover", "mousemove"];
    const handlers = {};
    for (const name of eventTypes) {
      handlers[name] = (event) => {
        const prototype = Object.getPrototypeOf(event);
        const constructorName = prototype.constructor.name;
        const Constructor = window[constructorName];
        bubbleEvent(event, Constructor, frameElement);
      };
      html.addEventListener(name, handlers[name]);
    }
    return () => {
      for (const name of eventTypes) {
        html.removeEventListener(name, handlers[name]);
      }
    };
  });
}
var iframeSrcCache = /* @__PURE__ */ new WeakMap();
var iframeSrcCleanup = globalThis.FinalizationRegistry ? new globalThis.FinalizationRegistry(
  (url) => URL.revokeObjectURL(url)
) : void 0;
function getIframeSrc(resolvedAssets) {
  let src = iframeSrcCache.get(resolvedAssets);
  if (src) {
    return src;
  }
  const html = `<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<base href="${window.location.href}">
		<script>window.frameElement._load()</script>
		<style>
			html{
				height: auto !important;
				min-height: 100%;
			}
			/* Lowest specificity to not override global styles */
			:where(body) {
				margin: 0;
				/* Default background color in case zoom out mode background
				colors the html element */
				background-color: white;
			}
		</style>
		${resolvedAssets.styles ?? ""}
		${resolvedAssets.scripts ?? ""}
	</head>
	<body>
		<script>document.currentScript.parentElement.remove()</script>
	</body>
</html>`;
  src = URL.createObjectURL(new Blob([html], { type: "text/html" }));
  iframeSrcCache.set(resolvedAssets, src);
  iframeSrcCleanup?.register(resolvedAssets, src);
  return src;
}
function Iframe({
  contentRef,
  children,
  tabIndex = 0,
  scale = 1,
  frameSize = 0,
  readonly,
  forwardedRef: ref,
  title = __("Editor canvas"),
  ...props
}) {
  const { resolvedAssets, isPreviewMode } = useSelect((select) => {
    const settings = select(blockEditorStore).getSettings();
    return {
      resolvedAssets: settings.__unstableResolvedAssets,
      isPreviewMode: settings.isPreviewMode
    };
  }, []);
  const [iframeDocument, setIframeDocument] = useState();
  const [bodyClasses, setBodyClasses] = useState([]);
  const [before, writingFlowRef, after] = useWritingFlow();
  const setRef = useRefEffect((node) => {
    node._load = () => {
      setIframeDocument(node.contentDocument);
    };
    let iFrameDocument;
    function preventFileDropDefault(event) {
      event.preventDefault();
    }
    function interceptLinkClicks(event) {
      if (event.target.tagName === "A" && event.target.getAttribute("href")?.startsWith("#")) {
        event.preventDefault();
        iFrameDocument.defaultView.location.hash = event.target.getAttribute("href").slice(1);
      }
    }
    const { ownerDocument } = node;
    setBodyClasses(
      Array.from(ownerDocument.body.classList).filter(
        (name) => name.startsWith("admin-color-") || name.startsWith("post-type-") || name === "wp-embed-responsive"
      )
    );
    function onLoad() {
      const { contentDocument } = node;
      const { documentElement } = contentDocument;
      iFrameDocument = contentDocument;
      documentElement.classList.add("block-editor-iframe__html");
      contentDocument.dir = ownerDocument.dir;
      for (const compatStyle of getCompatibilityStyles()) {
        if (contentDocument.getElementById(compatStyle.id)) {
          continue;
        }
        contentDocument.head.appendChild(
          compatStyle.cloneNode(true)
        );
        if (!isPreviewMode) {
          console.warn(
            `${compatStyle.id} was added to the iframe incorrectly. Please use block.json or enqueue_block_assets to add styles to the iframe.`,
            compatStyle
          );
        }
      }
      iFrameDocument.addEventListener(
        "dragover",
        preventFileDropDefault,
        false
      );
      iFrameDocument.addEventListener(
        "drop",
        preventFileDropDefault,
        false
      );
      iFrameDocument.addEventListener("click", interceptLinkClicks);
    }
    node.addEventListener("load", onLoad);
    return () => {
      delete node._load;
      node.removeEventListener("load", onLoad);
      iFrameDocument?.removeEventListener(
        "dragover",
        preventFileDropDefault
      );
      iFrameDocument?.removeEventListener(
        "drop",
        preventFileDropDefault
      );
      iFrameDocument?.removeEventListener("click", interceptLinkClicks);
    };
  }, []);
  const {
    contentResizeListener,
    containerResizeListener,
    containerWidth,
    isZoomedOut,
    scaleContainerWidth
  } = useScaleCanvas({
    scale,
    frameSize: parseInt(frameSize),
    iframeDocument
  });
  const disabledRef = useDisabled({ isDisabled: !readonly });
  const bodyRef = useMergeRefs([
    useBubbleEvents(iframeDocument),
    contentRef,
    writingFlowRef,
    disabledRef
  ]);
  const src = getIframeSrc(resolvedAssets);
  const shouldRenderFocusCaptureElements = tabIndex >= 0 && !isPreviewMode;
  const iframe = /* @__PURE__ */ jsxs(Fragment, { children: [
    shouldRenderFocusCaptureElements && before,
    /* @__PURE__ */ jsx(
      "iframe",
      {
        ...props,
        style: {
          ...props.style,
          height: props.style?.height,
          border: 0
        },
        ref: useMergeRefs([ref, setRef]),
        tabIndex,
        src,
        title,
        onKeyDown: (event) => {
          if (props.onKeyDown) {
            props.onKeyDown(event);
          }
          if (event.currentTarget.ownerDocument !== event.target.ownerDocument) {
            const { stopPropagation } = event.nativeEvent;
            event.nativeEvent.stopPropagation = () => {
            };
            event.stopPropagation();
            event.nativeEvent.stopPropagation = stopPropagation;
            bubbleEvent(
              event,
              window.KeyboardEvent,
              event.currentTarget
            );
          }
        },
        children: iframeDocument && createPortal(
          /* @__PURE__ */ jsxs(
            "body",
            {
              ref: bodyRef,
              className: clsx(
                "block-editor-iframe__body",
                "editor-styles-wrapper",
                ...bodyClasses
              ),
              children: [
                contentResizeListener,
                /* @__PURE__ */ jsx(StyleProvider, { document: iframeDocument, children: /* @__PURE__ */ jsx(ViewportWidthProvider, { value: containerWidth, children }) })
              ]
            }
          ),
          iframeDocument.documentElement
        )
      }
    ),
    shouldRenderFocusCaptureElements && after
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "block-editor-iframe__container", children: [
    containerResizeListener,
    /* @__PURE__ */ jsx(
      "div",
      {
        className: clsx(
          "block-editor-iframe__scale-container",
          isZoomedOut && "is-zoomed-out"
        ),
        style: {
          "--wp-block-editor-iframe-zoom-out-scale-container-width": isZoomedOut && `${scaleContainerWidth}px`
        },
        children: iframe
      }
    )
  ] });
}
function IframeIfReady(props, ref) {
  const isInitialised = useSelect(
    (select) => select(blockEditorStore).getSettings().__internalIsInitialized,
    []
  );
  if (!isInitialised) {
    return null;
  }
  return /* @__PURE__ */ jsx(Iframe, { ...props, forwardedRef: ref });
}
var iframe_default = forwardRef(IframeIfReady);
export {
  iframe_default as default
};
//# sourceMappingURL=index.mjs.map
