import type { CRDTDoc } from './types';
type DocumentMeta = Record<string, DocumentMetaValue>;
type DocumentMetaValue = boolean | number | string;
/**
 * Creates a new Y.Doc instance with the given document metadata.
 *
 * @param {DocumentMeta} documentMeta Optional metadata to associate with the
 *                                    document. Metadata is not persisted.
 */
export declare function createYjsDoc(documentMeta?: DocumentMeta): CRDTDoc;
/**
 * Initializes a Y.Doc instance with the necessary CRDT state for our use case.
 *
 * @param {Y.Doc} ydoc Y.Doc instance to initialize.
 */
export declare function initializeYjsDoc(ydoc: CRDTDoc): void;
/**
 * Record that the entity was saved (persisted to the database) in the CRDT
 * document record metadata.
 *
 * @param {CRDTDoc} ydoc CRDT document.
 */
export declare function markEntityAsSaved(ydoc: CRDTDoc): void;
export declare function serializeCrdtDoc(crdtDoc: CRDTDoc): string;
export declare function deserializeCrdtDoc(serializedCrdtDoc: string): CRDTDoc | null;
export {};
//# sourceMappingURL=utils.d.ts.map