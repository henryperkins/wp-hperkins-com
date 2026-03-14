// packages/widgets/src/blocks/legacy-widget/edit/index.js
import clsx from "clsx";
import {
  useBlockProps,
  BlockControls,
  InspectorControls,
  BlockIcon
} from "@wordpress/block-editor";
import { Flex, FlexBlock, Spinner, Placeholder } from "@wordpress/components";
import { brush as brushIcon } from "@wordpress/icons";
import { __ } from "@wordpress/i18n";
import { useState, useCallback } from "@wordpress/element";
import { useEntityRecord } from "@wordpress/core-data";
import WidgetTypeSelector from "./widget-type-selector.mjs";
import InspectorCard from "./inspector-card.mjs";
import Form from "./form.mjs";
import Preview from "./preview.mjs";
import NoPreview from "./no-preview.mjs";
import ConvertToBlocksButton from "./convert-to-blocks-button.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function Edit(props) {
  const { id, idBase } = props.attributes;
  const { isWide = false } = props;
  const blockProps = useBlockProps({
    className: clsx({
      "is-wide-widget": isWide
    })
  });
  return /* @__PURE__ */ jsx("div", { ...blockProps, children: !id && !idBase ? /* @__PURE__ */ jsx(Empty, { ...props }) : /* @__PURE__ */ jsx(NotEmpty, { ...props }) });
}
function Empty({ attributes: { id, idBase }, setAttributes }) {
  return /* @__PURE__ */ jsx(
    Placeholder,
    {
      icon: /* @__PURE__ */ jsx(BlockIcon, { icon: brushIcon }),
      label: __("Legacy Widget"),
      children: /* @__PURE__ */ jsx(Flex, { children: /* @__PURE__ */ jsx(FlexBlock, { children: /* @__PURE__ */ jsx(
        WidgetTypeSelector,
        {
          selectedId: id ?? idBase,
          onSelect: ({ selectedId, isMulti }) => {
            if (!selectedId) {
              setAttributes({
                id: null,
                idBase: null,
                instance: null
              });
            } else if (isMulti) {
              setAttributes({
                id: null,
                idBase: selectedId,
                instance: {}
              });
            } else {
              setAttributes({
                id: selectedId,
                idBase: null,
                instance: null
              });
            }
          }
        }
      ) }) })
    }
  );
}
function NotEmpty({
  attributes: { id, idBase, instance },
  setAttributes,
  clientId,
  isSelected,
  isWide = false
}) {
  const [hasPreview, setHasPreview] = useState(null);
  const widgetTypeId = id ?? idBase;
  const { record: widgetType, hasResolved: hasResolvedWidgetType } = useEntityRecord("root", "widgetType", widgetTypeId);
  const setInstance = useCallback((nextInstance) => {
    setAttributes({ instance: nextInstance });
  }, []);
  if (!widgetType && hasResolvedWidgetType) {
    return /* @__PURE__ */ jsx(
      Placeholder,
      {
        icon: /* @__PURE__ */ jsx(BlockIcon, { icon: brushIcon }),
        label: __("Legacy Widget"),
        children: __("Widget is missing.")
      }
    );
  }
  if (!hasResolvedWidgetType) {
    return /* @__PURE__ */ jsx(Placeholder, { children: /* @__PURE__ */ jsx(Spinner, {}) });
  }
  const mode = idBase && !isSelected ? "preview" : "edit";
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    idBase === "text" && /* @__PURE__ */ jsx(BlockControls, { group: "other", children: /* @__PURE__ */ jsx(
      ConvertToBlocksButton,
      {
        clientId,
        rawInstance: instance.raw
      }
    ) }),
    /* @__PURE__ */ jsx(InspectorControls, { children: /* @__PURE__ */ jsx(
      InspectorCard,
      {
        name: widgetType.name,
        description: widgetType.description
      }
    ) }),
    /* @__PURE__ */ jsx(
      Form,
      {
        title: widgetType.name,
        isVisible: mode === "edit",
        id,
        idBase,
        instance,
        isWide,
        onChangeInstance: setInstance,
        onChangeHasPreview: setHasPreview
      }
    ),
    idBase && /* @__PURE__ */ jsxs(Fragment, { children: [
      hasPreview === null && mode === "preview" && /* @__PURE__ */ jsx(Placeholder, { children: /* @__PURE__ */ jsx(Spinner, {}) }),
      hasPreview === true && /* @__PURE__ */ jsx(
        Preview,
        {
          idBase,
          instance,
          isVisible: mode === "preview"
        }
      ),
      hasPreview === false && mode === "preview" && /* @__PURE__ */ jsx(NoPreview, { name: widgetType.name })
    ] })
  ] });
}
export {
  Edit as default
};
//# sourceMappingURL=index.mjs.map
