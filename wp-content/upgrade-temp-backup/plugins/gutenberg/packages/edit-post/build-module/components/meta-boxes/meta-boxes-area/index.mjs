// packages/edit-post/src/components/meta-boxes/meta-boxes-area/index.js
import clsx from "clsx";
import { useRef, useEffect } from "@wordpress/element";
import { Spinner } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { store as editPostStore } from "../../../store/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function MetaBoxesArea({ location }) {
  const container = useRef(null);
  const formRef = useRef(null);
  useEffect(() => {
    formRef.current = document.querySelector(
      ".metabox-location-" + location
    );
    if (formRef.current) {
      container.current.appendChild(formRef.current);
    }
    return () => {
      if (formRef.current) {
        document.querySelector("#metaboxes").appendChild(formRef.current);
      }
    };
  }, [location]);
  const isSaving = useSelect((select) => {
    return select(editPostStore).isSavingMetaBoxes();
  }, []);
  const classes = clsx("edit-post-meta-boxes-area", `is-${location}`, {
    "is-loading": isSaving
  });
  return /* @__PURE__ */ jsxs("div", { className: classes, children: [
    isSaving && /* @__PURE__ */ jsx(Spinner, {}),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "edit-post-meta-boxes-area__container",
        ref: container
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "edit-post-meta-boxes-area__clear" })
  ] });
}
var meta_boxes_area_default = MetaBoxesArea;
export {
  meta_boxes_area_default as default
};
//# sourceMappingURL=index.mjs.map
