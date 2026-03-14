// packages/block-editor/src/components/block-visibility/modal.js
import clsx from "clsx";
import { __, sprintf } from "@wordpress/i18n";
import {
  useState,
  useMemo,
  useCallback,
  createInterpolateElement
} from "@wordpress/element";
import {
  Button,
  CheckboxControl,
  Flex,
  FlexItem,
  Icon,
  Modal
} from "@wordpress/components";
import { useDispatch, useSelect } from "@wordpress/data";
import { store as keyboardShortcutsStore } from "@wordpress/keyboard-shortcuts";
import { store as noticesStore } from "@wordpress/notices";
import {
  BLOCK_VISIBILITY_VIEWPORT_ENTRIES,
  BLOCK_VISIBILITY_VIEWPORTS
} from "./constants.mjs";
import { store as blockEditorStore } from "../../store/index.mjs";
import { cleanEmptyObject } from "../../hooks/utils.mjs";
import {
  getViewportCheckboxState,
  getHideEverywhereCheckboxState
} from "./utils.mjs";

// packages/block-editor/src/components/block-visibility/style.scss
if (typeof document !== "undefined" && process.env.NODE_ENV !== "test" && !document.head.querySelector("style[data-wp-hash='4334c7deb6']")) {
  const style = document.createElement("style");
  style.setAttribute("data-wp-hash", "4334c7deb6");
  style.appendChild(document.createTextNode(".block-editor-block-visibility-modal{z-index:1000001}.block-editor-block-visibility-modal__options{border:0;list-style:none;margin:24px 0;padding:0}.block-editor-block-visibility-modal__options-item{align-items:center;display:flex;gap:24px;justify-content:space-between;margin:0 0 16px}.block-editor-block-visibility-modal__options-item:last-child{margin:0}.block-editor-block-visibility-modal__options-item--everywhere{align-items:start;flex-direction:column}.block-editor-block-visibility-modal__options-checkbox--everywhere{font-weight:600}.block-editor-block-visibility-modal__options-icon--checked{fill:#ddd}.block-editor-block-visibility-modal__sub-options{padding-inline-start:12px;width:100%}.block-editor-block-visibility-modal__description{color:#757575;font-size:12px}.block-editor-block-visibility-info{align-items:center;display:flex;justify-content:start;margin:0 16px 16px;padding-bottom:4px;padding-top:4px}"));
  document.head.appendChild(style);
}

