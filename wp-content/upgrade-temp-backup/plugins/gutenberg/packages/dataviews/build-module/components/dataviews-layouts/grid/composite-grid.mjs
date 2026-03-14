// packages/dataviews/src/components/dataviews-layouts/grid/composite-grid.tsx
import clsx from "clsx";
import {
  Flex,
  FlexItem,
  Tooltip,
  Composite,
  privateApis as componentsPrivateApis
} from "@wordpress/components";
import { Stack } from "@wordpress/ui";
import { __, sprintf } from "@wordpress/i18n";
import { useInstanceId } from "@wordpress/compose";
import { isAppleOS } from "@wordpress/keycodes";
import { useContext, forwardRef } from "@wordpress/element";
import { unlock } from "../../../lock-unlock.mjs";
import ItemActions from "../../dataviews-item-actions/index.mjs";
import DataViewsSelectionCheckbox from "../../dataviews-selection-checkbox/index.mjs";
import DataViewsContext from "../../dataviews-context/index.mjs";
import {
  useHasAPossibleBulkAction,
  useSomeItemHasAPossibleBulkAction
} from "../../dataviews-bulk-actions/index.mjs";
import { ItemClickWrapper } from "../utils/item-click-wrapper.mjs";
import { useGridColumns } from "./preview-size-picker.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { Badge } = unlock(componentsPrivateApis);
function chunk(array, size) {
  const chunks = [];
  for (let i = 0, j = array.length; i < j; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}
var GridItem = forwardRef(function GridItem2({
  view,
  selection,
  onChangeSelection,
  onClickItem,
  isItemClickable,
  renderItemLink,
  getItemId,
  item,
  actions,
  mediaField,
  titleField,
  descriptionField,
  regularFields,
  badgeFields,
  hasBulkActions,
  config,
  ...props
}, ref) {
  const { showTitle = true, showMedia = true, showDescription = true } = view;
  const hasBulkAction = useHasAPossibleBulkAction(actions, item);
  const id = getItemId(item);
  const instanceId = useInstanceId(GridItem2);
  const isSelected = selection.includes(id);
  const mediaPlaceholder = /* @__PURE__ */ jsx("span", { className: "dataviews-view-grid__media-placeholder" });
  const rendersMediaField = showMedia && mediaField?.render;
  const renderedMediaField = rendersMediaField ? /* @__PURE__ */ jsx(
    mediaField.render,
    {
      item,
      field: mediaField,
      config
    }
  ) : mediaPlaceholder;
  const renderedTitleField = showTitle && titleField?.render ? /* @__PURE__ */ jsx(titleField.render, { item, field: titleField }) : null;
  let mediaA11yProps;
  let titleA11yProps;
  if (isItemClickable(item) && onClickItem) {
    if (renderedTitleField) {
      mediaA11yProps = {
        "aria-labelledby": `dataviews-view-grid__title-field-${instanceId}`
      };
      titleA11yProps = {
        id: `dataviews-view-grid__title-field-${instanceId}`
      };
    } else {
      mediaA11yProps = {
        "aria-label": __("Navigate to item")
      };
    }
  }
  return /* @__PURE__ */ jsxs(
    Stack,
    {
      direction: "column",
      ...props,
      ref,
      className: clsx(
        props.className,
        "dataviews-view-grid__row__gridcell",
        "dataviews-view-grid__card",
        {
          "is-selected": hasBulkAction && isSelected
        }
      ),
      onClickCapture: (event) => {
        props.onClickCapture?.(event);
        if (isAppleOS() ? event.metaKey : event.ctrlKey) {
          event.stopPropagation();
          event.preventDefault();
          if (!hasBulkAction) {
            return;
          }
          onChangeSelection(
            selection.includes(id) ? selection.filter((itemId) => id !== itemId) : [...selection, id]
          );
        }
      },
      children: [
        /* @__PURE__ */ jsx(
          ItemClickWrapper,
          {
            item,
            isItemClickable,
            onClickItem,
            renderItemLink,
            className: clsx("dataviews-view-grid__media", {
              "dataviews-view-grid__media--placeholder": !rendersMediaField
            }),
            ...mediaA11yProps,
            children: renderedMediaField
          }
        ),
        hasBulkActions && /* @__PURE__ */ jsx(
          DataViewsSelectionCheckbox,
          {
            item,
            selection,
            onChangeSelection,
            getItemId,
            titleField,
            disabled: !hasBulkAction
          }
        ),
        !!actions?.length && /* @__PURE__ */ jsx("div", { className: "dataviews-view-grid__media-actions", children: /* @__PURE__ */ jsx(ItemActions, { item, actions, isCompact: true }) }),
        showTitle && /* @__PURE__ */ jsx("div", { className: "dataviews-view-grid__title", children: /* @__PURE__ */ jsx(
          ItemClickWrapper,
          {
            item,
            isItemClickable,
            onClickItem,
            renderItemLink,
            className: "dataviews-view-grid__title-field dataviews-title-field",
            ...titleA11yProps,
            title: titleField?.getValueFormatted({
              item,
              field: titleField
            }) || void 0,
            children: renderedTitleField
          }
        ) }),
        /* @__PURE__ */ jsxs(Stack, { direction: "column", gap: "xs", children: [
          showDescription && descriptionField?.render && /* @__PURE__ */ jsx(
            descriptionField.render,
            {
              item,
              field: descriptionField
            }
          ),
          !!badgeFields?.length && /* @__PURE__ */ jsx(
            Stack,
            {
              direction: "row",
              className: "dataviews-view-grid__badge-fields",
              gap: "sm",
              wrap: "wrap",
              align: "top",
              justify: "flex-start",
              children: badgeFields.map((field) => {
                return /* @__PURE__ */ jsx(
                  Badge,
                  {
                    className: "dataviews-view-grid__field-value",
                    children: /* @__PURE__ */ jsx(
                      field.render,
                      {
                        item,
                        field
                      }
                    )
                  },
                  field.id
                );
              })
            }
          ),
          !!regularFields?.length && /* @__PURE__ */ jsx(
            Stack,
            {
              direction: "column",
              className: "dataviews-view-grid__fields",
              gap: "xs",
              children: regularFields.map((field) => {
                return /* @__PURE__ */ jsx(
                  Flex,
                  {
                    className: "dataviews-view-grid__field",
                    gap: 1,
                    justify: "flex-start",
                    expanded: true,
                    style: { height: "auto" },
                    direction: "row",
                    children: /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(Tooltip, { text: field.label, children: /* @__PURE__ */ jsx(FlexItem, { className: "dataviews-view-grid__field-name", children: field.header }) }),
                      /* @__PURE__ */ jsx(
                        FlexItem,
                        {
                          className: "dataviews-view-grid__field-value",
                          style: { maxHeight: "none" },
                          children: /* @__PURE__ */ jsx(
                            field.render,
                            {
                              item,
                              field
                            }
                          )
                        }
                      )
                    ] })
                  },
                  field.id
                );
              })
            }
          )
        ] })
      ]
    }
  );
});
function CompositeGrid({
  data,
  isInfiniteScroll,
  className,
  inert,
  isLoading,
  view,
  fields,
  selection,
  onChangeSelection,
  onClickItem,
  isItemClickable,
  renderItemLink,
  getItemId,
  actions
}) {
  const { paginationInfo, resizeObserverRef } = useContext(DataViewsContext);
  const gridColumns = useGridColumns();
  const hasBulkActions = useSomeItemHasAPossibleBulkAction(actions, data);
  const titleField = fields.find(
    (field) => field.id === view?.titleField
  );
  const mediaField = fields.find(
    (field) => field.id === view?.mediaField
  );
  const descriptionField = fields.find(
    (field) => field.id === view?.descriptionField
  );
  const otherFields = view.fields ?? [];
  const { regularFields, badgeFields } = otherFields.reduce(
    (accumulator, fieldId) => {
      const field = fields.find((f) => f.id === fieldId);
      if (!field) {
        return accumulator;
      }
      const key = view.layout?.badgeFields?.includes(fieldId) ? "badgeFields" : "regularFields";
      accumulator[key].push(field);
      return accumulator;
    },
    { regularFields: [], badgeFields: [] }
  );
  const size = "900px";
  const totalRows = Math.ceil(data.length / gridColumns);
  return /* @__PURE__ */ jsx(
    Composite,
    {
      role: isInfiniteScroll ? "feed" : "grid",
      className: clsx("dataviews-view-grid", className),
      focusWrap: true,
      "aria-busy": isLoading,
      "aria-rowcount": isInfiniteScroll ? void 0 : totalRows,
      ref: resizeObserverRef,
      inert,
      children: chunk(data, gridColumns).map((row, i) => /* @__PURE__ */ jsx(
        Composite.Row,
        {
          render: /* @__PURE__ */ jsx(
            "div",
            {
              role: "row",
              "aria-rowindex": i + 1,
              "aria-label": sprintf(
                /* translators: %d: The row number in the grid */
                __("Row %d"),
                i + 1
              ),
              className: "dataviews-view-grid__row",
              style: {
                gridTemplateColumns: `repeat( ${gridColumns}, minmax(0, 1fr) )`
              }
            }
          ),
          children: row.map((item, indexInRow) => {
            const index = i * gridColumns + indexInRow;
            return /* @__PURE__ */ jsx(
              Composite.Item,
              {
                render: (props) => /* @__PURE__ */ jsx(
                  GridItem,
                  {
                    ...props,
                    role: isInfiniteScroll ? "article" : "gridcell",
                    "aria-setsize": isInfiniteScroll ? paginationInfo.totalItems : void 0,
                    "aria-posinset": isInfiniteScroll ? index + 1 : void 0,
                    view,
                    selection,
                    onChangeSelection,
                    onClickItem,
                    isItemClickable,
                    renderItemLink,
                    getItemId,
                    item,
                    actions,
                    mediaField,
                    titleField,
                    descriptionField,
                    regularFields,
                    badgeFields,
                    hasBulkActions,
                    config: {
                      sizes: size
                    }
                  }
                )
              },
              getItemId(item)
            );
          })
        },
        i
      ))
    }
  );
}
export {
  CompositeGrid as default
};
//# sourceMappingURL=composite-grid.mjs.map
