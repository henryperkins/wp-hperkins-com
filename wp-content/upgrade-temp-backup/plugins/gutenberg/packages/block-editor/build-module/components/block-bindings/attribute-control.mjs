// packages/block-editor/src/components/block-bindings/attribute-control.js
import fastDeepEqual from "fast-deep-equal/es6/index.js";
import { __ } from "@wordpress/i18n";
import {
  getBlockBindingsSource,
  store as blocksStore
} from "@wordpress/blocks";
import {
  __experimentalItem as Item,
  __experimentalText as Text,
  __experimentalToolsPanelItem as ToolsPanelItem,
  __experimentalVStack as VStack,
  privateApis as componentsPrivateApis
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { useContext } from "@wordpress/element";
import { useViewportMatch } from "@wordpress/compose";
import BlockContext from "../block-context/index.mjs";
import BlockBindingsSourceFieldsList from "./source-fields-list.mjs";
import useBlockBindingsUtils from "./use-block-bindings-utils.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { store as blockEditorStore } from "../../store/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var { Menu } = unlock(componentsPrivateApis);
function BlockBindingsAttributeControl({
  attribute,
  binding,
  blockName
}) {
  const { updateBlockBindings } = useBlockBindingsUtils();
  const isMobile = useViewportMatch("medium", "<");
  const blockContext = useContext(BlockContext);
  const compatibleFields = useSelect(
    (select) => {
      const {
        getAllBlockBindingsSources,
        getBlockBindingsSourceFieldsList,
        getBlockType
      } = unlock(select(blocksStore));
      const _attributeType = getBlockType(blockName).attributes?.[attribute]?.type;
      const attributeType = _attributeType === "rich-text" ? "string" : _attributeType;
      const sourceFields = {};
      Object.entries(getAllBlockBindingsSources()).forEach(
        ([sourceName, source2]) => {
          const fieldsList = getBlockBindingsSourceFieldsList(
            source2,
            blockContext
          );
          if (!fieldsList?.length) {
            return;
          }
          const compatibleFieldsList = fieldsList.filter(
            (field) => field.type === attributeType
          );
          if (compatibleFieldsList.length) {
            sourceFields[sourceName] = compatibleFieldsList;
          }
        }
      );
      return sourceFields;
    },
    [attribute, blockName, blockContext]
  );
  const { canUpdateBlockBindings } = useSelect((select) => ({
    canUpdateBlockBindings: select(blockEditorStore).getSettings().canUpdateBlockBindings
  }));
  const hasCompatibleFields = Object.keys(compatibleFields).length > 0;
  const isAttributeReadOnly = !canUpdateBlockBindings || !hasCompatibleFields;
  const { source: boundSourceName, args } = binding || {};
  const source = getBlockBindingsSource(boundSourceName);
  let displayText;
  let isValid = true;
  if (binding === void 0) {
    if (!hasCompatibleFields) {
      displayText = __("No sources available");
    } else {
      displayText = __("Not connected");
    }
    isValid = true;
  } else if (!source) {
    isValid = false;
    displayText = __("Source not registered");
  } else {
    displayText = compatibleFields?.[boundSourceName]?.find(
      (field) => fastDeepEqual(field.args, args)
    )?.label || source?.label || boundSourceName;
  }
  return /* @__PURE__ */ jsx(
    ToolsPanelItem,
    {
      hasValue: () => !!binding,
      label: attribute,
      onDeselect: !!hasCompatibleFields && (() => {
        updateBlockBindings({
          [attribute]: void 0
        });
      }),
      children: /* @__PURE__ */ jsxs(Menu, { placement: isMobile ? "bottom-start" : "left-start", children: [
        /* @__PURE__ */ jsx(
          Menu.TriggerButton,
          {
            render: /* @__PURE__ */ jsx(Item, {}),
            disabled: !hasCompatibleFields,
            children: /* @__PURE__ */ jsxs(
              VStack,
              {
                className: "block-editor-bindings__item",
                spacing: 0,
                children: [
                  /* @__PURE__ */ jsx(Text, { truncate: true, children: attribute }),
                  /* @__PURE__ */ jsx(
                    Text,
                    {
                      truncate: true,
                      variant: isValid ? "muted" : void 0,
                      isDestructive: !isValid,
                      children: displayText
                    }
                  )
                ]
              }
            )
          }
        ),
        !isAttributeReadOnly && /* @__PURE__ */ jsx(Menu.Popover, { gutter: isMobile ? 8 : 36, children: /* @__PURE__ */ jsx(
          Menu,
          {
            placement: isMobile ? "bottom-start" : "left-start",
            children: Object.entries(compatibleFields).map(
              ([sourceKey, fields]) => /* @__PURE__ */ jsx(
                BlockBindingsSourceFieldsList,
                {
                  args: binding?.args,
                  attribute,
                  sourceKey,
                  fields
                },
                sourceKey
              )
            )
          }
        ) })
      ] })
    }
  );
}
export {
  BlockBindingsAttributeControl as default
};
//# sourceMappingURL=attribute-control.mjs.map
