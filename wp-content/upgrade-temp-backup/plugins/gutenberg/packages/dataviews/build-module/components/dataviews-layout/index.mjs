// packages/dataviews/src/components/dataviews-layout/index.tsx
import { useContext } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import DataViewsContext from "../dataviews-context/index.mjs";
import { VIEW_LAYOUTS } from "../dataviews-layouts/index.mjs";
import { jsx } from "react/jsx-runtime";
function DataViewsLayout({ className }) {
  const {
    actions = [],
    data,
    fields,
    getItemId,
    getItemLevel,
    hasInitiallyLoaded,
    isLoading,
    view,
    onChangeView,
    selection,
    onChangeSelection,
    setOpenedFilter,
    onClickItem,
    isItemClickable,
    renderItemLink,
    defaultLayouts,
    empty = /* @__PURE__ */ jsx("p", { children: __("No results") })
  } = useContext(DataViewsContext);
  if (!hasInitiallyLoaded) {
    return null;
  }
  const ViewComponent = VIEW_LAYOUTS.find(
    (v) => v.type === view.type && defaultLayouts[v.type]
  )?.component;
  return /* @__PURE__ */ jsx(
    ViewComponent,
    {
      className,
      actions,
      data,
      fields,
      getItemId,
      getItemLevel,
      isLoading,
      onChangeView,
      onChangeSelection,
      selection,
      setOpenedFilter,
      onClickItem,
      renderItemLink,
      isItemClickable,
      view,
      empty
    }
  );
}
export {
  DataViewsLayout as default
};
//# sourceMappingURL=index.mjs.map
