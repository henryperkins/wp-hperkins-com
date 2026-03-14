// packages/workflow/src/components/workflow-menu.js
import { Command, useCommandState } from "cmdk";
import { useSelect, useDispatch } from "@wordpress/data";
import { useState, useEffect, useRef, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import {
  Modal,
  TextHighlight,
  __experimentalHStack as HStack,
  privateApis as componentsPrivateApis
} from "@wordpress/components";
import {
  store as keyboardShortcutsStore,
  useShortcut
} from "@wordpress/keyboard-shortcuts";
import { Icon, search as inputIcon } from "@wordpress/icons";
import { executeAbility, store as abilitiesStore } from "@wordpress/abilities";

// packages/workflow/src/components/workflow-menu.scss
if (typeof document !== "undefined" && process.env.NODE_ENV !== "test" && !document.head.querySelector("style[data-wp-hash='cbad731ae6']")) {
  const style = document.createElement("style");
  style.setAttribute("data-wp-hash", "cbad731ae6");
  style.appendChild(document.createTextNode(":root{--wp-block-synced-color:#7a00df;--wp-block-synced-color--rgb:122,0,223;--wp-bound-block-color:var(--wp-block-synced-color);--wp-editor-canvas-background:#ddd;--wp-admin-theme-color:#007cba;--wp-admin-theme-color--rgb:0,124,186;--wp-admin-theme-color-darker-10:#006ba1;--wp-admin-theme-color-darker-10--rgb:0,107,160.5;--wp-admin-theme-color-darker-20:#005a87;--wp-admin-theme-color-darker-20--rgb:0,90,135;--wp-admin-border-width-focus:2px}@media (-webkit-min-device-pixel-ratio:2),(min-resolution:192dpi){:root{--wp-admin-border-width-focus:1.5px}}.workflows-workflow-menu{border-radius:4px;margin:auto;max-width:400px;position:relative;top:calc(5% + 64px);width:calc(100% - 32px)}@media (min-width:600px){.workflows-workflow-menu{top:calc(10% + 64px)}}.workflows-workflow-menu .components-modal__content{margin:0;padding:0}.workflows-workflow-menu__overlay{align-items:start;display:block}.workflows-workflow-menu__header{padding:0 16px}.workflows-workflow-menu__header-search-icon:dir(ltr){transform:scaleX(-1)}.workflows-workflow-menu__container{will-change:transform}.workflows-workflow-menu__container:focus{outline:none}.workflows-workflow-menu__container [cmdk-input]{border:none;border-radius:0;color:#1e1e1e;font-size:15px;line-height:28px;margin:0;outline:none;padding:16px 4px;width:100%}.workflows-workflow-menu__container [cmdk-input]::placeholder{color:#757575}.workflows-workflow-menu__container [cmdk-input]:focus{box-shadow:none;outline:none}.workflows-workflow-menu__container [cmdk-item]{align-items:center;border-radius:2px;color:#1e1e1e;cursor:pointer;display:flex;font-size:13px}.workflows-workflow-menu__container [cmdk-item]:active,.workflows-workflow-menu__container [cmdk-item][aria-selected=true]{background:var(--wp-admin-theme-color);color:#fff}.workflows-workflow-menu__container [cmdk-item][aria-disabled=true]{color:#949494;cursor:not-allowed}.workflows-workflow-menu__container [cmdk-item]>div{min-height:40px;padding:4px 4px 4px 16px}.workflows-workflow-menu__container [cmdk-root]>[cmdk-list]{max-height:368px;overflow:auto}.workflows-workflow-menu__container [cmdk-root]>[cmdk-list] [cmdk-list-sizer]>[cmdk-group]:last-child [cmdk-group-items]:not(:empty){padding-bottom:8px}.workflows-workflow-menu__container [cmdk-root]>[cmdk-list] [cmdk-list-sizer]>[cmdk-group]>[cmdk-group-items]:not(:empty){padding:0 8px}.workflows-workflow-menu__container [cmdk-empty]{align-items:center;color:#1e1e1e;display:flex;justify-content:center;padding:8px 0 32px;white-space:pre-wrap}.workflows-workflow-menu__container [cmdk-loading]{padding:16px}.workflows-workflow-menu__container [cmdk-list-sizer]{position:relative}.workflows-workflow-menu__item span{display:inline-block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.workflows-workflow-menu__item mark{background:unset;color:inherit;font-weight:600}.workflows-workflow-menu__output{padding:16px}.workflows-workflow-menu__output-header{border-bottom:1px solid #ddd;margin-bottom:16px;padding-bottom:8px}.workflows-workflow-menu__output-header h3{color:#1e1e1e;font-size:16px;font-weight:600;margin:0 0 4px}.workflows-workflow-menu__output-hint{color:#757575;font-size:12px;margin:0}.workflows-workflow-menu__output-content{max-height:400px;overflow:auto}.workflows-workflow-menu__output-content pre{background:#f0f0f0;border-radius:2px;color:#1e1e1e;font-size:12px;line-height:1.5;margin:0;padding:12px;white-space:pre-wrap;word-break:break-word}.workflows-workflow-menu__output-error{background:#e0e0e0;border:1px solid #9e1313;border-radius:2px;color:#cc1818;padding:12px}.workflows-workflow-menu__output-error p{font-size:13px;margin:0}.workflows-workflow-menu__executing{color:#757575;font-size:14px;padding:24px 16px}"));
  document.head.appendChild(style);
}

// packages/workflow/src/components/workflow-menu.js
import { unlock } from "../lock-unlock.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var { withIgnoreIMEEvents } = unlock(componentsPrivateApis);
var EMPTY_ARRAY = [];
var inputLabel = __("Run abilities and workflows");
function WorkflowInput({ isOpen, search, setSearch, abilities }) {
  const workflowMenuInput = useRef();
  const _value = useCommandState((state) => state.value);
  const selectedItemId = useMemo(() => {
    const ability = abilities.find((a) => a.label === _value);
    return ability?.name;
  }, [_value, abilities]);
  useEffect(() => {
    if (isOpen) {
      workflowMenuInput.current.focus();
    }
  }, [isOpen]);
  return /* @__PURE__ */ jsx(
    Command.Input,
    {
      ref: workflowMenuInput,
      value: search,
      onValueChange: setSearch,
      placeholder: inputLabel,
      "aria-activedescendant": selectedItemId
    }
  );
}
function WorkflowMenu() {
  const { registerShortcut } = useDispatch(keyboardShortcutsStore);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [abilityOutput, setAbilityOutput] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const containerRef = useRef();
  const abilities = useSelect((select) => {
    const allAbilities = select(abilitiesStore).getAbilities();
    return allAbilities || EMPTY_ARRAY;
  }, []);
  const filteredAbilities = useMemo(() => {
    if (!search) {
      return abilities;
    }
    const searchLower = search.toLowerCase();
    return abilities.filter(
      (ability) => ability.label?.toLowerCase().includes(searchLower) || ability.name?.toLowerCase().includes(searchLower)
    );
  }, [abilities, search]);
  useEffect(() => {
    if (abilityOutput && containerRef.current) {
      containerRef.current.focus();
    }
  }, [abilityOutput]);
  useEffect(() => {
    registerShortcut({
      name: "core/workflows",
      category: "global",
      description: __("Open the workflow palette."),
      keyCombination: {
        modifier: "primary",
        character: "j"
      }
    });
  }, [registerShortcut]);
  useShortcut(
    "core/workflows",
    /** @type {React.KeyboardEventHandler} */
    withIgnoreIMEEvents((event) => {
      if (event.defaultPrevented) {
        return;
      }
      event.preventDefault();
      setIsOpen(!isOpen);
    }),
    {
      bindGlobal: true
    }
  );
  const closeAndReset = () => {
    setSearch("");
    setIsOpen(false);
    setAbilityOutput(null);
    setIsExecuting(false);
  };
  const goBack = () => {
    setAbilityOutput(null);
    setIsExecuting(false);
    setSearch("");
  };
  const handleExecuteAbility = async (ability) => {
    setIsExecuting(true);
    try {
      const result = await executeAbility(ability.name);
      setAbilityOutput({
        name: ability.name,
        label: ability?.label || ability.name,
        description: ability?.description || "",
        success: true,
        data: result
      });
    } catch (error) {
      setAbilityOutput({
        name: ability.name,
        label: ability?.label || ability.name,
        description: ability?.description || "",
        success: false,
        error: error.message || String(error)
      });
    } finally {
      setIsExecuting(false);
    }
  };
  const onContainerKeyDown = (event) => {
    if (abilityOutput && (event.key === "Escape" || event.key === "Backspace" || event.key === "Delete")) {
      event.preventDefault();
      event.stopPropagation();
      goBack();
    }
  };
  if (!isOpen) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    Modal,
    {
      className: "workflows-workflow-menu",
      overlayClassName: "workflows-workflow-menu__overlay",
      onRequestClose: abilityOutput ? goBack : closeAndReset,
      __experimentalHideHeader: true,
      contentLabel: __("Workflow palette"),
      children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "workflows-workflow-menu__container",
          onKeyDown: withIgnoreIMEEvents(onContainerKeyDown),
          ref: containerRef,
          tabIndex: -1,
          role: "presentation",
          children: abilityOutput ? /* @__PURE__ */ jsxs("div", { className: "workflows-workflow-menu__output", children: [
            /* @__PURE__ */ jsxs("div", { className: "workflows-workflow-menu__output-header", children: [
              /* @__PURE__ */ jsx("h3", { children: abilityOutput.label }),
              abilityOutput.description && /* @__PURE__ */ jsx("p", { className: "workflows-workflow-menu__output-hint", children: abilityOutput.description })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "workflows-workflow-menu__output-content", children: abilityOutput.success ? /* @__PURE__ */ jsx("pre", { children: JSON.stringify(
              abilityOutput.data,
              null,
              2
            ) }) : /* @__PURE__ */ jsx("div", { className: "workflows-workflow-menu__output-error", children: /* @__PURE__ */ jsx("p", { children: abilityOutput.error }) }) })
          ] }) : /* @__PURE__ */ jsxs(Command, { label: inputLabel, shouldFilter: false, children: [
            /* @__PURE__ */ jsxs(HStack, { className: "workflows-workflow-menu__header", children: [
              /* @__PURE__ */ jsx(
                Icon,
                {
                  className: "workflows-workflow-menu__header-search-icon",
                  icon: inputIcon
                }
              ),
              /* @__PURE__ */ jsx(
                WorkflowInput,
                {
                  search,
                  setSearch,
                  isOpen,
                  abilities
                }
              )
            ] }),
            /* @__PURE__ */ jsxs(Command.List, { label: __("Workflow suggestions"), children: [
              isExecuting && /* @__PURE__ */ jsx(
                HStack,
                {
                  className: "workflows-workflow-menu__executing",
                  align: "center",
                  children: __("Executing ability\u2026")
                }
              ),
              !isExecuting && search && filteredAbilities.length === 0 && /* @__PURE__ */ jsx(Command.Empty, { children: __("No results found.") }),
              !isExecuting && filteredAbilities.length > 0 && /* @__PURE__ */ jsx(Command.Group, { children: filteredAbilities.map((ability) => /* @__PURE__ */ jsx(
                Command.Item,
                {
                  value: ability.label,
                  className: "workflows-workflow-menu__item",
                  onSelect: () => handleExecuteAbility(ability),
                  id: ability.name,
                  children: /* @__PURE__ */ jsx(HStack, { alignment: "left", children: /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsx(
                    TextHighlight,
                    {
                      text: ability.label,
                      highlight: search
                    }
                  ) }) })
                },
                ability.name
              )) })
            ] })
          ] })
        }
      )
    }
  );
}
export {
  WorkflowMenu
};
//# sourceMappingURL=workflow-menu.mjs.map
