// packages/media-fields/src/filename/view.tsx
import {
  Tooltip,
  __experimentalTruncate as Truncate
} from "@wordpress/components";
import { useMemo } from "@wordpress/element";
import { getFilename } from "@wordpress/url";
import { Fragment, jsx } from "react/jsx-runtime";
var TRUNCATE_LENGTH = 15;
function FileNameView({
  item
}) {
  const fileName = useMemo(
    () => item?.source_url ? getFilename(item.source_url) : null,
    [item?.source_url]
  );
  if (!fileName) {
    return "";
  }
  return fileName.length > TRUNCATE_LENGTH ? /* @__PURE__ */ jsx(Tooltip, { text: fileName, children: /* @__PURE__ */ jsx(Truncate, { limit: TRUNCATE_LENGTH, ellipsizeMode: "tail", children: fileName }) }) : /* @__PURE__ */ jsx(Fragment, { children: fileName });
}
export {
  FileNameView as default
};
//# sourceMappingURL=view.mjs.map
