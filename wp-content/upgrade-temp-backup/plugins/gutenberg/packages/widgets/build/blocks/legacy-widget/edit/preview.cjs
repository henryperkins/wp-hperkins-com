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

// packages/widgets/src/blocks/legacy-widget/edit/preview.js
var preview_exports = {};
__export(preview_exports, {
  default: () => Preview
});
module.exports = __toCommonJS(preview_exports);
var import_clsx = __toESM(require("clsx"));
var import_compose = require("@wordpress/compose");
var import_element = require("@wordpress/element");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_api_fetch = __toESM(require("@wordpress/api-fetch"));
var import_jsx_runtime = require("react/jsx-runtime");
function Preview({ idBase, instance, isVisible }) {
  const [isLoaded, setIsLoaded] = (0, import_element.useState)(false);
  const [srcDoc, setSrcDoc] = (0, import_element.useState)("");
  (0, import_element.useEffect)(() => {
    const abortController = typeof window.AbortController === "undefined" ? void 0 : new window.AbortController();
    async function fetchPreviewHTML() {
      const restRoute = `/wp/v2/widget-types/${idBase}/render`;
      return await (0, import_api_fetch.default)({
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
  const ref = (0, import_compose.useRefEffect)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    isVisible && !isLoaded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Placeholder, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Spinner, {}) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "div",
      {
        className: (0, import_clsx.default)("wp-block-legacy-widget__edit-preview", {
          "is-offscreen": !isVisible || !isLoaded
        }),
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Disabled, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "iframe",
          {
            ref,
            className: "wp-block-legacy-widget__edit-preview-iframe",
            tabIndex: "-1",
            title: (0, import_i18n.__)("Legacy Widget Preview"),
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
//# sourceMappingURL=preview.cjs.map
