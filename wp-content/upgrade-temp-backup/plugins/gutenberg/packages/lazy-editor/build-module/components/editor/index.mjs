// packages/lazy-editor/src/components/editor/index.tsx
import { privateApis as editorPrivateApis } from "@wordpress/editor";
import { store as coreDataStore } from "@wordpress/core-data";
import { useSelect } from "@wordpress/data";
import { Spinner } from "@wordpress/components";
import { useMemo } from "@wordpress/element";
import { useStylesId } from "../../hooks/use-styles-id.mjs";
import { useEditorSettings } from "../../hooks/use-editor-settings.mjs";
import { useEditorAssets } from "../../hooks/use-editor-assets.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
var { Editor: PrivateEditor, BackButton } = unlock(editorPrivateApis);
function Editor({
  postType,
  postId,
  settings,
  backButton
}) {
  const homePage = useSelect(
    (select) => {
      if (postType || postId) {
        return null;
      }
      const { getHomePage } = unlock(select(coreDataStore));
      return getHomePage();
    },
    [postType, postId]
  );
  const resolvedPostType = postType || homePage?.postType;
  const resolvedPostId = postId || homePage?.postId;
  const templateId = useSelect(
    (select) => {
      if (!resolvedPostType || !resolvedPostId) {
        return void 0;
      }
      if (resolvedPostType === "wp_template") {
        return resolvedPostId;
      }
      return unlock(select(coreDataStore)).getTemplateId(
        resolvedPostType,
        resolvedPostId
      );
    },
    [resolvedPostType, resolvedPostId]
  );
  const stylesId = useStylesId({ templateId });
  const { isReady: settingsReady, editorSettings } = useEditorSettings({
    stylesId
  });
  const { isReady: assetsReady } = useEditorAssets();
  const finalSettings = useMemo(
    () => ({
      ...editorSettings,
      ...settings
    }),
    [editorSettings, settings]
  );
  if (!settingsReady || !assetsReady) {
    return /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh"
        },
        children: /* @__PURE__ */ jsx(Spinner, {})
      }
    );
  }
  return /* @__PURE__ */ jsx(
    PrivateEditor,
    {
      postType: resolvedPostType,
      postId: resolvedPostId,
      templateId,
      settings: finalSettings,
      styles: finalSettings.styles,
      children: backButton && /* @__PURE__ */ jsx(BackButton, { children: backButton })
    }
  );
}
export {
  Editor
};
//# sourceMappingURL=index.mjs.map
