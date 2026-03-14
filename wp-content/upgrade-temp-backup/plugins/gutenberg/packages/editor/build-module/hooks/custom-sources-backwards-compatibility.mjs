// packages/editor/src/hooks/custom-sources-backwards-compatibility.js
import { useSelect } from "@wordpress/data";
import { useEntityProp } from "@wordpress/core-data";
import { useMemo } from "@wordpress/element";
import { createHigherOrderComponent } from "@wordpress/compose";
import { addFilter } from "@wordpress/hooks";
import { store as editorStore } from "../store/index.mjs";
import { jsx } from "react/jsx-runtime";
var createWithMetaAttributeSource = (metaAttributes) => createHigherOrderComponent(
  (BlockEdit) => ({ attributes, setAttributes, ...props }) => {
    const postType = useSelect(
      (select) => select(editorStore).getCurrentPostType(),
      []
    );
    const [meta, setMeta] = useEntityProp(
      "postType",
      postType,
      "meta"
    );
    const mergedAttributes = useMemo(
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
    return /* @__PURE__ */ jsx(
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
addFilter(
  "blocks.registerBlockType",
  "core/editor/custom-sources-backwards-compatibility/shim-attribute-source",
  shimAttributeSource
);
//# sourceMappingURL=custom-sources-backwards-compatibility.mjs.map
