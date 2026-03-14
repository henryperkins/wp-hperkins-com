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

// packages/core-data/src/awareness/post-editor-awareness.ts
var post_editor_awareness_exports = {};
__export(post_editor_awareness_exports, {
  PostEditorAwareness: () => PostEditorAwareness
});
module.exports = __toCommonJS(post_editor_awareness_exports);
var import_data = require("@wordpress/data");
var import_sync = require("@wordpress/sync");
var import_block_editor = require("@wordpress/block-editor");
var import_base_awareness = require("./base-awareness.cjs");
var import_block_lookup = require("./block-lookup.cjs");
var import_config = require("./config.cjs");
var import_name = require("../name.cjs");
var import_crdt_user_selections = require("../utils/crdt-user-selections.cjs");
var PostEditorAwareness = class extends import_base_awareness.BaseAwarenessState {
  constructor(doc, kind, name, postId) {
    super(doc);
    this.kind = kind;
    this.name = name;
    this.postId = postId;
  }
  equalityFieldChecks = {
    ...import_base_awareness.baseEqualityFieldChecks,
    editorState: this.areEditorStatesEqual
  };
  onSetUp() {
    super.onSetUp();
    this.subscribeToCollaboratorSelectionChanges();
  }
  /**
   * Subscribe to collaborator selection changes and update the selection state.
   */
  subscribeToCollaboratorSelectionChanges() {
    const {
      getSelectionStart,
      getSelectionEnd,
      getSelectedBlocksInitialCaretPosition
    } = (0, import_data.select)(import_block_editor.store);
    let selectionStart = getSelectionStart();
    let selectionEnd = getSelectionEnd();
    let localCursorTimeout = null;
    (0, import_data.subscribe)(() => {
      const newSelectionStart = getSelectionStart();
      const newSelectionEnd = getSelectionEnd();
      if (newSelectionStart === selectionStart && newSelectionEnd === selectionEnd) {
        return;
      }
      selectionStart = newSelectionStart;
      selectionEnd = newSelectionEnd;
      const initialPosition = getSelectedBlocksInitialCaretPosition();
      void this.updateSelectionInEntityRecord(
        selectionStart,
        selectionEnd,
        initialPosition
      );
      if (localCursorTimeout) {
        clearTimeout(localCursorTimeout);
      }
      localCursorTimeout = setTimeout(() => {
        const selectionState = (0, import_crdt_user_selections.getSelectionState)(
          selectionStart,
          selectionEnd,
          this.doc
        );
        this.setThrottledLocalStateField(
          "editorState",
          { selection: selectionState },
          import_config.AWARENESS_CURSOR_UPDATE_THROTTLE_IN_MS
        );
      }, import_config.LOCAL_CURSOR_UPDATE_DEBOUNCE_IN_MS);
    });
  }
  /**
   * Update the entity record with the current collaborator's selection.
   *
   * @param selectionStart  - The start position of the selection.
   * @param selectionEnd    - The end position of the selection.
   * @param initialPosition - The initial position of the selection.
   */
  async updateSelectionInEntityRecord(selectionStart, selectionEnd, initialPosition) {
    const edits = {
      selection: { selectionStart, selectionEnd, initialPosition }
    };
    const options = {
      undoIgnore: true
    };
    (0, import_data.dispatch)(import_name.STORE_NAME).editEntityRecord(
      this.kind,
      this.name,
      this.postId,
      edits,
      options
    );
  }
  /**
   * Check if two editor states are equal.
   *
   * @param state1 - The first editor state.
   * @param state2 - The second editor state.
   * @return True if the editor states are equal, false otherwise.
   */
  areEditorStatesEqual(state1, state2) {
    if (!state1 || !state2) {
      return state1 === state2;
    }
    return (0, import_crdt_user_selections.areSelectionsStatesEqual)(state1.selection, state2.selection);
  }
  /**
   * Resolve a selection state to a text index and block client ID.
   *
   * For text-based selections, navigates up from the resolved Y.Text via
   * AbstractType.parent to find the containing block, then resolves the
   * local clientId via the block's tree path.
   * For WholeBlock selections, resolves the block's relative position and
   * then finds the local clientId via tree path.
   *
   * Tree-path resolution is used instead of reading the clientId directly
   * from the Yjs block because the local block-editor store may use different
   * clientIds (e.g. in "Show Template" mode where blocks are cloned).
   *
   * @param selection - The selection state.
   * @return The text index and block client ID, or nulls if not resolvable.
   */
  convertSelectionStateToAbsolute(selection) {
    if (selection.type === import_crdt_user_selections.SelectionType.None) {
      return { textIndex: null, localClientId: null };
    }
    if (selection.type === import_crdt_user_selections.SelectionType.WholeBlock) {
      const absolutePos = import_sync.Y.createAbsolutePositionFromRelativePosition(
        selection.blockPosition,
        this.doc
      );
      let localClientId2 = null;
      if (absolutePos && absolutePos.type instanceof import_sync.Y.Array) {
        const parentArray = absolutePos.type;
        const block = parentArray.get(absolutePos.index);
        if (block instanceof import_sync.Y.Map) {
          const path2 = (0, import_block_lookup.getBlockPathInYdoc)(block);
          localClientId2 = path2 ? (0, import_block_lookup.resolveBlockClientIdByPath)(path2) : null;
        }
      }
      return { textIndex: null, localClientId: localClientId2 };
    }
    const cursorPos = "cursorPosition" in selection ? selection.cursorPosition : selection.cursorStartPosition;
    const absolutePosition = import_sync.Y.createAbsolutePositionFromRelativePosition(
      cursorPos.relativePosition,
      this.doc
    );
    if (!absolutePosition) {
      return { textIndex: null, localClientId: null };
    }
    const yType = absolutePosition.type.parent?.parent;
    const path = yType instanceof import_sync.Y.Map ? (0, import_block_lookup.getBlockPathInYdoc)(yType) : null;
    const localClientId = path ? (0, import_block_lookup.resolveBlockClientIdByPath)(path) : null;
    return { textIndex: absolutePosition.index, localClientId };
  }
  /**
   * Type guard to check if a struct is a Y.Item (not Y.GC)
   * @param struct - The struct to check.
   * @return True if the struct is a Y.Item, false otherwise.
   */
  isYItem(struct) {
    return "content" in struct;
  }
  /**
   * Get data for debugging, using the awareness state.
   *
   * @return {YDocDebugData} The debug data.
   */
  getDebugData() {
    const ydoc = this.doc;
    const docData = Object.fromEntries(
      Array.from(ydoc.share, ([key, value]) => [
        key,
        value.toJSON()
      ])
    );
    const collaboratorMapData = new Map(
      Array.from(this.getSeenStates().entries()).map(
        ([clientId, collaboratorState]) => [
          String(clientId),
          {
            name: collaboratorState.collaboratorInfo.name,
            wpUserId: collaboratorState.collaboratorInfo.id
          }
        ]
      )
    );
    const serializableClientItems = {};
    ydoc.store.clients.forEach((structs, clientId) => {
      const items = structs.filter(this.isYItem);
      serializableClientItems[clientId] = items.map((item) => {
        const { left, right, ...rest } = item;
        return {
          ...rest,
          left: left ? {
            id: left.id,
            length: left.length,
            origin: left.origin,
            content: left.content
          } : null,
          right: right ? {
            id: right.id,
            length: right.length,
            origin: right.origin,
            content: right.content
          } : null
        };
      });
    });
    return {
      doc: docData,
      clients: serializableClientItems,
      collaboratorMap: Object.fromEntries(collaboratorMapData)
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PostEditorAwareness
});
//# sourceMappingURL=post-editor-awareness.cjs.map
