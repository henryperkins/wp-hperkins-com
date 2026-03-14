// packages/sync/src/utils.ts
import * as Y from "yjs";
import * as buffer from "lib0/buffer";
import {
  CRDT_DOC_META_PERSISTENCE_KEY,
  CRDT_DOC_VERSION,
  CRDT_STATE_MAP_KEY,
  CRDT_STATE_MAP_SAVED_AT_KEY as SAVED_AT_KEY,
  CRDT_STATE_MAP_SAVED_BY_KEY as SAVED_BY_KEY,
  CRDT_STATE_MAP_VERSION_KEY as VERSION_KEY
} from "./config.mjs";
function createYjsDoc(documentMeta = {}) {
  const metaMap = new Map(
    Object.entries(documentMeta)
  );
  return new Y.Doc({ meta: metaMap });
}
function initializeYjsDoc(ydoc) {
  const stateMap = ydoc.getMap(CRDT_STATE_MAP_KEY);
  stateMap.set(VERSION_KEY, CRDT_DOC_VERSION);
}
function markEntityAsSaved(ydoc) {
  const recordMeta = ydoc.getMap(CRDT_STATE_MAP_KEY);
  recordMeta.set(SAVED_AT_KEY, Date.now());
  recordMeta.set(SAVED_BY_KEY, ydoc.clientID);
}
function pseudoRandomID() {
  return Math.floor(Math.random() * 1e9);
}
function serializeCrdtDoc(crdtDoc) {
  return JSON.stringify({
    document: buffer.toBase64(Y.encodeStateAsUpdateV2(crdtDoc)),
    updateId: pseudoRandomID()
    // helps with debugging
  });
}
function deserializeCrdtDoc(serializedCrdtDoc) {
  try {
    const { document } = JSON.parse(serializedCrdtDoc);
    const docMeta = {
      [CRDT_DOC_META_PERSISTENCE_KEY]: true
    };
    const ydoc = createYjsDoc(docMeta);
    const yupdate = buffer.fromBase64(document);
    Y.applyUpdateV2(ydoc, yupdate);
    ydoc.clientID = pseudoRandomID();
    return ydoc;
  } catch (e) {
    return null;
  }
}
export {
  createYjsDoc,
  deserializeCrdtDoc,
  initializeYjsDoc,
  markEntityAsSaved,
  serializeCrdtDoc
};
//# sourceMappingURL=utils.mjs.map
