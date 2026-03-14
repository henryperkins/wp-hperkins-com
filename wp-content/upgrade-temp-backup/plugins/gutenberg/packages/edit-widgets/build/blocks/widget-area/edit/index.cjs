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

// packages/edit-widgets/src/blocks/widget-area/edit/index.js
var edit_exports = {};
__export(edit_exports, {
  default: () => WidgetAreaEdit
});
module.exports = __toCommonJS(edit_exports);
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_components = require("@wordpress/components");
var import_block_editor = require("@wordpress/block-editor");
var import_inner_blocks = __toESM(require("./inner-blocks.cjs"));
var import_store = require("../../../store/index.cjs");
var import_use_is_dragging_within = __toESM(require("./use-is-dragging-within.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function WidgetAreaEdit({
  clientId,
  attributes: { id, name }
}) {
  const isOpen = (0, import_data.useSelect)(
    (select) => select(import_store.store).getIsWidgetAreaOpen(clientId),
    [clientId]
  );
  const { setIsWidgetAreaOpen } = (0, import_data.useDispatch)(import_store.store);
  const wrapper = (0, import_element.useRef)();
  const setOpen = (0, import_element.useCallback)(
    (openState) => setIsWidgetAreaOpen(clientId, openState),
    [clientId]
  );
  const isDragging = useIsDragging(wrapper);
  const isDraggingWithin = (0, import_use_is_dragging_within.default)(wrapper);
  const [openedWhileDragging, setOpenedWhileDragging] = (0, import_element.useState)(false);
  (0, import_element.useEffect)(() => {
    if (!isDragging) {
      setOpenedWhileDragging(false);
      return;
    }
    if (isDraggingWithin && !isOpen) {
      setOpen(true);
      setOpenedWhileDragging(true);
    } else if (!isDraggingWithin && isOpen && openedWhileDragging) {
      setOpen(false);
    }
  }, [isOpen, isDragging, isDraggingWithin, openedWhileDragging]);
  const blockProps = (0, import_block_editor.useBlockProps)();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ...blockProps, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Panel, { ref: wrapper, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.PanelBody,
    {
      title: name,
      opened: isOpen,
      onToggle: () => {
        setIsWidgetAreaOpen(clientId, !isOpen);
      },
      scrollAfterOpen: !isDragging,
      children: ({ opened }) => (
        // This is required to ensure LegacyWidget blocks are not
        // unmounted when the panel is collapsed. Unmounting legacy
        // widgets may have unintended consequences (e.g.  TinyMCE
        // not being properly reinitialized)
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.__unstableDisclosureContent,
          {
            className: "wp-block-widget-area__panel-body-content",
            visible: opened,
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_core_data.EntityProvider,
              {
                kind: "root",
                type: "postType",
                id: `widget-area-${id}`,
                children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_inner_blocks.default, { id })
              }
            )
          }
        )
      )
    }
  ) }) });
}
var useIsDragging = (elementRef) => {
  const [isDragging, setIsDragging] = (0, import_element.useState)(false);
  (0, import_element.useEffect)(() => {
    const { ownerDocument } = elementRef.current;
    function handleDragStart() {
      setIsDragging(true);
    }
    function handleDragEnd() {
      setIsDragging(false);
    }
    ownerDocument.addEventListener("dragstart", handleDragStart);
    ownerDocument.addEventListener("dragend", handleDragEnd);
    return () => {
      ownerDocument.removeEventListener("dragstart", handleDragStart);
      ownerDocument.removeEventListener("dragend", handleDragEnd);
    };
  }, []);
  return isDragging;
};
//# sourceMappingURL=index.cjs.map
