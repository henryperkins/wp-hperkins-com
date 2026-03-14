/**
 * Internal dependencies
 */
import { AwarenessState } from './awareness-state';
import { areCollaboratorInfosEqual } from './utils';
import type { BaseState } from './types';
export declare abstract class BaseAwarenessState<State extends BaseState> extends AwarenessState<State> {
    protected onSetUp(): void;
    /**
     * Set the current collaborator info in the local state.
     */
    private setCurrentCollaboratorInfo;
}
export declare const baseEqualityFieldChecks: {
    collaboratorInfo: typeof areCollaboratorInfosEqual;
};
export declare class BaseAwareness extends BaseAwarenessState<BaseState> {
    protected equalityFieldChecks: {
        collaboratorInfo: typeof areCollaboratorInfosEqual;
    };
}
//# sourceMappingURL=base-awareness.d.ts.map