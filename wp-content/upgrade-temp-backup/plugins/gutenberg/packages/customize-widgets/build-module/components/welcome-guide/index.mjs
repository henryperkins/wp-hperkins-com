// packages/customize-widgets/src/components/welcome-guide/index.js
import { __ } from "@wordpress/i18n";
import { Button, ExternalLink } from "@wordpress/components";
import { useDispatch } from "@wordpress/data";
import { store as preferencesStore } from "@wordpress/preferences";
import { jsx, jsxs } from "react/jsx-runtime";
function WelcomeGuide({ sidebar }) {
  const { toggle } = useDispatch(preferencesStore);
  const isEntirelyBlockWidgets = sidebar.getWidgets().every((widget) => widget.id.startsWith("block-"));
  return /* @__PURE__ */ jsxs("div", { className: "customize-widgets-welcome-guide", children: [
    /* @__PURE__ */ jsx("div", { className: "customize-widgets-welcome-guide__image__wrapper", children: /* @__PURE__ */ jsxs("picture", { children: [
      /* @__PURE__ */ jsx(
        "source",
        {
          srcSet: "https://s.w.org/images/block-editor/welcome-editor.svg",
          media: "(prefers-reduced-motion: reduce)"
        }
      ),
      /* @__PURE__ */ jsx(
        "img",
        {
          className: "customize-widgets-welcome-guide__image",
          src: "https://s.w.org/images/block-editor/welcome-editor.gif",
          width: "312",
          height: "240",
          alt: ""
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("h1", { className: "customize-widgets-welcome-guide__heading", children: __("Welcome to block Widgets") }),
    /* @__PURE__ */ jsx("p", { className: "customize-widgets-welcome-guide__text", children: isEntirelyBlockWidgets ? __(
      "Your theme provides different \u201Cblock\u201D areas for you to add and edit content.\xA0Try adding a search bar, social icons, or other types of blocks here and see how they\u2019ll look on your site."
    ) : __(
      "You can now add any block to your site\u2019s widget areas. Don\u2019t worry, all of your favorite widgets still work flawlessly."
    ) }),
    /* @__PURE__ */ jsx(
      Button,
      {
        size: "compact",
        variant: "primary",
        onClick: () => toggle("core/customize-widgets", "welcomeGuide"),
        children: __("Got it")
      }
    ),
    /* @__PURE__ */ jsx("hr", { className: "customize-widgets-welcome-guide__separator" }),
    !isEntirelyBlockWidgets && /* @__PURE__ */ jsxs("p", { className: "customize-widgets-welcome-guide__more-info", children: [
      __("Want to stick with the old widgets?"),
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx(
        ExternalLink,
        {
          href: __(
            "https://wordpress.org/plugins/classic-widgets/"
          ),
          children: __("Get the Classic Widgets plugin.")
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "customize-widgets-welcome-guide__more-info", children: [
      __("New to the block editor?"),
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx(
        ExternalLink,
        {
          href: __(
            "https://wordpress.org/documentation/article/wordpress-block-editor/"
          ),
          children: __("Here's a detailed guide.")
        }
      )
    ] })
  ] });
}
export {
  WelcomeGuide as default
};
//# sourceMappingURL=index.mjs.map
