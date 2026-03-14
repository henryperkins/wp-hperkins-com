// packages/dataviews/src/dataviews-picker/index.tsx
import { useEffect, useMemo, useRef, useState } from "@wordpress/element";
import { useResizeObserver, throttle } from "@wordpress/compose";
import { Stack } from "@wordpress/ui";
import DataViewsContext from "../components/dataviews-context/index.mjs";
import { VIEW_LAYOUTS } from "../components/dataviews-layouts/index.mjs";
import {
  Filters,
  FiltersToggled,
  useFilters,
  FiltersToggle
} from "../components/dataviews-filters/index.mjs";
import DataViewsLayout from "../components/dataviews-layout/index.mjs";
import { DataViewsPickerFooter } from "../components/dataviews-picker-footer/index.mjs";
import DataViewsSearch from "../components/dataviews-search/index.mjs";
import { DataViewsPagination } from "../components/dataviews-pagination/index.mjs";
import DataViewsViewConfig, {
  DataviewsViewConfigDropdown,
  ViewTypeMenu
} from "../components/dataviews-view-config/index.mjs";
import normalizeFields from "../field-types/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var isItemClickable = () => false;
var dataViewsPickerLayouts = VIEW_LAYOUTS.filter(
  (viewLayout) => viewLayout.isPicker
);
var defaultGetItemId = (item) => item.id;
var EMPTY_ARRAY = [];
function DefaultUI({
  search = true,
  searchLabel = void 0
}) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      Stack,
      {
        direction: "row",
        align: "top",
        justify: "space-between",
        className: "dataviews__view-actions",
        gap: "xs",
        children: [
          /* @__PURE__ */ jsxs(
            Stack,
            {
              direction: "row",
              gap: "sm",
              justify: "start",
              className: "dataviews__search",
              children: [
                search && /* @__PURE__ */ jsx(DataViewsSearch, { label: searchLabel }),
                /* @__PURE__ */ jsx(FiltersToggle, {})
              ]
            }
          ),
          /* @__PURE__ */ jsx(Stack, { direction: "row", gap: "xs", style: { flexShrink: 0 }, children: /* @__PURE__ */ jsx(DataViewsViewConfig, {}) })
        ]
      }
    ),
    /* @__PURE__ */ jsx(FiltersToggled, { className: "dataviews-filters__container" }),
    /* @__PURE__ */ jsx(DataViewsLayout, {}),
    /* @__PURE__ */ jsx(DataViewsPickerFooter, {})
  ] });
}
function DataViewsPicker({
  view,
  onChangeView,
  fields,
  search = true,
  searchLabel = void 0,
  actions = EMPTY_ARRAY,
  data,
  getItemId = defaultGetItemId,
  isLoading = false,
  paginationInfo,
  defaultLayouts: defaultLayoutsProperty,
  selection,
  onChangeSelection,
  children,
  config = { perPageSizes: [10, 20, 50, 100] },
  itemListLabel,
  empty
}) {
  const { infiniteScrollHandler } = paginationInfo;
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const resizeObserverRef = useResizeObserver(
    (resizeObserverEntries) => {
      setContainerWidth(
        resizeObserverEntries[0].borderBoxSize[0].inlineSize
      );
    },
    { box: "border-box" }
  );
  const [openedFilter, setOpenedFilter] = useState(null);
  function setSelectionWithChange(value) {
    const newValue = typeof value === "function" ? value(selection) : value;
    if (onChangeSelection) {
      onChangeSelection(newValue);
    }
  }
  const _fields = useMemo(() => normalizeFields(fields), [fields]);
  const filters = useFilters(_fields, view);
  const hasPrimaryOrLockedFilters = useMemo(
    () => (filters || []).some(
      (filter) => filter.isPrimary || filter.isLocked
    ),
    [filters]
  );
  const [isShowingFilter, setIsShowingFilter] = useState(
    hasPrimaryOrLockedFilters
  );
  useEffect(() => {
    if (hasPrimaryOrLockedFilters && !isShowingFilter) {
      setIsShowingFilter(true);
    }
  }, [hasPrimaryOrLockedFilters, isShowingFilter]);
  useEffect(() => {
    if (!view.infiniteScrollEnabled || !containerRef.current) {
      return;
    }
    const handleScroll = throttle((event) => {
      const target = event.target;
      const scrollTop = target.scrollTop;
      const scrollHeight = target.scrollHeight;
      const clientHeight = target.clientHeight;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        infiniteScrollHandler?.();
      }
    }, 100);
    const container = containerRef.current;
    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      handleScroll.cancel();
    };
  }, [infiniteScrollHandler, view.infiniteScrollEnabled]);
  const defaultLayouts = useMemo(
    () => Object.fromEntries(
      Object.entries(defaultLayoutsProperty).filter(
        ([layoutType]) => {
          return dataViewsPickerLayouts.some(
            (viewLayout) => viewLayout.type === layoutType
          );
        }
      )
    ),
    [defaultLayoutsProperty]
  );
  if (!defaultLayouts[view.type]) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    DataViewsContext.Provider,
    {
      value: {
        view,
        onChangeView,
        fields: _fields,
        actions,
        data,
        isLoading,
        paginationInfo,
        isItemClickable,
        selection,
        onChangeSelection: setSelectionWithChange,
        openedFilter,
        setOpenedFilter,
        getItemId,
        containerWidth,
        containerRef,
        resizeObserverRef,
        defaultLayouts,
        filters,
        isShowingFilter,
        setIsShowingFilter,
        config,
        itemListLabel,
        empty,
        hasInitiallyLoaded: true,
        hasInfiniteScrollHandler: !!infiniteScrollHandler
      },
      children: /* @__PURE__ */ jsx("div", { className: "dataviews-picker-wrapper", ref: containerRef, children: children ?? /* @__PURE__ */ jsx(DefaultUI, { search, searchLabel }) })
    }
  );
}
var DataViewsPickerSubComponents = DataViewsPicker;
DataViewsPickerSubComponents.BulkActionToolbar = DataViewsPickerFooter;
DataViewsPickerSubComponents.Filters = Filters;
DataViewsPickerSubComponents.FiltersToggled = FiltersToggled;
DataViewsPickerSubComponents.FiltersToggle = FiltersToggle;
DataViewsPickerSubComponents.Layout = DataViewsLayout;
DataViewsPickerSubComponents.LayoutSwitcher = ViewTypeMenu;
DataViewsPickerSubComponents.Pagination = DataViewsPagination;
DataViewsPickerSubComponents.Search = DataViewsSearch;
DataViewsPickerSubComponents.ViewConfig = DataviewsViewConfigDropdown;
var dataviews_picker_default = DataViewsPickerSubComponents;
export {
  dataviews_picker_default as default
};
//# sourceMappingURL=index.mjs.map
