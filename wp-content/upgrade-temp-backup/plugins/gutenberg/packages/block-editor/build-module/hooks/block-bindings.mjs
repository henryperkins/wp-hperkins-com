// packages/block-editor/src/hooks/block-bindings.js
import { __ } from "@wordpress/i18n";
import { store as blocksStore } from "@wordpress/blocks";
import {
  __experimentalItemGroup as ItemGroup,
  __experimentalText as Text,
  __experimentalToolsPanel as ToolsPanel
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { useContext } from "@wordpress/element";
import { useViewportMatch } from "@wordpress/compose";
import {
  BlockBindingsAttributeControl,
  useBlockBindingsUtils
} from "../components/block-bindings/index.mjs";
import { unlock } from "../lock-unlock.mjs";
import InspectorControls from "../components/inspector-controls/index.mjs";
import BlockContext from "../components/block-context/index.mjs";
import { store as blockEditorStore } from "../store/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var useToolsPanelDropdownMenuProps = () => {
  const isMobile = useViewportMatch("medium", "<");
  return !isMobile ? {
    popoverProps: {
      placement: "left-start",
      // For non-mobile, inner sidebar width (248px) - button width (24px) - border (1px) + padding (16px) + spacing (20px)
      offset: 259
    }
  } : {};
};
var BlockBindingsPanel = ({ name: blockName, metadata }) => {
  const blockContext = useContext(BlockContext);
  const { removeAllBlockBindings } = useBlockBindingsUtils();
  const dropdownMenuProps = useToolsPanelDropdownMenuProps();
  const { bindableAttributes, hasCompatibleFields } = useSelect(
    (select) => {
      const { __experimentalBlockBindingsSupportedAttributes } = select(blockEditorStore).getSettings();
      const {
        getAllBlockBindingsSources,
        getBlockBindingsSourceFieldsList
      } = unlock(select(blocksStore));
      return {
        bindableAttributes: __experimentalBlockBindingsSupportedAttributes?.[blockName],
        hasCompatibleFields: Object.values(
          getAllBlockBindingsSources()
        ).some(
          (source) => getBlockBindingsSourceFieldsList(source, blockContext)?.length > 0
        )
      };
    },
    [blockName, blockContext]
  );
  if (!bindableAttributes || bindableAttributes.length === 0) {
    return null;
  }
  const { bindings } = metadata || {};
  if (bindings === void 0 && !hasCompatibleFields) {
    return null;
  }
  return /* @__PURE__ */ jsx(InspectorControls, { group: "bindings", children: /* @__PURE__ */ jsxs(
    ToolsPanel,
    {
      label: __("Attributes"),
      resetAll: () => {
        removeAllBlockBindings();
      },
      dropdownMenuProps,
      className: "block-editor-bindings__panel",
      children: [
        /* @__PURE__ */ jsx(ItemGroup, { isBordered: true, isSeparated: true, children: bindableAttributes.map((attribute) => /* @__PURE__ */ jsx(
          BlockBindingsAttributeControl,
          {
            attribute,
            blockName,
            binding: bindings?.[attribute]
          },
          attribute
        )) }),
        /* @__PURE__ */ jsx(Text, { as: "div", variant: "muted", children: /* @__PURE__ */ jsx("p", { children: __(
          "Attributes connected to custom fields or other dynamic data."
        ) }) })
      ]
    }
  ) });
};
var block_bindings_default = {
  edit: BlockBindingsPanel,
  attributeKeys: ["metadata"],
  hasSupport(name) {
    return ![
      "core/post-date",
      "core/navigation-link",
      "core/navigation-submenu"
    ].includes(name);
  }
};
export {
  BlockBindingsPanel,
  block_bindings_default as default
};
//# sourceMappingURL=block-bindings.mjs.map
