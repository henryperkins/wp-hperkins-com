// packages/block-library/src/navigation-link/shared/use-handle-link-change.js
import { useCallback } from "@wordpress/element";
import { useDispatch } from "@wordpress/data";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { updateAttributes } from "./update-attributes.mjs";
import { useEntityBinding } from "./use-entity-binding.mjs";
function useHandleLinkChange({ clientId, attributes, setAttributes }) {
  const { updateBlockAttributes } = useDispatch(blockEditorStore);
  const { hasUrlBinding, createBinding, clearBinding } = useEntityBinding({
    clientId,
    attributes
  });
  return useCallback(
    (updatedLink) => {
      if (!updatedLink) {
        return;
      }
      const attrs = {
        url: updatedLink.url,
        kind: updatedLink.kind,
        type: updatedLink.type,
        id: updatedLink.id
      };
      if (!attributes.label || attributes.label === "") {
        attrs.title = updatedLink.title;
      }
      const willBeCustomLink = !updatedLink.id && hasUrlBinding;
      if (willBeCustomLink) {
        clearBinding();
        updateBlockAttributes(clientId, {
          url: updatedLink.url,
          kind: "custom",
          type: "custom",
          id: void 0
        });
      } else {
        const { isEntityLink, attributes: updatedAttributes } = updateAttributes(attrs, setAttributes, attributes);
        if (isEntityLink) {
          createBinding(updatedAttributes);
        } else {
          clearBinding();
        }
      }
    },
    [
      attributes,
      clientId,
      hasUrlBinding,
      createBinding,
      clearBinding,
      setAttributes,
      updateBlockAttributes
    ]
  );
}
export {
  useHandleLinkChange
};
//# sourceMappingURL=use-handle-link-change.mjs.map
