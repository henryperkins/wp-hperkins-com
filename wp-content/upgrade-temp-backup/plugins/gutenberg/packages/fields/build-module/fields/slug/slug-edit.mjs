// packages/fields/src/fields/slug/slug-edit.tsx
import {
  Button,
  ExternalLink,
  __experimentalInputControl as InputControl,
  __experimentalInputControlPrefixWrapper as InputControlPrefixWrapper,
  __experimentalInputControlSuffixWrapper as InputControlSuffixWrapper,
  __experimentalVStack as VStack
} from "@wordpress/components";
import { copySmall } from "@wordpress/icons";
import { useCopyToClipboard, useInstanceId } from "@wordpress/compose";
import { useDispatch } from "@wordpress/data";
import { useCallback, useEffect, useRef } from "@wordpress/element";
import { store as noticesStore } from "@wordpress/notices";
import { safeDecodeURIComponent } from "@wordpress/url";
import { __ } from "@wordpress/i18n";
import { getSlug } from "./utils.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var SlugEdit = ({
  field,
  onChange,
  data
}) => {
  const { id } = field;
  const slug = field.getValue({ item: data }) || getSlug(data);
  const permalinkTemplate = data.permalink_template || "";
  const PERMALINK_POSTNAME_REGEX = /%(?:postname|pagename)%/;
  const [prefix, suffix] = permalinkTemplate.split(
    PERMALINK_POSTNAME_REGEX
  );
  const permalinkPrefix = prefix;
  const permalinkSuffix = suffix;
  const isEditable = PERMALINK_POSTNAME_REGEX.test(permalinkTemplate);
  const originalSlugRef = useRef(slug);
  const slugToDisplay = slug || originalSlugRef.current;
  const permalink = isEditable ? `${permalinkPrefix}${slugToDisplay}${permalinkSuffix}` : safeDecodeURIComponent(data.link || "");
  useEffect(() => {
    if (slug && originalSlugRef.current === void 0) {
      originalSlugRef.current = slug;
    }
  }, [slug]);
  const onChangeControl = useCallback(
    (newValue) => onChange({
      [id]: newValue
    }),
    [id, onChange]
  );
  const { createNotice } = useDispatch(noticesStore);
  const copyButtonRef = useCopyToClipboard(permalink, () => {
    createNotice("info", __("Copied Permalink to clipboard."), {
      isDismissible: true,
      type: "snackbar"
    });
  });
  const postUrlSlugDescriptionId = "editor-post-url__slug-description-" + useInstanceId(SlugEdit);
  return /* @__PURE__ */ jsxs("fieldset", { className: "fields-controls__slug", children: [
    isEditable && /* @__PURE__ */ jsxs(VStack, { children: [
      /* @__PURE__ */ jsxs(VStack, { spacing: "0px", children: [
        /* @__PURE__ */ jsx("span", { children: __(
          "Customize the last part of the Permalink."
        ) }),
        /* @__PURE__ */ jsx(ExternalLink, { href: "https://wordpress.org/documentation/article/page-post-settings-sidebar/#permalink", children: __("Learn more") })
      ] }),
      /* @__PURE__ */ jsx(
        InputControl,
        {
          __next40pxDefaultSize: true,
          prefix: /* @__PURE__ */ jsx(InputControlPrefixWrapper, { children: "/" }),
          suffix: /* @__PURE__ */ jsx(InputControlSuffixWrapper, { variant: "control", children: /* @__PURE__ */ jsx(
            Button,
            {
              size: "small",
              icon: copySmall,
              ref: copyButtonRef,
              label: __("Copy")
            }
          ) }),
          label: __("Link"),
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
      /* @__PURE__ */ jsxs("div", { className: "fields-controls__slug-help", children: [
        /* @__PURE__ */ jsx("span", { className: "fields-controls__slug-help-visual-label", children: __("Permalink:") }),
        /* @__PURE__ */ jsxs(
          ExternalLink,
          {
            className: "fields-controls__slug-help-link",
            href: permalink,
            children: [
              /* @__PURE__ */ jsx("span", { className: "fields-controls__slug-help-prefix", children: permalinkPrefix }),
              /* @__PURE__ */ jsx("span", { className: "fields-controls__slug-help-slug", children: slugToDisplay }),
              /* @__PURE__ */ jsx("span", { className: "fields-controls__slug-help-suffix", children: permalinkSuffix })
            ]
          }
        )
      ] })
    ] }),
    !isEditable && /* @__PURE__ */ jsx(
      ExternalLink,
      {
        className: "fields-controls__slug-help",
        href: permalink,
        children: permalink
      }
    )
  ] });
};
var slug_edit_default = SlugEdit;
export {
  slug_edit_default as default
};
//# sourceMappingURL=slug-edit.mjs.map
