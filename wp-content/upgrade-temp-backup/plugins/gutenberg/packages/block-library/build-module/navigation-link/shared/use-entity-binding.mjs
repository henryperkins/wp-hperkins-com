// packages/block-library/src/navigation-link/shared/use-entity-binding.js
import { useCallback } from "@wordpress/element";
import {
  useBlockBindingsUtils,
  useBlockEditingMode
} from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
function buildNavigationLinkEntityBinding(kind) {
  if (kind === void 0) {
    throw new Error(
      'buildNavigationLinkEntityBinding requires a kind parameter. Only "post-type" and "taxonomy" are supported.'
    );
  }
  if (kind !== "post-type" && kind !== "taxonomy") {
    throw new Error(
      `Invalid kind "${kind}" provided to buildNavigationLinkEntityBinding. Only 'post-type' and 'taxonomy' are supported.`
    );
  }
  const source = kind === "taxonomy" ? "core/term-data" : "core/post-data";
  return {
    url: {
      source,
      args: {
        field: "link"
      }
    }
  };
}
function useEntityBinding({ clientId, attributes }) {
  const { updateBlockBindings } = useBlockBindingsUtils(clientId);
  const { metadata, id, kind, type } = attributes;
  const blockEditingMode = useBlockEditingMode();
  const hasUrlBinding = !!metadata?.bindings?.url && !!id;
  const expectedSource = kind === "post-type" ? "core/post-data" : "core/term-data";
  const hasCorrectBinding = hasUrlBinding && metadata?.bindings?.url?.source === expectedSource;
  const { isBoundEntityAvailable, entityRecord } = useSelect(
    (select) => {
      if (!hasCorrectBinding || !id) {
        return { isBoundEntityAvailable: false, entityRecord: null };
      }
      const isPostType = kind === "post-type";
      const isTaxonomy = kind === "taxonomy";
      if (!isPostType && !isTaxonomy) {
        return { isBoundEntityAvailable: false, entityRecord: null };
      }
      if (blockEditingMode === "disabled") {
        return { isBoundEntityAvailable: true, entityRecord: null };
      }
      const { getEntityRecord, hasFinishedResolution } = select(coreStore);
      const entityType = isTaxonomy ? "taxonomy" : "postType";
      const typeForAPI = type === "tag" ? "post_tag" : type;
      const record = getEntityRecord(entityType, typeForAPI, id);
      const hasResolved = hasFinishedResolution("getEntityRecord", [
        entityType,
        typeForAPI,
        id
      ]);
      const isAvailable = hasResolved ? record !== void 0 : true;
      return {
        isBoundEntityAvailable: isAvailable,
        entityRecord: record || null
      };
    },
    [kind, type, id, hasCorrectBinding, blockEditingMode]
  );
  const clearBinding = useCallback(() => {
    if (hasUrlBinding) {
      updateBlockBindings({ url: void 0 });
    }
  }, [updateBlockBindings, hasUrlBinding]);
  const createBinding = useCallback(
    (updatedAttributes) => {
      const kindToUse = updatedAttributes?.kind ?? kind;
      if (!kindToUse) {
        return;
      }
      try {
        const binding = buildNavigationLinkEntityBinding(kindToUse);
        updateBlockBindings(binding);
      } catch (error) {
        console.warn(
          "Failed to create entity binding:",
          error.message
        );
      }
    },
    [updateBlockBindings, kind]
  );
  return {
    hasUrlBinding: hasCorrectBinding,
    isBoundEntityAvailable,
    entityRecord,
    clearBinding,
    createBinding
  };
}
export {
  buildNavigationLinkEntityBinding,
  useEntityBinding
};
//# sourceMappingURL=use-entity-binding.mjs.map
