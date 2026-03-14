// packages/editor/src/bindings/pattern-overrides.js
import { store as blockEditorStore } from "@wordpress/block-editor";
var CONTENT = "content";
var pattern_overrides_default = {
  name: "core/pattern-overrides",
  getValues({ select, clientId, context, bindings }) {
    const patternOverridesContent = context["pattern/overrides"];
    const { getBlockAttributes } = select(blockEditorStore);
    const currentBlockAttributes = getBlockAttributes(clientId);
    const overridesValues = {};
    for (const attributeName of Object.keys(bindings)) {
      const overridableValue = patternOverridesContent?.[currentBlockAttributes?.metadata?.name]?.[attributeName];
      if (overridableValue === void 0) {
        overridesValues[attributeName] = currentBlockAttributes[attributeName];
        continue;
      } else {
        overridesValues[attributeName] = overridableValue === "" ? void 0 : overridableValue;
      }
    }
    return overridesValues;
  },
  setValues({ select, dispatch, clientId, bindings }) {
    const { getBlockAttributes, getBlockParentsByBlockName, getBlocks } = select(blockEditorStore);
    const currentBlockAttributes = getBlockAttributes(clientId);
    const blockName = currentBlockAttributes?.metadata?.name;
    if (!blockName) {
      return;
    }
    const [patternClientId] = getBlockParentsByBlockName(
      clientId,
      "core/block",
      true
    );
    const attributes = Object.entries(bindings).reduce(
      (attrs, [key, { newValue }]) => {
        attrs[key] = newValue;
        return attrs;
      },
      {}
    );
    if (!patternClientId) {
      const syncBlocksWithSameName = (blocks) => {
        for (const block of blocks) {
          if (block.attributes?.metadata?.name === blockName) {
            dispatch(blockEditorStore).updateBlockAttributes(
              block.clientId,
              attributes
            );
          }
          syncBlocksWithSameName(block.innerBlocks);
        }
      };
      syncBlocksWithSameName(getBlocks());
      return;
    }
    const currentBindingValue = getBlockAttributes(patternClientId)?.[CONTENT];
    dispatch(blockEditorStore).updateBlockAttributes(patternClientId, {
      [CONTENT]: {
        ...currentBindingValue,
        [blockName]: {
          ...currentBindingValue?.[blockName],
          ...Object.entries(attributes).reduce(
            (acc, [key, value]) => {
              acc[key] = value === void 0 ? "" : value;
              return acc;
            },
            {}
          )
        }
      }
    });
  },
  canUserEditValue: () => true
};
export {
  pattern_overrides_default as default
};
//# sourceMappingURL=pattern-overrides.mjs.map
