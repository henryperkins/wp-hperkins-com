// packages/blocks/src/api/raw-handling/shortcode-converter.js
import { regexp, next } from "@wordpress/shortcode";
import { createBlock, getBlockTransforms, findTransform } from "../factory.mjs";
import { getBlockType } from "../registration.mjs";
import { getBlockAttributes } from "../parser/get-block-attributes.mjs";
import { applyBuiltInValidationFixes } from "../parser/apply-built-in-validation-fixes.mjs";
var castArray = (maybeArray) => Array.isArray(maybeArray) ? maybeArray : [maybeArray];
var beforeLineRegexp = /(\n|<p>)\s*$/;
var afterLineRegexp = /^\s*(\n|<\/p>)/;
function segmentHTMLToShortcodeBlock(HTML, lastIndex = 0, excludedBlockNames = []) {
  const transformsFrom = getBlockTransforms("from");
  const transformation = findTransform(
    transformsFrom,
    (transform) => excludedBlockNames.indexOf(transform.blockName) === -1 && transform.type === "shortcode" && castArray(transform.tag).some(
      (tag) => regexp(tag).test(HTML)
    )
  );
  if (!transformation) {
    return [HTML];
  }
  const transformTags = castArray(transformation.tag);
  const transformTag = transformTags.find(
    (tag) => regexp(tag).test(HTML)
  );
  let match;
  const previousIndex = lastIndex;
  if (match = next(transformTag, HTML, lastIndex)) {
    lastIndex = match.index + match.content.length;
    const beforeHTML = HTML.substr(0, match.index);
    const afterHTML = HTML.substr(lastIndex);
    if (!match.shortcode.content?.includes("<") && !(beforeLineRegexp.test(beforeHTML) && afterLineRegexp.test(afterHTML))) {
      return segmentHTMLToShortcodeBlock(HTML, lastIndex);
    }
    if (transformation.isMatch && !transformation.isMatch(match.shortcode.attrs)) {
      return segmentHTMLToShortcodeBlock(HTML, previousIndex, [
        ...excludedBlockNames,
        transformation.blockName
      ]);
    }
    let blocks = [];
    if (typeof transformation.transform === "function") {
      blocks = [].concat(
        transformation.transform(match.shortcode.attrs, match)
      );
      blocks = blocks.map((block) => {
        block.originalContent = match.shortcode.content;
        return applyBuiltInValidationFixes(
          block,
          getBlockType(block.name)
        );
      });
    } else {
      const attributes = Object.fromEntries(
        Object.entries(transformation.attributes).filter(([, schema]) => schema.shortcode).map(([key, schema]) => [
          key,
          schema.shortcode(match.shortcode.attrs, match)
        ])
      );
      const blockType = getBlockType(transformation.blockName);
      if (!blockType) {
        return [HTML];
      }
      const transformationBlockType = {
        ...blockType,
        attributes: transformation.attributes
      };
      let block = createBlock(
        transformation.blockName,
        getBlockAttributes(
          transformationBlockType,
          match.shortcode.content,
          attributes
        )
      );
      block.originalContent = match.shortcode.content;
      block = applyBuiltInValidationFixes(
        block,
        transformationBlockType
      );
      blocks = [block];
    }
    return [
      ...segmentHTMLToShortcodeBlock(
        beforeHTML.replace(beforeLineRegexp, "")
      ),
      ...blocks,
      ...segmentHTMLToShortcodeBlock(
        afterHTML.replace(afterLineRegexp, "")
      )
    ];
  }
  return [HTML];
}
var shortcode_converter_default = segmentHTMLToShortcodeBlock;
export {
  shortcode_converter_default as default
};
//# sourceMappingURL=shortcode-converter.mjs.map
