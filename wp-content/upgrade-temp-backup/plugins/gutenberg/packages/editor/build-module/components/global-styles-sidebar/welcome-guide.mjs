// packages/editor/src/components/global-styles-sidebar/welcome-guide.js
import { useDispatch, useSelect } from "@wordpress/data";
import { ExternalLink, Guide } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { store as preferencesStore } from "@wordpress/preferences";
import { store as interfaceStore } from "@wordpress/interface";
import WelcomeGuideImage from "./welcome-guide-image.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function WelcomeGuideStyles() {
  const { toggle } = useDispatch(preferencesStore);
  const { isActive, isStylesOpen } = useSelect((select) => {
    const sidebar = select(interfaceStore).getActiveComplementaryArea("core");
    return {
      isActive: !!select(preferencesStore).get(
        "core/edit-site",
        "welcomeGuideStyles"
      ),
      isStylesOpen: sidebar === "edit-site/global-styles"
    };
  }, []);
  if (!isActive || !isStylesOpen) {
    return null;
  }
  const welcomeLabel = __("Welcome to Styles");
  return /* @__PURE__ */ jsx(
    Guide,
    {
      className: "editor-welcome-guide guide-styles",
      contentLabel: welcomeLabel,
      finishButtonText: __("Get started"),
      onFinish: () => toggle("core/edit-site", "welcomeGuideStyles"),
      pages: [
        {
          image: /* @__PURE__ */ jsx(
            WelcomeGuideImage,
            {
              nonAnimatedSrc: "https://s.w.org/images/block-editor/welcome-to-styles.svg?1",
              animatedSrc: "https://s.w.org/images/block-editor/welcome-to-styles.gif?1"
            }
          ),
          content: /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("h1", { className: "editor-welcome-guide__heading", children: welcomeLabel }),
            /* @__PURE__ */ jsx("p", { className: "editor-welcome-guide__text", children: __(
              "Tweak your site, or give it a whole new look! Get creative \u2014 how about a new color palette for your buttons, or choosing a new font? Take a look at what you can do here."
            ) })
          ] })
        },
        {
          image: /* @__PURE__ */ jsx(
            WelcomeGuideImage,
            {
              nonAnimatedSrc: "https://s.w.org/images/block-editor/set-the-design.svg?1",
              animatedSrc: "https://s.w.org/images/block-editor/set-the-design.gif?1"
            }
          ),
          content: /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("h1", { className: "editor-welcome-guide__heading", children: __("Set the design") }),
            /* @__PURE__ */ jsx("p", { className: "editor-welcome-guide__text", children: __(
              "You can customize your site as much as you like with different colors, typography, and layouts. Or if you prefer, just leave it up to your theme to handle!"
            ) })
          ] })
        },
        {
          image: /* @__PURE__ */ jsx(
            WelcomeGuideImage,
            {
              nonAnimatedSrc: "https://s.w.org/images/block-editor/personalize-blocks.svg?1",
              animatedSrc: "https://s.w.org/images/block-editor/personalize-blocks.gif?1"
            }
          ),
          content: /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("h1", { className: "editor-welcome-guide__heading", children: __("Personalize blocks") }),
            /* @__PURE__ */ jsx("p", { className: "editor-welcome-guide__text", children: __(
              "You can adjust your blocks to ensure a cohesive experience across your site \u2014 add your unique colors to a branded Button block, or adjust the Heading block to your preferred size."
            ) })
          ] })
        },
        {
          image: /* @__PURE__ */ jsx(
            WelcomeGuideImage,
            {
              nonAnimatedSrc: "https://s.w.org/images/block-editor/welcome-documentation.svg",
              animatedSrc: "https://s.w.org/images/block-editor/welcome-documentation.gif"
            }
          ),
          content: /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("h1", { className: "editor-welcome-guide__heading", children: __("Learn more") }),
            /* @__PURE__ */ jsxs("p", { className: "editor-welcome-guide__text", children: [
              __(
                "New to block themes and styling your site?"
              ),
              " ",
              /* @__PURE__ */ jsx(
                ExternalLink,
                {
                  href: __(
                    "https://wordpress.org/documentation/article/styles-overview/"
                  ),
                  children: __(
                    "Here\u2019s a detailed guide to learn how to make the most of it."
                  )
                }
              )
            ] })
          ] })
        }
      ]
    }
  );
}
export {
  WelcomeGuideStyles as default
};
//# sourceMappingURL=welcome-guide.mjs.map
