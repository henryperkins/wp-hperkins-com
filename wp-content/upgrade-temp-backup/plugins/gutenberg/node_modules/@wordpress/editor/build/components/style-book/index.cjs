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

// packages/editor/src/components/style-book/index.js
var style_book_exports = {};
__export(style_book_exports, {
  StyleBookBody: () => StyleBookBody,
  StyleBookPreview: () => StyleBookPreview,
  default: () => style_book_default,
  getExamplesForSinglePageUse: () => getExamplesForSinglePageUse
});
module.exports = __toCommonJS(style_book_exports);
var import_clsx = __toESM(require("clsx"));
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_block_editor = require("@wordpress/block-editor");
var import_data = require("@wordpress/data");
var import_global_styles_engine = require("@wordpress/global-styles-engine");
var import_element = require("@wordpress/element");
var import_keycodes = require("@wordpress/keycodes");
var import_media_utils = require("@wordpress/media-utils");
var import_core_data = require("@wordpress/core-data");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_constants = require("./constants.cjs");
var import_categories = require("./categories.cjs");
var import_examples = require("./examples.cjs");
var import_global_styles_renderer = require("../global-styles-renderer/index.cjs");
var import_constants2 = require("./constants.cjs");
var import_use_global_styles_output = require("../../hooks/use-global-styles-output.cjs");
var import_global_styles = require("../global-styles/index.cjs");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { ExperimentalBlockEditorProvider } = (0, import_lock_unlock.unlock)(import_block_editor.privateApis);
var { Tabs } = (0, import_lock_unlock.unlock)(import_components.privateApis);
function isObjectEmpty(object) {
  return !object || Object.keys(object).length === 0;
}
var scrollToSection = (anchorId, iframe) => {
  if (!anchorId || !iframe || !iframe?.contentDocument) {
    return;
  }
  const element = anchorId === "top" ? iframe.contentDocument.body : iframe.contentDocument.getElementById(anchorId);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth"
    });
  }
};
var getStyleBookNavigationFromPath = (path) => {
  if (path && typeof path === "string") {
    if (path === "/" || path.startsWith("/typography") || path.startsWith("/colors") || path.startsWith("/blocks")) {
      return {
        top: true
      };
    }
  }
  return null;
};
function useMultiOriginPalettes() {
  const { colors, gradients } = (0, import_block_editor.__experimentalUseMultipleOriginColorsAndGradients)();
  const [
    shouldDisplayDefaultDuotones,
    customDuotones,
    themeDuotones,
    defaultDuotones
  ] = (0, import_block_editor.useSettings)(
    "color.defaultDuotone",
    "color.duotone.custom",
    "color.duotone.theme",
    "color.duotone.default"
  );
  const palettes = (0, import_element.useMemo)(() => {
    const result = { colors, gradients, duotones: [] };
    if (themeDuotones && themeDuotones.length) {
      result.duotones.push({
        name: (0, import_i18n._x)(
          "Theme",
          "Indicates these duotone filters come from the theme."
        ),
        slug: "theme",
        duotones: themeDuotones
      });
    }
    if (shouldDisplayDefaultDuotones && defaultDuotones && defaultDuotones.length) {
      result.duotones.push({
        name: (0, import_i18n._x)(
          "Default",
          "Indicates these duotone filters come from WordPress."
        ),
        slug: "default",
        duotones: defaultDuotones
      });
    }
    if (customDuotones && customDuotones.length) {
      result.duotones.push({
        name: (0, import_i18n._x)(
          "Custom",
          "Indicates these doutone filters are created by the user."
        ),
        slug: "custom",
        duotones: customDuotones
      });
    }
    return result;
  }, [
    colors,
    gradients,
    customDuotones,
    themeDuotones,
    defaultDuotones,
    shouldDisplayDefaultDuotones
  ]);
  return palettes;
}
function getExamplesForSinglePageUse(examples) {
  const examplesForSinglePageUse = [];
  const overviewCategoryExamples = (0, import_categories.getExamplesByCategory)(
    { slug: "overview" },
    examples
  );
  examplesForSinglePageUse.push(...overviewCategoryExamples.examples);
  const otherExamples = examples.filter((example) => {
    return example.category !== "overview" && !overviewCategoryExamples.examples.find(
      (overviewExample) => overviewExample.name === example.name
    );
  });
  examplesForSinglePageUse.push(...otherExamples);
  return examplesForSinglePageUse;
}
function applyBlockVariationsToExamples(examples, variation) {
  if (!variation) {
    return examples;
  }
  return examples.map((example) => {
    return {
      ...example,
      variation,
      blocks: Array.isArray(example.blocks) ? example.blocks.map((block) => ({
        ...block,
        attributes: {
          ...block.attributes,
          style: void 0,
          className: `is-style-${variation}`
        }
      })) : {
        ...example.blocks,
        attributes: {
          ...example.blocks.attributes,
          style: void 0,
          className: `is-style-${variation}`
        }
      }
    };
  });
}
function StyleBook({
  isSelected,
  onClick,
  onSelect,
  showTabs = true,
  userConfig = {},
  path = ""
}, ref) {
  const textColor = (0, import_global_styles.useStyle)("color.text");
  const backgroundColor = (0, import_global_styles.useStyle)("color.background");
  const colors = useMultiOriginPalettes();
  const examples = (0, import_element.useMemo)(() => (0, import_examples.getExamples)(colors), [colors]);
  const tabs = (0, import_element.useMemo)(
    () => (0, import_categories.getTopLevelStyleBookCategories)().filter(
      (category) => examples.some(
        (example) => example.category === category.slug
      )
    ),
    [examples]
  );
  const examplesForSinglePageUse = getExamplesForSinglePageUse(examples);
  const { base: baseConfig } = (0, import_global_styles.useGlobalStyles)();
  const goTo = getStyleBookNavigationFromPath(path);
  const mergedConfig = (0, import_element.useMemo)(() => {
    if (!isObjectEmpty(userConfig) && !isObjectEmpty(baseConfig)) {
      return (0, import_global_styles_engine.mergeGlobalStyles)(baseConfig, userConfig);
    }
    return {};
  }, [baseConfig, userConfig]);
  const originalSettings = (0, import_data.useSelect)(
    (select) => select(import_block_editor.store).getSettings(),
    []
  );
  const [globalStyles] = (0, import_use_global_styles_output.useGlobalStylesOutputWithConfig)(mergedConfig);
  const settings = (0, import_element.useMemo)(
    () => ({
      ...originalSettings,
      styles: !isObjectEmpty(globalStyles) && !isObjectEmpty(userConfig) ? globalStyles : originalSettings.styles,
      isPreviewMode: true
    }),
    [globalStyles, originalSettings, userConfig]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "div",
    {
      ref,
      className: (0, import_clsx.default)("editor-style-book", {
        "is-button": !!onClick
      }),
      style: {
        color: textColor,
        background: backgroundColor
      },
      children: showTabs ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "editor-style-book__tablist-container", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs.TabList, { children: tabs.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs.Tab, { tabId: tab.slug, children: tab.title }, tab.slug)) }) }),
        tabs.map((tab) => {
          const categoryDefinition = tab.slug ? (0, import_categories.getTopLevelStyleBookCategories)().find(
            (_category) => _category.slug === tab.slug
          ) : null;
          const filteredExamples = categoryDefinition ? (0, import_categories.getExamplesByCategory)(
            categoryDefinition,
            examples
          ) : { examples };
          return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            Tabs.TabPanel,
            {
              tabId: tab.slug,
              focusable: false,
              className: "editor-style-book__tabpanel",
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                StyleBookBody,
                {
                  category: tab.slug,
                  examples: filteredExamples,
                  isSelected,
                  onSelect,
                  settings,
                  title: tab.title,
                  goTo
                }
              )
            },
            tab.slug
          );
        })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        StyleBookBody,
        {
          examples: { examples: examplesForSinglePageUse },
          isSelected,
          onClick,
          onSelect,
          settings,
          goTo
        }
      )
    }
  );
}
var StyleBookPreview = ({
  userConfig = {},
  isStatic = false,
  path,
  onPathChange
}) => {
  const editorSettings = (0, import_data.useSelect)(
    (select) => select(import_store.store).getEditorSettings(),
    []
  );
  const canUserUploadMedia = (0, import_data.useSelect)(
    (select) => select(import_core_data.store).canUser("create", {
      kind: "postType",
      name: "attachment"
    }),
    []
  );
  (0, import_element.useEffect)(() => {
    (0, import_data.dispatch)(import_block_editor.store).updateSettings({
      ...editorSettings,
      mediaUpload: canUserUploadMedia ? import_media_utils.uploadMedia : void 0
    });
  }, [editorSettings, canUserUploadMedia]);
  const [internalPath, setInternalPath] = (0, import_element.useState)("/");
  const section = path ?? internalPath;
  const onChangeSection = onPathChange ?? setInternalPath;
  const isSelected = (blockName) => {
    return section === `/blocks/${encodeURIComponent(blockName)}` || section.startsWith(
      `/blocks/${encodeURIComponent(blockName)}/`
    );
  };
  const onSelect = (blockName, isBlockVariation = false) => {
    if (import_constants2.STYLE_BOOK_COLOR_GROUPS.find(
      (group) => group.slug === blockName
    )) {
      onChangeSection("/colors/palette");
      return;
    }
    if (blockName === "typography") {
      onChangeSection("/typography");
      return;
    }
    if (isBlockVariation) {
      return;
    }
    onChangeSection(`/blocks/${encodeURIComponent(blockName)}`);
  };
  const colors = useMultiOriginPalettes();
  const examples = (0, import_examples.getExamples)(colors);
  const examplesForSinglePageUse = getExamplesForSinglePageUse(examples);
  let previewCategory = null;
  let blockVariation = null;
  if (section.includes("/colors")) {
    previewCategory = "colors";
  } else if (section.includes("/typography")) {
    previewCategory = "text";
  } else if (section.includes("/blocks")) {
    previewCategory = "blocks";
    let blockName = decodeURIComponent(section).split("/blocks/")[1];
    if (blockName?.includes("/variations")) {
      [blockName, blockVariation] = blockName.split("/variations/");
    }
    if (blockName && examples.find((example) => example.name === blockName)) {
      previewCategory = blockName;
    }
  } else if (!isStatic) {
    previewCategory = "overview";
  }
  const categoryDefinition = import_constants2.STYLE_BOOK_PREVIEW_CATEGORIES.find(
    (category) => category.slug === previewCategory
  );
  const filteredExamples = (0, import_element.useMemo)(() => {
    if (!categoryDefinition) {
      return {
        examples: [
          examples.find(
            (example) => example.name === previewCategory
          )
        ]
      };
    }
    return (0, import_categories.getExamplesByCategory)(categoryDefinition, examples);
  }, [categoryDefinition, examples, previewCategory]);
  const displayedExamples = (0, import_element.useMemo)(() => {
    if (!previewCategory) {
      return { examples: examplesForSinglePageUse };
    }
    if (blockVariation) {
      return {
        examples: applyBlockVariationsToExamples(
          filteredExamples.examples,
          blockVariation
        )
      };
    }
    return filteredExamples;
  }, [
    previewCategory,
    examplesForSinglePageUse,
    blockVariation,
    filteredExamples
  ]);
  const { base: baseConfig } = (0, import_global_styles.useGlobalStyles)();
  const goTo = getStyleBookNavigationFromPath(section);
  const mergedConfig = (0, import_element.useMemo)(() => {
    if (!isObjectEmpty(userConfig) && !isObjectEmpty(baseConfig)) {
      return (0, import_global_styles_engine.mergeGlobalStyles)(baseConfig, userConfig);
    }
    return {};
  }, [baseConfig, userConfig]);
  const [globalStyles] = (0, import_use_global_styles_output.useGlobalStylesOutputWithConfig)(mergedConfig);
  const settings = (0, import_element.useMemo)(
    () => ({
      ...editorSettings,
      styles: !isObjectEmpty(globalStyles) && !isObjectEmpty(userConfig) ? globalStyles : editorSettings.styles,
      isPreviewMode: true
    }),
    [globalStyles, editorSettings, userConfig]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "editor-style-book", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_block_editor.BlockEditorProvider, { settings, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_global_styles_renderer.GlobalStylesRenderer, { disableRootPadding: true }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      StyleBookBody,
      {
        examples: displayedExamples,
        settings,
        goTo,
        isSelected: !isStatic ? isSelected : null,
        onSelect: !isStatic ? onSelect : null
      }
    )
  ] }) });
};
var StyleBookBody = ({
  examples,
  isSelected,
  onClick,
  onSelect,
  settings,
  title,
  goTo
}) => {
  const [isFocused, setIsFocused] = (0, import_element.useState)(false);
  const [hasIframeLoaded, setHasIframeLoaded] = (0, import_element.useState)(false);
  const iframeRef = (0, import_element.useRef)(null);
  const buttonModeProps = {
    role: "button",
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    onKeyDown: (event) => {
      if (event.defaultPrevented) {
        return;
      }
      const { keyCode } = event;
      if (onClick && (keyCode === import_keycodes.ENTER || keyCode === import_keycodes.SPACE)) {
        event.preventDefault();
        onClick(event);
      }
    },
    onClick: (event) => {
      if (event.defaultPrevented) {
        return;
      }
      if (onClick) {
        event.preventDefault();
        onClick(event);
      }
    },
    readonly: true
  };
  const handleLoad = () => setHasIframeLoaded(true);
  (0, import_element.useLayoutEffect)(() => {
    if (hasIframeLoaded && iframeRef.current && goTo?.top) {
      scrollToSection("top", iframeRef.current);
    }
  }, [goTo?.top, hasIframeLoaded]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_block_editor.__unstableIframe,
    {
      onLoad: handleLoad,
      ref: iframeRef,
      className: (0, import_clsx.default)("editor-style-book__iframe", {
        "is-focused": isFocused && !!onClick,
        "is-button": !!onClick
      }),
      name: "style-book-canvas",
      tabIndex: 0,
      ...onClick ? buttonModeProps : {},
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.__unstableEditorStyles, { styles: settings.styles }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("style", { children: [
          import_constants.STYLE_BOOK_IFRAME_STYLES,
          !!onClick && "body { cursor: pointer; } body * { pointer-events: none; }"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          Examples,
          {
            className: "editor-style-book__examples",
            filteredExamples: examples,
            label: title ? (0, import_i18n.sprintf)(
              // translators: %s: Category of blocks, e.g. Text.
              (0, import_i18n.__)("Examples of blocks in the %s category"),
              title
            ) : (0, import_i18n.__)("Examples of blocks"),
            isSelected,
            onSelect
          },
          title
        )
      ]
    }
  );
};
var Examples = (0, import_element.memo)(
  ({ className, filteredExamples, label, isSelected, onSelect }) => {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      import_components.Composite,
      {
        orientation: "vertical",
        className,
        "aria-label": label,
        role: "grid",
        children: [
          !!filteredExamples?.examples?.length && filteredExamples.examples.map((example) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            Example,
            {
              id: `example-${example.name}`,
              title: example.title,
              content: example.content,
              blocks: example.blocks,
              isSelected: isSelected?.(example.name),
              onClick: !!onSelect ? () => onSelect(
                example.name,
                !!example.variation
              ) : null
            },
            example.name
          )),
          !!filteredExamples?.subcategories?.length && filteredExamples.subcategories.map((subcategory) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            import_components.Composite.Group,
            {
              className: "editor-style-book__subcategory",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Composite.GroupLabel, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "editor-style-book__subcategory-title", children: subcategory.title }) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Subcategory,
                  {
                    examples: subcategory.examples,
                    isSelected,
                    onSelect
                  }
                )
              ]
            },
            `subcategory-${subcategory.slug}`
          ))
        ]
      }
    );
  }
);
var Subcategory = ({ examples, isSelected, onSelect }) => {
  return !!examples?.length && examples.map((example) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    Example,
    {
      id: `example-${example.name}`,
      title: example.title,
      content: example.content,
      blocks: example.blocks,
      isSelected: isSelected?.(example.name),
      onClick: !!onSelect ? () => onSelect(example.name) : null
    },
    example.name
  ));
};
var disabledExamples = ["example-duotones"];
var Example = ({ id, title, blocks, isSelected, onClick, content }) => {
  const originalSettings = (0, import_data.useSelect)(
    (select) => select(import_block_editor.store).getSettings(),
    []
  );
  const settings = (0, import_element.useMemo)(
    () => ({
      ...originalSettings,
      focusMode: false,
      // Disable "Spotlight mode".
      isPreviewMode: true
    }),
    [originalSettings]
  );
  const renderedBlocks = (0, import_element.useMemo)(
    () => Array.isArray(blocks) ? blocks : [blocks],
    [blocks]
  );
  const disabledProps = disabledExamples.includes(id) || !onClick ? {
    disabled: true,
    accessibleWhenDisabled: !!onClick
  } : {};
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { role: "row", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { role: "gridcell", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.Composite.Item,
    {
      className: (0, import_clsx.default)("editor-style-book__example", {
        "is-selected": isSelected,
        "is-disabled-example": !!disabledProps?.disabled
      }),
      id,
      "aria-label": !!onClick ? (0, import_i18n.sprintf)(
        // translators: %s: Title of a block, e.g. Heading.
        (0, import_i18n.__)("Open %s styles in Styles panel"),
        title
      ) : void 0,
      render: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}),
      role: !!onClick ? "button" : null,
      onClick,
      ...disabledProps,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "editor-style-book__example-title", children: title }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "div",
          {
            className: "editor-style-book__example-preview",
            "aria-hidden": true,
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Disabled, { className: "editor-style-book__example-preview__content", children: content ? content : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              ExperimentalBlockEditorProvider,
              {
                value: renderedBlocks,
                settings,
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.__unstableEditorStyles, {}),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockList, { renderAppender: false })
                ]
              }
            ) })
          }
        )
      ]
    }
  ) }) });
};
var style_book_default = (0, import_element.forwardRef)(StyleBook);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  StyleBookBody,
  StyleBookPreview,
  getExamplesForSinglePageUse
});
//# sourceMappingURL=index.cjs.map
