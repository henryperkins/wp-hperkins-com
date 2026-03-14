/**
 * Internal dependencies
 */
import type AttributeMap from './AttributeMap';
interface Op {
    insert?: string | Record<string, unknown>;
    delete?: number;
    retain?: number | Record<string, unknown>;
    attributes?: AttributeMap;
}
declare namespace Op {
    function length(op: Op): number;
}
export default Op;
//# sourceMappingURL=Op.d.ts.map