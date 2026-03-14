// packages/block-editor/src/hooks/auto-inspector-controls.js
import { getBlockType, store as blocksStore } from "@wordpress/blocks";
import { PanelBody } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { DataForm } from "@wordpress/dataviews";
import { useContext, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import InspectorControls from "../components/inspector-controls/index.mjs";
import { useBlockEditingMode } from "../components/block-editing-mode/index.mjs";
import { store as blockEditorStore } from "../store/index.mjs";
import { unlock } from "../lock-unlock.mjs";
import BlockContext from "../components/block-context/index.mjs";
import { generateFieldsFromAttributes } from "./generate-fields-from-attributes.mjs";
import { jsx } from "react/jsx-runtime";
function hasAutoGenerateControl(blockTypeAttributes) {
  if (!blockTypeAttributes) {
    return false;
  }
  return Object.values(blockTypeAttributes).some(
    (attr) => attr?.autoGenerateControl
  );
}
function AutoRegisterControls({ name, clientId, setAttributes }) {
  const blockEditingMode = useBlockEditingMode();
  const blockContext = useContext(BlockContext);
  const attributes = useSelect(
    (select) => {
      const _attributes = select(blockEditorStore).getBlockAttributes(clientId);
      if (!_attributes?.metadata?.bindings) {
        return _attributes;
      }
      const { getBlockBindingsSource } = unlock(select(blocksStore));
      return Object.entries(_attributes.metadata.bindings).reduce(
        (acc, [attribute, binding]) => {
          const source = getBlockBindingsSource(binding.source);
          if (!source) {
            return acc;
          }
          const values = source.getValues({
            select,
            context: blockContext,
            bindings: { [attribute]: binding }
          });
          return { ...acc, ...values };
        },
        _attributes
      );
    },
    [blockContext, clientId]
  );
  const blockType = getBlockType(name);
  const { fields, form } = useMemo(() => {
    if (!blockType?.attributes) {
      return { fields: [], form: { fields: [] } };
    }
    return generateFieldsFromAttributes(blockType.attributes);
  }, [blockType?.attributes]);
  if (blockEditingMode !== "default") {
    return null;
  }
  if (!fields || fields.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsx(InspectorControls, { children: /* @__PURE__ */ jsx(PanelBody, { title: __("Settings"), children: /* @__PURE__ */ jsx(
    DataForm,
    {
      data: attributes,
      fields,
      form,
      onChange: setAttributes
    }
  ) }) });
}
var auto_inspector_controls_default = {
  edit: AutoRegisterControls,
  attributeKeys: [],
  hasSupport(name) {
    const blockType = getBlockType(name);
    return hasAutoGenerateControl(blockType?.attributes);
  }
};
export {
  auto_inspector_controls_default as default
};
//# sourceMappingURL=auto-inspector-controls.mjs.map
