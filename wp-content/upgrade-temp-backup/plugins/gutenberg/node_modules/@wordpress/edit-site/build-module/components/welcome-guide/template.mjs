// packages/edit-site/src/components/welcome-guide/template.js
import { useDispatch, useSelect } from "@wordpress/data";
import { Guide } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { store as preferencesStore } from "@wordpress/preferences";
import { store as editorStore } from "@wordpress/editor";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function WelcomeGuideTemplate() {
  const { toggle } = useDispatch(preferencesStore);
  const { isActive, hasPreviousEntity } = useSelect((select) => {
    const { getEditorSettings } = select(editorStore);
    const { get } = select(preferencesStore);
    return {
      isActive: get("core/edit-site", "welcomeGuideTemplate"),
      hasPreviousEntity: !!getEditorSettings().onNavigateToPreviousEntityRecord
    };
  }, []);
  const isVisible = isActive && hasPreviousEntity;
  if (!isVisible) {
    return null;
  }
  const heading = __("Editing a template");
  return /* @__PURE__ */ jsx(
    Guide,
    {
      className: "edit-site-welcome-guide guide-template",
      contentLabel: heading,
      finishButtonText: __("Continue"),
      onFinish: () => toggle("core/edit-site", "welcomeGuideTemplate"),
      pages: [
        {
          image: /* @__PURE__ */ jsx(
            "video",
            {
              className: "edit-site-welcome-guide__video",
              autoPlay: true,
              loop: true,
              muted: true,
              width: "312",
              height: "240",
              children: /* @__PURE__ */ jsx(
                "source",
                {
                  src: "https://s.w.org/images/block-editor/editing-your-template.mp4",
                  type: "video/mp4"
                }
              )
            }
          ),
          content: /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("h1", { className: "edit-site-welcome-guide__heading", children: heading }),
            /* @__PURE__ */ jsx("p", { className: "edit-site-welcome-guide__text", children: __(
              "Note that the same template can be used by multiple pages, so any changes made here may affect other pages on the site. To switch back to editing the page content click the \u2018Back\u2019 button in the toolbar."
            ) })
          ] })
        }
      ]
    }
  );
}
export {
  WelcomeGuideTemplate as default
};
//# sourceMappingURL=template.mjs.map
