// packages/edit-site/src/components/layout/hooks.js
import { useEffect, useState } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
var MAX_LOADING_TIME = 1e4;
function useIsSiteEditorLoading() {
  const [loaded, setLoaded] = useState(false);
  const inLoadingPause = useSelect(
    (select) => {
      const hasResolvingSelectors = select(coreStore).hasResolvingSelectors();
      return !loaded && !hasResolvingSelectors;
    },
    [loaded]
  );
  useEffect(() => {
    let timeout;
    if (!loaded) {
      timeout = setTimeout(() => {
        setLoaded(true);
      }, MAX_LOADING_TIME);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [loaded]);
  useEffect(() => {
    if (inLoadingPause) {
      const ARTIFICIAL_DELAY = 100;
      const timeout = setTimeout(() => {
        setLoaded(true);
      }, ARTIFICIAL_DELAY);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [inLoadingPause]);
  return !loaded;
}
export {
  useIsSiteEditorLoading
};
//# sourceMappingURL=hooks.mjs.map
