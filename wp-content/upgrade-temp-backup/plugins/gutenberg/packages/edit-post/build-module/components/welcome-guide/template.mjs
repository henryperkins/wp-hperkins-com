// packages/edit-post/src/components/welcome-guide/template.js
import { useDispatch } from "@wordpress/data";
import { Guide } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import WelcomeGuideImage from "./image.mjs";
import { store as editPostStore } from "../../store/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function WelcomeGuideTemplate() {
  const { toggleFeature } = useDispatch(editPostStore);
  return /* @__PURE__ */ jsx(
    Guide,
    {
      className: "edit-template-welcome-guide",
      contentLabel: __("Welcome to the template editor"),
      finishButtonText: __("Get started"),
      onFinish: () => toggleFeature("welcomeGuideTemplate"),
      pages: [
        {
          image: /* @__PURE__ */ jsx(
            WelcomeGuideImage,
            {
              nonAnimatedSrc: "https://s.w.org/images/block-editor/welcome-template-editor.svg",
              animatedSrc: "https://s.w.org/images/block-editor/welcome-template-editor.gif"
            }
          ),
          content: /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("h1", { className: "edit-post-welcome-guide__heading", children: __("Welcome to the template editor") }),
            /* @__PURE__ */ jsx("p", { className: "edit-post-welcome-guide__text", children: __(
              "Templates help define the layout of the site. You can customize all aspects of your posts and pages using blocks and patterns in this editor."
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
