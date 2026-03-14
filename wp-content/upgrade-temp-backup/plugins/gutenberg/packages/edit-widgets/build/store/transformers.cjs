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

// packages/edit-widgets/src/store/transformers.js
var transformers_exports = {};
__export(transformers_exports, {
  transformBlockToWidget: () => transformBlockToWidget,
  transformWidgetToBlock: () => transformWidgetToBlock
});
module.exports = __toCommonJS(transformers_exports);
var import_blocks = require("@wordpress/blocks");
var import_widgets = require("@wordpress/widgets");
function transformWidgetToBlock(widget) {
  if (widget.id_base === "block") {
    const parsedBlocks = (0, import_blocks.parse)(widget.instance.raw.content, {
      __unstableSkipAutop: true
    });
    if (!parsedBlocks.length) {
      return (0, import_widgets.addWidgetIdToBlock)(
        (0, import_blocks.createBlock)("core/paragraph", {}, []),
        widget.id
      );
    }
    return (0, import_widgets.addWidgetIdToBlock)(parsedBlocks[0], widget.id);
  }
  let attributes;
  if (widget._embedded.about[0].is_multi) {
    attributes = {
      idBase: widget.id_base,
      instance: widget.instance
    };
  } else {
    attributes = {
      id: widget.id
    };
  }
  return (0, import_widgets.addWidgetIdToBlock)(
    (0, import_blocks.createBlock)("core/legacy-widget", attributes, []),
    widget.id
  );
}
function transformBlockToWidget(block, relatedWidget = {}) {
  let widget;
  const isValidLegacyWidgetBlock = block.name === "core/legacy-widget" && (block.attributes.id || block.attributes.instance);
  if (isValidLegacyWidgetBlock) {
    widget = {
      ...relatedWidget,
      id: block.attributes.id ?? relatedWidget.id,
      id_base: block.attributes.idBase ?? relatedWidget.id_base,
      instance: block.attributes.instance ?? relatedWidget.instance
    };
  } else {
    widget = {
      ...relatedWidget,
      id_base: "block",
      instance: {
        raw: {
          content: (0, import_blocks.serialize)(block)
        }
      }
    };
  }
  delete widget.rendered;
  delete widget.rendered_form;
  return widget;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  transformBlockToWidget,
  transformWidgetToBlock
});
//# sourceMappingURL=transformers.cjs.map
