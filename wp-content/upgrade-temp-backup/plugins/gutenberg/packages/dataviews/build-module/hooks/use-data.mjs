// packages/dataviews/src/hooks/use-data.ts
import { useEffect, useRef, useState } from "@wordpress/element";
function useData(data, isLoading, paginationInfo) {
  const previousDataRef = useRef(data);
  const previousPaginationInfoRef = useRef(paginationInfo);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(
    !isLoading
  );
  useEffect(() => {
    if (!isLoading) {
      previousDataRef.current = data;
      previousPaginationInfoRef.current = paginationInfo;
      setHasInitiallyLoaded(true);
    }
  }, [data, isLoading, paginationInfo]);
  return {
    data: isLoading && previousDataRef.current?.length ? previousDataRef.current : data,
    paginationInfo: isLoading && previousDataRef.current?.length ? previousPaginationInfoRef.current : paginationInfo,
    hasInitiallyLoaded
  };
}
export {
  useData as default
};
//# sourceMappingURL=use-data.mjs.map
