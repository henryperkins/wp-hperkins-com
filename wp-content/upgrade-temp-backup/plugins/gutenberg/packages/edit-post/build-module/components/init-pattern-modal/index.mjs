// packages/edit-post/src/components/init-pattern-modal/index.js
import { useSelect, useDispatch } from "@wordpress/data";
import { __, _x } from "@wordpress/i18n";
import {
  Modal,
  Button,
  __experimentalHStack as HStack,
  __experimentalVStack as VStack,
  ToggleControl,
  TextControl
} from "@wordpress/components";
import { useState } from "@wordpress/element";
import { store as editorStore } from "@wordpress/editor";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function InitPatternModal() {
  const { editPost } = useDispatch(editorStore);
  const [syncType, setSyncType] = useState(void 0);
  const [title, setTitle] = useState("");
  const isNewPost = useSelect(
    (select) => select(editorStore).isCleanNewPost(),
    []
  );
  const [isModalOpen, setIsModalOpen] = useState(() => isNewPost);
  if (!isNewPost) {
    return null;
  }
  return /* @__PURE__ */ jsx(Fragment, { children: isModalOpen && /* @__PURE__ */ jsx(
    Modal,
    {
      title: __("Create pattern"),
      onRequestClose: () => {
        setIsModalOpen(false);
      },
      overlayClassName: "reusable-blocks-menu-items__convert-modal",
      children: /* @__PURE__ */ jsx(
        "form",
        {
          onSubmit: (event) => {
            event.preventDefault();
            setIsModalOpen(false);
            editPost({
              title,
              meta: {
                wp_pattern_sync_status: syncType
              }
            });
          },
          children: /* @__PURE__ */ jsxs(VStack, { spacing: "5", children: [
            /* @__PURE__ */ jsx(
              TextControl,
              {
                label: __("Name"),
                value: title,
                onChange: setTitle,
                placeholder: __("My pattern"),
                className: "patterns-create-modal__name-input",
                __next40pxDefaultSize: true
              }
            ),
            /* @__PURE__ */ jsx(
              ToggleControl,
              {
                label: _x("Synced", "pattern (singular)"),
                help: __(
                  "Sync this pattern across multiple locations."
                ),
                checked: !syncType,
                onChange: () => {
                  setSyncType(
                    !syncType ? "unsynced" : void 0
                  );
                }
              }
            ),
            /* @__PURE__ */ jsx(HStack, { justify: "right", children: /* @__PURE__ */ jsx(
              Button,
              {
                __next40pxDefaultSize: true,
                variant: "primary",
                type: "submit",
                disabled: !title,
                accessibleWhenDisabled: true,
                children: __("Create")
              }
            ) })
          ] })
        }
      )
    }
  ) });
}
export {
  InitPatternModal as default
};
//# sourceMappingURL=index.mjs.map
