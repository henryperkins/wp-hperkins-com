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

// packages/global-styles-engine/src/core/render.tsx
var render_exports = {};
__export(render_exports, {
  generateCustomProperties: () => generateCustomProperties,
  generateGlobalStyles: () => generateGlobalStyles,
  generateSvgFilters: () => generateSvgFilters,
  getBlockSelectors: () => getBlockSelectors,
  getLayoutStyles: () => getLayoutStyles,
  getNodesWithSettings: () => getNodesWithSettings,
  getNodesWithStyles: () => getNodesWithStyles,
  getStylesDeclarations: () => getStylesDeclarations,
  processCSSNesting: () => processCSSNesting,
  transformToStyles: () => transformToStyles
});
module.exports = __toCommonJS(render_exports);
var import_blocks = require("@wordpress/blocks");
var import_style_engine = require("@wordpress/style-engine");
var import_data = require("@wordpress/data");
var import_common = require("../utils/common.cjs");
var import_selectors = require("./selectors.cjs");
var import_typography = require("../utils/typography.cjs");
var import_duotone = require("../utils/duotone.cjs");
var import_string = require("../utils/string.cjs");
var import_gap = require("../utils/gap.cjs");
var import_background = require("../utils/background.cjs");
var import_layout = require("../utils/layout.cjs");
var import_object = require("../utils/object.cjs");
var import_get_setting = require("../settings/get-setting.cjs");
var ELEMENT_CLASS_NAMES = {
  button: "wp-element-button",
  caption: "wp-element-caption"
};
var BLOCK_SUPPORT_FEATURE_LEVEL_SELECTORS = {
  __experimentalBorder: "border",
  color: "color",
  dimensions: "dimensions",
  spacing: "spacing",
  typography: "typography"
};
function getPresetsClasses(blockSelector = "*", blockPresets = {}) {
  return import_common.PRESET_METADATA.reduce(
    (declarations, { path, cssVarInfix, classes }) => {
      if (!classes) {
        return declarations;
      }
      const presetByOrigin = (0, import_object.getValueFromObjectPath)(
        blockPresets,
        path,
        []
      );
      ["default", "theme", "custom"].forEach((origin) => {
        if (presetByOrigin[origin]) {
          presetByOrigin[origin].forEach(
            ({ slug }) => {
              classes.forEach(
                ({
                  classSuffix,
                  propertyName
                }) => {
                  const classSelectorToUse = `.has-${(0, import_string.kebabCase)(
                    slug
                  )}-${classSuffix}`;
                  const selectorToUse = blockSelector.split(",").map(
                    (selector) => `${selector}${classSelectorToUse}`
                  ).join(",");
                  const value = `var(--wp--preset--${cssVarInfix}--${(0, import_string.kebabCase)(
                    slug
                  )})`;
                  declarations += `${selectorToUse}{${propertyName}: ${value} !important;}`;
                }
              );
            }
          );
        }
      });
      return declarations;
    },
    ""
  );
}
function getPresetsSvgFilters(blockPresets = {}) {
  return import_common.PRESET_METADATA.filter(
    // Duotone are the only type of filters for now.
    (metadata) => metadata.path.at(-1) === "duotone"
  ).flatMap((metadata) => {
    const presetByOrigin = (0, import_object.getValueFromObjectPath)(
      blockPresets,
      metadata.path,
      {}
    );
    return ["default", "theme"].filter((origin) => presetByOrigin[origin]).flatMap(
      (origin) => presetByOrigin[origin].map(
        (preset) => (0, import_duotone.getDuotoneFilter)(
          `wp-duotone-${preset.slug}`,
          preset.colors
        )
      )
    ).join("");
  });
}
function flattenTree(input = {}, prefix, token) {
  let result = [];
  Object.keys(input).forEach((key) => {
    const newKey = prefix + (0, import_string.kebabCase)(key.replace("/", "-"));
    const newLeaf = input[key];
    if (newLeaf instanceof Object) {
      const newPrefix = newKey + token;
      result = [...result, ...flattenTree(newLeaf, newPrefix, token)];
    } else {
      result.push(`${newKey}: ${newLeaf}`);
    }
  });
  return result;
}
function concatFeatureVariationSelectorString(featureSelector, styleVariationSelector) {
  const featureSelectors = featureSelector.split(",");
  const combinedSelectors = [];
  featureSelectors.forEach((selector) => {
    combinedSelectors.push(
      `${styleVariationSelector.trim()}${selector.trim()}`
    );
  });
  return combinedSelectors.join(", ");
}
var updateParagraphTextIndentSelector = (featureDeclarations, settings, blockName) => {
  if (blockName !== "core/paragraph") {
    return featureDeclarations;
  }
  const blockSettings = settings?.blocks?.["core/paragraph"];
  const textIndentSetting = blockSettings?.typography?.textIndent ?? settings?.typography?.textIndent ?? "subsequent";
  if (textIndentSetting !== "all") {
    return featureDeclarations;
  }
  const oldSelector = ".wp-block-paragraph + .wp-block-paragraph";
  const newSelector = ".wp-block-paragraph";
  if (oldSelector in featureDeclarations) {
    const declarations = featureDeclarations[oldSelector];
    const updated = { ...featureDeclarations };
    delete updated[oldSelector];
    updated[newSelector] = declarations;
    return updated;
  }
  return featureDeclarations;
};
var updateButtonWidthDeclarations = (featureDeclarations, settings) => {
  const buttonSelector = ".wp-block-button";
  if (!(buttonSelector in featureDeclarations)) {
    return featureDeclarations;
  }
  const updated = { ...featureDeclarations };
  updated[buttonSelector] = updated[buttonSelector].map(
    (declaration) => {
      const match = declaration.match(/^width:\s*(.+)$/);
      if (!match) {
        return declaration;
      }
      const value = match[1];
      let percentage = null;
      if (value.endsWith("%")) {
        percentage = parseFloat(value);
      }
      const presetPrefix = "var(--wp--preset--dimension--";
      if (percentage === null && value.startsWith(presetPrefix) && value.endsWith(")")) {
        const slug = value.slice(presetPrefix.length, -1);
        const dimensionSizes = {
          ...settings?.dimensions?.dimensionSizes ?? {},
          ...settings?.blocks?.["core/button"]?.dimensions?.dimensionSizes ?? {}
        };
        for (const origin of Object.values(dimensionSizes)) {
          if (!Array.isArray(origin)) {
            continue;
          }
          for (const preset of origin) {
            if (preset.slug === slug && typeof preset.size === "string" && preset.size.endsWith("%")) {
              percentage = parseFloat(preset.size);
              break;
            }
          }
          if (percentage !== null) {
            break;
          }
        }
      }
      if (percentage === null || isNaN(percentage)) {
        return declaration;
      }
      return `width: calc(${percentage} * 1% - (var(--wp--style--block-gap, 0.5em) * (1 - ${percentage} / 100)))`;
    }
  );
  return updated;
};
var getFeatureDeclarations = (selectors, styles) => {
  const declarations = {};
  Object.entries(selectors).forEach(([feature, selector]) => {
    if (feature === "root" || !styles?.[feature]) {
      return;
    }
    const isShorthand = typeof selector === "string";
    if (!isShorthand && typeof selector === "object" && selector !== null) {
      Object.entries(selector).forEach(
        ([subfeature, subfeatureSelector]) => {
          if (subfeature === "root" || !styles?.[feature][subfeature]) {
            return;
          }
          const subfeatureStyles = {
            [feature]: {
              [subfeature]: styles[feature][subfeature]
            }
          };
          const newDeclarations = getStylesDeclarations(subfeatureStyles);
          declarations[subfeatureSelector] = [
            ...declarations[subfeatureSelector] || [],
            ...newDeclarations
          ];
          delete styles[feature][subfeature];
        }
      );
    }
    if (isShorthand || typeof selector === "object" && selector !== null && "root" in selector) {
      const featureSelector = isShorthand ? selector : selector.root;
      const featureStyles = { [feature]: styles[feature] };
      const newDeclarations = getStylesDeclarations(featureStyles);
      declarations[featureSelector] = [
        ...declarations[featureSelector] || [],
        ...newDeclarations
      ];
      delete styles[feature];
    }
  });
  return declarations;
};
function getStylesDeclarations(blockStyles = {}, selector = "", useRootPaddingAlign, tree = {}, disableRootPadding = false) {
  const isRoot = import_common.ROOT_BLOCK_SELECTOR === selector;
  const output = Object.entries(
    import_blocks.__EXPERIMENTAL_STYLE_PROPERTY
  ).reduce(
    (declarations, [key, { value, properties, useEngine, rootOnly }]) => {
      if (rootOnly && !isRoot) {
        return declarations;
      }
      const pathToValue = value;
      if (pathToValue[0] === "elements" || useEngine) {
        return declarations;
      }
      const styleValue = (0, import_object.getValueFromObjectPath)(
        blockStyles,
        pathToValue
      );
      if (key === "--wp--style--root--padding" && (typeof styleValue === "string" || !useRootPaddingAlign)) {
        return declarations;
      }
      if (properties && typeof styleValue !== "string") {
        Object.entries(properties).forEach((entry) => {
          const [name, prop] = entry;
          if (!(0, import_object.getValueFromObjectPath)(styleValue, [prop], false)) {
            return;
          }
          const cssProperty = name.startsWith("--") ? name : (0, import_string.kebabCase)(name);
          declarations.push(
            `${cssProperty}: ${(0, import_style_engine.getCSSValueFromRawStyle)(
              (0, import_object.getValueFromObjectPath)(styleValue, [prop])
            )}`
          );
        });
      } else if ((0, import_object.getValueFromObjectPath)(blockStyles, pathToValue, false)) {
        const cssProperty = key.startsWith("--") ? key : (0, import_string.kebabCase)(key);
        declarations.push(
          `${cssProperty}: ${(0, import_style_engine.getCSSValueFromRawStyle)(
            (0, import_object.getValueFromObjectPath)(blockStyles, pathToValue)
          )}`
        );
      }
      return declarations;
    },
    []
  );
  if (!!blockStyles.background) {
    if (blockStyles.background?.backgroundImage) {
      blockStyles.background.backgroundImage = (0, import_common.getResolvedValue)(
        blockStyles.background.backgroundImage,
        tree
      );
    }
    if (!isRoot && !!blockStyles.background?.backgroundImage?.id) {
      blockStyles = {
        ...blockStyles,
        background: {
          ...blockStyles.background,
          ...(0, import_background.setBackgroundStyleDefaults)(blockStyles.background)
        }
      };
    }
  }
  const extraRules = (0, import_style_engine.getCSSRules)(blockStyles);
  extraRules.forEach((rule) => {
    if (isRoot && (useRootPaddingAlign || disableRootPadding) && rule.key.startsWith("padding")) {
      return;
    }
    const cssProperty = rule.key.startsWith("--") ? rule.key : (0, import_string.kebabCase)(rule.key);
    let ruleValue = (0, import_common.getResolvedValue)(rule.value, tree);
    if (cssProperty === "font-size") {
      ruleValue = (0, import_typography.getTypographyFontSizeValue)(
        { name: "", slug: "", size: ruleValue },
        tree?.settings
      );
    }
    if (cssProperty === "aspect-ratio") {
      output.push("min-height: unset");
    }
    output.push(`${cssProperty}: ${ruleValue}`);
  });
  return output;
}
function getLayoutStyles({
  layoutDefinitions = import_layout.LAYOUT_DEFINITIONS,
  style,
  selector,
  hasBlockGapSupport,
  hasFallbackGapSupport,
  fallbackGapValue
}) {
  let ruleset = "";
  let gapValue = hasBlockGapSupport ? (0, import_gap.getGapCSSValue)(style?.spacing?.blockGap) : "";
  if (hasFallbackGapSupport) {
    if (selector === import_common.ROOT_BLOCK_SELECTOR) {
      gapValue = !gapValue ? "0.5em" : gapValue;
    } else if (!hasBlockGapSupport && fallbackGapValue) {
      gapValue = fallbackGapValue;
    }
  }
  if (gapValue && layoutDefinitions) {
    Object.values(layoutDefinitions).forEach(
      ({ className, name, spacingStyles }) => {
        if (!hasBlockGapSupport && "flex" !== name && "grid" !== name) {
          return;
        }
        if (spacingStyles?.length) {
          spacingStyles.forEach((spacingStyle) => {
            const declarations = [];
            if (spacingStyle.rules) {
              Object.entries(spacingStyle.rules).forEach(
                ([cssProperty, cssValue]) => {
                  declarations.push(
                    `${cssProperty}: ${cssValue ? cssValue : gapValue}`
                  );
                }
              );
            }
            if (declarations.length) {
              let combinedSelector = "";
              if (!hasBlockGapSupport) {
                combinedSelector = selector === import_common.ROOT_BLOCK_SELECTOR ? `:where(.${className}${spacingStyle?.selector || ""})` : `:where(${selector}.${className}${spacingStyle?.selector || ""})`;
              } else {
                combinedSelector = selector === import_common.ROOT_BLOCK_SELECTOR ? `:root :where(.${className})${spacingStyle?.selector || ""}` : `:root :where(${selector}-${className})${spacingStyle?.selector || ""}`;
              }
              ruleset += `${combinedSelector} { ${declarations.join(
                "; "
              )}; }`;
            }
          });
        }
      }
    );
    if (selector === import_common.ROOT_BLOCK_SELECTOR && hasBlockGapSupport) {
      ruleset += `${import_common.ROOT_CSS_PROPERTIES_SELECTOR} { --wp--style--block-gap: ${gapValue}; }`;
    }
  }
  if (selector === import_common.ROOT_BLOCK_SELECTOR && layoutDefinitions) {
    const validDisplayModes = ["block", "flex", "grid"];
    Object.values(layoutDefinitions).forEach(
      ({ className, displayMode, baseStyles }) => {
        if (displayMode && validDisplayModes.includes(displayMode)) {
          ruleset += `${selector} .${className} { display:${displayMode}; }`;
        }
        if (baseStyles?.length) {
          baseStyles.forEach((baseStyle) => {
            const declarations = [];
            if (baseStyle.rules) {
              Object.entries(baseStyle.rules).forEach(
                ([cssProperty, cssValue]) => {
                  declarations.push(
                    `${cssProperty}: ${cssValue}`
                  );
                }
              );
            }
            if (declarations.length) {
              const combinedSelector = `.${className}${baseStyle?.selector || ""}`;
              ruleset += `${combinedSelector} { ${declarations.join(
                "; "
              )}; }`;
            }
          });
        }
      }
    );
  }
  return ruleset;
}
var STYLE_KEYS = [
  "border",
  "color",
  "dimensions",
  "spacing",
  "typography",
  "filter",
  "outline",
  "shadow",
  "background"
];
function pickStyleKeys(treeToPickFrom) {
  if (!treeToPickFrom) {
    return {};
  }
  const entries = Object.entries(treeToPickFrom);
  const pickedEntries = entries.filter(
    ([key]) => STYLE_KEYS.includes(key)
  );
  const clonedEntries = pickedEntries.map(([key, style]) => [
    key,
    JSON.parse(JSON.stringify(style))
  ]);
  return Object.fromEntries(clonedEntries);
}
var getNodesWithStyles = (tree, blockSelectors) => {
  const nodes = [];
  if (!tree?.styles) {
    return nodes;
  }
  const styles = pickStyleKeys(tree.styles);
  if (styles) {
    nodes.push({
      styles,
      selector: import_common.ROOT_BLOCK_SELECTOR,
      // Root selector (body) styles should not be wrapped in `:root where()` to keep
      // specificity at (0,0,1) and maintain backwards compatibility.
      skipSelectorWrapper: true
    });
  }
  Object.entries(import_blocks.__EXPERIMENTAL_ELEMENTS).forEach(([name, selector]) => {
    if (tree.styles?.elements?.[name]) {
      nodes.push({
        styles: tree.styles?.elements?.[name] ?? {},
        selector,
        // Top level elements that don't use a class name should not receive the
        // `:root :where()` wrapper to maintain backwards compatibility.
        skipSelectorWrapper: !ELEMENT_CLASS_NAMES[name]
      });
    }
  });
  Object.entries(tree.styles?.blocks ?? {}).forEach(
    ([blockName, node]) => {
      const blockStyles = pickStyleKeys(node);
      const typedNode = node;
      const variationNodesToAdd = [];
      if (typedNode?.variations) {
        const variations = {};
        Object.entries(typedNode.variations).forEach(
          ([variationName, variation]) => {
            const typedVariation = variation;
            variations[variationName] = pickStyleKeys(typedVariation);
            if (typedVariation?.css) {
              variations[variationName].css = typedVariation.css;
            }
            const variationSelector = typeof blockSelectors !== "string" ? blockSelectors[blockName]?.styleVariationSelectors?.[variationName] : void 0;
            Object.entries(
              typedVariation?.elements ?? {}
            ).forEach(([element, elementStyles]) => {
              if (elementStyles && import_blocks.__EXPERIMENTAL_ELEMENTS[element]) {
                variationNodesToAdd.push({
                  styles: elementStyles,
                  selector: (0, import_common.scopeSelector)(
                    variationSelector,
                    import_blocks.__EXPERIMENTAL_ELEMENTS[element]
                  )
                });
              }
            });
            Object.entries(typedVariation?.blocks ?? {}).forEach(
              ([
                variationBlockName,
                variationBlockStyles
              ]) => {
                const variationBlockSelector = typeof blockSelectors !== "string" ? (0, import_common.scopeSelector)(
                  variationSelector,
                  blockSelectors[variationBlockName]?.selector
                ) : void 0;
                const variationDuotoneSelector = typeof blockSelectors !== "string" ? (0, import_common.scopeSelector)(
                  variationSelector,
                  blockSelectors[variationBlockName]?.duotoneSelector
                ) : void 0;
                const variationFeatureSelectors = typeof blockSelectors !== "string" ? (0, import_common.scopeFeatureSelectors)(
                  variationSelector,
                  blockSelectors[variationBlockName]?.featureSelectors ?? {}
                ) : void 0;
                const variationBlockStyleNodes = pickStyleKeys(variationBlockStyles);
                if (variationBlockStyles?.css) {
                  variationBlockStyleNodes.css = variationBlockStyles.css;
                }
                if (!variationBlockSelector || typeof blockSelectors === "string") {
                  return;
                }
                variationNodesToAdd.push({
                  selector: variationBlockSelector,
                  duotoneSelector: variationDuotoneSelector,
                  featureSelectors: variationFeatureSelectors,
                  fallbackGapValue: blockSelectors[variationBlockName]?.fallbackGapValue,
                  hasLayoutSupport: blockSelectors[variationBlockName]?.hasLayoutSupport,
                  styles: variationBlockStyleNodes
                });
                Object.entries(
                  variationBlockStyles.elements ?? {}
                ).forEach(
                  ([
                    variationBlockElement,
                    variationBlockElementStyles
                  ]) => {
                    if (variationBlockElementStyles && import_blocks.__EXPERIMENTAL_ELEMENTS[variationBlockElement]) {
                      variationNodesToAdd.push({
                        styles: variationBlockElementStyles,
                        selector: (0, import_common.scopeSelector)(
                          variationBlockSelector,
                          import_blocks.__EXPERIMENTAL_ELEMENTS[variationBlockElement]
                        )
                      });
                    }
                  }
                );
              }
            );
          }
        );
        blockStyles.variations = variations;
      }
      if (typeof blockSelectors !== "string" && blockSelectors?.[blockName]?.selector) {
        nodes.push({
          duotoneSelector: blockSelectors[blockName].duotoneSelector,
          fallbackGapValue: blockSelectors[blockName].fallbackGapValue,
          hasLayoutSupport: blockSelectors[blockName].hasLayoutSupport,
          selector: blockSelectors[blockName].selector,
          styles: blockStyles,
          featureSelectors: blockSelectors[blockName].featureSelectors,
          styleVariationSelectors: blockSelectors[blockName].styleVariationSelectors,
          name: blockName
        });
      }
      Object.entries(typedNode?.elements ?? {}).forEach(
        ([elementName, value]) => {
          if (typeof blockSelectors !== "string" && value && blockSelectors?.[blockName] && import_blocks.__EXPERIMENTAL_ELEMENTS[elementName]) {
            nodes.push({
              styles: value,
              selector: blockSelectors[blockName]?.selector.split(",").map((sel) => {
                const elementSelectors = import_blocks.__EXPERIMENTAL_ELEMENTS[elementName].split(",");
                return elementSelectors.map(
                  (elementSelector) => sel + " " + elementSelector
                );
              }).join(",")
            });
          }
        }
      );
      nodes.push(...variationNodesToAdd);
    }
  );
  return nodes;
};
var getNodesWithSettings = (tree, blockSelectors) => {
  const nodes = [];
  if (!tree?.settings) {
    return nodes;
  }
  const pickPresets = (treeToPickFrom) => {
    let presets2 = {};
    import_common.PRESET_METADATA.forEach(({ path }) => {
      const value = (0, import_object.getValueFromObjectPath)(treeToPickFrom, path, false);
      if (value !== false) {
        presets2 = (0, import_object.setImmutably)(presets2, path, value);
      }
    });
    return presets2;
  };
  const presets = pickPresets(tree.settings);
  const custom = tree.settings?.custom;
  if (Object.keys(presets).length > 0 || custom) {
    nodes.push({
      presets,
      custom,
      selector: import_common.ROOT_CSS_PROPERTIES_SELECTOR
    });
  }
  Object.entries(tree.settings?.blocks ?? {}).forEach(
    ([blockName, node]) => {
      const blockCustom = node.custom;
      if (typeof blockSelectors === "string" || !blockSelectors[blockName]) {
        return;
      }
      const blockPresets = pickPresets(node);
      if (Object.keys(blockPresets).length > 0 || blockCustom) {
        nodes.push({
          presets: blockPresets,
          custom: blockCustom,
          selector: blockSelectors[blockName]?.selector,
          featureSelectors: blockSelectors[blockName]?.featureSelectors
        });
      }
    }
  );
  return nodes;
};
function resolveFeatureSelector(featureSelectors, featureKey, fallback) {
  if (!featureSelectors || typeof featureSelectors === "string") {
    return fallback;
  }
  const feature = featureSelectors[featureKey];
  if (typeof feature === "string") {
    return feature;
  }
  if (typeof feature === "object" && feature.root) {
    return feature.root;
  }
  return fallback;
}
function getPresetVarDeclarations(presets, mergedSettings, { path, valueKey, valueFunc, cssVarInfix }) {
  const presetByOrigin = (0, import_object.getValueFromObjectPath)(
    presets,
    path,
    []
  );
  const declarations = [];
  for (const origin of ["default", "theme", "custom"]) {
    if (!presetByOrigin[origin]) {
      continue;
    }
    for (const value of presetByOrigin[origin]) {
      const slug = (0, import_string.kebabCase)(value.slug);
      if (valueKey && !valueFunc) {
        declarations.push(
          `--wp--preset--${cssVarInfix}--${slug}: ${value[valueKey]}`
        );
      } else if (valueFunc && typeof valueFunc === "function") {
        declarations.push(
          `--wp--preset--${cssVarInfix}--${slug}: ${valueFunc(
            value,
            mergedSettings
          )}`
        );
      }
    }
  }
  return declarations;
}
var generateCustomProperties = (tree, blockSelectors) => {
  const nodes = getNodesWithSettings(tree, blockSelectors);
  let ruleset = "";
  for (const { presets, custom, selector, featureSelectors } of nodes) {
    const defaultSelector = selector;
    const varsBySelector = {
      [defaultSelector]: []
    };
    if (tree?.settings) {
      for (const metadata of import_common.PRESET_METADATA) {
        const declarations = getPresetVarDeclarations(
          presets,
          tree.settings,
          metadata
        );
        if (declarations.length === 0) {
          continue;
        }
        const target = resolveFeatureSelector(
          featureSelectors,
          metadata.path[0],
          defaultSelector
        );
        if (!varsBySelector[target]) {
          varsBySelector[target] = [];
        }
        varsBySelector[target].push(...declarations);
      }
    }
    const customProps = flattenTree(custom, "--wp--custom--", "--");
    if (customProps.length > 0) {
      varsBySelector[defaultSelector].push(...customProps);
    }
    for (const [ruleSelector, declarations] of Object.entries(
      varsBySelector
    )) {
      if (declarations.length > 0) {
        ruleset += `${ruleSelector}{${declarations.join(";")};}`;
      }
    }
  }
  return ruleset;
};
var transformToStyles = (tree, blockSelectors, hasBlockGapSupport, hasFallbackGapSupport, disableLayoutStyles = false, disableRootPadding = false, styleOptions = {}) => {
  const options = {
    blockGap: true,
    blockStyles: true,
    layoutStyles: true,
    marginReset: true,
    presets: true,
    rootPadding: true,
    variationStyles: false,
    ...styleOptions
  };
  const nodesWithStyles = getNodesWithStyles(tree, blockSelectors);
  const nodesWithSettings = getNodesWithSettings(tree, blockSelectors);
  const useRootPaddingAlign = tree?.settings?.useRootPaddingAwareAlignments;
  const { contentSize, wideSize } = tree?.settings?.layout || {};
  const hasBodyStyles = options.marginReset || options.rootPadding || options.layoutStyles;
  let ruleset = "";
  if (options.presets && (contentSize || wideSize)) {
    ruleset += `${import_common.ROOT_CSS_PROPERTIES_SELECTOR} {`;
    ruleset = contentSize ? ruleset + ` --wp--style--global--content-size: ${contentSize};` : ruleset;
    ruleset = wideSize ? ruleset + ` --wp--style--global--wide-size: ${wideSize};` : ruleset;
    ruleset += "}";
  }
  if (hasBodyStyles) {
    ruleset += ":where(body) {margin: 0;";
    if (options.rootPadding && useRootPaddingAlign) {
      ruleset += `padding-right: 0; padding-left: 0; padding-top: var(--wp--style--root--padding-top); padding-bottom: var(--wp--style--root--padding-bottom) }
				.has-global-padding { padding-right: var(--wp--style--root--padding-right); padding-left: var(--wp--style--root--padding-left); }
				.has-global-padding > .alignfull { margin-right: calc(var(--wp--style--root--padding-right) * -1); margin-left: calc(var(--wp--style--root--padding-left) * -1); }
				.has-global-padding :where(:not(.alignfull.is-layout-flow) > .has-global-padding:not(.wp-block-block, .alignfull)) { padding-right: 0; padding-left: 0; }
				.has-global-padding :where(:not(.alignfull.is-layout-flow) > .has-global-padding:not(.wp-block-block, .alignfull)) > .alignfull { margin-left: 0; margin-right: 0;
				`;
    }
    ruleset += "}";
  }
  if (options.blockStyles) {
    nodesWithStyles.forEach(
      ({
        selector,
        duotoneSelector,
        styles,
        fallbackGapValue,
        hasLayoutSupport,
        featureSelectors,
        styleVariationSelectors,
        skipSelectorWrapper,
        name
      }) => {
        if (featureSelectors) {
          let featureDeclarations = getFeatureDeclarations(
            featureSelectors,
            styles
          );
          featureDeclarations = updateParagraphTextIndentSelector(
            featureDeclarations,
            tree.settings,
            name
          );
          featureDeclarations = updateButtonWidthDeclarations(
            featureDeclarations,
            tree.settings
          );
          Object.entries(featureDeclarations).forEach(
            ([cssSelector, declarations]) => {
              if (declarations.length) {
                const rules = declarations.join(";");
                ruleset += `:root :where(${cssSelector}){${rules};}`;
              }
            }
          );
        }
        if (duotoneSelector) {
          const duotoneStyles = {};
          if (styles?.filter) {
            duotoneStyles.filter = styles.filter;
            delete styles.filter;
          }
          const duotoneDeclarations = getStylesDeclarations(duotoneStyles);
          if (duotoneDeclarations.length) {
            ruleset += `${duotoneSelector}{${duotoneDeclarations.join(
              ";"
            )};}`;
          }
        }
        if (!disableLayoutStyles && (import_common.ROOT_BLOCK_SELECTOR === selector || hasLayoutSupport)) {
          ruleset += getLayoutStyles({
            style: styles,
            selector,
            hasBlockGapSupport,
            hasFallbackGapSupport,
            fallbackGapValue
          });
        }
        const styleDeclarations = getStylesDeclarations(
          styles,
          selector,
          useRootPaddingAlign,
          tree,
          disableRootPadding
        );
        if (styleDeclarations?.length) {
          const generalSelector = skipSelectorWrapper ? selector : `:root :where(${selector})`;
          ruleset += `${generalSelector}{${styleDeclarations.join(
            ";"
          )};}`;
        }
        if (styles?.css) {
          ruleset += processCSSNesting(
            styles.css,
            `:root :where(${selector})`
          );
        }
        if (options.variationStyles && styleVariationSelectors) {
          Object.entries(styleVariationSelectors).forEach(
            ([styleVariationName, styleVariationSelector]) => {
              const styleVariations = styles?.variations?.[styleVariationName];
              if (styleVariations) {
                if (featureSelectors) {
                  let featureDeclarations = getFeatureDeclarations(
                    featureSelectors,
                    styleVariations
                  );
                  featureDeclarations = updateParagraphTextIndentSelector(
                    featureDeclarations,
                    tree.settings,
                    name
                  );
                  featureDeclarations = updateButtonWidthDeclarations(
                    featureDeclarations,
                    tree.settings
                  );
                  Object.entries(
                    featureDeclarations
                  ).forEach(
                    ([baseSelector, declarations]) => {
                      if (declarations.length) {
                        const cssSelector = concatFeatureVariationSelectorString(
                          baseSelector,
                          styleVariationSelector
                        );
                        const rules = declarations.join(";");
                        ruleset += `:root :where(${cssSelector}){${rules};}`;
                      }
                    }
                  );
                }
                const styleVariationDeclarations = getStylesDeclarations(
                  styleVariations,
                  styleVariationSelector,
                  useRootPaddingAlign,
                  tree
                );
                if (styleVariationDeclarations.length) {
                  ruleset += `:root :where(${styleVariationSelector}){${styleVariationDeclarations.join(
                    ";"
                  )};}`;
                }
                if (styleVariations?.css) {
                  ruleset += processCSSNesting(
                    styleVariations.css,
                    `:root :where(${styleVariationSelector})`
                  );
                }
                if (hasLayoutSupport && styleVariations?.spacing?.blockGap) {
                  const variationSelectorWithBlock = styleVariationSelector + selector;
                  ruleset += getLayoutStyles({
                    style: styleVariations,
                    selector: variationSelectorWithBlock,
                    hasBlockGapSupport: true,
                    hasFallbackGapSupport,
                    fallbackGapValue
                  });
                }
              }
            }
          );
        }
        const pseudoSelectorStyles = Object.entries(styles).filter(
          ([key]) => key.startsWith(":")
        );
        if (pseudoSelectorStyles?.length) {
          pseudoSelectorStyles.forEach(
            ([pseudoKey, pseudoStyle]) => {
              const pseudoDeclarations = getStylesDeclarations(pseudoStyle);
              if (!pseudoDeclarations?.length) {
                return;
              }
              const _selector = selector.split(",").map((sel) => sel + pseudoKey).join(",");
              const pseudoRule = `:root :where(${_selector}){${pseudoDeclarations.join(
                ";"
              )};}`;
              ruleset += pseudoRule;
            }
          );
        }
      }
    );
  }
  if (options.layoutStyles) {
    ruleset = ruleset + ".wp-site-blocks > .alignleft { float: left; margin-right: 2em; }";
    ruleset = ruleset + ".wp-site-blocks > .alignright { float: right; margin-left: 2em; }";
    ruleset = ruleset + ".wp-site-blocks > .aligncenter { justify-content: center; margin-left: auto; margin-right: auto; }";
  }
  if (options.blockGap && hasBlockGapSupport) {
    const gapValue = (0, import_gap.getGapCSSValue)(tree?.styles?.spacing?.blockGap) || "0.5em";
    ruleset = ruleset + `:root :where(.wp-site-blocks) > * { margin-block-start: ${gapValue}; margin-block-end: 0; }`;
    ruleset = ruleset + ":root :where(.wp-site-blocks) > :first-child { margin-block-start: 0; }";
    ruleset = ruleset + ":root :where(.wp-site-blocks) > :last-child { margin-block-end: 0; }";
  }
  if (options.presets) {
    nodesWithSettings.forEach(({ selector, presets }) => {
      if (import_common.ROOT_BLOCK_SELECTOR === selector || import_common.ROOT_CSS_PROPERTIES_SELECTOR === selector) {
        selector = "";
      }
      const classes = getPresetsClasses(selector, presets);
      if (classes.length > 0) {
        ruleset += classes;
      }
    });
  }
  return ruleset;
};
function generateSvgFilters(tree, blockSelectors) {
  const nodesWithSettings = getNodesWithSettings(tree, blockSelectors);
  return nodesWithSettings.flatMap(({ presets }) => {
    return getPresetsSvgFilters(presets);
  });
}
var getSelectorsConfig = (blockType, rootSelector) => {
  if (blockType?.selectors && Object.keys(blockType.selectors).length > 0) {
    return blockType.selectors;
  }
  const config = {
    root: rootSelector
  };
  Object.entries(BLOCK_SUPPORT_FEATURE_LEVEL_SELECTORS).forEach(
    ([featureKey, featureName]) => {
      const featureSelector = (0, import_selectors.getBlockSelector)(blockType, featureKey);
      if (featureSelector) {
        config[featureName] = featureSelector;
      }
    }
  );
  return config;
};
var getBlockSelectors = (blockTypes, variationInstanceId) => {
  const { getBlockStyles } = (0, import_data.select)(import_blocks.store);
  const result = {};
  blockTypes.forEach((blockType) => {
    const name = blockType.name;
    const selector = (0, import_selectors.getBlockSelector)(blockType);
    if (!selector) {
      return;
    }
    let duotoneSelector = (0, import_selectors.getBlockSelector)(blockType, "filter.duotone");
    if (!duotoneSelector) {
      const rootSelector = (0, import_selectors.getBlockSelector)(blockType);
      const duotoneSupport = (0, import_blocks.getBlockSupport)(
        blockType,
        "color.__experimentalDuotone",
        false
      );
      duotoneSelector = duotoneSupport && rootSelector && (0, import_common.scopeSelector)(rootSelector, duotoneSupport);
    }
    const hasLayoutSupport = !!blockType?.supports?.layout || !!blockType?.supports?.__experimentalLayout;
    const fallbackGapValue = (
      // @ts-expect-error
      blockType?.supports?.spacing?.blockGap?.__experimentalDefault
    );
    const blockStyleVariations = getBlockStyles(name);
    const styleVariationSelectors = {};
    blockStyleVariations?.forEach((variation) => {
      const variationSuffix = variationInstanceId ? `-${variationInstanceId}` : "";
      const variationName = `${variation.name}${variationSuffix}`;
      const styleVariationSelector = (0, import_common.getBlockStyleVariationSelector)(
        variationName,
        selector
      );
      styleVariationSelectors[variationName] = styleVariationSelector;
    });
    const featureSelectors = getSelectorsConfig(blockType, selector);
    result[name] = {
      duotoneSelector: duotoneSelector ?? void 0,
      fallbackGapValue,
      featureSelectors: Object.keys(featureSelectors).length ? featureSelectors : void 0,
      hasLayoutSupport,
      name,
      selector,
      styleVariationSelectors: blockStyleVariations?.length ? styleVariationSelectors : void 0
    };
  });
  return result;
};
function updateConfigWithSeparator(config) {
  const blocks = config.styles?.blocks;
  const separatorBlock = blocks?.["core/separator"];
  const needsSeparatorStyleUpdate = separatorBlock && separatorBlock.color?.background && !separatorBlock.color?.text && !separatorBlock.border?.color;
  if (needsSeparatorStyleUpdate) {
    return {
      ...config,
      styles: {
        ...config.styles,
        blocks: {
          ...blocks,
          "core/separator": {
            ...separatorBlock,
            color: {
              ...separatorBlock.color,
              text: separatorBlock.color?.background
            }
          }
        }
      }
    };
  }
  return config;
}
function processCSSNesting(css, blockSelector) {
  let processedCSS = "";
  if (!css || css.trim() === "") {
    return processedCSS;
  }
  const parts = css.split("&");
  parts.forEach((part) => {
    if (!part || part.trim() === "") {
      return;
    }
    const isRootCss = !part.includes("{");
    if (isRootCss) {
      processedCSS += `:root :where(${blockSelector}){${part.trim()}}`;
    } else {
      const splitPart = part.replace("}", "").split("{");
      if (splitPart.length !== 2) {
        return;
      }
      const [nestedSelector, cssValue] = splitPart;
      const matches = nestedSelector.match(/([>+~\s]*::[a-zA-Z-]+)/);
      const pseudoPart = matches ? matches[1] : "";
      const withoutPseudoElement = matches ? nestedSelector.replace(pseudoPart, "").trim() : nestedSelector.trim();
      let combinedSelector;
      if (withoutPseudoElement === "") {
        combinedSelector = blockSelector;
      } else {
        combinedSelector = nestedSelector.startsWith(" ") ? (0, import_common.scopeSelector)(blockSelector, withoutPseudoElement) : (0, import_common.appendToSelector)(blockSelector, withoutPseudoElement);
      }
      processedCSS += `:root :where(${combinedSelector})${pseudoPart}{${cssValue.trim()}}`;
    }
  });
  return processedCSS;
}
function generateGlobalStyles(config = {}, blockTypes = [], options = {}) {
  const {
    hasBlockGapSupport: hasBlockGapSupportOption,
    hasFallbackGapSupport: hasFallbackGapSupportOption,
    disableLayoutStyles = false,
    disableRootPadding = false,
    styleOptions = {}
  } = options;
  const blocks = blockTypes.length > 0 ? blockTypes : (0, import_blocks.getBlockTypes)();
  const blockGap = (0, import_get_setting.getSetting)(config, "spacing.blockGap");
  const hasBlockGapSupport = hasBlockGapSupportOption ?? blockGap !== null;
  const hasFallbackGapSupport = hasFallbackGapSupportOption ?? !hasBlockGapSupport;
  if (!config?.styles || !config?.settings) {
    return [[], {}];
  }
  const updatedConfig = updateConfigWithSeparator(config);
  const blockSelectors = getBlockSelectors(blocks);
  const customProperties = generateCustomProperties(
    updatedConfig,
    blockSelectors
  );
  const globalStyles = transformToStyles(
    updatedConfig,
    blockSelectors,
    hasBlockGapSupport,
    hasFallbackGapSupport,
    disableLayoutStyles,
    disableRootPadding,
    styleOptions
  );
  const svgs = generateSvgFilters(updatedConfig, blockSelectors);
  const styles = [
    {
      css: customProperties,
      isGlobalStyles: true
    },
    {
      css: globalStyles,
      isGlobalStyles: true
    },
    // Load custom CSS in own stylesheet so that any invalid CSS entered in the input won't break all the global styles in the editor.
    {
      css: updatedConfig?.styles?.css ?? "",
      isGlobalStyles: true
    },
    {
      assets: svgs,
      __unstableType: "svg",
      isGlobalStyles: true
    }
  ];
  blocks.forEach((blockType) => {
    const blockStyles = updatedConfig?.styles?.blocks?.[blockType.name];
    if (blockStyles?.css) {
      const { featureSelectors } = blockSelectors[blockType.name];
      const cssFeatureSelector = typeof featureSelectors === "object" ? featureSelectors?.css : void 0;
      let resolvedCssSelector;
      if (typeof cssFeatureSelector === "string") {
        resolvedCssSelector = cssFeatureSelector;
      } else if (typeof cssFeatureSelector === "object") {
        resolvedCssSelector = cssFeatureSelector?.root;
      }
      const selector = resolvedCssSelector ?? blockSelectors[blockType.name].selector;
      styles.push({
        css: processCSSNesting(blockStyles.css, selector),
        isGlobalStyles: true
      });
    }
  });
  return [styles, updatedConfig.settings];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  generateCustomProperties,
  generateGlobalStyles,
  generateSvgFilters,
  getBlockSelectors,
  getLayoutStyles,
  getNodesWithSettings,
  getNodesWithStyles,
  getStylesDeclarations,
  processCSSNesting,
  transformToStyles
});
//# sourceMappingURL=render.cjs.map
