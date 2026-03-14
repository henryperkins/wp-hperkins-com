// packages/editor/src/components/page-attributes/order.js
import { __ } from "@wordpress/i18n";
import {
  Flex,
  FlexBlock,
  __experimentalNumberControl as NumberControl
} from "@wordpress/components";
import { useSelect, useDispatch } from "@wordpress/data";
import { useState } from "@wordpress/element";
import PostTypeSupportCheck from "../post-type-support-check/index.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { jsx } from "react/jsx-runtime";
function PageAttributesOrder() {
  const order = useSelect(
    (select) => select(editorStore).getEditedPostAttribute("menu_order") ?? 0,
    []
  );
  const { editPost } = useDispatch(editorStore);
  const [orderInput, setOrderInput] = useState(null);
  const setUpdatedOrder = (value2) => {
    setOrderInput(value2);
    const newOrder = Number(value2);
    if (Number.isInteger(newOrder) && value2.trim?.() !== "") {
      editPost({ menu_order: newOrder });
    }
  };
  const value = orderInput ?? order;
  return /* @__PURE__ */ jsx(Flex, { children: /* @__PURE__ */ jsx(FlexBlock, { children: /* @__PURE__ */ jsx(
    NumberControl,
    {
      __next40pxDefaultSize: true,
      label: __("Order"),
      help: __("Set the page order."),
      value,
      onChange: setUpdatedOrder,
      hideLabelFromVision: true,
      onBlur: () => {
        setOrderInput(null);
      }
    }
  ) }) });
}
function PageAttributesOrderWithChecks() {
  return /* @__PURE__ */ jsx(PostTypeSupportCheck, { supportKeys: "page-attributes", children: /* @__PURE__ */ jsx(PageAttributesOrder, {}) });
}
export {
  PageAttributesOrderWithChecks as default
};
//# sourceMappingURL=order.mjs.map
