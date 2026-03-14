// packages/block-editor/src/components/block-edit/multiple-usage-warning.js
import { getBlockType } from "@wordpress/blocks";
import { Button } from "@wordpress/components";
import { useDispatch } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { store as blockEditorStore } from "../../store/index.mjs";
import Warning from "../warning/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function MultipleUsageWarning({
  originalBlockClientId,
  name,
  onReplace
}) {
  const { selectBlock } = useDispatch(blockEditorStore);
  const blockType = getBlockType(name);
  return /* @__PURE__ */ jsxs(
    Warning,
    {
      actions: [
        /* @__PURE__ */ jsx(
          Button,
          {
            __next40pxDefaultSize: true,
            variant: "secondary",
            onClick: () => selectBlock(originalBlockClientId),
            children: __("Find original")
          },
          "find-original"
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            __next40pxDefaultSize: true,
            variant: "secondary",
            onClick: () => onReplace([]),
            children: __("Remove")
          },
          "remove"
        )
      ],
      children: [
        /* @__PURE__ */ jsxs("strong", { children: [
          blockType?.title,
          ": "
        ] }),
        __("This block can only be used once.")
      ]
    }
  );
}
export {
  MultipleUsageWarning
};
//# sourceMappingURL=multiple-usage-warning.mjs.map
