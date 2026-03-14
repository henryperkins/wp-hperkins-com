// packages/core-data/src/utils/crdt-blocks.ts
import { v4 as uuidv4 } from "uuid";
import fastDeepEqual from "fast-deep-equal/es6/index.js";
import { getBlockTypes } from "@wordpress/blocks";
import { RichTextData } from "@wordpress/rich-text";
import { Y } from "@wordpress/sync";
import { createYMap } from "./crdt-utils.mjs";
import { Delta } from "../sync.mjs";
var serializableBlocksCache = /* @__PURE__ */ new WeakMap();
function makeBlockAttributesSerializable(attributes) {
  const newAttributes = { ...attributes };
  for (const [key, value] of Object.entries(attributes)) {
    if (value instanceof RichTextData) {
      newAttributes[key] = value.valueOf();
    }
  }
  return newAttributes;
}
function makeBlocksSerializable(blocks) {
  return blocks.map((block) => {
    const { name, innerBlocks, attributes, ...rest } = block;
    delete rest.validationIssues;
    return {
      ...rest,
      name,
      attributes: makeBlockAttributesSerializable(attributes),
      innerBlocks: makeBlocksSerializable(innerBlocks)
    };
  });
}
function areBlocksEqual(gblock, yblock) {
  const yblockAsJson = yblock.toJSON();
  const overwrites = {
    innerBlocks: null,
    clientId: null
  };
  const res = fastDeepEqual(
    Object.assign({}, gblock, overwrites),
    Object.assign({}, yblockAsJson, overwrites)
  );
  const inners = gblock.innerBlocks || [];
  const yinners = yblock.get("innerBlocks");
  return res && inners.length === yinners?.length && inners.every(
    (block, i) => areBlocksEqual(block, yinners.get(i))
  );
}
function createNewYAttributeMap(blockName, attributes) {
  return new Y.Map(
    Object.entries(attributes).map(
      ([attributeName, attributeValue]) => {
        return [
          attributeName,
          createNewYAttributeValue(
            blockName,
            attributeName,
            attributeValue
          )
        ];
      }
    )
  );
}
function createNewYAttributeValue(blockName, attributeName, attributeValue) {
  const isRichText = isRichTextAttribute(blockName, attributeName);
  if (isRichText) {
    return new Y.Text(attributeValue?.toString() ?? "");
  }
  return attributeValue;
}
function createNewYBlock(block) {
  return createYMap(
    Object.fromEntries(
      Object.entries(block).map(([key, value]) => {
        switch (key) {
          case "attributes": {
            return [
              key,
              createNewYAttributeMap(block.name, value)
            ];
          }
          case "innerBlocks": {
            const innerBlocks = new Y.Array();
            if (!Array.isArray(value)) {
              return [key, innerBlocks];
            }
            innerBlocks.insert(
              0,
              value.map(
                (innerBlock) => createNewYBlock(innerBlock)
              )
            );
            return [key, innerBlocks];
          }
          default:
            return [key, value];
        }
      })
    )
  );
}
function mergeCrdtBlocks(yblocks, incomingBlocks, cursorPosition) {
  if (!serializableBlocksCache.has(incomingBlocks)) {
    serializableBlocksCache.set(
      incomingBlocks,
      makeBlocksSerializable(incomingBlocks)
    );
  }
  const allBlocks = serializableBlocksCache.get(incomingBlocks) ?? [];
  const blocksToSync = allBlocks.filter(
    (block) => shouldBlockBeSynced(block)
  );
  const numOfCommonEntries = Math.min(
    blocksToSync.length ?? 0,
    yblocks.length
  );
  let left = 0;
  let right = 0;
  for (; left < numOfCommonEntries && areBlocksEqual(blocksToSync[left], yblocks.get(left)); left++) {
  }
  for (; right < numOfCommonEntries - left && areBlocksEqual(
    blocksToSync[blocksToSync.length - right - 1],
    yblocks.get(yblocks.length - right - 1)
  ); right++) {
  }
  const numOfUpdatesNeeded = numOfCommonEntries - left - right;
  const numOfInsertionsNeeded = Math.max(
    0,
    blocksToSync.length - yblocks.length
  );
  const numOfDeletionsNeeded = Math.max(
    0,
    yblocks.length - blocksToSync.length
  );
  for (let i = 0; i < numOfUpdatesNeeded; i++, left++) {
    const block = blocksToSync[left];
    const yblock = yblocks.get(left);
    Object.entries(block).forEach(([key, value]) => {
      switch (key) {
        case "attributes": {
          const currentAttributes = yblock.get(key);
          if (!currentAttributes) {
            yblock.set(
              key,
              createNewYAttributeMap(block.name, value)
            );
            break;
          }
          Object.entries(value).forEach(
            ([attributeName, attributeValue]) => {
              const currentAttribute = currentAttributes?.get(attributeName);
              const isExpectedType = isExpectedAttributeType(
                block.name,
                attributeName,
                currentAttribute
              );
              const isAttributeChanged = !isExpectedType || !fastDeepEqual(
                currentAttribute,
                attributeValue
              );
              if (isAttributeChanged) {
                updateYBlockAttribute(
                  block.name,
                  attributeName,
                  attributeValue,
                  currentAttributes,
                  cursorPosition
                );
              }
            }
          );
          currentAttributes.forEach(
            (_attrValue, attrName) => {
              if (!value.hasOwnProperty(attrName)) {
                currentAttributes.delete(attrName);
              }
            }
          );
          break;
        }
        case "innerBlocks": {
          let yInnerBlocks = yblock.get(key);
          if (!(yInnerBlocks instanceof Y.Array)) {
            yInnerBlocks = new Y.Array();
            yblock.set(key, yInnerBlocks);
          }
          mergeCrdtBlocks(
            yInnerBlocks,
            value ?? [],
            cursorPosition
          );
          break;
        }
        default:
          if (!fastDeepEqual(block[key], yblock.get(key))) {
            yblock.set(key, value);
          }
      }
    });
    yblock.forEach((_v, k) => {
      if (!block.hasOwnProperty(k)) {
        yblock.delete(k);
      }
    });
  }
  yblocks.delete(left, numOfDeletionsNeeded);
  for (let i = 0; i < numOfInsertionsNeeded; i++, left++) {
    const newBlock = [createNewYBlock(blocksToSync[left])];
    yblocks.insert(left, newBlock);
  }
  const knownClientIds = /* @__PURE__ */ new Set();
  for (let j = 0; j < yblocks.length; j++) {
    const yblock = yblocks.get(j);
    let clientId = yblock.get("clientId");
    if (!clientId) {
      continue;
    }
    if (knownClientIds.has(clientId)) {
      clientId = uuidv4();
      yblock.set("clientId", clientId);
    }
    knownClientIds.add(clientId);
  }
}
function shouldBlockBeSynced(block) {
  if ("core/gallery" === block.name) {
    return !block.innerBlocks.some(
      (innerBlock) => innerBlock.attributes && innerBlock.attributes.blob
    );
  }
  return true;
}
function updateYBlockAttribute(blockName, attributeName, attributeValue, currentAttributes, cursorPosition) {
  const isRichText = isRichTextAttribute(blockName, attributeName);
  const currentAttribute = currentAttributes.get(attributeName);
  if (isRichText && "string" === typeof attributeValue && currentAttributes.has(attributeName) && currentAttribute instanceof Y.Text) {
    mergeRichTextUpdate(currentAttribute, attributeValue, cursorPosition);
  } else {
    currentAttributes.set(
      attributeName,
      createNewYAttributeValue(blockName, attributeName, attributeValue)
    );
  }
}
var cachedBlockAttributeTypes;
function getBlockAttributeType(blockName, attributeName) {
  if (!cachedBlockAttributeTypes) {
    cachedBlockAttributeTypes = /* @__PURE__ */ new Map();
    for (const blockType of getBlockTypes()) {
      const blockAttributeTypeMap = /* @__PURE__ */ new Map();
      for (const [name, definition] of Object.entries(
        blockType.attributes ?? {}
      )) {
        if (definition.type) {
          blockAttributeTypeMap.set(name, definition.type);
        }
      }
      cachedBlockAttributeTypes.set(
        blockType.name,
        blockAttributeTypeMap
      );
    }
  }
  return cachedBlockAttributeTypes.get(blockName)?.get(attributeName);
}
function isExpectedAttributeType(blockName, attributeName, attributeValue) {
  const expectedAttributeType = getBlockAttributeType(
    blockName,
    attributeName
  );
  if (expectedAttributeType === "rich-text") {
    return attributeValue instanceof Y.Text;
  } else if (expectedAttributeType === "string") {
    return typeof attributeValue === "string";
  }
  return true;
}
function isRichTextAttribute(blockName, attributeName) {
  return "rich-text" === getBlockAttributeType(blockName, attributeName);
}
var localDoc;
function mergeRichTextUpdate(blockYText, updatedValue, cursorPosition = null) {
  if (!localDoc) {
    localDoc = new Y.Doc();
  }
  const localYText = localDoc.getText("temporary-text");
  localYText.delete(0, localYText.length);
  localYText.insert(0, updatedValue);
  const currentValueAsDelta = new Delta(blockYText.toDelta());
  const updatedValueAsDelta = new Delta(localYText.toDelta());
  const deltaDiff = currentValueAsDelta.diffWithCursor(
    updatedValueAsDelta,
    cursorPosition
  );
  blockYText.applyDelta(deltaDiff.ops);
}
export {
  mergeCrdtBlocks,
  mergeRichTextUpdate
};
//# sourceMappingURL=crdt-blocks.mjs.map
