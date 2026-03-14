"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/edit-site/src/hooks/commands/use-common-commands.js
var use_common_commands_exports = {};
__export(use_common_commands_exports, {
  useCommonCommands: () => useCommonCommands
});
module.exports = __toCommonJS(use_common_commands_exports);
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_commands = require("@wordpress/commands");
var import_router = require("@wordpress/router");
var import_preferences = require("@wordpress/preferences");
var import_core_data = require("@wordpress/core-data");
var import_editor = require("@wordpress/editor");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_store = require("../../store/index.cjs");
var { useHistory, useLocation } = (0, import_lock_unlock.unlock)(import_router.privateApis);
var { useGlobalStyles } = (0, import_lock_unlock.unlock)(import_editor.privateApis);
var getGlobalStylesToggleWelcomeGuideCommands = () => function useGlobalStylesToggleWelcomeGuideCommands() {
  const { openGeneralSidebar } = (0, import_lock_unlock.unlock)((0, import_data.useDispatch)(import_store.store));
  const { params } = useLocation();
  const { canvas = "view" } = params;
  const { set } = (0, import_data.useDispatch)(import_preferences.store);
  const history = useHistory();
  const isBlockBasedTheme = (0, import_data.useSelect)((select) => {
    return select(import_core_data.store).getCurrentTheme().is_block_theme;
  }, []);
  const commands = (0, import_element.useMemo)(() => {
    if (!isBlockBasedTheme) {
      return [];
    }
    return [
      {
        name: "core/edit-site/toggle-styles-welcome-guide",
        label: (0, import_i18n.__)("Learn about styles"),
        callback: ({ close }) => {
          close();
          if (canvas !== "edit") {
            history.navigate("/styles?canvas=edit", {
              transition: "canvas-mode-edit-transition"
            });
          }
          openGeneralSidebar("edit-site/global-styles");
          set("core/edit-site", "welcomeGuideStyles", true);
          setTimeout(() => {
            set("core/edit-site", "welcomeGuideStyles", true);
          }, 500);
        },
        icon: import_icons.help
      }
    ];
  }, [history, openGeneralSidebar, canvas, isBlockBasedTheme, set]);
  return {
    isLoading: false,
    commands
  };
};
var getGlobalStylesResetCommands = () => function useGlobalStylesResetCommands() {
  const { user, setUser } = useGlobalStyles();
  const canReset = !!user && (Object.keys(user?.styles ?? {}).length > 0 || Object.keys(user?.settings ?? {}).length > 0);
  const commands = (0, import_element.useMemo)(() => {
    if (!canReset) {
      return [];
    }
    return [
      {
        name: "core/edit-site/reset-global-styles",
        label: (0, import_i18n.__)("Reset styles"),
        icon: (0, import_i18n.isRTL)() ? import_icons.rotateRight : import_icons.rotateLeft,
        callback: ({ close }) => {
          close();
          setUser({ styles: {}, settings: {} });
        }
      }
    ];
  }, [canReset, setUser]);
  return {
    isLoading: false,
    commands
  };
};
var getGlobalStylesOpenRevisionsCommands = () => function useGlobalStylesOpenRevisionsCommands() {
  const { openGeneralSidebar } = (0, import_lock_unlock.unlock)((0, import_data.useDispatch)(import_store.store));
  const { setStylesPath } = (0, import_lock_unlock.unlock)((0, import_data.useDispatch)(import_editor.store));
  const { params } = useLocation();
  const { canvas = "view" } = params;
  const history = useHistory();
  const hasRevisions = (0, import_data.useSelect)((select) => {
    const { getEntityRecord, __experimentalGetCurrentGlobalStylesId } = select(import_core_data.store);
    const globalStylesId = __experimentalGetCurrentGlobalStylesId();
    const globalStyles = globalStylesId ? getEntityRecord("root", "globalStyles", globalStylesId) : void 0;
    return !!globalStyles?._links?.["version-history"]?.[0]?.count;
  }, []);
  const commands = (0, import_element.useMemo)(() => {
    if (!hasRevisions) {
      return [];
    }
    return [
      {
        name: "core/edit-site/open-styles-revisions",
        label: (0, import_i18n.__)("Open style revisions"),
        icon: import_icons.backup,
        callback: ({ close }) => {
          close();
          if (canvas !== "edit") {
            history.navigate("/styles?canvas=edit", {
              transition: "canvas-mode-edit-transition"
            });
          }
          openGeneralSidebar("edit-site/global-styles");
          setStylesPath("/revisions");
        }
      }
    ];
  }, [
    history,
    openGeneralSidebar,
    setStylesPath,
    hasRevisions,
    canvas
  ]);
  return {
    isLoading: false,
    commands
  };
};
function useCommonCommands() {
  (0, import_commands.useCommandLoader)({
    name: "core/edit-site/toggle-styles-welcome-guide",
    hook: getGlobalStylesToggleWelcomeGuideCommands()
  });
  (0, import_commands.useCommandLoader)({
    name: "core/edit-site/reset-global-styles",
    hook: getGlobalStylesResetCommands()
  });
  (0, import_commands.useCommandLoader)({
    name: "core/edit-site/open-styles-revisions",
    hook: getGlobalStylesOpenRevisionsCommands()
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useCommonCommands
});
//# sourceMappingURL=use-common-commands.cjs.map
