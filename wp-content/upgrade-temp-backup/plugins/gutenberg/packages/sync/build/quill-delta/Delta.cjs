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

// packages/sync/src/quill-delta/Delta.ts
var Delta_exports = {};
__export(Delta_exports, {
  AttributeMap: () => import_AttributeMap.default,
  Op: () => import_Op.default,
  OpIterator: () => import_OpIterator.default,
  default: () => Delta_default
});
module.exports = __toCommonJS(Delta_exports);
var import_diff = require("diff");
var import_es6 = __toESM(require("fast-deep-equal/es6"));
var import_AttributeMap = __toESM(require("./AttributeMap.cjs"));
var import_Op = __toESM(require("./Op.cjs"));
var import_OpIterator = __toESM(require("./OpIterator.cjs"));
function cloneDeep(value) {
  return JSON.parse(JSON.stringify(value));
}
var NULL_CHARACTER = String.fromCharCode(0);
function normalizeChangeCounts(changes) {
  return changes.map((change) => ({
    ...change,
    count: change.value.length
  }));
}
var getEmbedTypeAndData = (a, b) => {
  if (typeof a !== "object" || a === null) {
    throw new Error(`cannot retain a ${typeof a}`);
  }
  if (typeof b !== "object" || b === null) {
    throw new Error(`cannot retain a ${typeof b}`);
  }
  const embedType = Object.keys(a)[0];
  if (!embedType || embedType !== Object.keys(b)[0]) {
    throw new Error(
      `embed types not matched: ${embedType} != ${Object.keys(b)[0]}`
    );
  }
  return [embedType, a[embedType], b[embedType]];
};
var Delta = class _Delta {
  static Op = import_Op.default;
  static OpIterator = import_OpIterator.default;
  static AttributeMap = import_AttributeMap.default;
  static handlers = {};
  static registerEmbed(embedType, handler) {
    this.handlers[embedType] = handler;
  }
  static unregisterEmbed(embedType) {
    delete this.handlers[embedType];
  }
  static getHandler(embedType) {
    const handler = this.handlers[embedType];
    if (!handler) {
      throw new Error(`no handlers for embed type "${embedType}"`);
    }
    return handler;
  }
  ops;
  constructor(ops) {
    if (Array.isArray(ops)) {
      this.ops = ops;
    } else if (ops !== null && ops !== void 0 && Array.isArray(ops.ops)) {
      this.ops = ops.ops;
    } else {
      this.ops = [];
    }
  }
  insert(arg, attributes) {
    const newOp = {};
    if (typeof arg === "string" && arg.length === 0) {
      return this;
    }
    newOp.insert = arg;
    if (attributes !== null && attributes !== void 0 && typeof attributes === "object" && Object.keys(attributes).length > 0) {
      newOp.attributes = attributes;
    }
    return this.push(newOp);
  }
  delete(length) {
    if (length <= 0) {
      return this;
    }
    return this.push({ delete: length });
  }
  retain(length, attributes) {
    if (typeof length === "number" && length <= 0) {
      return this;
    }
    const newOp = { retain: length };
    if (attributes !== null && attributes !== void 0 && typeof attributes === "object" && Object.keys(attributes).length > 0) {
      newOp.attributes = attributes;
    }
    return this.push(newOp);
  }
  push(newOp) {
    let index = this.ops.length;
    let lastOp = this.ops[index - 1];
    newOp = cloneDeep(newOp);
    if (typeof lastOp === "object") {
      if (typeof newOp.delete === "number" && typeof lastOp.delete === "number") {
        this.ops[index - 1] = {
          delete: lastOp.delete + newOp.delete
        };
        return this;
      }
      if (typeof lastOp.delete === "number" && newOp.insert !== null && newOp.insert !== void 0) {
        index -= 1;
        lastOp = this.ops[index - 1];
        if (typeof lastOp !== "object") {
          this.ops.unshift(newOp);
          return this;
        }
      }
      if ((0, import_es6.default)(newOp.attributes, lastOp.attributes)) {
        if (typeof newOp.insert === "string" && typeof lastOp.insert === "string") {
          this.ops[index - 1] = {
            insert: lastOp.insert + newOp.insert
          };
          if (typeof newOp.attributes === "object") {
            this.ops[index - 1].attributes = newOp.attributes;
          }
          return this;
        } else if (typeof newOp.retain === "number" && typeof lastOp.retain === "number") {
          this.ops[index - 1] = {
            retain: lastOp.retain + newOp.retain
          };
          if (typeof newOp.attributes === "object") {
            this.ops[index - 1].attributes = newOp.attributes;
          }
          return this;
        }
      }
    }
    if (index === this.ops.length) {
      this.ops.push(newOp);
    } else {
      this.ops.splice(index, 0, newOp);
    }
    return this;
  }
  chop() {
    const lastOp = this.ops[this.ops.length - 1];
    if (lastOp && typeof lastOp.retain === "number" && !lastOp.attributes) {
      this.ops.pop();
    }
    return this;
  }
  filter(predicate) {
    return this.ops.filter(predicate);
  }
  forEach(predicate) {
    this.ops.forEach(predicate);
  }
  map(predicate) {
    return this.ops.map(predicate);
  }
  partition(predicate) {
    const passed = [];
    const failed = [];
    this.forEach((op) => {
      const target = predicate(op) ? passed : failed;
      target.push(op);
    });
    return [passed, failed];
  }
  reduce(predicate, initialValue) {
    return this.ops.reduce(predicate, initialValue);
  }
  changeLength() {
    return this.reduce((length, elem) => {
      if (elem.insert) {
        return length + import_Op.default.length(elem);
      } else if (elem.delete) {
        return length - elem.delete;
      }
      return length;
    }, 0);
  }
  length() {
    return this.reduce((length, elem) => {
      return length + import_Op.default.length(elem);
    }, 0);
  }
  slice(start = 0, end = Infinity) {
    const ops = [];
    const iter = new import_OpIterator.default(this.ops);
    let index = 0;
    while (index < end && iter.hasNext()) {
      let nextOp;
      if (index < start) {
        nextOp = iter.next(start - index);
      } else {
        nextOp = iter.next(end - index);
        ops.push(nextOp);
      }
      index += import_Op.default.length(nextOp);
    }
    return new _Delta(ops);
  }
  compose(other) {
    const thisIter = new import_OpIterator.default(this.ops);
    const otherIter = new import_OpIterator.default(other.ops);
    const ops = [];
    const firstOther = otherIter.peek();
    if (firstOther !== null && firstOther !== void 0 && typeof firstOther.retain === "number" && (firstOther.attributes === null || firstOther.attributes === void 0)) {
      let firstLeft = firstOther.retain;
      while (thisIter.peekType() === "insert" && thisIter.peekLength() <= firstLeft) {
        firstLeft -= thisIter.peekLength();
        ops.push(thisIter.next());
      }
      if (firstOther.retain - firstLeft > 0) {
        otherIter.next(firstOther.retain - firstLeft);
      }
    }
    const delta = new _Delta(ops);
    while (thisIter.hasNext() || otherIter.hasNext()) {
      if (otherIter.peekType() === "insert") {
        delta.push(otherIter.next());
      } else if (thisIter.peekType() === "delete") {
        delta.push(thisIter.next());
      } else {
        const length = Math.min(
          thisIter.peekLength(),
          otherIter.peekLength()
        );
        const thisOp = thisIter.next(length);
        const otherOp = otherIter.next(length);
        if (otherOp.retain) {
          const newOp = {};
          if (typeof thisOp.retain === "number") {
            newOp.retain = typeof otherOp.retain === "number" ? length : otherOp.retain;
          } else if (typeof otherOp.retain === "number") {
            if (thisOp.retain === null || thisOp.retain === void 0) {
              newOp.insert = thisOp.insert;
            } else {
              newOp.retain = thisOp.retain;
            }
          } else {
            const action = thisOp.retain === null || thisOp.retain === void 0 ? "insert" : "retain";
            const [embedType, thisData, otherData] = getEmbedTypeAndData(
              thisOp[action],
              otherOp.retain
            );
            const handler = _Delta.getHandler(embedType);
            newOp[action] = {
              [embedType]: handler.compose(
                thisData,
                otherData,
                action === "retain"
              )
            };
          }
          const attributes = import_AttributeMap.default.compose(
            thisOp.attributes,
            otherOp.attributes,
            typeof thisOp.retain === "number"
          );
          if (attributes) {
            newOp.attributes = attributes;
          }
          delta.push(newOp);
          if (!otherIter.hasNext() && (0, import_es6.default)(delta.ops[delta.ops.length - 1], newOp)) {
            const rest = new _Delta(thisIter.rest());
            return delta.concat(rest).chop();
          }
        } else if (typeof otherOp.delete === "number" && (typeof thisOp.retain === "number" || typeof thisOp.retain === "object" && thisOp.retain !== null)) {
          delta.push(otherOp);
        }
      }
    }
    return delta.chop();
  }
  concat(other) {
    const delta = new _Delta(this.ops.slice());
    if (other.ops.length > 0) {
      delta.push(other.ops[0]);
      delta.ops = delta.ops.concat(other.ops.slice(1));
    }
    return delta;
  }
  diff(other) {
    if (this.ops === other.ops) {
      return new _Delta();
    }
    const strings = this.deltasToStrings(other);
    const diffResult = normalizeChangeCounts(
      (0, import_diff.diffChars)(strings[0], strings[1])
    );
    const thisIter = new import_OpIterator.default(this.ops);
    const otherIter = new import_OpIterator.default(other.ops);
    const retDelta = this.convertChangesToDelta(
      diffResult,
      thisIter,
      otherIter
    );
    return retDelta.chop();
  }
  eachLine(predicate, newline = "\n") {
    const iter = new import_OpIterator.default(this.ops);
    let line = new _Delta();
    let i = 0;
    while (iter.hasNext()) {
      if (iter.peekType() !== "insert") {
        return;
      }
      const thisOp = iter.peek();
      const start = import_Op.default.length(thisOp) - iter.peekLength();
      const index = typeof thisOp.insert === "string" ? thisOp.insert.indexOf(newline, start) - start : -1;
      if (index < 0) {
        line.push(iter.next());
      } else if (index > 0) {
        line.push(iter.next(index));
      } else {
        if (predicate(line, iter.next(1).attributes || {}, i) === false) {
          return;
        }
        i += 1;
        line = new _Delta();
      }
    }
    if (line.length() > 0) {
      predicate(line, {}, i);
    }
  }
  invert(base) {
    const inverted = new _Delta();
    this.reduce((baseIndex, op) => {
      if (op.insert) {
        inverted.delete(import_Op.default.length(op));
      } else if (typeof op.retain === "number" && (op.attributes === null || op.attributes === void 0)) {
        inverted.retain(op.retain);
        return baseIndex + op.retain;
      } else if (op.delete || typeof op.retain === "number") {
        const length = op.delete || op.retain;
        const slice = base.slice(baseIndex, baseIndex + length);
        slice.forEach((baseOp) => {
          if (op.delete) {
            inverted.push(baseOp);
          } else if (op.retain && op.attributes) {
            inverted.retain(
              import_Op.default.length(baseOp),
              import_AttributeMap.default.invert(
                op.attributes,
                baseOp.attributes
              )
            );
          }
        });
        return baseIndex + length;
      } else if (typeof op.retain === "object" && op.retain !== null) {
        const slice = base.slice(baseIndex, baseIndex + 1);
        const baseOp = new import_OpIterator.default(slice.ops).next();
        const [embedType, opData, baseOpData] = getEmbedTypeAndData(
          op.retain,
          baseOp.insert
        );
        const handler = _Delta.getHandler(embedType);
        inverted.retain(
          { [embedType]: handler.invert(opData, baseOpData) },
          import_AttributeMap.default.invert(op.attributes, baseOp.attributes)
        );
        return baseIndex + 1;
      }
      return baseIndex;
    }, 0);
    return inverted.chop();
  }
  transform(arg, priority = false) {
    priority = !!priority;
    if (typeof arg === "number") {
      return this.transformPosition(arg, priority);
    }
    const other = arg;
    const thisIter = new import_OpIterator.default(this.ops);
    const otherIter = new import_OpIterator.default(other.ops);
    const delta = new _Delta();
    while (thisIter.hasNext() || otherIter.hasNext()) {
      if (thisIter.peekType() === "insert" && (priority || otherIter.peekType() !== "insert")) {
        delta.retain(import_Op.default.length(thisIter.next()));
      } else if (otherIter.peekType() === "insert") {
        delta.push(otherIter.next());
      } else {
        const length = Math.min(
          thisIter.peekLength(),
          otherIter.peekLength()
        );
        const thisOp = thisIter.next(length);
        const otherOp = otherIter.next(length);
        if (thisOp.delete) {
          continue;
        } else if (otherOp.delete) {
          delta.push(otherOp);
        } else {
          const thisData = thisOp.retain;
          const otherData = otherOp.retain;
          let transformedData = typeof otherData === "object" && otherData !== null ? otherData : length;
          if (typeof thisData === "object" && thisData !== null && typeof otherData === "object" && otherData !== null) {
            const embedType = Object.keys(thisData)[0];
            if (embedType === Object.keys(otherData)[0]) {
              const handler = _Delta.getHandler(embedType);
              if (handler) {
                transformedData = {
                  [embedType]: handler.transform(
                    thisData[embedType],
                    otherData[embedType],
                    priority
                  )
                };
              }
            }
          }
          delta.retain(
            transformedData,
            import_AttributeMap.default.transform(
              thisOp.attributes,
              otherOp.attributes,
              priority
            )
          );
        }
      }
    }
    return delta.chop();
  }
  transformPosition(index, priority = false) {
    priority = !!priority;
    const thisIter = new import_OpIterator.default(this.ops);
    let offset = 0;
    while (thisIter.hasNext() && offset <= index) {
      const length = thisIter.peekLength();
      const nextType = thisIter.peekType();
      thisIter.next();
      if (nextType === "delete") {
        index -= Math.min(length, index - offset);
        continue;
      } else if (nextType === "insert" && (offset < index || !priority)) {
        index += length;
      }
      offset += length;
    }
    return index;
  }
  /**
   * Given a Delta and a cursor position, do a diff and attempt to adjust
   * the diff to place insertions or deletions at the cursor position.
   *
   * @param other             - The other Delta to diff against.
   * @param cursorAfterChange - The cursor position index after the change.
   * @return A Delta that attempts to place insertions or deletions at the cursor position.
   */
  diffWithCursor(other, cursorAfterChange) {
    if (this.ops === other.ops) {
      return new _Delta();
    } else if (cursorAfterChange === null) {
      return this.diff(other);
    }
    const strings = this.deltasToStrings(other);
    let diffs = normalizeChangeCounts(
      (0, import_diff.diffChars)(strings[0], strings[1])
    );
    let lastDiffPosition = 0;
    const adjustedDiffs = [];
    for (let i = 0; i < diffs.length; i++) {
      const diff = diffs[i];
      const segmentStart = lastDiffPosition;
      const segmentEnd = lastDiffPosition + (diff.count ?? 0);
      const isCursorInSegment = cursorAfterChange > segmentStart && cursorAfterChange <= segmentEnd;
      const isUnchangedSegment = !diff.added && !diff.removed;
      const isRemovalSegment = diff.removed && !diff.added;
      const nextDiff = diffs[i + 1];
      const isNextDiffAnInsert = nextDiff && nextDiff.added && !nextDiff.removed;
      if (isUnchangedSegment && isCursorInSegment && isNextDiffAnInsert) {
        const movedSegments = this.tryMoveInsertionToCursor(
          diff,
          nextDiff,
          cursorAfterChange,
          segmentStart
        );
        if (movedSegments) {
          adjustedDiffs.push(...movedSegments);
          i++;
          lastDiffPosition = segmentEnd;
          continue;
        }
      }
      if (isRemovalSegment) {
        const movedSegments = this.tryMoveDeletionToCursor(
          diff,
          adjustedDiffs,
          cursorAfterChange,
          lastDiffPosition
        );
        if (movedSegments) {
          adjustedDiffs.pop();
          adjustedDiffs.push(...movedSegments);
          lastDiffPosition += diff.count ?? 0;
          continue;
        }
      }
      adjustedDiffs.push(diff);
      if (!diff.added) {
        lastDiffPosition += diff.count ?? 0;
      }
    }
    diffs = adjustedDiffs;
    const thisIter = new import_OpIterator.default(this.ops);
    const otherIter = new import_OpIterator.default(other.ops);
    const retDelta = this.convertChangesToDelta(
      diffs,
      thisIter,
      otherIter
    );
    return retDelta.chop();
  }
  /**
   * Try to move an insertion operation from after an unchanged segment to the cursor position within it.
   * This is a "look-ahead" strategy.
   *
   * @param diff              - The current unchanged diff segment.
   * @param nextDiff          - The next diff segment (expected to be an insertion).
   * @param cursorAfterChange - The cursor position after the change.
   * @param segmentStart      - The start position of the current segment.
   * @return An array of adjusted diff segments if the insertion was successfully moved, null otherwise.
   */
  tryMoveInsertionToCursor(diff, nextDiff, cursorAfterChange, segmentStart) {
    const nextDiffInsert = nextDiff.value;
    const insertLength = nextDiffInsert.length;
    const insertOffset = cursorAfterChange - segmentStart - insertLength;
    const textAtCursor = diff.value.substring(
      insertOffset,
      insertOffset + nextDiffInsert.length
    );
    const isInsertMoveable = textAtCursor === nextDiffInsert;
    if (!isInsertMoveable) {
      return null;
    }
    const beforeCursor = diff.value.substring(0, insertOffset);
    const afterCursor = diff.value.substring(insertOffset);
    const result = [];
    if (beforeCursor.length > 0) {
      result.push({
        value: beforeCursor,
        count: beforeCursor.length,
        added: false,
        removed: false
      });
    }
    result.push(nextDiff);
    if (afterCursor.length > 0) {
      result.push({
        value: afterCursor,
        count: afterCursor.length,
        added: false,
        removed: false
      });
    }
    return result;
  }
  /**
   * Try to move a deletion operation to the cursor position by looking back at the previous unchanged segment.
   * This is a "look-back" strategy.
   *
   * @param diff              - The current deletion diff segment.
   * @param adjustedDiffs     - The array of previously processed diff segments.
   * @param cursorAfterChange - The cursor position after the change.
   * @param lastDiffPosition  - The position in the document up to (but not including) the current diff.
   * @return An array of adjusted diff segments if the deletion was successfully moved, null otherwise.
   */
  tryMoveDeletionToCursor(diff, adjustedDiffs, cursorAfterChange, lastDiffPosition) {
    const prevDiff = adjustedDiffs[adjustedDiffs.length - 1];
    if (!prevDiff || prevDiff.added || prevDiff.removed) {
      return null;
    }
    const prevSegmentStart = lastDiffPosition - (prevDiff.count ?? 0);
    const prevSegmentEnd = lastDiffPosition;
    if (cursorAfterChange < prevSegmentStart || cursorAfterChange >= prevSegmentEnd) {
      return null;
    }
    const deletedChars = diff.value;
    const deleteOffset = cursorAfterChange - prevSegmentStart;
    const textAtCursor = prevDiff.value.substring(
      deleteOffset,
      deleteOffset + deletedChars.length
    );
    const canBePlacedHere = textAtCursor === deletedChars;
    if (!canBePlacedHere) {
      return null;
    }
    const beforeCursor = prevDiff.value.substring(0, deleteOffset);
    const atAndAfterCursor = prevDiff.value.substring(deleteOffset);
    const deletionLength = diff.count ?? 0;
    const afterDeletion = atAndAfterCursor.substring(deletionLength);
    const result = [];
    if (beforeCursor.length > 0) {
      result.push({
        value: beforeCursor,
        count: beforeCursor.length,
        added: false,
        removed: false
      });
    }
    result.push(diff);
    if (afterDeletion.length > 0) {
      result.push({
        value: afterDeletion,
        count: afterDeletion.length,
        added: false,
        removed: false
      });
    }
    return result;
  }
  /**
   * Convert two Deltas to string representations for diffing.
   *
   * @param other - The other Delta to convert.
   * @return A tuple of [thisString, otherString].
   */
  deltasToStrings(other) {
    return [this, other].map((delta) => {
      return delta.map((op) => {
        if (op.insert !== null || op.insert !== void 0) {
          return typeof op.insert === "string" ? op.insert : NULL_CHARACTER;
        }
        const prep = delta === other ? "on" : "with";
        throw new Error(
          "diff() called " + prep + " non-document"
        );
      }).join("");
    });
  }
  /**
   * Process diff changes and convert them to Delta operations.
   *
   * @param changes   - The array of changes from the diff algorithm.
   * @param thisIter  - Iterator for this Delta's operations.
   * @param otherIter - Iterator for the other Delta's operations.
   * @return A Delta containing the processed diff operations.
   */
  convertChangesToDelta(changes, thisIter, otherIter) {
    const retDelta = new _Delta();
    changes.forEach((component) => {
      let length = component.count ?? 0;
      while (length > 0) {
        let opLength = 0;
        if (component.added) {
          opLength = Math.min(otherIter.peekLength(), length);
          retDelta.push(otherIter.next(opLength));
        } else if (component.removed) {
          opLength = Math.min(length, thisIter.peekLength());
          thisIter.next(opLength);
          retDelta.delete(opLength);
        } else {
          opLength = Math.min(
            thisIter.peekLength(),
            otherIter.peekLength(),
            length
          );
          const thisOp = thisIter.next(opLength);
          const otherOp = otherIter.next(opLength);
          if ((0, import_es6.default)(thisOp.insert, otherOp.insert)) {
            retDelta.retain(
              opLength,
              import_AttributeMap.default.diff(
                thisOp.attributes,
                otherOp.attributes
              )
            );
          } else {
            retDelta.push(otherOp).delete(opLength);
          }
        }
        length -= opLength;
      }
    });
    return retDelta;
  }
};
var Delta_default = Delta;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AttributeMap,
  Op,
  OpIterator
});
//# sourceMappingURL=Delta.cjs.map
