// packages/edit-widgets/src/components/secondary-sidebar/index.js
import { useSelect } from "@wordpress/data";
import { store as editWidgetsStore } from "../../store/index.mjs";
import InserterSidebar from "./inserter-sidebar.mjs";
import ListViewSidebar from "./list-view-sidebar.mjs";
import { jsx } from "react/jsx-runtime";
function SecondarySidebar() {
  const { isInserterOpen, isListViewOpen } = useSelect((select) => {
    const { isInserterOpened, isListViewOpened } = select(editWidgetsStore);
    return {
      isInserterOpen: isInserterOpened(),
      isListViewOpen: isListViewOpened()
    };
  }, []);
  if (isInserterOpen) {
    return /* @__PURE__ */ jsx(InserterSidebar, {});
  }
  if (isListViewOpen) {
    return /* @__PURE__ */ jsx(ListViewSidebar, {});
  }
  return null;
}
export {
  SecondarySidebar as default
};
//# sourceMappingURL=index.mjs.map
