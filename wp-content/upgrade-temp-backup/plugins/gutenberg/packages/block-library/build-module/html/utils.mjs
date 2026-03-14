// packages/block-library/src/html/utils.js
function parseContent(content = "") {
  if (!content || !content.trim()) {
    return { html: "", css: "", js: "" };
  }
  const doc = document.implementation.createHTMLDocument("");
  doc.body.innerHTML = content;
  const styleTag = doc.body.querySelector(
    'style[data-wp-block-html="css"]'
  );
  const css = styleTag ? styleTag.textContent.trim() : "";
  if (styleTag) {
    styleTag.remove();
  }
  const scriptTag = doc.body.querySelector(
    'script[data-wp-block-html="js"]'
  );
  const js = scriptTag ? scriptTag.textContent.trim() : "";
  if (scriptTag) {
    scriptTag.remove();
  }
  const html = doc.body.innerHTML.trim();
  return { html, css, js };
}
function serializeContent({ html = "", css = "", js = "" }) {
  const parts = [];
  if (css.trim()) {
    parts.push(`<style data-wp-block-html="css">
${css}
</style>`);
  }
  if (js.trim()) {
    parts.push(`<script data-wp-block-html="js">
${js}
</script>`);
  }
  if (html.trim()) {
    parts.push(html);
  }
  return parts.join("\n\n");
}
export {
  parseContent,
  serializeContent
};
//# sourceMappingURL=utils.mjs.map
