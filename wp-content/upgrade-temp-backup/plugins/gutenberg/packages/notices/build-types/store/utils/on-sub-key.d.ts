/**
 * External dependencies
 */
import type { Reducer, Action } from 'redux';
/**
 * Higher-order reducer creator which creates a combined reducer object, keyed
 * by a property on the action object.
 *
 * @param actionProperty Action property by which to key object.
 *
 * @return Higher-order reducer.
 */
export declare const onSubKey: (actionProperty: string) => <S, A extends Action & Record<string, any>>(reducer: Reducer<S, A>) => (state: Record<string, S> | undefined, action: A) => Record<string, S>;
export default onSubKey;
//# sourceMappingURL=on-sub-key.d.ts.map