import type { Notice } from './types';
/**
 * Returns all notices as an array, optionally for a given context. Defaults to
 * the global context.
 *
 * @param state   Notices state.
 * @param context Optional grouping context.
 *
 * @example
 *
 *```js
 * import { useSelect } from '@wordpress/data';
 * import { store as noticesStore } from '@wordpress/notices';
 *
 * const ExampleComponent = () => {
 *     const notices = useSelect( ( select ) => select( noticesStore ).getNotices() );
 *     return (
 *         <ul>
 *         { notices.map( ( notice ) => (
 *             <li key={ notice.ID }>{ notice.content }</li>
 *         ) ) }
 *        </ul>
 *    )
 * };
 *```
 *
 * @return Array of notices.
 */
export declare function getNotices(state: Record<string, Array<Notice>>, context?: string): Notice[];
//# sourceMappingURL=selectors.d.ts.map