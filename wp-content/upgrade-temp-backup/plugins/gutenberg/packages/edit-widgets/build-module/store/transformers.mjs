// packages/edit-widgets/src/store/transformers.js
import { createBlock, parse, serialize } from "@wordpress/blocks";
import { addWidgetIdToBlock } from "@wordpress/widgets";
function transformWidgetToBlock(widget) {
  if (widget.id_base === "block") {
    const parsedBlocks = parse(widget.instance.raw.content, {
      __unstableSkipAutop: true
    });
    if (!parsedBlocks.length) {
      return addWidgetIdToBlock(
        createBlock("core/paragraph", {}, []),
        widget.id
      );
    }
    return addWidgetIdToBlock(parsedBlocks[0], widget.id);
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
  return addWidgetIdToBlock(
    createBlock("core/legacy-widget", attributes, []),
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
          content: serialize(block)
        }
      }
    };
  }
  delete widget.rendered;
  delete widget.rendered_form;
  return widget;
}
export {
  transformBlockToWidget,
  transformWidgetToBlock
};
//# sourceMappingURL=transformers.mjs.map
