"use strict";

// packages/editor/src/hooks/custom-sources-backwards-compatibility.js
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_element = require("@wordpress/element");
var import_compose = require("@wordpress/compose");
var import_hooks = require("@wordpress/hooks");
var import_store = require("../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var createWithMetaAttributeSource = (metaAttributes) => (0, import_compose.createHigherOrderComponent)(
  (BlockEdit) => ({ attributes, setAttributes, ...props }) => {
    const postType = (0, import_data.useSelect)(
      (select) => select(import_store.store).getCurrentPostType(),
      []
    );
    const [meta, setMeta] = (0, import_core_data.useEntityProp)(
      "postType",
      postType,
      "meta"
    );
    const mergedAttributes = (0, import_element.useMemo)(
      () => ({
        ...attributes,
        ...Object.fromEntries(
          Object.entries(metaAttributes).map(
            ([attributeKey, metaKey]) => [
              attributeKey,
              meta[metaKey]
            ]
          )
        )
      }),
      [attributes, meta]
    );
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      BlockEdit,
      {
        attributes: mergedAttributes,
        setAttributes: (nextAttributes) => {
          const nextMeta = Object.fromEntries(
            Object.entries(nextAttributes ?? {}).filter(
              // Filter to intersection of keys between the updated
              // attributes and those with an associated meta key.
              ([key]) => key in metaAttributes
            ).map(([attributeKey, value]) => [
              // Rename the keys to the expected meta key name.
              metaAttributes[attributeKey],
              value
            ])
          );
          if (Object.entries(nextMeta).length) {
            setMeta(nextMeta);
          }
          setAttributes(nextAttributes);
        },
        ...props
      }
    );
  },
  "withMetaAttributeSource"
);
function shimAttributeSource(settings) {
  const metaAttributes = Object.fromEntries(
    Object.entries(settings.attributes ?? {}).filter(([, { source }]) => source === "meta").map(([attributeKey, { meta }]) => [attributeKey, meta])
  );
  if (Object.entries(metaAttributes).length) {
    settings.edit = createWithMetaAttributeSource(metaAttributes)(
      settings.edit
    );
  }
  return settings;
}
(0, import_hooks.addFilter)(
  "blocks.registerBlockType",
  "core/editor/custom-sources-backwards-compatibility/shim-attribute-source",
  shimAttributeSource
);
//# sourceMappingURL=custom-sources-backwards-compatibility.cjs.map
