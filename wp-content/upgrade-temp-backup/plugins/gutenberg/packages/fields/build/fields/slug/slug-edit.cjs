"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/fields/src/fields/slug/slug-edit.tsx
var slug_edit_exports = {};
__export(slug_edit_exports, {
  default: () => slug_edit_default
});
module.exports = __toCommonJS(slug_edit_exports);
var import_components = require("@wordpress/components");
var import_icons = require("@wordpress/icons");
var import_compose = require("@wordpress/compose");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_notices = require("@wordpress/notices");
var import_url = require("@wordpress/url");
var import_i18n = require("@wordpress/i18n");
var import_utils = require("./utils.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var SlugEdit = ({
  field,
  onChange,
  data
}) => {
  const { id } = field;
  const slug = field.getValue({ item: data }) || (0, import_utils.getSlug)(data);
  const permalinkTemplate = data.permalink_template || "";
  const PERMALINK_POSTNAME_REGEX = /%(?:postname|pagename)%/;
  const [prefix, suffix] = permalinkTemplate.split(
    PERMALINK_POSTNAME_REGEX
  );
  const permalinkPrefix = prefix;
  const permalinkSuffix = suffix;
  const isEditable = PERMALINK_POSTNAME_REGEX.test(permalinkTemplate);
  const originalSlugRef = (0, import_element.useRef)(slug);
  const slugToDisplay = slug || originalSlugRef.current;
  const permalink = isEditable ? `${permalinkPrefix}${slugToDisplay}${permalinkSuffix}` : (0, import_url.safeDecodeURIComponent)(data.link || "");
  (0, import_element.useEffect)(() => {
    if (slug && originalSlugRef.current === void 0) {
      originalSlugRef.current = slug;
    }
  }, [slug]);
  const onChangeControl = (0, import_element.useCallback)(
    (newValue) => onChange({
      [id]: newValue
    }),
    [id, onChange]
  );
  const { createNotice } = (0, import_data.useDispatch)(import_notices.store);
  const copyButtonRef = (0, import_compose.useCopyToClipboard)(permalink, () => {
    createNotice("info", (0, import_i18n.__)("Copied Permalink to clipboard."), {
      isDismissible: true,
      type: "snackbar"
    });
  });
  const postUrlSlugDescriptionId = "editor-post-url__slug-description-" + (0, import_compose.useInstanceId)(SlugEdit);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { className: "fields-controls__slug", children: [
    isEditable && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: "0px", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: (0, import_i18n.__)(
          "Customize the last part of the Permalink."
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.ExternalLink, { href: "https://wordpress.org/documentation/article/page-post-settings-sidebar/#permalink", children: (0, import_i18n.__)("Learn more") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.__experimentalInputControl,
        {
          __next40pxDefaultSize: true,
          prefix: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalInputControlPrefixWrapper, { children: "/" }),
          suffix: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalInputControlSuffixWrapper, { variant: "control", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              size: "small",
              icon: import_icons.copySmall,
              ref: copyButtonRef,
              label: (0, import_i18n.__)("Copy")
            }
          ) }),
          label: (0, import_i18n.__)("Link"),
          hideLabelFromVision: true,
          value: slug,
          autoComplete: "off",
          spellCheck: "false",
          type: "text",
          className: "fields-controls__slug-input",
          onChange: (newValue) => {
            onChangeControl(newValue);
          },
          onBlur: () => {
            if (slug === "") {
              onChangeControl(originalSlugRef.current);
            }
          },
          "aria-describedby": postUrlSlugDescriptionId
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "fields-controls__slug-help", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "fields-controls__slug-help-visual-label", children: (0, import_i18n.__)("Permalink:") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          import_components.ExternalLink,
          {
            className: "fields-controls__slug-help-link",
            href: permalink,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "fields-controls__slug-help-prefix", children: permalinkPrefix }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "fields-controls__slug-help-slug", children: slugToDisplay }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "fields-controls__slug-help-suffix", children: permalinkSuffix })
            ]
          }
        )
      ] })
    ] }),
    !isEditable && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.ExternalLink,
      {
        className: "fields-controls__slug-help",
        href: permalink,
        children: permalink
      }
    )
  ] });
};
var slug_edit_default = SlugEdit;
//# sourceMappingURL=slug-edit.cjs.map
