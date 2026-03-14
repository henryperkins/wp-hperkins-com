// packages/editor/src/components/style-book/index.js
import clsx from "clsx";
import {
  Disabled,
  Composite,
  privateApis as componentsPrivateApis
} from "@wordpress/components";
import { __, _x, sprintf } from "@wordpress/i18n";
import {
  BlockList,
  privateApis as blockEditorPrivateApis,
  store as blockEditorStore,
  useSettings,
  BlockEditorProvider,
  __unstableEditorStyles as EditorStyles,
  __unstableIframe as Iframe,
  __experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients
} from "@wordpress/block-editor";
import { useSelect, dispatch } from "@wordpress/data";
import { mergeGlobalStyles } from "@wordpress/global-styles-engine";
import {
  useMemo,
  useState,
  memo,
  useRef,
  useLayoutEffect,
  useEffect,
  forwardRef
} from "@wordpress/element";
import { ENTER, SPACE } from "@wordpress/keycodes";
import { uploadMedia } from "@wordpress/media-utils";
import { store as coreStore } from "@wordpress/core-data";
import { unlock } from "../../lock-unlock.mjs";
import { STYLE_BOOK_IFRAME_STYLES } from "./constants.mjs";
import {
  getExamplesByCategory,
  getTopLevelStyleBookCategories
} from "./categories.mjs";
import { getExamples } from "./examples.mjs";
import { GlobalStylesRenderer } from "../global-styles-renderer/index.mjs";
import {
  STYLE_BOOK_COLOR_GROUPS,
  STYLE_BOOK_PREVIEW_CATEGORIES
} from "./constants.mjs";
import { useGlobalStylesOutputWithConfig } from "../../hooks/use-global-styles-output.mjs";
import { useStyle, useGlobalStyles } from "../global-styles/index.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var { ExperimentalBlockEditorProvider } = unlock(blockEditorPrivateApis);
var { Tabs } = unlock(componentsPrivateApis);
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
  const { colors, gradients } = useMultipleOriginColorsAndGradients();
  const [
    shouldDisplayDefaultDuotones,
    customDuotones,
    themeDuotones,
    defaultDuotones
  ] = useSettings(
    "color.defaultDuotone",
    "color.duotone.custom",
    "color.duotone.theme",
    "color.duotone.default"
  );
  const palettes = useMemo(() => {
    const result = { colors, gradients, duotones: [] };
    if (themeDuotones && themeDuotones.length) {
      result.duotones.push({
        name: _x(
          "Theme",
          "Indicates these duotone filters come from the theme."
        ),
        slug: "theme",
        duotones: themeDuotones
      });
    }
    if (shouldDisplayDefaultDuotones && defaultDuotones && defaultDuotones.length) {
      result.duotones.push({
        name: _x(
          "Default",
          "Indicates these duotone filters come from WordPress."
        ),
        slug: "default",
        duotones: defaultDuotones
      });
    }
    if (customDuotones && customDuotones.length) {
      result.duotones.push({
        name: _x(
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
  const overviewCategoryExamples = getExamplesByCategory(
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
  const textColor = useStyle("color.text");
  const backgroundColor = useStyle("color.background");
  const colors = useMultiOriginPalettes();
  const examples = useMemo(() => getExamples(colors), [colors]);
  const tabs = useMemo(
    () => getTopLevelStyleBookCategories().filter(
      (category) => examples.some(
        (example) => example.category === category.slug
      )
    ),
    [examples]
  );
  const examplesForSinglePageUse = getExamplesForSinglePageUse(examples);
  const { base: baseConfig } = useGlobalStyles();
  const goTo = getStyleBookNavigationFromPath(path);
  const mergedConfig = useMemo(() => {
    if (!isObjectEmpty(userConfig) && !isObjectEmpty(baseConfig)) {
      return mergeGlobalStyles(baseConfig, userConfig);
    }
    return {};
  }, [baseConfig, userConfig]);
  const originalSettings = useSelect(
    (select) => select(blockEditorStore).getSettings(),
    []
  );
  const [globalStyles] = useGlobalStylesOutputWithConfig(mergedConfig);
  const settings = useMemo(
    () => ({
      ...originalSettings,
      styles: !isObjectEmpty(globalStyles) && !isObjectEmpty(userConfig) ? globalStyles : originalSettings.styles,
      isPreviewMode: true
    }),
    [globalStyles, originalSettings, userConfig]
  );
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: clsx("editor-style-book", {
        "is-button": !!onClick
      }),
      style: {
        color: textColor,
        background: backgroundColor
      },
      children: showTabs ? /* @__PURE__ */ jsxs(Tabs, { children: [
        /* @__PURE__ */ jsx("div", { className: "editor-style-book__tablist-container", children: /* @__PURE__ */ jsx(Tabs.TabList, { children: tabs.map((tab) => /* @__PURE__ */ jsx(Tabs.Tab, { tabId: tab.slug, children: tab.title }, tab.slug)) }) }),
        tabs.map((tab) => {
          const categoryDefinition = tab.slug ? getTopLevelStyleBookCategories().find(
            (_category) => _category.slug === tab.slug
          ) : null;
          const filteredExamples = categoryDefinition ? getExamplesByCategory(
            categoryDefinition,
            examples
          ) : { examples };
          return /* @__PURE__ */ jsx(
            Tabs.TabPanel,
            {
              tabId: tab.slug,
              focusable: false,
              className: "editor-style-book__tabpanel",
              children: /* @__PURE__ */ jsx(
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
      ] }) : /* @__PURE__ */ jsx(
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
  const editorSettings = useSelect(
    (select) => select(editorStore).getEditorSettings(),
    []
  );
  const canUserUploadMedia = useSelect(
    (select) => select(coreStore).canUser("create", {
      kind: "postType",
      name: "attachment"
    }),
    []
  );
  useEffect(() => {
    dispatch(blockEditorStore).updateSettings({
      ...editorSettings,
      mediaUpload: canUserUploadMedia ? uploadMedia : void 0
    });
  }, [editorSettings, canUserUploadMedia]);
  const [internalPath, setInternalPath] = useState("/");
  const section = path ?? internalPath;
  const onChangeSection = onPathChange ?? setInternalPath;
  const isSelected = (blockName) => {
    return section === `/blocks/${encodeURIComponent(blockName)}` || section.startsWith(
      `/blocks/${encodeURIComponent(blockName)}/`
    );
  };
  const onSelect = (blockName, isBlockVariation = false) => {
    if (STYLE_BOOK_COLOR_GROUPS.find(
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
  const examples = getExamples(colors);
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
  const categoryDefinition = STYLE_BOOK_PREVIEW_CATEGORIES.find(
    (category) => category.slug === previewCategory
  );
  const filteredExamples = useMemo(() => {
    if (!categoryDefinition) {
      return {
        examples: [
          examples.find(
            (example) => example.name === previewCategory
          )
        ]
      };
    }
    return getExamplesByCategory(categoryDefinition, examples);
  }, [categoryDefinition, examples, previewCategory]);
  const displayedExamples = useMemo(() => {
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
  const { base: baseConfig } = useGlobalStyles();
  const goTo = getStyleBookNavigationFromPath(section);
  const mergedConfig = useMemo(() => {
    if (!isObjectEmpty(userConfig) && !isObjectEmpty(baseConfig)) {
      return mergeGlobalStyles(baseConfig, userConfig);
    }
    return {};
  }, [baseConfig, userConfig]);
  const [globalStyles] = useGlobalStylesOutputWithConfig(mergedConfig);
  const settings = useMemo(
    () => ({
      ...editorSettings,
      styles: !isObjectEmpty(globalStyles) && !isObjectEmpty(userConfig) ? globalStyles : editorSettings.styles,
      isPreviewMode: true
    }),
    [globalStyles, editorSettings, userConfig]
  );
  return /* @__PURE__ */ jsx("div", { className: "editor-style-book", children: /* @__PURE__ */ jsxs(BlockEditorProvider, { settings, children: [
    /* @__PURE__ */ jsx(GlobalStylesRenderer, { disableRootPadding: true }),
    /* @__PURE__ */ jsx(
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
  const [isFocused, setIsFocused] = useState(false);
  const [hasIframeLoaded, setHasIframeLoaded] = useState(false);
  const iframeRef = useRef(null);
  const buttonModeProps = {
    role: "button",
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    onKeyDown: (event) => {
      if (event.defaultPrevented) {
        return;
      }
      const { keyCode } = event;
      if (onClick && (keyCode === ENTER || keyCode === SPACE)) {
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
  useLayoutEffect(() => {
    if (hasIframeLoaded && iframeRef.current && goTo?.top) {
      scrollToSection("top", iframeRef.current);
    }
  }, [goTo?.top, hasIframeLoaded]);
  return /* @__PURE__ */ jsxs(
    Iframe,
    {
      onLoad: handleLoad,
      ref: iframeRef,
      className: clsx("editor-style-book__iframe", {
        "is-focused": isFocused && !!onClick,
        "is-button": !!onClick
      }),
      name: "style-book-canvas",
      tabIndex: 0,
      ...onClick ? buttonModeProps : {},
      children: [
        /* @__PURE__ */ jsx(EditorStyles, { styles: settings.styles }),
        /* @__PURE__ */ jsxs("style", { children: [
          STYLE_BOOK_IFRAME_STYLES,
          !!onClick && "body { cursor: pointer; } body * { pointer-events: none; }"
        ] }),
        /* @__PURE__ */ jsx(
          Examples,
          {
            className: "editor-style-book__examples",
            filteredExamples: examples,
            label: title ? sprintf(
              // translators: %s: Category of blocks, e.g. Text.
              __("Examples of blocks in the %s category"),
              title
            ) : __("Examples of blocks"),
            isSelected,
            onSelect
          },
          title
        )
      ]
    }
  );
};
var Examples = memo(
  ({ className, filteredExamples, label, isSelected, onSelect }) => {
    return /* @__PURE__ */ jsxs(
      Composite,
      {
        orientation: "vertical",
        className,
        "aria-label": label,
        role: "grid",
        children: [
          !!filteredExamples?.examples?.length && filteredExamples.examples.map((example) => /* @__PURE__ */ jsx(
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
          !!filteredExamples?.subcategories?.length && filteredExamples.subcategories.map((subcategory) => /* @__PURE__ */ jsxs(
            Composite.Group,
            {
              className: "editor-style-book__subcategory",
              children: [
                /* @__PURE__ */ jsx(Composite.GroupLabel, { children: /* @__PURE__ */ jsx("h2", { className: "editor-style-book__subcategory-title", children: subcategory.title }) }),
                /* @__PURE__ */ jsx(
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
  return !!examples?.length && examples.map((example) => /* @__PURE__ */ jsx(
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
  const originalSettings = useSelect(
    (select) => select(blockEditorStore).getSettings(),
    []
  );
  const settings = useMemo(
    () => ({
      ...originalSettings,
      focusMode: false,
      // Disable "Spotlight mode".
      isPreviewMode: true
    }),
    [originalSettings]
  );
  const renderedBlocks = useMemo(
    () => Array.isArray(blocks) ? blocks : [blocks],
    [blocks]
  );
  const disabledProps = disabledExamples.includes(id) || !onClick ? {
    disabled: true,
    accessibleWhenDisabled: !!onClick
  } : {};
  return /* @__PURE__ */ jsx("div", { role: "row", children: /* @__PURE__ */ jsx("div", { role: "gridcell", children: /* @__PURE__ */ jsxs(
    Composite.Item,
    {
      className: clsx("editor-style-book__example", {
        "is-selected": isSelected,
        "is-disabled-example": !!disabledProps?.disabled
      }),
      id,
      "aria-label": !!onClick ? sprintf(
        // translators: %s: Title of a block, e.g. Heading.
        __("Open %s styles in Styles panel"),
        title
      ) : void 0,
      render: /* @__PURE__ */ jsx("div", {}),
      role: !!onClick ? "button" : null,
      onClick,
      ...disabledProps,
      children: [
        /* @__PURE__ */ jsx("span", { className: "editor-style-book__example-title", children: title }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "editor-style-book__example-preview",
            "aria-hidden": true,
            children: /* @__PURE__ */ jsx(Disabled, { className: "editor-style-book__example-preview__content", children: content ? content : /* @__PURE__ */ jsxs(
              ExperimentalBlockEditorProvider,
              {
                value: renderedBlocks,
                settings,
                children: [
                  /* @__PURE__ */ jsx(EditorStyles, {}),
                  /* @__PURE__ */ jsx(BlockList, { renderAppender: false })
                ]
              }
            ) })
          }
        )
      ]
    }
  ) }) });
};
var style_book_default = forwardRef(StyleBook);
export {
  StyleBookBody,
  StyleBookPreview,
  style_book_default as default,
  getExamplesForSinglePageUse
};
//# sourceMappingURL=index.mjs.map
