/**
 * External dependencies
 */
import { Awareness } from '@wordpress/sync';
/**
 * Extended Awareness class with typed state accessors.
 */
export declare class TypedAwareness<State extends object> extends Awareness {
    /**
     * Get the states from an awareness document.
     */
    getStates(): Map<number, State>;
    /**
     * Get a local state field from an awareness document.
     * @param field
     */
    getLocalStateField<FieldName extends keyof State>(field: FieldName): State[FieldName] | null;
    /**
     * Set a local state field on an awareness document.
     * @param field
     * @param value
     */
    setLocalStateField<FieldName extends string & keyof State>(field: FieldName, value: State[FieldName]): void;
}
//# sourceMappingURL=typed-awareness.d.ts.map