// packages/editor/src/components/provider/disable-non-page-content-blocks.js
import { useSelect, useRegistry } from "@wordpress/data";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { useEffect } from "@wordpress/element";
import usePostContentBlocks from "./use-post-content-blocks.mjs";
function DisableNonPageContentBlocks() {
  const contentOnlyIds = usePostContentBlocks();
  const { templateParts } = useSelect((select) => {
    const { getBlocksByName } = select(blockEditorStore);
    return {
      templateParts: getBlocksByName("core/template-part")
    };
  }, []);
  const disabledIds = useSelect(
    (select) => {
      const { getBlockOrder } = select(blockEditorStore);
      return templateParts.flatMap(
        (clientId) => getBlockOrder(clientId)
      );
    },
    [templateParts]
  );
  const registry = useRegistry();
  useEffect(() => {
    const { setBlockEditingMode, unsetBlockEditingMode } = registry.dispatch(blockEditorStore);
    setBlockEditingMode("", "disabled");
    return () => {
      unsetBlockEditingMode("");
    };
  }, [registry]);
  useEffect(() => {
    const { setBlockEditingMode, unsetBlockEditingMode } = registry.dispatch(blockEditorStore);
    registry.batch(() => {
      for (const clientId of contentOnlyIds) {
        setBlockEditingMode(clientId, "contentOnly");
      }
    });
    return () => {
      registry.batch(() => {
        for (const clientId of contentOnlyIds) {
          unsetBlockEditingMode(clientId);
        }
      });
    };
  }, [contentOnlyIds, registry]);
  useEffect(() => {
    const { setBlockEditingMode, unsetBlockEditingMode } = registry.dispatch(blockEditorStore);
    registry.batch(() => {
      for (const clientId of templateParts) {
        setBlockEditingMode(clientId, "contentOnly");
      }
    });
    return () => {
      registry.batch(() => {
        for (const clientId of templateParts) {
          unsetBlockEditingMode(clientId);
        }
      });
    };
  }, [templateParts, registry]);
  useEffect(() => {
    const { setBlockEditingMode, unsetBlockEditingMode } = registry.dispatch(blockEditorStore);
    registry.batch(() => {
      for (const clientId of disabledIds) {
        setBlockEditingMode(clientId, "disabled");
      }
    });
    return () => {
      registry.batch(() => {
        for (const clientId of disabledIds) {
          unsetBlockEditingMode(clientId);
        }
      });
    };
  }, [disabledIds, registry]);
  return null;
}
export {
  DisableNonPageContentBlocks as default
};
//# sourceMappingURL=disable-non-page-content-blocks.mjs.map
