// packages/blocks/src/api/raw-handling/markdown-converter.js
import showdown from "showdown";
var converter = new showdown.Converter({
  noHeaderId: true,
  tables: true,
  literalMidWordUnderscores: true,
  omitExtraWLInCodeBlocks: true,
  simpleLineBreaks: true,
  strikethrough: true
});
function slackMarkdownVariantCorrector(text) {
  return text.replace(
    /((?:^|\n)```)([^\n`]+)(```(?:$|\n))/,
    (match, p1, p2, p3) => `${p1}
${p2}
${p3}`
  );
}
function bulletsToAsterisks(text) {
  return text.replace(/(^|\n)•( +)/g, "$1*$2");
}
function markdownConverter(text) {
  return converter.makeHtml(
    slackMarkdownVariantCorrector(bulletsToAsterisks(text))
  );
}
export {
  markdownConverter as default
};
//# sourceMappingURL=markdown-converter.mjs.map
