export namespace storeConfig {
    export { reducer };
    export { selectors };
    export { actions };
}
/**
 * Store definition for the editor namespace.
 *
 * @see https://github.com/WordPress/gutenberg/blob/HEAD/packages/data/README.md#createReduxStore
 */
export const store: import("@wordpress/data").StoreDescriptor<import("@wordpress/data").ReduxStoreConfig<any, typeof actions, typeof selectors>>;
import reducer from './reducer';
import * as selectors from './selectors';
import * as actions from './actions';
//# sourceMappingURL=index.d.ts.map