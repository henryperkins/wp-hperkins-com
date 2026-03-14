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

// packages/global-styles-ui/src/global-styles-ui.tsx
var global_styles_ui_exports = {};
__export(global_styles_ui_exports, {
  GlobalStylesUI: () => GlobalStylesUI
});
module.exports = __toCommonJS(global_styles_ui_exports);
var import_components = require("@wordpress/components");
var import_blocks = require("@wordpress/blocks");
var import_data = require("@wordpress/data");
var import_block_editor = require("@wordpress/block-editor");
var import_element = require("@wordpress/element");
var import_compose = require("@wordpress/compose");
var import_global_styles_engine = require("@wordpress/global-styles-engine");
var import_provider = require("./provider.cjs");
var import_screen_root = __toESM(require("./screen-root.cjs"));
var import_screen_block_list = __toESM(require("./screen-block-list.cjs"));
var import_screen_block = __toESM(require("./screen-block.cjs"));
var import_screen_typography = __toESM(require("./screen-typography.cjs"));
var import_screen_typography_element = __toESM(require("./screen-typography-element.cjs"));
var import_screen_colors = __toESM(require("./screen-colors.cjs"));
var import_screen_color_palette = __toESM(require("./screen-color-palette.cjs"));
var import_screen_background = __toESM(require("./screen-background.cjs"));
var import_screen_shadows = require("./screen-shadows.cjs");
var import_screen_layout = __toESM(require("./screen-layout.cjs"));
var import_screen_style_variations = __toESM(require("./screen-style-variations.cjs"));
var import_screen_css = __toESM(require("./screen-css.cjs"));
var import_screen_revisions = __toESM(require("./screen-revisions/index.cjs"));
var import_font_sizes = __toESM(require("./font-sizes/font-sizes.cjs"));
var import_font_size = __toESM(require("./font-sizes/font-size.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function BlockStylesNavigationScreens({
  parentMenu,
  blockStyles,
  blockName
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: blockStyles.map((style, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Navigator.Screen,
    {
      path: parentMenu + "/variations/" + style.name,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_screen_block.default, { name: blockName, variation: style.name })
    },
    index
  )) });
}
function ContextScreens({ name, parentMenu = "" }) {
  const blockStyleVariations = (0, import_data.useSelect)(
    (select) => {
      if (!name) {
        return [];
      }
      const { getBlockStyles } = select(import_blocks.store);
      return getBlockStyles(name);
    },
    [name]
  );
  if (!blockStyleVariations?.length) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
  const blocks = (0, import_blocks.getBlockTypes)();
  const mergedValue = (0, import_element.useMemo)(() => {
    return (0, import_global_styles_engine.mergeGlobalStyles)(baseValue, value);
  }, [baseValue, value]);
  const [globalStylesCSS, globalSettings] = (0, import_global_styles_engine.generateGlobalStyles)(
    mergedValue,
    [],
    {
      styleOptions: { variationStyles: true }
    }
  );
  const styles = (0, import_element.useMemo)(
    () => [...serverCSS ?? [], ...globalStylesCSS ?? []],
    [serverCSS, globalStylesCSS]
  );
  const settings = (0, import_element.useMemo)(() => {
    return {
      ...serverSettings,
      __experimentalFeatures: globalSettings,
      styles
    };
  }, [globalSettings, serverSettings, styles]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_provider.GlobalStylesProvider,
    {
      value,
      baseValue,
      onChange,
      fontLibraryEnabled,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockEditorProvider, { settings, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        import_components.Navigator,
        {
          className: "global-styles-ui-sidebar__navigator-provider",
          initialPath: path || "/",
          children: [
            (path || onPathChange) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              PathSynchronizer,
              {
                path,
                onPathChange
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobalStylesNavigationScreen, { path: "/", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_screen_root.default, {}) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobalStylesNavigationScreen, { path: "/colors", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_screen_colors.default, {}) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobalStylesNavigationScreen, { path: "/typography", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_screen_typography.default, {}) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobalStylesNavigationScreen, { path: "/typography/font-sizes", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_font_sizes.default, {}) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobalStylesNavigationScreen, { path: "/typography/font-sizes/:origin/:slug", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_font_size.default, {}) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobalStylesNavigationScreen, { path: "/layout", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_screen_layout.default, {}) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobalStylesNavigationScreen, { path: "/colors/palette", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_screen_color_palette.default, {}) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobalStylesNavigationScreen, { path: "/variations", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_screen_style_variations.default, {}) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobalStylesNavigationScreen, { path: "/css", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_screen_css.default, {}) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobalStylesNavigationScreen, { path: "/revisions/:revisionId?", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_screen_revisions.default, {}) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobalStylesNavigationScreen, { path: "/shadows", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_screen_shadows.ScreenShadows, {}) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobalStylesNavigationScreen, { path: "/shadows/edit/:category/:slug", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_screen_shadows.ScreenShadowsEdit, {}) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobalStylesNavigationScreen, { path: "/background", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_screen_background.default, {}) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobalStylesNavigationScreen, { path: "/typography/text", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_screen_typography_element.default, { element: "text" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobalStylesNavigationScreen, { path: "/typography/link", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_screen_typography_element.default, { element: "link" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobalStylesNavigationScreen, { path: "/typography/heading", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_screen_typography_element.default, { element: "heading" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobalStylesNavigationScreen, { path: "/typography/caption", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_screen_typography_element.default, { element: "caption" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobalStylesNavigationScreen, { path: "/typography/button", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_screen_typography_element.default, { element: "button" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobalStylesNavigationScreen, { path: "/blocks", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_screen_block_list.default, {}) }),
            blocks.map((block) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_element.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                GlobalStylesNavigationScreen,
                {
                  path: "/blocks/" + encodeURIComponent(block.name),
                  children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_screen_block.default, { name: block.name })
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Navigator.Screen,
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
  const navigator = (0, import_components.useNavigator)();
  const { path: childPath } = navigator.location;
  const previousParentPath = (0, import_compose.usePrevious)(path);
  const previousChildPath = (0, import_compose.usePrevious)(childPath);
  (0, import_element.useEffect)(() => {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GlobalStylesUI
});
//# sourceMappingURL=global-styles-ui.cjs.map
