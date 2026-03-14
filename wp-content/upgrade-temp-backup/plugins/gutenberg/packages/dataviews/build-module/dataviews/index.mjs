// packages/dataviews/src/dataviews/index.tsx
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
import DataViewsFooter from "../components/dataviews-footer/index.mjs";
import DataViewsSearch from "../components/dataviews-search/index.mjs";
import { BulkActionsFooter } from "../components/dataviews-bulk-actions/index.mjs";
import { DataViewsPagination } from "../components/dataviews-pagination/index.mjs";
import DataViewsViewConfig, {
  DataviewsViewConfigDropdown,
  ViewTypeMenu
} from "../components/dataviews-view-config/index.mjs";
import normalizeFields from "../field-types/index.mjs";
import useData from "../hooks/use-data.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var defaultGetItemId = (item) => item.id;
var defaultIsItemClickable = () => true;
var EMPTY_ARRAY = [];
var dataViewsLayouts = VIEW_LAYOUTS.filter(
  (viewLayout) => !viewLayout.isPicker
);
function DefaultUI({
  header,
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
              justify: "start",
              gap: "sm",
              className: "dataviews__search",
              children: [
                search && /* @__PURE__ */ jsx(DataViewsSearch, { label: searchLabel }),
                /* @__PURE__ */ jsx(FiltersToggle, {})
              ]
            }
          ),
          /* @__PURE__ */ jsxs(Stack, { direction: "row", gap: "xs", style: { flexShrink: 0 }, children: [
            /* @__PURE__ */ jsx(DataViewsViewConfig, {}),
            header
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx(FiltersToggled, { className: "dataviews-filters__container" }),
    /* @__PURE__ */ jsx(DataViewsLayout, {}),
    /* @__PURE__ */ jsx(DataViewsFooter, {})
  ] });
}
function DataViews({
  view,
  onChangeView,
  fields,
  search = true,
  searchLabel = void 0,
  actions = EMPTY_ARRAY,
  data,
  getItemId = defaultGetItemId,
  getItemLevel,
  isLoading = false,
  paginationInfo,
  defaultLayouts: defaultLayoutsProperty,
  selection: selectionProperty,
  onChangeSelection,
  onClickItem,
  renderItemLink,
  isItemClickable = defaultIsItemClickable,
  header,
  children,
  config = { perPageSizes: [10, 20, 50, 100] },
  empty,
  onReset
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
  const [selectionState, setSelectionState] = useState([]);
  const isUncontrolled = selectionProperty === void 0 || onChangeSelection === void 0;
  const selection = isUncontrolled ? selectionState : selectionProperty;
  const [openedFilter, setOpenedFilter] = useState(null);
  function setSelectionWithChange(value) {
    const newValue = typeof value === "function" ? value(selection) : value;
    if (isUncontrolled) {
      setSelectionState(newValue);
    }
    if (onChangeSelection) {
      onChangeSelection(newValue);
    }
  }
  const _fields = useMemo(() => normalizeFields(fields), [fields]);
  const _selection = useMemo(() => {
    return selection.filter(
      (id) => data.some((item) => getItemId(item) === id)
    );
  }, [selection, data, getItemId]);
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
          return dataViewsLayouts.some(
            (viewLayout) => viewLayout.type === layoutType
          );
        }
      )
    ),
    [defaultLayoutsProperty]
  );
  const {
    data: displayData,
    paginationInfo: displayPaginationInfo,
    hasInitiallyLoaded
  } = useData(data, isLoading, paginationInfo);
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
        data: displayData,
        isLoading,
        paginationInfo: displayPaginationInfo,
        selection: _selection,
        onChangeSelection: setSelectionWithChange,
        openedFilter,
        setOpenedFilter,
        getItemId,
        getItemLevel,
        isItemClickable,
        onClickItem,
        renderItemLink,
        containerWidth,
        containerRef,
        resizeObserverRef,
        defaultLayouts,
        filters,
        isShowingFilter,
        setIsShowingFilter,
        config,
        empty,
        hasInitiallyLoaded,
        hasInfiniteScrollHandler: !!infiniteScrollHandler,
        onReset
      },
      children: /* @__PURE__ */ jsx("div", { className: "dataviews-wrapper", ref: containerRef, children: children ?? /* @__PURE__ */ jsx(
        DefaultUI,
        {
          header,
          search,
          searchLabel
        }
      ) })
    }
  );
}
var DataViewsSubComponents = DataViews;
DataViewsSubComponents.BulkActionToolbar = BulkActionsFooter;
DataViewsSubComponents.Filters = Filters;
DataViewsSubComponents.FiltersToggled = FiltersToggled;
DataViewsSubComponents.FiltersToggle = FiltersToggle;
DataViewsSubComponents.Layout = DataViewsLayout;
DataViewsSubComponents.LayoutSwitcher = ViewTypeMenu;
DataViewsSubComponents.Pagination = DataViewsPagination;
DataViewsSubComponents.Search = DataViewsSearch;
DataViewsSubComponents.ViewConfig = DataviewsViewConfigDropdown;
DataViewsSubComponents.Footer = DataViewsFooter;
var dataviews_default = DataViewsSubComponents;
export {
  dataviews_default as default
};
//# sourceMappingURL=index.mjs.map
