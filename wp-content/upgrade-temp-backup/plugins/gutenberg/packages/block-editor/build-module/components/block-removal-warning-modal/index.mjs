// packages/block-editor/src/components/block-removal-warning-modal/index.js
import { useEffect, useState } from "@wordpress/element";
import { useDispatch, useSelect } from "@wordpress/data";
import {
  Modal,
  Button,
  CheckboxControl,
  __experimentalHStack as HStack,
  __experimentalVStack as VStack
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { store as blockEditorStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function BlockRemovalWarningModal({ rules }) {
  const [confirmed, setConfirmed] = useState(false);
  const { clientIds, selectPrevious, message } = useSelect(
    (select) => unlock(select(blockEditorStore)).getRemovalPromptData()
  );
  const {
    clearBlockRemovalPrompt,
    setBlockRemovalRules,
    privateRemoveBlocks
  } = unlock(useDispatch(blockEditorStore));
  useEffect(() => {
    setBlockRemovalRules(rules);
    return () => {
      setBlockRemovalRules();
    };
  }, [rules, setBlockRemovalRules]);
  useEffect(() => {
    setConfirmed(false);
  }, [clientIds]);
  if (!message) {
    return;
  }
  const isStructured = typeof message === "object" && message !== null;
  const description = isStructured ? message.description : message;
  const requireConfirmation = isStructured && message.requireConfirmation;
  const isRemoveDisabled = requireConfirmation && !confirmed;
  const onConfirmRemoval = () => {
    privateRemoveBlocks(
      clientIds,
      selectPrevious,
      /* force */
      true
    );
    clearBlockRemovalPrompt();
  };
  return /* @__PURE__ */ jsx(
    Modal,
    {
      title: __("Confirm deletion"),
      onRequestClose: clearBlockRemovalPrompt,
      size: "medium",
      children: /* @__PURE__ */ jsxs(VStack, { spacing: 4, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { children: description }),
          isStructured && (message.warning || message.subtext) && /* @__PURE__ */ jsxs("p", { children: [
            message.warning && /* @__PURE__ */ jsx("strong", { children: message.warning }),
            message.warning && message.subtext && " ",
            message.subtext
          ] })
        ] }),
        requireConfirmation && /* @__PURE__ */ jsx(
          CheckboxControl,
          {
            label: __("I understand the consequences"),
            checked: confirmed,
            onChange: setConfirmed
          }
        ),
        /* @__PURE__ */ jsxs(HStack, { justify: "right", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "tertiary",
              onClick: clearBlockRemovalPrompt,
              __next40pxDefaultSize: true,
              children: __("Cancel")
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "primary",
              onClick: onConfirmRemoval,
              disabled: isRemoveDisabled,
              accessibleWhenDisabled: true,
              __next40pxDefaultSize: true,
              children: __("Delete")
            }
          )
        ] })
      ] })
    }
  );
}
export {
  BlockRemovalWarningModal
};
//# sourceMappingURL=index.mjs.map
