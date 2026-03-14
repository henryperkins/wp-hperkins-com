// packages/block-editor/src/components/border-radius-control/constants.js
import { __ } from "@wordpress/i18n";
import {
  cornerAll,
  cornerBottomLeft,
  cornerBottomRight,
  cornerTopLeft,
  cornerTopRight
} from "@wordpress/icons";
var DEFAULT_VALUES = {
  topLeft: void 0,
  topRight: void 0,
  bottomLeft: void 0,
  bottomRight: void 0
};
var RANGE_CONTROL_MAX_SIZE = 8;
var EMPTY_ARRAY = [];
var CORNERS = {
  all: __("Border radius"),
  topLeft: __("Top left"),
  topRight: __("Top right"),
  bottomLeft: __("Bottom left"),
  bottomRight: __("Bottom right")
};
var ICONS = {
  all: cornerAll,
  topLeft: cornerTopLeft,
  topRight: cornerTopRight,
  bottomLeft: cornerBottomLeft,
  bottomRight: cornerBottomRight
};
var MIN_BORDER_RADIUS_VALUE = 0;
var MAX_BORDER_RADIUS_VALUES = {
  px: 100,
  em: 20,
  rem: 20
};
export {
  CORNERS,
  DEFAULT_VALUES,
  EMPTY_ARRAY,
  ICONS,
  MAX_BORDER_RADIUS_VALUES,
  MIN_BORDER_RADIUS_VALUE,
  RANGE_CONTROL_MAX_SIZE
};
//# sourceMappingURL=constants.mjs.map
