// packages/core-data/src/locks/actions.js
import createLocks from "./engine.mjs";
function createLocksActions() {
  const locks = createLocks();
  function __unstableAcquireStoreLock(store, path, { exclusive }) {
    return () => locks.acquire(store, path, exclusive);
  }
  function __unstableReleaseStoreLock(lock) {
    return () => locks.release(lock);
  }
  return { __unstableAcquireStoreLock, __unstableReleaseStoreLock };
}
export {
  createLocksActions as default
};
//# sourceMappingURL=actions.mjs.map
