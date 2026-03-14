// packages/connectors/src/connector-item.tsx
import {
  __experimentalHStack as HStack,
  __experimentalVStack as VStack,
  __experimentalItem as Item,
  __experimentalText as Text,
  ExternalLink,
  FlexBlock,
  Button,
  TextControl
} from "@wordpress/components";
import { createInterpolateElement, useState } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { jsx, jsxs } from "react/jsx-runtime";
function ConnectorItem({
  className,
  icon,
  name,
  description,
  actionArea,
  children
}) {
  return /* @__PURE__ */ jsx(Item, { className, children: /* @__PURE__ */ jsxs(VStack, { spacing: 4, children: [
    /* @__PURE__ */ jsxs(HStack, { alignment: "center", spacing: 4, wrap: true, children: [
      icon,
      /* @__PURE__ */ jsx(FlexBlock, { children: /* @__PURE__ */ jsxs(VStack, { spacing: 0, children: [
        /* @__PURE__ */ jsx(Text, { weight: 600, size: 15, children: name }),
        /* @__PURE__ */ jsx(Text, { variant: "muted", size: 12, children: description })
      ] }) }),
      actionArea
    ] }),
    children
  ] }) });
}
function DefaultConnectorSettings({
  onSave,
  onRemove,
  initialValue = "",
  helpUrl,
  helpLabel,
  readOnly = false
}) {
  const [apiKey, setApiKey] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const helpLinkLabel = helpLabel || helpUrl?.replace(/^https?:\/\//, "");
  const helpLink = helpUrl ? createInterpolateElement(
    sprintf(
      /* translators: %s: Link to provider settings. */
      __("Get your API key at %s"),
      "<a></a>"
    ),
    {
      a: /* @__PURE__ */ jsx(ExternalLink, { href: helpUrl, children: helpLinkLabel })
    }
  ) : void 0;
  const getHelp = () => {
    if (readOnly) {
      return helpUrl ? createInterpolateElement(
        sprintf(
          /* translators: %s: Link to provider settings. */
          __(
            "Your API key is stored securely. You can reset it at %s"
          ),
          "<a></a>"
        ),
        {
          a: /* @__PURE__ */ jsx(ExternalLink, { href: helpUrl, children: helpLinkLabel })
        }
      ) : __("Your API key is stored securely.");
    }
    if (saveError) {
      return /* @__PURE__ */ jsx("span", { style: { color: "#cc1818" }, children: saveError });
    }
    return helpLink;
  };
  const handleSave = async () => {
    setSaveError(null);
    setIsSaving(true);
    try {
      await onSave?.(apiKey);
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : __(
          "It was not possible to connect to the provider using this key."
        )
      );
    } finally {
      setIsSaving(false);
    }
  };
  return /* @__PURE__ */ jsxs(
    VStack,
    {
      spacing: 4,
      className: "connector-settings",
      style: readOnly ? {
        "--wp-components-color-background": "#f0f0f0"
      } : void 0,
      children: [
        /* @__PURE__ */ jsx(
          TextControl,
          {
            __next40pxDefaultSize: true,
            label: __("API Key"),
            value: apiKey,
            onChange: (value) => {
              if (!readOnly) {
                setSaveError(null);
                setApiKey(value);
              }
            },
            placeholder: __("Enter your API key"),
            disabled: readOnly || isSaving,
            help: getHelp()
          }
        ),
        readOnly ? /* @__PURE__ */ jsx(Button, { variant: "link", isDestructive: true, onClick: onRemove, children: __("Remove and replace") }) : /* @__PURE__ */ jsx(HStack, { justify: "flex-start", children: /* @__PURE__ */ jsx(
          Button,
          {
            __next40pxDefaultSize: true,
            variant: "primary",
            disabled: !apiKey || isSaving,
            accessibleWhenDisabled: true,
            isBusy: isSaving,
            onClick: handleSave,
            children: __("Save")
          }
        ) })
      ]
    }
  );
}
export {
  ConnectorItem,
  DefaultConnectorSettings
};
//# sourceMappingURL=connector-item.mjs.map
