// packages/editor/src/components/style-book/examples.tsx
import { __, sprintf } from "@wordpress/i18n";
import {
  getBlockType,
  getBlockTypes,
  getBlockFromExample,
  createBlock
} from "@wordpress/blocks";
import ColorExamples from "./color-examples.mjs";
import DuotoneExamples from "./duotone-examples.mjs";
import { STYLE_BOOK_COLOR_GROUPS } from "./constants.mjs";
import { jsx } from "react/jsx-runtime";
function getColorExamples(colors) {
  if (!colors) {
    return [];
  }
  const examples = [];
  STYLE_BOOK_COLOR_GROUPS.forEach((group) => {
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
        example.content = /* @__PURE__ */ jsx(
          DuotoneExamples,
          {
            duotones: paletteFiltered[group.type]
          }
        );
        examples.push(example);
      } else {
        example.content = /* @__PURE__ */ jsx(
          ColorExamples,
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
      title: __("Colors"),
      category: "overview",
      content: /* @__PURE__ */ jsx(
        ColorExamples,
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
  if (getBlockType("core/heading")) {
    const headingBlock = createBlock("core/heading", {
      // translators: Typography example. Your local alphabet, numbers and some common special characters.
      content: __(
        `AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789X{(\u2026)},.-<>?!*&:/A@HELFO\u2122\xA9`
      ),
      level: 1
    });
    typographyBlockExamples.push(headingBlock);
  }
  if (getBlockType("core/paragraph")) {
    const firstParagraphBlock = createBlock("core/paragraph", {
      content: __(
        `A paragraph in a website refers to a distinct block of text that is used to present and organize information. It is a fundamental unit of content in web design and is typically composed of a group of related sentences or thoughts focused on a particular topic or idea. Paragraphs play a crucial role in improving the readability and user experience of a website. They break down the text into smaller, manageable chunks, allowing readers to scan the content more easily.`
      )
    });
    const secondParagraphBlock = createBlock("core/paragraph", {
      content: __(
        `Additionally, paragraphs help structure the flow of information and provide logical breaks between different concepts or pieces of information. In terms of formatting, paragraphs in websites are commonly denoted by a vertical gap or indentation between each block of text. This visual separation helps visually distinguish one paragraph from another, creating a clear and organized layout that guides the reader through the content smoothly.`
      )
    });
    if (getBlockType("core/group")) {
      const groupBlock = createBlock(
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
      title: __("Typography"),
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
    const blockType = getBlockType(blockName);
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
        blocks: getBlockFromExample(blockName, {
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
  const nonHeadingBlockExamples = getBlockTypes().filter((blockType) => {
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
    blocks: getBlockFromExample(blockType.name, {
      ...blockType.example,
      attributes: {
        ...blockType.example.attributes,
        style: void 0
      }
    })
  }));
  const isHeadingBlockRegistered = !!getBlockType("core/heading");
  if (!isHeadingBlockRegistered) {
    return nonHeadingBlockExamples;
  }
  const headingsExample = {
    name: "core/heading",
    title: __("Headings"),
    category: "text",
    blocks: [1, 2, 3, 4, 5, 6].map((level) => {
      return createBlock("core/heading", {
        content: sprintf(
          // translators: %d: heading level e.g: "1", "2", "3"
          __("Heading %d"),
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
export {
  getExamples
};
//# sourceMappingURL=examples.mjs.map
