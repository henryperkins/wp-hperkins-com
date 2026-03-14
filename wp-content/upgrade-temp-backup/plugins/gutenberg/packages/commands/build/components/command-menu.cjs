var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/commands/src/components/command-menu.js
var command_menu_exports = {};
__export(command_menu_exports, {
  CommandMenu: () => CommandMenu,
  CommandMenuGroup: () => CommandMenuGroup,
  CommandMenuLoaderWrapper: () => CommandMenuLoaderWrapper,
  isValidIcon: () => isValidIcon
});
module.exports = __toCommonJS(command_menu_exports);
var import_cmdk = require("cmdk");
var import_clsx = __toESM(require("clsx"));
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_keyboard_shortcuts = require("@wordpress/keyboard-shortcuts");
var import_icons = require("@wordpress/icons");
var import_store = require("../store/index.cjs");
var import_lock_unlock = require("../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { withIgnoreIMEEvents } = (0, import_lock_unlock.unlock)(import_components.privateApis);
var inputLabel = (0, import_i18n.__)("Search commands and settings");
var CATEGORY_ICONS = {
  view: import_icons.arrowRight
};
var CATEGORY_LABELS = {
  command: (0, import_i18n.__)("Command"),
  view: (0, import_i18n.__)("View"),
  edit: (0, import_i18n.__)("Edit"),
  action: (0, import_i18n.__)("Action"),
  workflow: (0, import_i18n.__)("Workflow")
};
function isValidIcon(icon) {
  return !!icon && (typeof icon === "string" || (0, import_element.isValidElement)(icon) || typeof icon === "function" || icon instanceof import_element.Component);
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
  (0, import_element.useEffect)(() => {
    setLoader(name, isLoading);
  }, [setLoader, name, isLoading]);
  if (!commands.length) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: commands.map((command) => {
    const commandCategory = command.category ?? category;
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_cmdk.Command.Item,
      {
        value: command.searchLabel ?? command.label,
        keywords: command.keywords,
        onSelect: () => command.callback({ close }),
        id: command.name,
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          import_components.__experimentalHStack,
          {
            alignment: "left",
            className: (0, import_clsx.default)("commands-command-menu__item", {
              "has-icon": CATEGORY_ICONS[commandCategory] || command.icon
            }),
            children: [
              CATEGORY_ICONS[commandCategory] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_icons.Icon,
                {
                  icon: CATEGORY_ICONS[commandCategory]
                }
              ),
              !CATEGORY_ICONS[commandCategory] && isValidIcon(command.icon) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_icons.Icon, { icon: command.icon }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "commands-command-menu__item-label", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_components.TextHighlight,
                {
                  text: command.label,
                  highlight: search
                }
              ) }),
              CATEGORY_LABELS[commandCategory] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "commands-command-menu__item-category", children: CATEGORY_LABELS[commandCategory] })
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
  const currentLoaderRef = (0, import_element.useRef)(hook);
  const [key, setKey] = (0, import_element.useState)(0);
  (0, import_element.useEffect)(() => {
    if (currentLoaderRef.current !== hook) {
      currentLoaderRef.current = hook;
      setKey((prevKey) => prevKey + 1);
    }
  }, [hook]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
  const { commands, loaders } = (0, import_data.useSelect)(
    (select) => {
      const { getCommands, getCommandLoaders } = select(import_store.store);
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_cmdk.Command.Group, { children: [
    commands.map((command) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_cmdk.Command.Item,
      {
        value: command.searchLabel ?? command.label,
        keywords: command.keywords,
        onSelect: () => command.callback({ close }),
        id: command.name,
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          import_components.__experimentalHStack,
          {
            alignment: "left",
            className: (0, import_clsx.default)("commands-command-menu__item", {
              "has-icon": CATEGORY_ICONS[command.category] || command.icon
            }),
            children: [
              CATEGORY_ICONS[command.category] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_icons.Icon, { icon: CATEGORY_ICONS[command.category] }) : command.icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_icons.Icon, { icon: command.icon }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_components.TextHighlight,
                {
                  text: command.label,
                  highlight: search
                }
              ) }),
              CATEGORY_LABELS[command.category] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "commands-command-menu__item-category", children: CATEGORY_LABELS[command.category] })
            ]
          }
        )
      },
      command.name
    )),
    loaders.map((loader) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
  const commandMenuInput = (0, import_element.useRef)();
  const _value = (0, import_cmdk.useCommandState)((state) => state.value);
  const selectedItemId = (0, import_element.useMemo)(() => {
    const item = document.querySelector(
      `[cmdk-item=""][data-value="${_value}"]`
    );
    return item?.getAttribute("id");
  }, [_value]);
  (0, import_element.useEffect)(() => {
    if (isOpen) {
      commandMenuInput.current.focus();
    }
  }, [isOpen]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_cmdk.Command.Input,
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
  const { registerShortcut } = (0, import_data.useDispatch)(import_keyboard_shortcuts.store);
  const [search, setSearch] = (0, import_element.useState)("");
  const isOpen = (0, import_data.useSelect)(
    (select) => select(import_store.store).isOpen(),
    []
  );
  const { open, close } = (0, import_data.useDispatch)(import_store.store);
  const [loaders, setLoaders] = (0, import_element.useState)({});
  (0, import_element.useEffect)(() => {
    registerShortcut({
      name: "core/commands",
      category: "global",
      description: (0, import_i18n.__)("Open the command palette."),
      keyCombination: {
        modifier: "primary",
        character: "k"
      }
    });
  }, [registerShortcut]);
  (0, import_keyboard_shortcuts.useShortcut)(
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
  const setLoader = (0, import_element.useCallback)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Modal,
    {
      className: "commands-command-menu",
      overlayClassName: "commands-command-menu__overlay",
      onRequestClose: closeAndReset,
      __experimentalHideHeader: true,
      contentLabel: (0, import_i18n.__)("Command palette"),
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "commands-command-menu__container", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_cmdk.Command, { label: inputLabel, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "commands-command-menu__header", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_icons.Icon,
            {
              className: "commands-command-menu__header-search-icon",
              icon: import_icons.search
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            CommandInput,
            {
              search,
              setSearch,
              isOpen
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_cmdk.Command.List, { label: (0, import_i18n.__)("Command suggestions"), children: [
          search && !isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_cmdk.Command.Empty, { children: (0, import_i18n.__)("No results found.") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            CommandMenuGroup,
            {
              search,
              setLoader,
              close: closeAndReset,
              isContextual: true
            }
          ),
          search && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CommandMenu,
  CommandMenuGroup,
  CommandMenuLoaderWrapper,
  isValidIcon
});
//# sourceMappingURL=command-menu.cjs.map
