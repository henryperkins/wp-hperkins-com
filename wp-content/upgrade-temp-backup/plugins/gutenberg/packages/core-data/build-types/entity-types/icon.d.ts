/**
 * Internal dependencies
 */
import type { Context, OmitNevers } from './helpers';
import type { BaseEntityRecords as _BaseEntityRecords } from './base-entity-records';
declare module './base-entity-records' {
    namespace BaseEntityRecords {
        interface Icon<C extends Context> {
            /**
             * The icon name.
             */
            name: string;
            /**
             * The icon content (SVG markup).
             */
            content: string;
            /**
             * The icon label.
             */
            label: string;
        }
    }
}
export type Icon<C extends Context = 'edit'> = OmitNevers<_BaseEntityRecords.Icon<C>>;
//# sourceMappingURL=icon.d.ts.map