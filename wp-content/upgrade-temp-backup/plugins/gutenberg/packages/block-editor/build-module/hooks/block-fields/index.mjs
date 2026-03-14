// packages/block-editor/src/hooks/block-fields/index.js
import {
  privateApis as blocksPrivateApis,
  getBlockType,
  store as blocksStore
} from "@wordpress/blocks";
import { useDebounce } from "@wordpress/compose";
import {
  __experimentalHStack as HStack,
  __experimentalTruncate as Truncate
} from "@wordpress/components";
import { useDispatch, useSelect } from "@wordpress/data";
import { DataForm } from "@wordpress/dataviews";
import { useContext, useState, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { store as blockEditorStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import BlockContext from "../../components/block-context/index.mjs";
import BlockIcon from "../../components/block-icon/index.mjs";
import useBlockDisplayTitle from "../../components/block-title/use-block-display-title.mjs";
import useBlockDisplayInformation from "../../components/use-block-display-information/index.mjs";
import FieldsDropdownMenu from "./fields-dropdown-menu.mjs";
import { PrivateBlockContext } from "../../components/block-list/private-block-context.mjs";
import InspectorControls from "../../components/inspector-controls/fill.mjs";
import RichText from "./rich-text/index.mjs";
import Media from "./media/index.mjs";
import Link from "./link/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { fieldsKey, formKey } = unlock(blocksPrivateApis);
function createConfiguredControl(ControlComponent, config = {}) {
  return function ConfiguredControl(props) {
    return /* @__PURE__ */ jsx(ControlComponent, { ...props, config });
  };
}
function BlockFields({
  clientId,
  blockType,
  setAttributes,
  isMultiBlock = false
}) {
  const blockTitle = useBlockDisplayTitle({
    clientId,
    context: "list-view"
  });
  const blockInformation = useBlockDisplayInformation(clientId);
  const blockTypeFields = blockType?.[fieldsKey];
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
  const { selectBlock, toggleBlockHighlight } = useDispatch(blockEditorStore);
  const debouncedToggleBlockHighlight = useDebounce(
    toggleBlockHighlight,
    50
  );
  const computedForm = useMemo(() => {
    if (!isMultiBlock) {
      return blockType?.[formKey];
    }
    return {
      ...blockType?.[formKey],
      fields: [blockType?.[formKey]?.fields?.[0]]
    };
  }, [blockType, isMultiBlock]);
  const [form, setForm] = useState(computedForm);
  const dataFormFields = useMemo(() => {
    if (!blockTypeFields?.length) {
      return [];
    }
    return blockTypeFields.map((fieldDef) => {
      const field = {
        ...fieldDef
      };
      if ("string" === typeof fieldDef.Edit && fieldDef.Edit === "rich-text") {
        field.Edit = createConfiguredControl(RichText, {
          clientId
        });
      } else if ("string" === typeof fieldDef.Edit && fieldDef.Edit === "link") {
        field.Edit = createConfiguredControl(Link);
      } else if ("object" === typeof fieldDef.Edit && fieldDef.Edit.control === "media") {
        field.Edit = createConfiguredControl(Media, {
          ...fieldDef.Edit
        });
      }
      return field;
    });
  }, [blockTypeFields, clientId]);
  if (!blockTypeFields?.length) {
    return null;
  }
  const handleToggleField = (fieldId) => {
    setForm((prev) => {
      if (prev.fields?.includes(fieldId)) {
        return {
          ...prev,
          fields: prev.fields.filter((id) => id !== fieldId)
        };
      }
      return {
        ...prev,
        fields: [...prev.fields || [], fieldId]
      };
    });
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "block-editor-block-fields__container",
      onMouseEnter: isMultiBlock ? () => debouncedToggleBlockHighlight(clientId, true) : void 0,
      onMouseLeave: () => isMultiBlock ? debouncedToggleBlockHighlight(clientId, false) : void 0,
      onFocus: isMultiBlock ? () => {
        selectBlock(
          clientId,
          null
          /* null to avoid focus on the block in the canvas */
        );
      } : void 0,
      children: [
        /* @__PURE__ */ jsx("div", { className: "block-editor-block-fields__header", children: /* @__PURE__ */ jsxs(HStack, { spacing: 1, children: [
          isMultiBlock && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              BlockIcon,
              {
                className: "block-editor-block-fields__header-icon",
                icon: blockInformation?.icon
              }
            ),
            /* @__PURE__ */ jsx("h2", { className: "block-editor-block-fields__header-title", children: /* @__PURE__ */ jsx(Truncate, { numberOfLines: 1, children: blockTitle }) }),
            /* @__PURE__ */ jsx(
              FieldsDropdownMenu,
              {
                fields: dataFormFields,
                visibleFields: form.fields,
                onToggleField: handleToggleField
              }
            )
          ] }),
          !isMultiBlock && /* @__PURE__ */ jsx("h2", { className: "block-editor-block-fields__header-title", children: __("Content") })
        ] }) }),
        /* @__PURE__ */ jsx(
          DataForm,
          {
            data: attributes,
            fields: dataFormFields,
            form,
            onChange: setAttributes
          }
        )
      ]
    }
  );
}
function hasBlockFieldsSupport(blockName) {
  return !!(window?.__experimentalContentOnlyInspectorFields && getBlockType(blockName)?.[fieldsKey]);
}
function BlockFieldsPanel(props) {
  const { blockType, isSelectionWithinCurrentSection } = useContext(PrivateBlockContext);
  return /* @__PURE__ */ jsx(InspectorControls, { group: "content", children: /* @__PURE__ */ jsx(
    BlockFields,
    {
      ...props,
      blockType,
      isMultiBlock: isSelectionWithinCurrentSection
    }
  ) });
}
var block_fields_default = {
  edit: BlockFieldsPanel,
  hasSupport: hasBlockFieldsSupport,
  attributeKeys: [],
  supportsPatternEditing: true
};
export {
  BlockFieldsPanel,
  block_fields_default as default
};
//# sourceMappingURL=index.mjs.map
