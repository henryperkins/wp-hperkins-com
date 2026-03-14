import { TypedAwareness } from './typed-awareness';
import type { EnhancedState, EqualityFieldCheck } from './types';
declare abstract class AwarenessWithEqualityChecks<State extends object> extends TypedAwareness<State> {
    /** OVERRIDDEN METHODS */
    /**
     * Set a local state field on an awareness document. Calling this method may
     * trigger rerenders of any subscribed components.
     *
     * Equality checks are provided by the abstract `equalityFieldChecks` property.
     * @param field - The field to set.
     * @param value - The value to set.
     */
    setLocalStateField<FieldName extends string & keyof State>(field: FieldName, value: State[FieldName]): void;
    /** ABSTRACT PROPERTIES */
    /**
     * Extending classes must implement equality checks for each awareness state
     * field they manage.
     */
    protected abstract equalityFieldChecks: {
        [FieldName in keyof State]: EqualityFieldCheck<State, FieldName>;
    };
    /** CUSTOM METHODS */
    /**
     * Determine if a field value has changed using the provided equality checks.
     * @param field  - The field to check.
     * @param value1 - The first value to compare.
     * @param value2 - The second value to compare.
     */
    protected isFieldEqual<FieldName extends keyof State>(field: FieldName, value1?: State[FieldName], value2?: State[FieldName]): boolean;
    /**
     * Determine if two states are equal by comparing each field using the
     * provided equality checks.
     * @param state1 - The first state to compare.
     * @param state2 - The second state to compare.
     */
    protected isStateEqual(state1: State, state2: State): boolean;
}
/**
 * Abstract class to manage awareness and allow external code to subscribe to
 * state updates.
 */
export declare abstract class AwarenessState<State extends object = {}> extends AwarenessWithEqualityChecks<State> {
    /** CUSTOM PROPERTIES */
    /**
     * Whether the setUp method has been called, to avoid running it multiple
     * times.
     */
    private hasSetupRun;
    /**
     * We keep track of all seen states during the current session for two reasons:
     *
     * 1. So that we can represent recently disconnected collaborators in our UI, even
     *    after they have been removed from the awareness document.
     * 2. So that we can provide debug information about all collaborators seen during
     *    the session.
     */
    private disconnectedCollaborators;
    private seenStates;
    /**
     * Hold a snapshot of the previous awareness state allows us to compare the
     * state values and avoid unnecessary updates to subscribers.
     */
    private previousSnapshot;
    private stateSubscriptions;
    /**
     * In some cases, we may want to throttle setting local state fields to avoid
     * overwhelming the awareness document with rapid updates. At the same time, we
     * want to ensure that when we read our own state locally, we get the latest
     * value -- even if it hasn't yet been set on the awareness instance.
     */
    private myThrottledState;
    private throttleTimeouts;
    /** CUSTOM METHODS */
    /**
     * Set up the awareness state. This method is idempotent and will only run
     * once. Subclasses should override `onSetUp()` instead of this method to
     * add their own setup logic.
     *
     * This is defined as a readonly arrow function property to prevent
     * subclasses from overriding it.
     */
    readonly setUp: () => void;
    /**
     * Hook method for subclasses to add their own setup logic. This is called
     * once after the base class setup completes. All subclasses must implement
     * this method. If extending a class that already implements `onSetUp()`,
     * call `super.onSetUp()` to ensure parent setup runs.
     */
    protected abstract onSetUp(): void;
    /**
     * Get the most recent state from the last processed change event.
     *
     * @return An array of EnhancedState< State >.
     */
    getCurrentState(): EnhancedState<State>[];
    /**
     * Get all seen states in this session to enable debug reporting.
     */
    getSeenStates(): Map<number, State>;
    /**
     * Allow external code to subscribe to awareness state changes.
     * @param callback - The callback to subscribe to.
     */
    onStateChange(callback: (newState: EnhancedState<State>[]) => void): () => void;
    /**
     * Set a local state field on an awareness document with throttle. See caveats
     * of this.setLocalStateField.
     * @param field - The field to set.
     * @param value - The value to set.
     * @param wait  - The wait time in milliseconds.
     */
    setThrottledLocalStateField<FieldName extends string & keyof State>(field: FieldName, value: State[FieldName], wait: number): void;
    /**
     * Set the current collaborator's connection status as awareness state.
     * @param isConnected - The connection status.
     */
    setConnectionStatus(isConnected: boolean): void;
    /**
     * Update all subscribed listeners with the latest awareness state.
     * @param forceUpdate - Whether to force an update.
     */
    protected updateSubscribers(forceUpdate?: boolean): void;
}
export {};
//# sourceMappingURL=awareness-state.d.ts.map