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

// packages/editor/src/components/post-revisions-preview/block-diff.js
var block_diff_exports = {};
__export(block_diff_exports, {
  diffRevisionContent: () => diffRevisionContent
});
module.exports = __toCommonJS(block_diff_exports);
var import_array = require("diff/lib/diff/array");
var import_word = require("diff/lib/diff/word");
var import_block_serialization_default_parser = require("@wordpress/block-serialization-default-parser");
var import_blocks = require("@wordpress/blocks");
var import_rich_text = require("@wordpress/rich-text");
var import_i18n = require("@wordpress/i18n");
var import_lock_unlock = require("../../lock-unlock.cjs");
var { parseRawBlock } = (0, import_lock_unlock.unlock)(import_blocks.privateApis);
function textSimilarity(text1, text2) {
  if (!text1 && !text2) {
    return 1;
  }
  if (!text1 || !text2) {
    return 0;
  }
  const changes = (0, import_word.diffWords)(text1, text2);
  const unchanged = changes.filter((c) => !c.added && !c.removed).reduce((sum, c) => sum + c.value.length, 0);
  const total = Math.max(text1.length, text2.length);
  return total > 0 ? unchanged / total : 0;
}
function pairSimilarBlocks(blocks) {
  const removed = [];
  const added = [];
  blocks.forEach((block, index) => {
    const status = block.__revisionDiffStatus;
    if (status === "removed") {
      removed.push({ block, index });
    } else if (status === "added") {
      added.push({ block, index });
    }
  });
  if (removed.length === 0 || added.length === 0) {
    return blocks;
  }
  const pairedRemoved = /* @__PURE__ */ new Set();
  const modifications = /* @__PURE__ */ new Map();
  const SIMILARITY_THRESHOLD = 0.3;
  for (const rem of removed) {
    let bestMatch = null;
    let bestScore = 0;
    for (const add of added) {
      if (modifications.has(add.index)) {
        continue;
      }
      if (add.block.blockName !== rem.block.blockName) {
        continue;
      }
      const score = textSimilarity(
        rem.block.innerHTML || "",
        add.block.innerHTML || ""
      );
      const attrsMatch = JSON.stringify(rem.block.attrs) === JSON.stringify(add.block.attrs);
      if (score > bestScore && score > SIMILARITY_THRESHOLD && (score < 1 || !attrsMatch)) {
        bestScore = score;
        bestMatch = add;
      }
    }
    if (bestMatch) {
      pairedRemoved.add(rem.index);
      modifications.set(bestMatch.index, {
        ...bestMatch.block,
        __revisionDiffStatus: "modified",
        __previousRawBlock: rem.block
      });
    }
  }
  return blocks.map((block, index) => {
    if (pairedRemoved.has(index)) {
      return null;
    }
    if (modifications.has(index)) {
      return modifications.get(index);
    }
    return block;
  }).filter(Boolean);
}
function diffRawBlocks(currentRaw, previousRaw) {
  const createBlockSignature = (rawBlock) => JSON.stringify({
    name: rawBlock.blockName,
    attrs: rawBlock.attrs,
    // Use innerContent filtered to non-null and non-whitespace-only strings.
    // This excludes whitespace between inner blocks which changes based on count.
    html: (rawBlock.innerContent || []).filter(
      (c) => c !== null && c.trim() !== ""
    )
  });
  const currentSigs = currentRaw.map(createBlockSignature);
  const previousSigs = previousRaw.map(createBlockSignature);
  const diff = (0, import_array.diffArrays)(previousSigs, currentSigs);
  const result = [];
  let currIdx = 0;
  let prevIdx = 0;
  for (const part of diff) {
    if (part.added) {
      for (let i = 0; i < part.count; i++) {
        result.push({
          ...currentRaw[currIdx++],
          __revisionDiffStatus: "added"
        });
      }
    } else if (part.removed) {
      for (let i = 0; i < part.count; i++) {
        result.push({
          ...previousRaw[prevIdx++],
          __revisionDiffStatus: "removed"
        });
      }
    } else {
      for (let i = 0; i < part.count; i++) {
        const currBlock = currentRaw[currIdx++];
        const prevBlock = previousRaw[prevIdx++];
        const diffedInnerBlocks = diffRawBlocks(
          currBlock.innerBlocks || [],
          prevBlock.innerBlocks || []
        );
        result.push({
          ...currBlock,
          innerBlocks: diffedInnerBlocks
        });
      }
    }
  }
  return pairSimilarBlocks(result);
}
function hasFormatChangedAtIndex(currentFormats, previousFormats, currentIndex, previousIndex) {
  const currFmts = currentFormats[currentIndex] || [];
  const prevFmts = previousFormats[previousIndex] || [];
  if (currFmts.length !== prevFmts.length) {
    return true;
  }
  for (const fmt of currFmts) {
    const match = prevFmts.find(
      (pf) => pf.type === fmt.type && JSON.stringify(pf.attributes) === JSON.stringify(fmt.attributes)
    );
    if (!match) {
      return true;
    }
  }
  return false;
}
function describeFormatChange(currentFormats, previousFormats, currIdx, prevIdx) {
  const currFmts = currentFormats[currIdx] || [];
  const prevFmts = previousFormats[prevIdx] || [];
  let addedCount = 0;
  let removedCount = 0;
  let changedCount = 0;
  for (const fmt of currFmts) {
    const match = prevFmts.find((pf) => pf.type === fmt.type);
    if (!match) {
      addedCount++;
    } else if (JSON.stringify(fmt.attributes) !== JSON.stringify(match.attributes)) {
      changedCount++;
    }
  }
  for (const fmt of prevFmts) {
    const match = currFmts.find((cf) => cf.type === fmt.type);
    if (!match) {
      removedCount++;
    }
  }
  if (addedCount > 0 && removedCount === 0 && changedCount === 0) {
    return {
      type: "added",
      description: (0, import_i18n.sprintf)(
        /* translators: %d: number of formats added */
        (0, import_i18n._n)("%d format added", "%d formats added", addedCount),
        addedCount
      )
    };
  }
  if (removedCount > 0 && addedCount === 0 && changedCount === 0) {
    return {
      type: "removed",
      description: (0, import_i18n.sprintf)(
        /* translators: %d: number of formats removed */
        (0, import_i18n._n)("%d format removed", "%d formats removed", removedCount),
        removedCount
      )
    };
  }
  const parts = [];
  if (addedCount > 0) {
    parts.push(
      (0, import_i18n.sprintf)(
        /* translators: %d: number of formats added */
        (0, import_i18n._n)("%d format added", "%d formats added", addedCount),
        addedCount
      )
    );
  }
  if (removedCount > 0) {
    parts.push(
      (0, import_i18n.sprintf)(
        /* translators: %d: number of formats removed */
        (0, import_i18n._n)("%d format removed", "%d formats removed", removedCount),
        removedCount
      )
    );
  }
  if (changedCount > 0) {
    parts.push(
      (0, import_i18n.sprintf)(
        /* translators: %d: number of formats changed */
        (0, import_i18n._n)("%d format changed", "%d formats changed", changedCount),
        changedCount
      )
    );
  }
  return {
    type: "changed",
    description: parts.join(", ") || (0, import_i18n.__)("Formatting changed")
  };
}
function applyRichTextDiff(currentRichText, previousRichText) {
  const currentText = currentRichText.toPlainText();
  const previousText = previousRichText.toPlainText();
  const textDiff = (0, import_word.diffWords)(previousText, currentText);
  let result = (0, import_rich_text.create)({ text: "" });
  let currentIdx = 0;
  let previousIdx = 0;
  for (const part of textDiff) {
    if (part.removed) {
      const removedSlice = (0, import_rich_text.slice)(
        previousRichText,
        previousIdx,
        previousIdx + part.value.length
      );
      const formatted = (0, import_rich_text.applyFormat)(
        removedSlice,
        {
          type: "revision/diff-removed",
          attributes: { title: (0, import_i18n.__)("Removed") }
        },
        0,
        part.value.length
      );
      result = (0, import_rich_text.concat)(result, formatted);
      previousIdx += part.value.length;
    } else if (part.added) {
      const addedSlice = (0, import_rich_text.slice)(
        currentRichText,
        currentIdx,
        currentIdx + part.value.length
      );
      const formatted = (0, import_rich_text.applyFormat)(
        addedSlice,
        {
          type: "revision/diff-added",
          attributes: { title: (0, import_i18n.__)("Added") }
        },
        0,
        part.value.length
      );
      result = (0, import_rich_text.concat)(result, formatted);
      currentIdx += part.value.length;
    } else {
      const currentFormats = currentRichText.formats || [];
      const previousFormats = previousRichText.formats || [];
      const len = part.value.length;
      const checkFormatChanged = (offset) => hasFormatChangedAtIndex(
        currentFormats,
        previousFormats,
        currentIdx + offset,
        previousIdx + offset
      );
      let rangeStart = 0;
      let rangeFormatChanged = checkFormatChanged(0);
      for (let i = 1; i <= len; i++) {
        const formatChanged = i < len && checkFormatChanged(i);
        if (i === len || formatChanged !== rangeFormatChanged) {
          const rangeSlice = (0, import_rich_text.slice)(
            currentRichText,
            currentIdx + rangeStart,
            currentIdx + i
          );
          if (rangeFormatChanged) {
            const { type, description } = describeFormatChange(
              currentFormats,
              previousFormats,
              currentIdx + rangeStart,
              previousIdx + rangeStart
            );
            const formatType = {
              added: "revision/diff-format-added",
              removed: "revision/diff-format-removed",
              changed: "revision/diff-format-changed"
            }[type];
            const marked = (0, import_rich_text.applyFormat)(
              rangeSlice,
              {
                type: formatType,
                attributes: { title: description }
              },
              0,
              i - rangeStart
            );
            result = (0, import_rich_text.concat)(result, marked);
          } else {
            result = (0, import_rich_text.concat)(result, rangeSlice);
          }
          rangeStart = i;
          rangeFormatChanged = formatChanged;
        }
      }
      currentIdx += part.value.length;
      previousIdx += part.value.length;
    }
  }
  return new import_rich_text.RichTextData(result);
}
function applyRichTextDiffToBlock(currentBlock, previousBlock) {
  const blockType = (0, import_blocks.getBlockType)(currentBlock.name);
  if (!blockType) {
    return;
  }
  for (const [attrName, attrDef] of Object.entries(
    blockType.attributes
  )) {
    if (attrDef.source === "rich-text") {
      const currentRichText = currentBlock.attributes[attrName];
      const previousRichText = previousBlock.attributes[attrName];
      if (currentRichText instanceof import_rich_text.RichTextData && previousRichText instanceof import_rich_text.RichTextData) {
        currentBlock.attributes[attrName] = applyRichTextDiff(
          currentRichText,
          previousRichText
        );
      }
    }
  }
}
function applyDiffRecursively(parsedBlock, rawBlock) {
  if (rawBlock.__revisionDiffStatus) {
    parsedBlock.__revisionDiffStatus = rawBlock.__revisionDiffStatus;
  }
  if (rawBlock.__revisionDiffStatus === "modified" && rawBlock.__previousRawBlock) {
    const previousParsed = parseRawBlock(rawBlock.__previousRawBlock);
    if (previousParsed) {
      applyRichTextDiffToBlock(parsedBlock, previousParsed);
    }
  }
  if (parsedBlock.innerBlocks && rawBlock.innerBlocks) {
    for (let i = 0; i < parsedBlock.innerBlocks.length; i++) {
      const parsedInner = parsedBlock.innerBlocks[i];
      const rawInner = rawBlock.innerBlocks[i];
      if (parsedInner && rawInner) {
        applyDiffRecursively(parsedInner, rawInner);
      }
    }
  }
}
function diffRevisionContent(currentContent, previousContent) {
  const currentRaw = (0, import_block_serialization_default_parser.parse)(currentContent || "");
  const previousRaw = (0, import_block_serialization_default_parser.parse)(previousContent || "");
  const mergedRaw = diffRawBlocks(currentRaw, previousRaw);
  return mergedRaw.map((rawBlock) => {
    const parsed = parseRawBlock(rawBlock);
    if (parsed) {
      applyDiffRecursively(parsed, rawBlock);
    }
    return parsed;
  }).filter(Boolean);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  diffRevisionContent
});
//# sourceMappingURL=block-diff.cjs.map
