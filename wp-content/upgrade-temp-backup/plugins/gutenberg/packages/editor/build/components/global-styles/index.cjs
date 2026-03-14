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

// packages/editor/src/components/global-styles/index.js
var global_styles_exports = {};
__export(global_styles_exports, {
  default: () => GlobalStylesUIWrapper,
  useGlobalStyles: () => import_hooks2.useGlobalStyles,
  useSetting: () => import_hooks2.useSetting,
  useStyle: () => import_hooks2.useStyle
});
module.exports = __toCommonJS(global_styles_exports);
var import_core_data = require("@wordpress/core-data");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_global_styles_ui = require("@wordpress/global-styles-ui");
var import_media_utils = require("@wordpress/media-utils");
var import_block_link = require("./block-link.cjs");
var import_hooks = require("./hooks.cjs");
var import_hooks2 = require("./hooks.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function useServerData(settings) {
  const styles = settings?.styles;
  const __unstableResolvedAssets = settings?.__unstableResolvedAssets;
  const colors = settings?.colors;
  const gradients = settings?.gradients;
  const __experimentalDiscussionSettings = settings?.__experimentalDiscussionSettings;
  const fontLibraryEnabled = settings?.fontLibraryEnabled ?? true;
  const mediaUploadHandler = (0, import_data.useSelect)((select) => {
    const { canUser } = select(import_core_data.store);
    const canUserUploadMedia = canUser("create", {
      kind: "postType",
      name: "attachment"
    });
    return canUserUploadMedia ? import_media_utils.uploadMedia : void 0;
  }, []);
  const serverCSS = (0, import_element.useMemo)(() => {
    if (!styles) {
      return [];
    }
    return styles.filter((style) => !style.isGlobalStyles);
  }, [styles]);
  const serverSettings = (0, import_element.useMemo)(() => {
    return {
      __unstableResolvedAssets,
      settings: {
        color: {
          palette: {
            theme: colors ?? []
          },
          gradients: {
            theme: gradients ?? []
          },
          duotone: {
            theme: []
          }
        }
      },
      __experimentalDiscussionSettings,
      mediaUpload: mediaUploadHandler
    };
  }, [
    __unstableResolvedAssets,
    colors,
    gradients,
    __experimentalDiscussionSettings,
    mediaUploadHandler
  ]);
  return { serverCSS, serverSettings, fontLibraryEnabled };
}
function GlobalStylesUIWrapper({
  path,
  onPathChange,
  settings
}) {
  const {
    user: userConfig,
    base: baseConfig,
    setUser: setUserConfig,
    isReady
  } = (0, import_hooks.useGlobalStyles)();
  const { serverCSS, serverSettings, fontLibraryEnabled } = useServerData(settings);
  if (!isReady) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_global_styles_ui.GlobalStylesUI,
      {
        value: userConfig,
        baseValue: baseConfig || {},
        onChange: setUserConfig,
        path,
        onPathChange,
        fontLibraryEnabled,
        serverCSS,
        serverSettings
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_block_link.GlobalStylesBlockLink,
      {
        path,
        onPathChange
      }
    )
  ] });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useGlobalStyles,
  useSetting,
  useStyle
});
//# sourceMappingURL=index.cjs.map
