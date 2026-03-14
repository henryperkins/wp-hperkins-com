// packages/global-styles-ui/src/global-styles-ui.tsx
import { Navigator, useNavigator } from "@wordpress/components";
import { getBlockTypes, store as blocksStore } from "@wordpress/blocks";
import { useSelect } from "@wordpress/data";
import { BlockEditorProvider } from "@wordpress/block-editor";
import { useMemo, useEffect, Fragment } from "@wordpress/element";
import { usePrevious } from "@wordpress/compose";
import {
  generateGlobalStyles,
  mergeGlobalStyles
} from "@wordpress/global-styles-engine";
import { GlobalStylesProvider } from "./provider.mjs";
import ScreenRoot from "./screen-root.mjs";
import ScreenBlockList from "./screen-block-list.mjs";
import ScreenBlock from "./screen-block.mjs";
import ScreenTypography from "./screen-typography.mjs";
import ScreenTypographyElement from "./screen-typography-element.mjs";
import ScreenColors from "./screen-colors.mjs";
import ScreenColorPalette from "./screen-color-palette.mjs";
import ScreenBackground from "./screen-background.mjs";
import { ScreenShadows, ScreenShadowsEdit } from "./screen-shadows.mjs";
import ScreenLayout from "./screen-layout.mjs";
import ScreenStyleVariations from "./screen-style-variations.mjs";
import ScreenCSS from "./screen-css.mjs";
import ScreenRevisions from "./screen-revisions/index.mjs";
import FontSizes from "./font-sizes/font-sizes.mjs";
import FontSize from "./font-sizes/font-size.mjs";
import { Fragment as Fragment2, jsx, jsxs } from "react/jsx-runtime";
function BlockStylesNavigationScreens({
  parentMenu,
  blockStyles,
  blockName
}) {
  return /* @__PURE__ */ jsx(Fragment2, { children: blockStyles.map((style, index) => /* @__PURE__ */ jsx(
    Navigator.Screen,
    {
      path: parentMenu + "/variations/" + style.name,
      children: /* @__PURE__ */ jsx(ScreenBlock, { name: blockName, variation: style.name })
    },
    index
  )) });
}
function ContextScreens({ name, parentMenu = "" }) {
  const blockStyleVariations = useSelect(
    (select) => {
      if (!name) {
        return [];
      }
      const { getBlockStyles } = select(blocksStore);
      return getBlockStyles(name);
    },
    [name]
  );
  if (!blockStyleVariations?.length) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    BlockStylesNavigationScreens,
    {
      parentMenu,
      blockStyles: blockStyleVariations,
      blockName: name || ""
    }
  );
}
function GlobalStylesUI({
  value,
  baseValue,
  onChange,
  path,
  onPathChange,
  fontLibraryEnabled = false,
  serverCSS,
  serverSettings
}) {
  const blocks = getBlockTypes();
  const mergedValue = useMemo(() => {
    return mergeGlobalStyles(baseValue, value);
  }, [baseValue, value]);
  const [globalStylesCSS, globalSettings] = generateGlobalStyles(
    mergedValue,
    [],
    {
      styleOptions: { variationStyles: true }
    }
  );
  const styles = useMemo(
    () => [...serverCSS ?? [], ...globalStylesCSS ?? []],
    [serverCSS, globalStylesCSS]
  );
  const settings = useMemo(() => {
    return {
      ...serverSettings,
      __experimentalFeatures: globalSettings,
      styles
    };
  }, [globalSettings, serverSettings, styles]);
  return /* @__PURE__ */ jsx(
    GlobalStylesProvider,
    {
      value,
      baseValue,
      onChange,
      fontLibraryEnabled,
      children: /* @__PURE__ */ jsx(BlockEditorProvider, { settings, children: /* @__PURE__ */ jsxs(
        Navigator,
        {
          className: "global-styles-ui-sidebar__navigator-provider",
          initialPath: path || "/",
          children: [
            (path || onPathChange) && /* @__PURE__ */ jsx(
              PathSynchronizer,
              {
                path,
                onPathChange
              }
            ),
            /* @__PURE__ */ jsx(GlobalStylesNavigationScreen, { path: "/", children: /* @__PURE__ */ jsx(ScreenRoot, {}) }),
            /* @__PURE__ */ jsx(GlobalStylesNavigationScreen, { path: "/colors", children: /* @__PURE__ */ jsx(ScreenColors, {}) }),
            /* @__PURE__ */ jsx(GlobalStylesNavigationScreen, { path: "/typography", children: /* @__PURE__ */ jsx(ScreenTypography, {}) }),
            /* @__PURE__ */ jsx(GlobalStylesNavigationScreen, { path: "/typography/font-sizes", children: /* @__PURE__ */ jsx(FontSizes, {}) }),
            /* @__PURE__ */ jsx(GlobalStylesNavigationScreen, { path: "/typography/font-sizes/:origin/:slug", children: /* @__PURE__ */ jsx(FontSize, {}) }),
            /* @__PURE__ */ jsx(GlobalStylesNavigationScreen, { path: "/layout", children: /* @__PURE__ */ jsx(ScreenLayout, {}) }),
            /* @__PURE__ */ jsx(GlobalStylesNavigationScreen, { path: "/colors/palette", children: /* @__PURE__ */ jsx(ScreenColorPalette, {}) }),
            /* @__PURE__ */ jsx(GlobalStylesNavigationScreen, { path: "/variations", children: /* @__PURE__ */ jsx(ScreenStyleVariations, {}) }),
            /* @__PURE__ */ jsx(GlobalStylesNavigationScreen, { path: "/css", children: /* @__PURE__ */ jsx(ScreenCSS, {}) }),
            /* @__PURE__ */ jsx(GlobalStylesNavigationScreen, { path: "/revisions/:revisionId?", children: /* @__PURE__ */ jsx(ScreenRevisions, {}) }),
            /* @__PURE__ */ jsx(GlobalStylesNavigationScreen, { path: "/shadows", children: /* @__PURE__ */ jsx(ScreenShadows, {}) }),
            /* @__PURE__ */ jsx(GlobalStylesNavigationScreen, { path: "/shadows/edit/:category/:slug", children: /* @__PURE__ */ jsx(ScreenShadowsEdit, {}) }),
            /* @__PURE__ */ jsx(GlobalStylesNavigationScreen, { path: "/background", children: /* @__PURE__ */ jsx(ScreenBackground, {}) }),
            /* @__PURE__ */ jsx(GlobalStylesNavigationScreen, { path: "/typography/text", children: /* @__PURE__ */ jsx(ScreenTypographyElement, { element: "text" }) }),
            /* @__PURE__ */ jsx(GlobalStylesNavigationScreen, { path: "/typography/link", children: /* @__PURE__ */ jsx(ScreenTypographyElement, { element: "link" }) }),
            /* @__PURE__ */ jsx(GlobalStylesNavigationScreen, { path: "/typography/heading", children: /* @__PURE__ */ jsx(ScreenTypographyElement, { element: "heading" }) }),
            /* @__PURE__ */ jsx(GlobalStylesNavigationScreen, { path: "/typography/caption", children: /* @__PURE__ */ jsx(ScreenTypographyElement, { element: "caption" }) }),
            /* @__PURE__ */ jsx(GlobalStylesNavigationScreen, { path: "/typography/button", children: /* @__PURE__ */ jsx(ScreenTypographyElement, { element: "button" }) }),
            /* @__PURE__ */ jsx(GlobalStylesNavigationScreen, { path: "/blocks", children: /* @__PURE__ */ jsx(ScreenBlockList, {}) }),
            blocks.map((block) => /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(
                GlobalStylesNavigationScreen,
                {
                  path: "/blocks/" + encodeURIComponent(block.name),
                  children: /* @__PURE__ */ jsx(ScreenBlock, { name: block.name })
                }
              ),
              /* @__PURE__ */ jsx(
                ContextScreens,
                {
                  name: block.name,
                  parentMenu: "/blocks/" + encodeURIComponent(block.name)
                }
              )
            ] }, block.name))
          ]
        }
      ) })
    }
  );
}
function GlobalStylesNavigationScreen({
  path,
  children
}) {
  return /* @__PURE__ */ jsx(
    Navigator.Screen,
    {
      className: "global-styles-ui-sidebar__navigator-screen",
      path,
      children
    }
  );
}
function PathSynchronizer({
  path,
  onPathChange
}) {
  const navigator = useNavigator();
  const { path: childPath } = navigator.location;
  const previousParentPath = usePrevious(path);
  const previousChildPath = usePrevious(childPath);
  useEffect(() => {
    if (path && path !== childPath) {
      if (path !== previousParentPath) {
        navigator.goTo(path);
      } else if (childPath !== previousChildPath && onPathChange) {
        onPathChange(childPath ?? "/");
      }
    }
  }, [
    onPathChange,
    path,
    previousChildPath,
    previousParentPath,
    childPath,
    navigator
  ]);
  return null;
}
export {
  GlobalStylesUI
};
//# sourceMappingURL=global-styles-ui.mjs.map
