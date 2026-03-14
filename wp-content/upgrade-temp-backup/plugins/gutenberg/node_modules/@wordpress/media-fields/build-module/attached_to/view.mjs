// packages/media-fields/src/attached_to/view.tsx
import { useState, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { getRenderedContent } from "../utils/get-rendered-content.mjs";
import { Fragment, jsx } from "react/jsx-runtime";
function MediaAttachedToView({
  item
}) {
  const [attachedPostTitle, setAttachedPostTitle] = useState(null);
  const parentId = item.post;
  const embeddedPostId = item._embedded?.["wp:attached-to"]?.[0]?.id;
  const embeddedPostTitle = item._embedded?.["wp:attached-to"]?.[0]?.title;
  useEffect(() => {
    if (!!parentId && parentId === embeddedPostId) {
      setAttachedPostTitle(
        getRenderedContent(embeddedPostTitle) || embeddedPostId?.toString() || ""
      );
    }
    if (!parentId) {
      setAttachedPostTitle(__("(Unattached)"));
    }
  }, [parentId, embeddedPostId, embeddedPostTitle]);
  return /* @__PURE__ */ jsx(Fragment, { children: attachedPostTitle });
}
export {
  MediaAttachedToView as default
};
//# sourceMappingURL=view.mjs.map
