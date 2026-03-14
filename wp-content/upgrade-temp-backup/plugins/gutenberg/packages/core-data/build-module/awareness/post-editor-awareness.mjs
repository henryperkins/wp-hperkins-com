// packages/core-data/src/awareness/post-editor-awareness.ts
import { dispatch, select, subscribe } from "@wordpress/data";
import { Y } from "@wordpress/sync";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { BaseAwarenessState, baseEqualityFieldChecks } from "./base-awareness.mjs";
import { getBlockPathInYdoc, resolveBlockClientIdByPath } from "./block-lookup.mjs";
import {
  AWARENESS_CURSOR_UPDATE_THROTTLE_IN_MS,
  LOCAL_CURSOR_UPDATE_DEBOUNCE_IN_MS
} from "./config.mjs";
import { STORE_NAME as coreStore } from "../name.mjs";
import {
  areSelectionsStatesEqual,
  getSelectionState,
  SelectionType
} from "../utils/crdt-user-selections.mjs";
var PostEditorAwareness = class extends BaseAwarenessState {
  constructor(doc, kind, name, postId) {
    super(doc);
    this.kind = kind;
    this.name = name;
    this.postId = postId;
  }
  equalityFieldChecks = {
    ...baseEqualityFieldChecks,
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
    } = select(blockEditorStore);
    let selectionStart = getSelectionStart();
    let selectionEnd = getSelectionEnd();
    let localCursorTimeout = null;
    subscribe(() => {
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
        const selectionState = getSelectionState(
          selectionStart,
          selectionEnd,
          this.doc
        );
        this.setThrottledLocalStateField(
          "editorState",
          { selection: selectionState },
          AWARENESS_CURSOR_UPDATE_THROTTLE_IN_MS
        );
      }, LOCAL_CURSOR_UPDATE_DEBOUNCE_IN_MS);
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
    dispatch(coreStore).editEntityRecord(
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
    return areSelectionsStatesEqual(state1.selection, state2.selection);
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
    if (selection.type === SelectionType.None) {
      return { textIndex: null, localClientId: null };
    }
    if (selection.type === SelectionType.WholeBlock) {
      const absolutePos = Y.createAbsolutePositionFromRelativePosition(
        selection.blockPosition,
        this.doc
      );
      let localClientId2 = null;
      if (absolutePos && absolutePos.type instanceof Y.Array) {
        const parentArray = absolutePos.type;
        const block = parentArray.get(absolutePos.index);
        if (block instanceof Y.Map) {
          const path2 = getBlockPathInYdoc(block);
          localClientId2 = path2 ? resolveBlockClientIdByPath(path2) : null;
        }
      }
      return { textIndex: null, localClientId: localClientId2 };
    }
    const cursorPos = "cursorPosition" in selection ? selection.cursorPosition : selection.cursorStartPosition;
    const absolutePosition = Y.createAbsolutePositionFromRelativePosition(
      cursorPos.relativePosition,
      this.doc
    );
    if (!absolutePosition) {
      return { textIndex: null, localClientId: null };
    }
    const yType = absolutePosition.type.parent?.parent;
    const path = yType instanceof Y.Map ? getBlockPathInYdoc(yType) : null;
    const localClientId = path ? resolveBlockClientIdByPath(path) : null;
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
export {
  PostEditorAwareness
};
//# sourceMappingURL=post-editor-awareness.mjs.map
