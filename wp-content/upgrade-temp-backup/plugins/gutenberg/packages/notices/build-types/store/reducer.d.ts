/**
 * Internal dependencies
 */
import type { Notice, ReducerAction } from './types';
/**
 * Reducer returning the next notices state. The notices state is an object
 * where each key is a context, its value an array of notice objects.
 *
 * @param state  Current state.
 * @param action Dispatched action.
 *
 * @return Updated state.
 */
declare const notices: (state: Record<string, Notice[]> | undefined, action: ReducerAction) => Record<string, Notice[]>;
export default notices;
//# sourceMappingURL=reducer.d.ts.map