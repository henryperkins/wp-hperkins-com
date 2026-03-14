// packages/blocks/src/api/raw-handling/paste-handler.js
import { getPhrasingContentSchema, removeInvalidHTML } from "@wordpress/dom";
import { htmlToBlocks } from "./html-to-blocks.mjs";
import { hasBlockSupport } from "../registration.mjs";
import { getBlockInnerHTML } from "../serializer.mjs";
import parse from "../parser/index.mjs";
import normaliseBlocks from "./normalise-blocks.mjs";
import specialCommentConverter from "./special-comment-converter.mjs";
import commentRemover from "./comment-remover.mjs";
import isInlineContent from "./is-inline-content.mjs";
import phrasingContentReducer from "./phrasing-content-reducer.mjs";
import headRemover from "./head-remover.mjs";
import msListConverter from "./ms-list-converter.mjs";
import msListIgnore from "./ms-list-ignore.mjs";
import listReducer from "./list-reducer.mjs";
import imageCorrector from "./image-corrector.mjs";
import blockquoteNormaliser from "./blockquote-normaliser.mjs";
import divNormaliser from "./div-normaliser.mjs";
import figureContentReducer from "./figure-content-reducer.mjs";
import shortcodeConverter from "./shortcode-converter.mjs";
import markdownConverter from "./markdown-converter.mjs";
import iframeRemover from "./iframe-remover.mjs";
import googleDocsUIDRemover from "./google-docs-uid-remover.mjs";
import htmlFormattingRemover from "./html-formatting-remover.mjs";
import brRemover from "./br-remover.mjs";
import { deepFilterHTML, isPlain, getBlockContentSchema } from "./utils.mjs";
import emptyParagraphRemover from "./empty-paragraph-remover.mjs";
import slackParagraphCorrector from "./slack-paragraph-corrector.mjs";
import isLatexMathMode from "./latex-to-math.mjs";
import { createBlock } from "../factory.mjs";
import headingTransformer from "./heading-transformer.mjs";
var log = (...args) => window?.console?.log?.(...args);
function filterInlineHTML(HTML) {
  HTML = deepFilterHTML(HTML, [
    headRemover,
    googleDocsUIDRemover,
    msListIgnore,
    phrasingContentReducer,
    commentRemover
  ]);
  HTML = removeInvalidHTML(HTML, getPhrasingContentSchema("paste"), {
    inline: true
  });
  HTML = deepFilterHTML(HTML, [htmlFormattingRemover, brRemover]);
  log("Processed inline HTML:\n\n", HTML);
  return HTML;
}
function pasteHandler({
  HTML = "",
  plainText = "",
  mode = "AUTO",
  tagName
}) {
  log("Received HTML (pasteHandler):\n\n", HTML);
  log("Received plain text (pasteHandler):\n\n", plainText);
  HTML = HTML.replace(/<meta[^>]+>/g, "");
  HTML = HTML.replace(
    /^\s*<html[^>]*>\s*<body[^>]*>(?:\s*<!--\s*StartFragment\s*-->)?/i,
    ""
  );
  HTML = HTML.replace(
    /(?:<!--\s*EndFragment\s*-->\s*)?<\/body>\s*<\/html>\s*$/i,
    ""
  );
  if (mode !== "INLINE") {
    const content = HTML ? HTML : plainText;
    if (content.indexOf("<!-- wp:") !== -1) {
      const parseResult = parse(content);
      const isSingleFreeFormBlock = parseResult.length === 1 && parseResult[0].name === "core/freeform";
      if (!isSingleFreeFormBlock) {
        return parseResult;
      }
    }
  }
  if (String.prototype.normalize) {
    HTML = HTML.normalize();
  }
  HTML = deepFilterHTML(HTML, [slackParagraphCorrector]);
  const isPlainText = plainText && (!HTML || isPlain(HTML));
  if (isPlainText && isLatexMathMode(plainText)) {
    return [createBlock("core/math", { latex: plainText })];
  }
  if (isPlainText) {
    HTML = plainText;
    if (!/^\s+$/.test(plainText)) {
      HTML = markdownConverter(HTML);
    }
  }
  const pieces = shortcodeConverter(HTML);
  const hasShortcodes = pieces.length > 1;
  if (isPlainText && !hasShortcodes) {
    if (mode === "AUTO" && plainText.indexOf("\n") === -1 && plainText.indexOf("<p>") !== 0 && HTML.indexOf("<p>") === 0) {
      mode = "INLINE";
    }
  }
  if (mode === "INLINE") {
    return filterInlineHTML(HTML);
  }
  if (mode === "AUTO" && !hasShortcodes && isInlineContent(HTML, tagName)) {
    return filterInlineHTML(HTML);
  }
  const phrasingContentSchema = getPhrasingContentSchema("paste");
  const blockContentSchema = getBlockContentSchema("paste");
  const blocks = pieces.map((piece) => {
    if (typeof piece !== "string") {
      return piece;
    }
    const filters = [
      googleDocsUIDRemover,
      msListConverter,
      headRemover,
      listReducer,
      imageCorrector,
      phrasingContentReducer,
      specialCommentConverter,
      commentRemover,
      iframeRemover,
      figureContentReducer,
      blockquoteNormaliser(),
      divNormaliser,
      headingTransformer
    ];
    const schema = {
      ...blockContentSchema,
      // Keep top-level phrasing content, normalised by `normaliseBlocks`.
      ...phrasingContentSchema
    };
    piece = deepFilterHTML(piece, filters, blockContentSchema);
    piece = removeInvalidHTML(piece, schema);
    piece = normaliseBlocks(piece);
    piece = deepFilterHTML(
      piece,
      [htmlFormattingRemover, brRemover, emptyParagraphRemover],
      blockContentSchema
    );
    log("Processed HTML piece:\n\n", piece);
    return htmlToBlocks(piece, pasteHandler);
  }).flat().filter(Boolean);
  if (mode === "AUTO" && blocks.length === 1 && hasBlockSupport(blocks[0].name, "__unstablePasteTextInline", false)) {
    const trimRegex = /^[\n]+|[\n]+$/g;
    const trimmedPlainText = plainText.replace(trimRegex, "");
    if (trimmedPlainText !== "" && trimmedPlainText.indexOf("\n") === -1) {
      return removeInvalidHTML(
        getBlockInnerHTML(blocks[0]),
        phrasingContentSchema
      ).replace(trimRegex, "");
    }
  }
  return blocks;
}
export {
  pasteHandler
};
//# sourceMappingURL=paste-handler.mjs.map
