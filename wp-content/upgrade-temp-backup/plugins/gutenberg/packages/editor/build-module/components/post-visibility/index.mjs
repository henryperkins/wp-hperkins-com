// packages/editor/src/components/post-visibility/index.js
import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import {
  TextControl,
  RadioControl,
  __experimentalVStack as VStack
} from "@wordpress/components";
import { useInstanceId } from "@wordpress/compose";
import { useSelect, useDispatch } from "@wordpress/data";
import { __experimentalInspectorPopoverHeader as InspectorPopoverHeader } from "@wordpress/block-editor";
import { VISIBILITY_OPTIONS } from "./utils.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function PostVisibility({ onClose }) {
  const instanceId = useInstanceId(PostVisibility);
  const { status, visibility, password } = useSelect((select) => ({
    status: select(editorStore).getEditedPostAttribute("status"),
    visibility: select(editorStore).getEditedPostVisibility(),
    password: select(editorStore).getEditedPostAttribute("password")
  }));
  const { editPost } = useDispatch(editorStore);
  const [hasPassword, setHasPassword] = useState(!!password);
  function updateVisibility(value) {
    const nextValues = {
      public: {
        status: visibility === "private" ? "draft" : status,
        password: ""
      },
      private: { status: "private", password: "" },
      password: {
        status: visibility === "private" ? "draft" : status,
        password: password || ""
      }
    };
    editPost(nextValues[value]);
    setHasPassword(value === "password");
  }
  const updatePassword = (value) => {
    editPost({ password: value });
  };
  return /* @__PURE__ */ jsxs("div", { className: "editor-post-visibility", children: [
    /* @__PURE__ */ jsx(
      InspectorPopoverHeader,
      {
        title: __("Visibility"),
        help: __("Control how this post is viewed."),
        onClose
      }
    ),
    /* @__PURE__ */ jsxs(VStack, { spacing: 4, children: [
      /* @__PURE__ */ jsx(
        RadioControl,
        {
          label: __("Visibility"),
          hideLabelFromVision: true,
          options: VISIBILITY_OPTIONS,
          selected: hasPassword ? "password" : visibility,
          onChange: updateVisibility
        }
      ),
      hasPassword && /* @__PURE__ */ jsx(
        TextControl,
        {
          label: __("Password"),
          onChange: updatePassword,
          value: password,
          placeholder: __("Use a secure password"),
          type: "text",
          id: `editor-post-visibility__password-input-${instanceId}`,
          __next40pxDefaultSize: true,
          maxLength: 255
        }
      )
    ] })
  ] });
}
export {
  PostVisibility as default
};
//# sourceMappingURL=index.mjs.map
