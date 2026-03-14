// packages/edit-post/src/components/meta-boxes/index.js
import { useSelect } from "@wordpress/data";
import MetaBoxesArea from "./meta-boxes-area/index.mjs";
import MetaBoxVisibility from "./meta-box-visibility.mjs";
import { store as editPostStore } from "../../store/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function MetaBoxes({ location }) {
  const metaBoxes = useSelect(
    (select) => select(editPostStore).getMetaBoxesPerLocation(location),
    [location]
  );
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    (metaBoxes ?? []).map(({ id }) => /* @__PURE__ */ jsx(MetaBoxVisibility, { id }, id)),
    /* @__PURE__ */ jsx(MetaBoxesArea, { location })
  ] });
}
export {
  MetaBoxes as default
};
//# sourceMappingURL=index.mjs.map
