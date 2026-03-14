// packages/fields/src/fields/slug/slug-view.tsx
import { useEffect, useRef } from "@wordpress/element";
import { getSlug } from "./utils.mjs";
var SlugView = ({ item }) => {
  const slug = getSlug(item);
  const originalSlugRef = useRef(slug);
  useEffect(() => {
    if (slug && originalSlugRef.current === void 0) {
      originalSlugRef.current = slug;
    }
  }, [slug]);
  const slugToDisplay = slug || originalSlugRef.current;
  return `${slugToDisplay}`;
};
var slug_view_default = SlugView;
export {
  slug_view_default as default
};
//# sourceMappingURL=slug-view.mjs.map
