// packages/widgets/src/blocks/legacy-widget/edit/preview.js
import clsx from "clsx";
import { useRefEffect } from "@wordpress/compose";
import { useEffect, useState } from "@wordpress/element";
import { Disabled, Placeholder, Spinner } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import apiFetch from "@wordpress/api-fetch";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function Preview({ idBase, instance, isVisible }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [srcDoc, setSrcDoc] = useState("");
  useEffect(() => {
    const abortController = typeof window.AbortController === "undefined" ? void 0 : new window.AbortController();
    async function fetchPreviewHTML() {
      const restRoute = `/wp/v2/widget-types/${idBase}/render`;
      return await apiFetch({
        path: restRoute,
        method: "POST",
        signal: abortController?.signal,
        data: instance ? { instance } : {}
      });
    }
    fetchPreviewHTML().then((response) => {
      setSrcDoc(response.preview);
    }).catch((error) => {
      if ("AbortError" === error.name) {
        return;
      }
      throw error;
    });
    return () => abortController?.abort();
  }, [idBase, instance]);
  const ref = useRefEffect(
    (iframe) => {
      if (!isLoaded) {
        return;
      }
      function setHeight() {
        const height = Math.max(
          iframe.contentDocument.documentElement?.offsetHeight ?? 0,
          iframe.contentDocument.body?.offsetHeight ?? 0
        );
        iframe.style.height = `${height !== 0 ? height : 100}px`;
      }
      const { IntersectionObserver } = iframe.ownerDocument.defaultView;
      const intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setHeight();
          }
        },
        {
          threshold: 1
        }
      );
      intersectionObserver.observe(iframe);
      iframe.addEventListener("load", setHeight);
      return () => {
        intersectionObserver.disconnect();
        iframe.removeEventListener("load", setHeight);
      };
    },
    [isLoaded]
  );
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    isVisible && !isLoaded && /* @__PURE__ */ jsx(Placeholder, { children: /* @__PURE__ */ jsx(Spinner, {}) }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: clsx("wp-block-legacy-widget__edit-preview", {
          "is-offscreen": !isVisible || !isLoaded
        }),
        children: /* @__PURE__ */ jsx(Disabled, { children: /* @__PURE__ */ jsx(
          "iframe",
          {
            ref,
            className: "wp-block-legacy-widget__edit-preview-iframe",
            tabIndex: "-1",
            title: __("Legacy Widget Preview"),
            srcDoc,
            onLoad: (event) => {
              event.target.contentDocument.body.style.overflow = "hidden";
              setIsLoaded(true);
            },
            height: 100
          }
        ) })
      }
    )
  ] });
}
export {
  Preview as default
};
//# sourceMappingURL=preview.mjs.map
