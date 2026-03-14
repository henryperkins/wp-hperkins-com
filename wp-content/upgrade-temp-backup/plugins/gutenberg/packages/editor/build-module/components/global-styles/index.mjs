// packages/editor/src/components/global-styles/index.js
import { store as coreStore } from "@wordpress/core-data";
import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { GlobalStylesUI } from "@wordpress/global-styles-ui";
import { uploadMedia } from "@wordpress/media-utils";
import { GlobalStylesBlockLink } from "./block-link.mjs";
import { useGlobalStyles } from "./hooks.mjs";
import { useGlobalStyles as useGlobalStyles2, useStyle, useSetting } from "./hooks.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function useServerData(settings) {
  const styles = settings?.styles;
  const __unstableResolvedAssets = settings?.__unstableResolvedAssets;
  const colors = settings?.colors;
  const gradients = settings?.gradients;
  const __experimentalDiscussionSettings = settings?.__experimentalDiscussionSettings;
  const fontLibraryEnabled = settings?.fontLibraryEnabled ?? true;
  const mediaUploadHandler = useSelect((select) => {
    const { canUser } = select(coreStore);
    const canUserUploadMedia = canUser("create", {
      kind: "postType",
      name: "attachment"
    });
    return canUserUploadMedia ? uploadMedia : void 0;
  }, []);
  const serverCSS = useMemo(() => {
    if (!styles) {
      return [];
    }
    return styles.filter((style) => !style.isGlobalStyles);
  }, [styles]);
  const serverSettings = useMemo(() => {
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
  } = useGlobalStyles();
  const { serverCSS, serverSettings, fontLibraryEnabled } = useServerData(settings);
  if (!isReady) {
    return null;
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      GlobalStylesUI,
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
    /* @__PURE__ */ jsx(
      GlobalStylesBlockLink,
      {
        path,
        onPathChange
      }
    )
  ] });
}
export {
  GlobalStylesUIWrapper as default,
  useGlobalStyles2 as useGlobalStyles,
  useSetting,
  useStyle
};
//# sourceMappingURL=index.mjs.map