// packages/block-editor/src/components/block-visibility/modal.js
import { jsx, jsxs } from "react/jsx-runtime";
var DEFAULT_VIEWPORT_CHECKBOX_VALUES = {
  [BLOCK_VISIBILITY_VIEWPORTS.mobile.key]: false,
  [BLOCK_VISIBILITY_VIEWPORTS.tablet.key]: false,
  [BLOCK_VISIBILITY_VIEWPORTS.desktop.key]: false
};
var EMPTY_BLOCKS = [];
function BlockVisibilityModal({ clientIds, onClose }) {
  const { createSuccessNotice } = useDispatch(noticesStore);
  const { updateBlockAttributes } = useDispatch(blockEditorStore);
  const blocks = useSelect(
    (select) => select(blockEditorStore).getBlocksByClientId(clientIds) ?? EMPTY_BLOCKS,
    [clientIds]
  );
  const listViewShortcut = useSelect((select) => {
    return select(keyboardShortcutsStore).getShortcutRepresentation(
      "core/editor/toggle-list-view"
    );
  }, []);
  const initialViewportValues = useMemo(() => {
    if (blocks?.length === 0) {
      return {
        hideEverywhere: false,
        viewportChecked: {}
      };
    }
    const viewportValues = {};
    BLOCK_VISIBILITY_VIEWPORT_ENTRIES.forEach(([, { key }]) => {
      viewportValues[key] = getViewportCheckboxState(blocks, key);
    });
    return {
      hideEverywhere: getHideEverywhereCheckboxState(blocks),
      viewportChecked: viewportValues
    };
  }, [blocks]);
  const [viewportChecked, setViewportChecked] = useState(
    initialViewportValues?.viewportChecked ?? {}
  );
  const [hideEverywhere, setHideEverywhere] = useState(
    initialViewportValues?.hideEverywhere ?? false
  );
  const handleViewportCheckboxChange = useCallback(
    (viewport, isChecked) => {
      setViewportChecked({
        ...viewportChecked,
        [viewport]: isChecked
      });
    },
    [viewportChecked]
  );
  const noticeMessage = useMemo(() => {
    if (!hideEverywhere) {
      return sprintf(
        // translators: %s: The shortcut key to access the List View.
        __(
          "Block visibility settings updated. You can access them via the List View (%s)."
        ),
        listViewShortcut
      );
    }
    const message = blocks?.length > 1 ? (
      // translators: %s: The shortcut key to access the List View.
      __(
        "Blocks hidden. You can access them via the List View (%s)."
      )
    ) : (
      // translators: %s: The shortcut key to access the List View.
      __(
        "Block hidden. You can access it via the List View (%s)."
      )
    );
    return sprintf(message, listViewShortcut);
  }, [hideEverywhere, blocks?.length, listViewShortcut]);
  const isAnyViewportChecked = useMemo(
    () => Object.values(viewportChecked).some(
      (checked) => checked === true || checked === null
    ),
    [viewportChecked]
  );
  const isDirty = useMemo(() => {
    if (hideEverywhere !== initialViewportValues.hideEverywhere) {
      return true;
    }
    return BLOCK_VISIBILITY_VIEWPORT_ENTRIES.some(
      ([, { key }]) => viewportChecked[key] !== initialViewportValues.viewportChecked[key]
    );
  }, [hideEverywhere, viewportChecked, initialViewportValues]);
  const hasIndeterminateValues = useMemo(() => {
    if (hideEverywhere === null) {
      return true;
    }
    return Object.values(viewportChecked).some(
      (checked) => checked === null
    );
  }, [hideEverywhere, viewportChecked]);
  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const newVisibility = hideEverywhere ? false : {
        viewport: BLOCK_VISIBILITY_VIEWPORT_ENTRIES.reduce(
          (acc, [, { key }]) => {
            if (viewportChecked[key]) {
              acc[key] = false;
            }
            return acc;
          },
          {}
        )
      };
      const attributesByClientId = Object.fromEntries(
        blocks.map(({ clientId, attributes }) => [
          clientId,
          {
            metadata: cleanEmptyObject({
              ...attributes?.metadata,
              blockVisibility: newVisibility
            })
          }
        ])
      );
      updateBlockAttributes(clientIds, attributesByClientId, {
        uniqueByBlock: true
      });
      createSuccessNotice(noticeMessage, {
        id: hideEverywhere ? "block-visibility-hidden" : "block-visibility-viewports-updated",
        type: "snackbar"
      });
      onClose();
    },
    [
      blocks,
      clientIds,
      createSuccessNotice,
      hideEverywhere,
      noticeMessage,
      onClose,
      updateBlockAttributes,
      viewportChecked
    ]
  );
  const hasMultipleBlocks = blocks?.length > 1;
  return /* @__PURE__ */ jsx(
    Modal,
    {
      title: clientIds?.length > 1 ? __("Hide blocks") : __("Hide block"),
      onRequestClose: onClose,
      overlayClassName: "block-editor-block-visibility-modal",
      size: "small",
      children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
        /* @__PURE__ */ jsxs("fieldset", { children: [
          /* @__PURE__ */ jsx("legend", { children: hasMultipleBlocks ? __(
            "Select the viewport sizes for which you want to hide the blocks. Changes will apply to all selected blocks."
          ) : __(
            "Select the viewport size for which you want to hide the block."
          ) }),
          /* @__PURE__ */ jsx("ul", { className: "block-editor-block-visibility-modal__options", children: /* @__PURE__ */ jsxs("li", { className: "block-editor-block-visibility-modal__options-item block-editor-block-visibility-modal__options-item--everywhere", children: [
            /* @__PURE__ */ jsx(
              CheckboxControl,
              {
                className: "block-editor-block-visibility-modal__options-checkbox--everywhere",
                label: __("Omit from published content"),
                checked: hideEverywhere === true,
                indeterminate: hideEverywhere === null,
                onChange: (checked) => {
                  setHideEverywhere(checked);
                  setViewportChecked(
                    DEFAULT_VIEWPORT_CHECKBOX_VALUES
                  );
                }
              }
            ),
            hideEverywhere !== true && /* @__PURE__ */ jsx("ul", { className: "block-editor-block-visibility-modal__sub-options", children: BLOCK_VISIBILITY_VIEWPORT_ENTRIES.map(
              ([, { label, icon, key }]) => /* @__PURE__ */ jsxs(
                "li",
                {
                  className: "block-editor-block-visibility-modal__options-item",
                  children: [
                    /* @__PURE__ */ jsx(
                      CheckboxControl,
                      {
                        label: sprintf(
                          // translators: %s: The viewport name.
                          __("Hide on %s"),
                          label
                        ),
                        checked: viewportChecked[key] ?? false,
                        indeterminate: viewportChecked[key] === null,
                        onChange: (checked) => handleViewportCheckboxChange(
                          key,
                          checked
                        )
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      Icon,
                      {
                        icon,
                        className: clsx({
                          "block-editor-block-visibility-modal__options-icon--checked": viewportChecked[key]
                        })
                      }
                    )
                  ]
                },
                key
              )
            ) })
          ] }) }),
          hasMultipleBlocks && hasIndeterminateValues && /* @__PURE__ */ jsx("p", { className: "block-editor-block-visibility-modal__description", children: __(
            "Selected blocks have different visibility settings. The checkboxes show an indeterminate state when settings differ."
          ) }),
          !hasMultipleBlocks && hideEverywhere === true && /* @__PURE__ */ jsx("p", { className: "block-editor-block-visibility-modal__description", children: sprintf(
            // translators: %s: The shortcut key to access the List View.
            __(
              "Block will be hidden in the editor, and omitted from the published markup on the frontend. You can configure it again by selecting it in the List View (%s)."
            ),
            listViewShortcut
          ) }),
          !hasMultipleBlocks && !hideEverywhere && isAnyViewportChecked && /* @__PURE__ */ jsx("p", { className: "block-editor-block-visibility-modal__description", children: createInterpolateElement(
            sprintf(
              // translators: %s: The shortcut key to access the List View
              __(
                "Block will be hidden according to the selected viewports. It will be <strong>included in the published markup on the frontend</strong>. You can configure it again by selecting it in the List View (%s)."
              ),
              listViewShortcut
            ),
            {
              strong: /* @__PURE__ */ jsx("strong", {})
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs(
          Flex,
          {
            className: "block-editor-block-visibility-modal__actions",
            justify: "flex-end",
            expanded: false,
            children: [
              /* @__PURE__ */ jsx(FlexItem, { children: /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "tertiary",
                  onClick: onClose,
                  __next40pxDefaultSize: true,
                  children: __("Cancel")
                }
              ) }),
              /* @__PURE__ */ jsx(FlexItem, { children: /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "primary",
                  type: "submit",
                  disabled: !isDirty,
                  accessibleWhenDisabled: true,
                  __next40pxDefaultSize: true,
                  children: __("Apply")
                }
              ) })
            ]
          }
        )
      ] })
    }
  );
}
export {
  BlockVisibilityModal as default
};
//# sourceMappingURL=modal.mjs.map
