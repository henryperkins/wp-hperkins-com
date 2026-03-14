// packages/commands/src/components/command-menu.js
import { Command, useCommandState } from "cmdk";
import clsx from "clsx";
import { useSelect, useDispatch } from "@wordpress/data";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  isValidElement,
  Component
} from "@wordpress/element";
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
import { Icon, search as inputIcon, arrowRight } from "@wordpress/icons";
import { store as commandsStore } from "../store/index.mjs";
import { unlock } from "../lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { withIgnoreIMEEvents } = unlock(componentsPrivateApis);
var inputLabel = __("Search commands and settings");
var CATEGORY_ICONS = {
  view: arrowRight
};
var CATEGORY_LABELS = {
  command: __("Command"),
  view: __("View"),
  edit: __("Edit"),
  action: __("Action"),
  workflow: __("Workflow")
};
function isValidIcon(icon) {
  return !!icon && (typeof icon === "string" || isValidElement(icon) || typeof icon === "function" || icon instanceof Component);
}
function CommandMenuLoader({
  name,
  search,
  hook,
  setLoader,
  close,
  category
}) {
  const { isLoading, commands = [] } = hook({ search }) ?? {};
  useEffect(() => {
    setLoader(name, isLoading);
  }, [setLoader, name, isLoading]);
  if (!commands.length) {
    return null;
  }
  return /* @__PURE__ */ jsx(Fragment, { children: commands.map((command) => {
    const commandCategory = command.category ?? category;
    return /* @__PURE__ */ jsx(
      Command.Item,
      {
        value: command.searchLabel ?? command.label,
        keywords: command.keywords,
        onSelect: () => command.callback({ close }),
        id: command.name,
        children: /* @__PURE__ */ jsxs(
          HStack,
          {
            alignment: "left",
            className: clsx("commands-command-menu__item", {
              "has-icon": CATEGORY_ICONS[commandCategory] || command.icon
            }),
            children: [
              CATEGORY_ICONS[commandCategory] && /* @__PURE__ */ jsx(
                Icon,
                {
                  icon: CATEGORY_ICONS[commandCategory]
                }
              ),
              !CATEGORY_ICONS[commandCategory] && isValidIcon(command.icon) && /* @__PURE__ */ jsx(Icon, { icon: command.icon }),
              /* @__PURE__ */ jsx("span", { className: "commands-command-menu__item-label", children: /* @__PURE__ */ jsx(
                TextHighlight,
                {
                  text: command.label,
                  highlight: search
                }
              ) }),
              CATEGORY_LABELS[commandCategory] && /* @__PURE__ */ jsx("span", { className: "commands-command-menu__item-category", children: CATEGORY_LABELS[commandCategory] })
            ]
          }
        )
      },
      command.name
    );
  }) });
}
function CommandMenuLoaderWrapper({
  hook,
  search,
  setLoader,
  close,
  category
}) {
  const currentLoaderRef = useRef(hook);
  const [key, setKey] = useState(0);
  useEffect(() => {
    if (currentLoaderRef.current !== hook) {
      currentLoaderRef.current = hook;
      setKey((prevKey) => prevKey + 1);
    }
  }, [hook]);
  return /* @__PURE__ */ jsx(
    CommandMenuLoader,
    {
      hook: currentLoaderRef.current,
      search,
      setLoader,
      close,
      category
    },
    key
  );
}
function CommandMenuGroup({ isContextual, search, setLoader, close }) {
  const { commands, loaders } = useSelect(
    (select) => {
      const { getCommands, getCommandLoaders } = select(commandsStore);
      return {
        commands: getCommands(isContextual),
        loaders: getCommandLoaders(isContextual)
      };
    },
    [isContextual]
  );
  if (!commands.length && !loaders.length) {
    return null;
  }
  return /* @__PURE__ */ jsxs(Command.Group, { children: [
    commands.map((command) => /* @__PURE__ */ jsx(
      Command.Item,
      {
        value: command.searchLabel ?? command.label,
        keywords: command.keywords,
        onSelect: () => command.callback({ close }),
        id: command.name,
        children: /* @__PURE__ */ jsxs(
          HStack,
          {
            alignment: "left",
            className: clsx("commands-command-menu__item", {
              "has-icon": CATEGORY_ICONS[command.category] || command.icon
            }),
            children: [
              CATEGORY_ICONS[command.category] ? /* @__PURE__ */ jsx(Icon, { icon: CATEGORY_ICONS[command.category] }) : command.icon && /* @__PURE__ */ jsx(Icon, { icon: command.icon }),
              /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsx(
                TextHighlight,
                {
                  text: command.label,
                  highlight: search
                }
              ) }),
              CATEGORY_LABELS[command.category] && /* @__PURE__ */ jsx("span", { className: "commands-command-menu__item-category", children: CATEGORY_LABELS[command.category] })
            ]
          }
        )
      },
      command.name
    )),
    loaders.map((loader) => /* @__PURE__ */ jsx(
      CommandMenuLoaderWrapper,
      {
        hook: loader.hook,
        search,
        setLoader,
        close,
        category: loader.category
      },
      loader.name
    ))
  ] });
}
function CommandInput({ isOpen, search, setSearch }) {
  const commandMenuInput = useRef();
  const _value = useCommandState((state) => state.value);
  const selectedItemId = useMemo(() => {
    const item = document.querySelector(
      `[cmdk-item=""][data-value="${_value}"]`
    );
    return item?.getAttribute("id");
  }, [_value]);
  useEffect(() => {
    if (isOpen) {
      commandMenuInput.current.focus();
    }
  }, [isOpen]);
  return /* @__PURE__ */ jsx(
    Command.Input,
    {
      ref: commandMenuInput,
      value: search,
      onValueChange: setSearch,
      placeholder: inputLabel,
      "aria-activedescendant": selectedItemId
    }
  );
}
function CommandMenu() {
  const { registerShortcut } = useDispatch(keyboardShortcutsStore);
  const [search, setSearch] = useState("");
  const isOpen = useSelect(
    (select) => select(commandsStore).isOpen(),
    []
  );
  const { open, close } = useDispatch(commandsStore);
  const [loaders, setLoaders] = useState({});
  useEffect(() => {
    registerShortcut({
      name: "core/commands",
      category: "global",
      description: __("Open the command palette."),
      keyCombination: {
        modifier: "primary",
        character: "k"
      }
    });
  }, [registerShortcut]);
  useShortcut(
    "core/commands",
    /** @type {React.KeyboardEventHandler} */
    withIgnoreIMEEvents((event) => {
      if (event.defaultPrevented) {
        return;
      }
      event.preventDefault();
      if (isOpen) {
        close();
      } else {
        open();
      }
    }),
    {
      bindGlobal: true
    }
  );
  const setLoader = useCallback(
    (name, value) => setLoaders((current) => ({
      ...current,
      [name]: value
    })),
    []
  );
  const closeAndReset = () => {
    setSearch("");
    close();
  };
  if (!isOpen) {
    return false;
  }
  const isLoading = Object.values(loaders).some(Boolean);
  return /* @__PURE__ */ jsx(
    Modal,
    {
      className: "commands-command-menu",
      overlayClassName: "commands-command-menu__overlay",
      onRequestClose: closeAndReset,
      __experimentalHideHeader: true,
      contentLabel: __("Command palette"),
      children: /* @__PURE__ */ jsx("div", { className: "commands-command-menu__container", children: /* @__PURE__ */ jsxs(Command, { label: inputLabel, children: [
        /* @__PURE__ */ jsxs("div", { className: "commands-command-menu__header", children: [
          /* @__PURE__ */ jsx(
            Icon,
            {
              className: "commands-command-menu__header-search-icon",
              icon: inputIcon
            }
          ),
          /* @__PURE__ */ jsx(
            CommandInput,
            {
              search,
              setSearch,
              isOpen
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(Command.List, { label: __("Command suggestions"), children: [
          search && !isLoading && /* @__PURE__ */ jsx(Command.Empty, { children: __("No results found.") }),
          /* @__PURE__ */ jsx(
            CommandMenuGroup,
            {
              search,
              setLoader,
              close: closeAndReset,
              isContextual: true
            }
          ),
          search && /* @__PURE__ */ jsx(
            CommandMenuGroup,
            {
              search,
              setLoader,
              close: closeAndReset
            }
          )
        ] })
      ] }) })
    }
  );
}
export {
  CommandMenu,
  CommandMenuGroup,
  CommandMenuLoaderWrapper,
  isValidIcon
};
//# sourceMappingURL=command-menu.mjs.map
