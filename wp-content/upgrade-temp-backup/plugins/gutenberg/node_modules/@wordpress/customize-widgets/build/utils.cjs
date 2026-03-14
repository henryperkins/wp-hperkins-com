var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/customize-widgets/src/utils.js
var utils_exports = {};
__export(utils_exports, {
  blockToWidget: () => blockToWidget,
  settingIdToWidgetId: () => settingIdToWidgetId,
  widgetToBlock: () => widgetToBlock
});
module.exports = __toCommonJS(utils_exports);
var import_blocks = require("@wordpress/blocks");
var import_widgets = require("@wordpress/widgets");
function settingIdToWidgetId(settingId) {
  const matches = settingId.match(/^widget_(.+)(?:\[(\d+)\])$/);
  if (matches) {
    const idBase = matches[1];
    const number = parseInt(matches[2], 10);
    return `${idBase}-${number}`;
  }
  return settingId;
}
function blockToWidget(block, existingWidget = null) {
  let widget;
  const isValidLegacyWidgetBlock = block.name === "core/legacy-widget" && (block.attributes.id || block.attributes.instance);
  if (isValidLegacyWidgetBlock) {
    if (block.attributes.id) {
      widget = {
        id: block.attributes.id
      };
    } else {
      const { encoded, hash, raw, ...rest } = block.attributes.instance;
      widget = {
        idBase: block.attributes.idBase,
        instance: {
          ...existingWidget?.instance,
          // Required only for the customizer.
          is_widget_customizer_js_value: true,
          encoded_serialized_instance: encoded,
          instance_hash_key: hash,
          raw_instance: raw,
          ...rest
        }
      };
    }
  } else {
    const instance = {
      content: (0, import_blocks.serialize)(block)
    };
    widget = {
      idBase: "block",
      widgetClass: "WP_Widget_Block",
      instance: {
        raw_instance: instance
      }
    };
  }
  const { form, rendered, ...restExistingWidget } = existingWidget || {};
  return {
    ...restExistingWidget,
    ...widget
  };
}
function widgetToBlock({ id, idBase, number, instance }) {
  let block;
  const {
    encoded_serialized_instance: encoded,
    instance_hash_key: hash,
    raw_instance: raw,
    ...rest
  } = instance;
  if (idBase === "block") {
    const parsedBlocks = (0, import_blocks.parse)(raw.content ?? "", {
      __unstableSkipAutop: true
    });
    block = parsedBlocks.length ? parsedBlocks[0] : (0, import_blocks.createBlock)("core/paragraph", {});
  } else if (number) {
    block = (0, import_blocks.createBlock)("core/legacy-widget", {
      idBase,
      instance: {
        encoded,
        hash,
        raw,
        ...rest
      }
    });
  } else {
    block = (0, import_blocks.createBlock)("core/legacy-widget", {
      id
    });
  }
  return (0, import_widgets.addWidgetIdToBlock)(block, id);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  blockToWidget,
  settingIdToWidgetId,
  widgetToBlock
});
//# sourceMappingURL=utils.cjs.map
