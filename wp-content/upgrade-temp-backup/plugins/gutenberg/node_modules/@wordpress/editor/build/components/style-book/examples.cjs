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

// packages/editor/src/components/style-book/examples.tsx
var examples_exports = {};
__export(examples_exports, {
  getExamples: () => getExamples
});
module.exports = __toCommonJS(examples_exports);
var import_i18n = require("@wordpress/i18n");
var import_blocks = require("@wordpress/blocks");
var import_color_examples = __toESM(require("./color-examples.cjs"));
var import_duotone_examples = __toESM(require("./duotone-examples.cjs"));
var import_constants = require("./constants.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function getColorExamples(colors) {
  if (!colors) {
    return [];
  }
  const examples = [];
  import_constants.STYLE_BOOK_COLOR_GROUPS.forEach((group) => {
    const palette = colors[group.type];
    const paletteFiltered = Array.isArray(palette) ? palette.find(
      (origin) => origin.slug === group.origin
    ) : void 0;
    if (paletteFiltered?.[group.type]) {
      const example = {
        name: group.slug,
        title: group.title,
        category: "colors"
      };
      if (group.type === "duotones") {
        example.content = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_duotone_examples.default,
          {
            duotones: paletteFiltered[group.type]
          }
        );
        examples.push(example);
      } else {
        example.content = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_color_examples.default,
          {
            colors: paletteFiltered[group.type],
            type: group.type
          }
        );
        examples.push(example);
      }
    }
  });
  return examples;
}
function getOverviewBlockExamples(colors) {
  const examples = [];
  const themePalette = Array.isArray(colors?.colors) ? colors.colors.find(
    (origin) => origin.slug === "theme"
  ) : void 0;
  if (themePalette) {
    const themeColorexample = {
      name: "theme-colors",
      title: (0, import_i18n.__)("Colors"),
      category: "overview",
      content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_color_examples.default,
        {
          colors: themePalette.colors,
          type: "colors",
          templateColumns: "repeat(auto-fill, minmax( 200px, 1fr ))",
          itemHeight: "32px"
        }
      )
    };
    examples.push(themeColorexample);
  }
  const typographyBlockExamples = [];
  if ((0, import_blocks.getBlockType)("core/heading")) {
    const headingBlock = (0, import_blocks.createBlock)("core/heading", {
      // translators: Typography example. Your local alphabet, numbers and some common special characters.
      content: (0, import_i18n.__)(
        `AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789X{(\u2026)},.-<>?!*&:/A@HELFO\u2122\xA9`
      ),
      level: 1
    });
    typographyBlockExamples.push(headingBlock);
  }
  if ((0, import_blocks.getBlockType)("core/paragraph")) {
    const firstParagraphBlock = (0, import_blocks.createBlock)("core/paragraph", {
      content: (0, import_i18n.__)(
        `A paragraph in a website refers to a distinct block of text that is used to present and organize information. It is a fundamental unit of content in web design and is typically composed of a group of related sentences or thoughts focused on a particular topic or idea. Paragraphs play a crucial role in improving the readability and user experience of a website. They break down the text into smaller, manageable chunks, allowing readers to scan the content more easily.`
      )
    });
    const secondParagraphBlock = (0, import_blocks.createBlock)("core/paragraph", {
      content: (0, import_i18n.__)(
        `Additionally, paragraphs help structure the flow of information and provide logical breaks between different concepts or pieces of information. In terms of formatting, paragraphs in websites are commonly denoted by a vertical gap or indentation between each block of text. This visual separation helps visually distinguish one paragraph from another, creating a clear and organized layout that guides the reader through the content smoothly.`
      )
    });
    if ((0, import_blocks.getBlockType)("core/group")) {
      const groupBlock = (0, import_blocks.createBlock)(
        "core/group",
        {
          layout: {
            type: "grid",
            columnCount: 2,
            minimumColumnWidth: "12rem"
          },
          style: {
            spacing: {
              blockGap: "1.5rem"
            }
          }
        },
        [firstParagraphBlock, secondParagraphBlock]
      );
      typographyBlockExamples.push(groupBlock);
    } else {
      typographyBlockExamples.push(firstParagraphBlock);
    }
  }
  if (!!typographyBlockExamples.length) {
    examples.push({
      name: "typography",
      title: (0, import_i18n.__)("Typography"),
      category: "overview",
      blocks: typographyBlockExamples
    });
  }
  const otherBlockExamples = [
    "core/image",
    "core/separator",
    "core/buttons",
    "core/pullquote",
    "core/search"
  ];
  otherBlockExamples.forEach((blockName) => {
    const blockType = (0, import_blocks.getBlockType)(blockName);
    if (blockType && blockType.example) {
      const blockExample = {
        name: blockName,
        title: blockType.title,
        category: "overview",
        /*
         * CSS generated from style attributes will take precedence over global styles CSS,
         * so remove the style attribute from the example to ensure the example
         * demonstrates changes to global styles.
         */
        blocks: (0, import_blocks.getBlockFromExample)(blockName, {
          ...blockType.example,
          attributes: {
            ...blockType.example.attributes,
            style: void 0
          }
        })
      };
      examples.push(blockExample);
    }
  });
  return examples;
}
function getExamples(colors) {
  const nonHeadingBlockExamples = (0, import_blocks.getBlockTypes)().filter((blockType) => {
    const { name, example, supports } = blockType;
    return name !== "core/heading" && !!example && supports?.inserter !== false;
  }).map((blockType) => ({
    name: blockType.name,
    title: blockType.title,
    category: blockType.category,
    /*
     * CSS generated from style attributes will take precedence over global styles CSS,
     * so remove the style attribute from the example to ensure the example
     * demonstrates changes to global styles.
     */
    blocks: (0, import_blocks.getBlockFromExample)(blockType.name, {
      ...blockType.example,
      attributes: {
        ...blockType.example.attributes,
        style: void 0
      }
    })
  }));
  const isHeadingBlockRegistered = !!(0, import_blocks.getBlockType)("core/heading");
  if (!isHeadingBlockRegistered) {
    return nonHeadingBlockExamples;
  }
  const headingsExample = {
    name: "core/heading",
    title: (0, import_i18n.__)("Headings"),
    category: "text",
    blocks: [1, 2, 3, 4, 5, 6].map((level) => {
      return (0, import_blocks.createBlock)("core/heading", {
        content: (0, import_i18n.sprintf)(
          // translators: %d: heading level e.g: "1", "2", "3"
          (0, import_i18n.__)("Heading %d"),
          level
        ),
        level
      });
    })
  };
  const colorExamples = getColorExamples(colors);
  const overviewBlockExamples = getOverviewBlockExamples(colors);
  return [
    headingsExample,
    ...colorExamples,
    ...nonHeadingBlockExamples,
    ...overviewBlockExamples
  ];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getExamples
});
//# sourceMappingURL=examples.cjs.map
