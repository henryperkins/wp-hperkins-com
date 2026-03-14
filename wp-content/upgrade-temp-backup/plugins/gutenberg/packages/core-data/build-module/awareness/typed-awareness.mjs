// packages/core-data/src/awareness/typed-awareness.ts
import { Awareness } from "@wordpress/sync";
import { getRecordValue } from "./utils.mjs";
var TypedAwareness = class extends Awareness {
  /**
   * Get the states from an awareness document.
   */
  getStates() {
    return super.getStates();
  }
  /**
   * Get a local state field from an awareness document.
   * @param field
   */
  getLocalStateField(field) {
    const state = this.getLocalState();
    return getRecordValue(state, field);
  }
  /**
   * Set a local state field on an awareness document.
   * @param field
   * @param value
   */
  setLocalStateField(field, value) {
    super.setLocalStateField(field, value);
  }
};
export {
  TypedAwareness
};
//# sourceMappingURL=typed-awareness.mjs.map
