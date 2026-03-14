/**
 * Context provider component for providing
 * an entity for a specific entity.
 *
 * @param {Object} props              The component's props.
 * @param {string} props.kind         The entity kind.
 * @param {string} props.type         The entity name.
 * @param {number} props.id           The entity ID.
 * @param {number} [props.revisionId] Optional revision ID. When set,
 *                                    `useEntityProp` reads from the
 *                                    revision record instead of the
 *                                    current entity.
 * @param {*}      props.children     The children to wrap.
 *
 * @return {Object} The provided children, wrapped with
 *                   the entity's context provider.
 */
export default function EntityProvider({ kind, type: name, id, revisionId, children, }: {
    kind: string;
    type: string;
    id: number;
    revisionId?: number | undefined;
    children: any;
}): any;
//# sourceMappingURL=entity-provider.d.ts.map