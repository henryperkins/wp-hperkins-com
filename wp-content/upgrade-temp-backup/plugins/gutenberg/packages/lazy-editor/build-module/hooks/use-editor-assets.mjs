// packages/lazy-editor/src/hooks/use-editor-assets.tsx
import loadAssets from "@wordpress/asset-loader";
import { store as coreDataStore } from "@wordpress/core-data";
import { useState, useEffect } from "@wordpress/element";
import { resolveSelect, useSelect } from "@wordpress/data";
import { unlock } from "../lock-unlock.mjs";
var loadAssetsPromise;
async function loadEditorAssets() {
  const load = async () => {
    const editorAssets = await unlock(
      resolveSelect(coreDataStore)
    ).getEditorAssets();
    await loadAssets(
      editorAssets.scripts || {},
      editorAssets.inline_scripts || { before: {}, after: {} },
      editorAssets.styles || {},
      editorAssets.inline_styles || { before: {}, after: {} },
      editorAssets.html_templates || [],
      editorAssets.script_modules || {}
    );
  };
  if (!loadAssetsPromise) {
    loadAssetsPromise = load();
  }
  return loadAssetsPromise;
}
function useEditorAssets() {
  const editorAssets = useSelect((select) => {
    return unlock(select(coreDataStore)).getEditorAssets();
  }, []);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  useEffect(() => {
    if (editorAssets && !assetsLoaded) {
      loadEditorAssets().then(() => {
        setAssetsLoaded(true);
      }).catch((error) => {
        console.error("Failed to load editor assets:", error);
      });
    }
  }, [editorAssets, assetsLoaded]);
  return {
    isReady: !!editorAssets && assetsLoaded,
    assetsLoaded
  };
}
export {
  loadEditorAssets,
  useEditorAssets
};
//# sourceMappingURL=use-editor-assets.mjs.map
