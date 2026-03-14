"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/block-editor/src/hooks/layout-child.js
var layout_child_exports = {};
__export(layout_child_exports, {
  default: () => layout_child_default
});
module.exports = __toCommonJS(layout_child_exports);
var import_compose = require("@wordpress/compose");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_store = require("../store/index.cjs");
var import_utils = require("./utils.cjs");
var import_layout = require("../components/block-list/layout.cjs");
var import_grid = require("../components/grid/index.cjs");
var import_use_block_visibility = __toESM(require("../components/block-visibility/use-block-visibility.cjs"));
var import_private_keys = require("../store/private-keys.cjs");
var import_constants = require("../components/block-visibility/constants.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var LAYOUT_CHILD_BLOCK_PROPS_REFERENCE = {};
function useBlockPropsChildLayoutStyles({ style }) {
  const shouldRenderChildLayoutStyles = (0, import_data.useSelect)((select) => {
    return !select(import_store.store).getSettings().disableLayoutStyles;
  });
  const layout = style?.layout ?? {};
  const {
    selfStretch,
    flexSize,
    columnStart,
    rowStart,
    columnSpan,
    rowSpan
  } = layout;
  const parentLayout = (0, import_layout.useLayout)() || {};
  const { columnCount, minimumColumnWidth } = parentLayout;
  const id = (0, import_compose.useInstanceId)(LAYOUT_CHILD_BLOCK_PROPS_REFERENCE);
  const selector = `.wp-container-content-${id}`;
  if (process.env.NODE_ENV === "development") {
    if (columnStart && typeof columnStart !== "number") {
      throw new Error("columnStart must be a number");
    }
    if (rowStart && typeof rowStart !== "number") {
      throw new Error("rowStart must be a number");
    }
    if (columnSpan && typeof columnSpan !== "number") {
      throw new Error("columnSpan must be a number");
    }
    if (rowSpan && typeof rowSpan !== "number") {
      throw new Error("rowSpan must be a number");
    }
  }
  let css = "";
  if (shouldRenderChildLayoutStyles) {
    if (selfStretch === "fixed" && flexSize) {
      css = `${selector} {
				flex-basis: ${flexSize};
				box-sizing: border-box;
			}`;
    } else if (selfStretch === "fill") {
      css = `${selector} {
				flex-grow: 1;
			}`;
    } else if (columnStart && columnSpan) {
      css = `${selector} {
				grid-column: ${columnStart} / span ${columnSpan};
			}`;
    } else if (columnStart) {
      css = `${selector} {
				grid-column: ${columnStart};
			}`;
    } else if (columnSpan) {
      css = `${selector} {
				grid-column: span ${columnSpan};
			}`;
    }
    if (rowStart && rowSpan) {
      css += `${selector} {
				grid-row: ${rowStart} / span ${rowSpan};
			}`;
    } else if (rowStart) {
      css += `${selector} {
				grid-row: ${rowStart};
			}`;
    } else if (rowSpan) {
      css += `${selector} {
				grid-row: span ${rowSpan};
			}`;
    }
    if ((columnSpan || columnStart) && (minimumColumnWidth || !columnCount)) {
      let parentColumnValue = parseFloat(minimumColumnWidth);
      if (isNaN(parentColumnValue)) {
        parentColumnValue = 12;
      }
      let parentColumnUnit = minimumColumnWidth?.replace(
        parentColumnValue,
        ""
      );
      if (!["px", "rem", "em"].includes(parentColumnUnit)) {
        parentColumnUnit = "rem";
      }
      let numColsToBreakAt = 2;
      if (columnSpan && columnStart) {
        numColsToBreakAt = columnSpan + columnStart - 1;
      } else if (columnSpan) {
        numColsToBreakAt = columnSpan;
      } else {
        numColsToBreakAt = columnStart;
      }
      const defaultGapValue = parentColumnUnit === "px" ? 24 : 1.5;
      const containerQueryValue = numColsToBreakAt * parentColumnValue + (numColsToBreakAt - 1) * defaultGapValue;
      const minimumContainerQueryValue = parentColumnValue * 2 + defaultGapValue - 1;
      const gridColumnValue = columnSpan && columnSpan > 1 ? "1/-1" : "auto";
      css += `@container (max-width: ${Math.max(
        containerQueryValue,
        minimumContainerQueryValue
      )}${parentColumnUnit}) {
				${selector} {
					grid-column: ${gridColumnValue};
					grid-row: auto;
				}
			}`;
    }
  }
  (0, import_utils.useStyleOverride)({ css });
  if (!css) {
    return;
  }
  return { className: `wp-container-content-${id}` };
}
function ChildLayoutControlsPure({ clientId, style, setAttributes }) {
  const parentLayout = (0, import_layout.useLayout)() || {};
  const {
    type: parentLayoutType = "default",
    allowSizingOnChildren = false,
    isManualPlacement
  } = parentLayout;
  if (parentLayoutType !== "grid") {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    GridTools,
    {
      clientId,
      style,
      setAttributes,
      allowSizingOnChildren,
      isManualPlacement,
      parentLayout
    }
  );
}
function GridTools({
  clientId,
  style,
  setAttributes,
  allowSizingOnChildren,
  isManualPlacement,
  parentLayout
}) {
  const {
    rootClientId,
    isVisible,
    parentBlockVisibility,
    blockBlockVisibility,
    deviceType,
    isChildBlockAGrid
  } = (0, import_data.useSelect)(
    (select) => {
      const {
        getBlockRootClientId,
        getBlockEditingMode,
        getTemplateLock,
        getBlockAttributes,
        getSettings
      } = select(import_store.store);
      const _rootClientId = getBlockRootClientId(clientId);
      if (getTemplateLock(_rootClientId) || getBlockEditingMode(_rootClientId) !== "default") {
        return {
          rootClientId: _rootClientId,
          isVisible: false
        };
      }
      const parentAttributes = getBlockAttributes(_rootClientId);
      const blockAttributes = getBlockAttributes(clientId);
      const settings = getSettings();
      return {
        rootClientId: _rootClientId,
        isVisible: true,
        parentBlockVisibility: parentAttributes?.metadata?.blockVisibility,
        blockBlockVisibility: blockAttributes?.metadata?.blockVisibility,
        deviceType: settings?.[import_private_keys.deviceTypeKey]?.toLowerCase() || import_constants.BLOCK_VISIBILITY_VIEWPORTS.desktop.value,
        // Check if the selected child block is itself a grid.
        isChildBlockAGrid: blockAttributes?.layout?.type === "grid"
      };
    },
    [clientId]
  );
  const { isBlockCurrentlyHidden: isParentBlockCurrentlyHidden } = (0, import_use_block_visibility.default)({
    blockVisibility: parentBlockVisibility,
    deviceType
  });
  const { isBlockCurrentlyHidden: isBlockItselfCurrentlyHidden } = (0, import_use_block_visibility.default)({
    blockVisibility: blockBlockVisibility,
    deviceType
  });
  const [resizerBounds, setResizerBounds] = (0, import_element.useState)();
  const childGridClientId = isChildBlockAGrid ? clientId : void 0;
  if (!isVisible || isParentBlockCurrentlyHidden) {
    return null;
  }
  const showResizer = allowSizingOnChildren && !isBlockItselfCurrentlyHidden;
  function updateLayout(layout) {
    setAttributes({
      style: {
        ...style,
        layout: {
          ...style?.layout,
          ...layout
        }
      }
    });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_grid.GridVisualizer,
      {
        clientId: rootClientId,
        contentRef: setResizerBounds,
        parentLayout,
        childGridClientId
      }
    ),
    showResizer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_grid.GridItemResizer,
      {
        clientId,
        bounds: resizerBounds,
        onChange: updateLayout,
        parentLayout
      }
    ),
    isManualPlacement && window.__experimentalEnableGridInteractivity && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_grid.GridItemMovers,
      {
        layout: style?.layout,
        parentLayout,
        onChange: updateLayout,
        gridClientId: rootClientId,
        blockClientId: clientId
      }
    )
  ] });
}
var layout_child_default = {
  useBlockProps: useBlockPropsChildLayoutStyles,
  edit: ChildLayoutControlsPure,
  attributeKeys: ["style"],
  hasSupport() {
    return true;
  }
};
//# sourceMappingURL=layout-child.cjs.map
