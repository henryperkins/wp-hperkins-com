// packages/fields/src/fields/parent/parent-view.tsx
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { __ } from "@wordpress/i18n";
import { getTitleWithFallbackName } from "./utils.mjs";
import { Fragment, jsx } from "react/jsx-runtime";
var ParentView = ({
  item
}) => {
  const parent = useSelect(
    (select) => {
      const { getEntityRecord } = select(coreStore);
      return item?.parent ? getEntityRecord("postType", item.type, item.parent) : null;
    },
    [item.parent, item.type]
  );
  if (parent) {
    return /* @__PURE__ */ jsx(Fragment, { children: getTitleWithFallbackName(parent) });
  }
  return /* @__PURE__ */ jsx(Fragment, { children: __("None") });
};
export {
  ParentView
};
//# sourceMappingURL=parent-view.mjs.map
