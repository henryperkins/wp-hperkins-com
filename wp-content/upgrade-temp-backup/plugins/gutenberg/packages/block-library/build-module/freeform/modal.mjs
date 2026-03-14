// packages/block-library/src/freeform/modal.js
import { store } from "@wordpress/block-editor";
import { Modal, Button, Flex, FlexItem } from "@wordpress/components";
import { useEffect, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import { fullscreen } from "@wordpress/icons";
import { useViewportMatch } from "@wordpress/compose";
import { jsx, jsxs } from "react/jsx-runtime";
function ModalAuxiliaryActions({ onClick, isModalFullScreen }) {
  const isMobileViewport = useViewportMatch("small", "<");
  if (isMobileViewport) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    Button,
    {
      size: "compact",
      onClick,
      icon: fullscreen,
      isPressed: isModalFullScreen,
      label: isModalFullScreen ? __("Exit fullscreen") : __("Enter fullscreen")
    }
  );
}
function ClassicEdit(props) {
  const styles = useSelect(
    (select) => select(store).getSettings().styles
  );
  useEffect(() => {
    const { baseURL, suffix, settings } = window.wpEditorL10n.tinymce;
    window.tinymce.EditorManager.overrideDefaults({
      base_url: baseURL,
      suffix
    });
    window.wp.oldEditor.initialize(props.id, {
      tinymce: {
        ...settings,
        setup(editor) {
          editor.on("init", () => {
            const doc = editor.getDoc();
            styles.forEach(({ css }) => {
              const styleEl = doc.createElement("style");
              styleEl.innerHTML = css;
              doc.head.appendChild(styleEl);
            });
          });
        }
      }
    });
    return () => {
      window.wp.oldEditor.remove(props.id);
    };
  }, []);
  return /* @__PURE__ */ jsx("textarea", { ...props });
}
function ModalEdit({ clientId, content, onClose, onChange }) {
  const [isModalFullScreen, setIsModalFullScreen] = useState(false);
  const id = `editor-${clientId}`;
  return /* @__PURE__ */ jsxs(
    Modal,
    {
      title: __("Classic Editor"),
      onRequestClose: onClose,
      shouldCloseOnClickOutside: false,
      overlayClassName: "block-editor-freeform-modal",
      isFullScreen: isModalFullScreen,
      className: "block-editor-freeform-modal__content",
      headerActions: /* @__PURE__ */ jsx(
        ModalAuxiliaryActions,
        {
          onClick: () => setIsModalFullScreen(!isModalFullScreen),
          isModalFullScreen
        }
      ),
      children: [
        /* @__PURE__ */ jsx(ClassicEdit, { id, defaultValue: content }),
        /* @__PURE__ */ jsxs(
          Flex,
          {
            className: "block-editor-freeform-modal__actions",
            justify: "flex-end",
            expanded: false,
            children: [
              /* @__PURE__ */ jsx(FlexItem, { children: /* @__PURE__ */ jsx(
                Button,
                {
                  __next40pxDefaultSize: true,
                  variant: "tertiary",
                  onClick: onClose,
                  children: __("Cancel")
                }
              ) }),
              /* @__PURE__ */ jsx(FlexItem, { children: /* @__PURE__ */ jsx(
                Button,
                {
                  __next40pxDefaultSize: true,
                  variant: "primary",
                  onClick: () => {
                    onChange(window.wp.oldEditor.getContent(id));
                    onClose();
                  },
                  children: __("Save")
                }
              ) })
            ]
          }
        )
      ]
    }
  );
}
export {
  ModalEdit as default
};
//# sourceMappingURL=modal.mjs.map
