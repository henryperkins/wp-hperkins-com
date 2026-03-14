// packages/core-data/src/awareness/base-awareness.ts
import { resolveSelect } from "@wordpress/data";
import { AwarenessState } from "./awareness-state.mjs";
import { STORE_NAME as coreStore } from "../name.mjs";
import { generateCollaboratorInfo, areCollaboratorInfosEqual } from "./utils.mjs";
var BaseAwarenessState = class extends AwarenessState {
  onSetUp() {
    void this.setCurrentCollaboratorInfo();
  }
  /**
   * Set the current collaborator info in the local state.
   */
  async setCurrentCollaboratorInfo() {
    const currentUser = await resolveSelect(coreStore).getCurrentUser();
    const collaboratorInfo = generateCollaboratorInfo(currentUser);
    this.setLocalStateField("collaboratorInfo", collaboratorInfo);
  }
};
var baseEqualityFieldChecks = {
  collaboratorInfo: areCollaboratorInfosEqual
};
var BaseAwareness = class extends BaseAwarenessState {
  equalityFieldChecks = baseEqualityFieldChecks;
};
export {
  BaseAwareness,
  BaseAwarenessState,
  baseEqualityFieldChecks
};
//# sourceMappingURL=base-awareness.mjs.map
