// packages/fields/src/fields/ping-status/index.tsx
import { __ } from "@wordpress/i18n";
import { CheckboxControl, ExternalLink } from "@wordpress/components";
import { jsx } from "react/jsx-runtime";
function PingStatusEdit({
  data,
  onChange
}) {
  const pingStatus = data?.ping_status ?? "open";
  const onTogglePingback = (checked) => {
    onChange({
      ...data,
      ping_status: checked ? "open" : "closed"
    });
  };
  return /* @__PURE__ */ jsx(
    CheckboxControl,
    {
      label: __("Enable pingbacks & trackbacks"),
      checked: pingStatus === "open",
      onChange: onTogglePingback,
      help: /* @__PURE__ */ jsx(
        ExternalLink,
        {
          href: __(
            "https://wordpress.org/documentation/article/trackbacks-and-pingbacks/"
          ),
          children: __("Learn more about pingbacks & trackbacks")
        }
      )
    }
  );
}
var pingStatusField = {
  id: "ping_status",
  label: __("Trackbacks & Pingbacks"),
  type: "text",
  Edit: PingStatusEdit,
  enableSorting: false,
  enableHiding: false,
  filterBy: false,
  elements: [
    {
      value: "open",
      label: __("Allow"),
      description: __(
        "Allow link notifications from other blogs (pingbacks and trackbacks) on new articles."
      )
    },
    {
      value: "closed",
      label: __("Don't allow"),
      description: __(
        "Don't allow link notifications from other blogs (pingbacks and trackbacks) on new articles."
      )
    }
  ]
};
var ping_status_default = pingStatusField;
export {
  ping_status_default as default
};
//# sourceMappingURL=index.mjs.map
