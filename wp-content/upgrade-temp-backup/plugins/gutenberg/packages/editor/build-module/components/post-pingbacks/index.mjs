// packages/editor/src/components/post-pingbacks/index.js
import { __ } from "@wordpress/i18n";
import { CheckboxControl, ExternalLink } from "@wordpress/components";
import { useDispatch, useSelect } from "@wordpress/data";
import { store as editorStore } from "../../store/index.mjs";
import { jsx } from "react/jsx-runtime";
function PostPingbacks() {
  const pingStatus = useSelect(
    (select) => select(editorStore).getEditedPostAttribute("ping_status") ?? "open",
    []
  );
  const { editPost } = useDispatch(editorStore);
  const onTogglePingback = () => editPost({
    ping_status: pingStatus === "open" ? "closed" : "open"
  });
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
var post_pingbacks_default = PostPingbacks;
export {
  post_pingbacks_default as default
};
//# sourceMappingURL=index.mjs.map
