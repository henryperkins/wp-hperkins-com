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

// packages/core-data/src/awareness/awareness-state.ts
var awareness_state_exports = {};
__export(awareness_state_exports, {
  AwarenessState: () => AwarenessState
});
module.exports = __toCommonJS(awareness_state_exports);
var import_config = require("./config.cjs");
var import_typed_awareness = require("./typed-awareness.cjs");
var import_utils = require("./utils.cjs");
var AwarenessWithEqualityChecks = class extends import_typed_awareness.TypedAwareness {
  /** OVERRIDDEN METHODS */
  /**
   * Set a local state field on an awareness document. Calling this method may
   * trigger rerenders of any subscribed components.
   *
   * Equality checks are provided by the abstract `equalityFieldChecks` property.
   * @param field - The field to set.
   * @param value - The value to set.
   */
  setLocalStateField(field, value) {
    if (this.isFieldEqual(
      field,
      value,
      this.getLocalStateField(field) ?? void 0
    )) {
      return;
    }
    super.setLocalStateField(field, value);
  }
  /** CUSTOM METHODS */
  /**
   * Determine if a field value has changed using the provided equality checks.
   * @param field  - The field to check.
   * @param value1 - The first value to compare.
   * @param value2 - The second value to compare.
   */
  isFieldEqual(field, value1, value2) {
    if (["clientId", "isConnected", "isMe"].includes(field)) {
      return value1 === value2;
    }
    if (field in this.equalityFieldChecks) {
      const fn = this.equalityFieldChecks[field];
      return fn(value1, value2);
    }
    throw new Error(
      `No equality check implemented for awareness state field "${field.toString()}".`
    );
  }
  /**
   * Determine if two states are equal by comparing each field using the
   * provided equality checks.
   * @param state1 - The first state to compare.
   * @param state2 - The second state to compare.
   */
  isStateEqual(state1, state2) {
    return [
      .../* @__PURE__ */ new Set([
        ...(0, import_utils.getTypedKeys)(state1),
        ...(0, import_utils.getTypedKeys)(state2)
      ])
    ].every((field) => {
      const value1 = state1[field];
      const value2 = state2[field];
      return this.isFieldEqual(field, value1, value2);
    });
  }
};
var AwarenessState = class extends AwarenessWithEqualityChecks {
  /** CUSTOM PROPERTIES */
  /**
   * Whether the setUp method has been called, to avoid running it multiple
   * times.
   */
  hasSetupRun = false;
  /**
   * We keep track of all seen states during the current session for two reasons:
   *
   * 1. So that we can represent recently disconnected collaborators in our UI, even
   *    after they have been removed from the awareness document.
   * 2. So that we can provide debug information about all collaborators seen during
   *    the session.
   */
  disconnectedCollaborators = /* @__PURE__ */ new Set();
  seenStates = /* @__PURE__ */ new Map();
  /**
   * Hold a snapshot of the previous awareness state allows us to compare the
   * state values and avoid unnecessary updates to subscribers.
   */
  previousSnapshot = /* @__PURE__ */ new Map();
  stateSubscriptions = [];
  /**
   * In some cases, we may want to throttle setting local state fields to avoid
   * overwhelming the awareness document with rapid updates. At the same time, we
   * want to ensure that when we read our own state locally, we get the latest
   * value -- even if it hasn't yet been set on the awareness instance.
   */
  myThrottledState = {};
  throttleTimeouts = /* @__PURE__ */ new Map();
  /** CUSTOM METHODS */
  /**
   * Set up the awareness state. This method is idempotent and will only run
   * once. Subclasses should override `onSetUp()` instead of this method to
   * add their own setup logic.
   *
   * This is defined as a readonly arrow function property to prevent
   * subclasses from overriding it.
   */
  setUp = () => {
    if (this.hasSetupRun) {
      return;
    }
    this.hasSetupRun = true;
    this.onSetUp();
    this.on(
      "change",
      ({ added, removed, updated }) => {
        [...added, ...updated].forEach((id) => {
          this.disconnectedCollaborators.delete(id);
        });
        removed.forEach((id) => {
          this.disconnectedCollaborators.add(id);
          setTimeout(() => {
            this.disconnectedCollaborators.delete(id);
            this.updateSubscribers(
              true
              /* force update */
            );
          }, import_config.REMOVAL_DELAY_IN_MS);
        });
        this.updateSubscribers();
      }
    );
  };
  /**
   * Get the most recent state from the last processed change event.
   *
   * @return An array of EnhancedState< State >.
   */
  getCurrentState() {
    return Array.from(this.previousSnapshot.values());
  }
  /**
   * Get all seen states in this session to enable debug reporting.
   */
  getSeenStates() {
    return this.seenStates;
  }
  /**
   * Allow external code to subscribe to awareness state changes.
   * @param callback - The callback to subscribe to.
   */
  onStateChange(callback) {
    this.stateSubscriptions.push(callback);
    return () => {
      this.stateSubscriptions = this.stateSubscriptions.filter(
        (cb) => cb !== callback
      );
    };
  }
  /**
   * Set a local state field on an awareness document with throttle. See caveats
   * of this.setLocalStateField.
   * @param field - The field to set.
   * @param value - The value to set.
   * @param wait  - The wait time in milliseconds.
   */
  setThrottledLocalStateField(field, value, wait) {
    this.setLocalStateField(field, value);
    this.throttleTimeouts.set(
      field,
      setTimeout(() => {
        this.throttleTimeouts.delete(field);
        if (this.myThrottledState[field]) {
          this.setLocalStateField(
            field,
            this.myThrottledState[field]
          );
          delete this.myThrottledState[field];
        }
      }, wait)
    );
  }
  /**
   * Set the current collaborator's connection status as awareness state.
   * @param isConnected - The connection status.
   */
  setConnectionStatus(isConnected) {
    if (isConnected) {
      this.disconnectedCollaborators.delete(this.clientID);
    } else {
      this.disconnectedCollaborators.add(this.clientID);
    }
    this.updateSubscribers(
      true
      /* force update */
    );
  }
  /**
   * Update all subscribed listeners with the latest awareness state.
   * @param forceUpdate - Whether to force an update.
   */
  updateSubscribers(forceUpdate = false) {
    if (!this.stateSubscriptions.length) {
      return;
    }
    const states = this.getStates();
    this.seenStates = new Map([
      ...this.seenStates.entries(),
      ...states.entries()
    ]);
    const updatedStates = new Map(
      [...this.disconnectedCollaborators, ...states.keys()].filter((clientId) => {
        return Object.keys(this.seenStates.get(clientId) ?? {}).length > 0;
      }).map((clientId) => {
        const rawState = this.seenStates.get(clientId);
        const isConnected = !this.disconnectedCollaborators.has(clientId);
        const isMe = clientId === this.clientID;
        const myState = isMe ? this.myThrottledState : {};
        const state = {
          ...rawState,
          ...myState,
          clientId,
          isConnected,
          isMe
        };
        return [clientId, state];
      })
    );
    if (!forceUpdate) {
      if ((0, import_utils.areMapsEqual)(
        this.previousSnapshot,
        updatedStates,
        this.isStateEqual.bind(this)
      )) {
        return;
      }
    }
    this.previousSnapshot = updatedStates;
    this.stateSubscriptions.forEach((callback) => {
      callback(Array.from(updatedStates.values()));
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AwarenessState
});
//# sourceMappingURL=awareness-state.cjs.map
