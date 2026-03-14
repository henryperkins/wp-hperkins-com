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

// packages/editor/src/components/global-styles-provider/index.js
var global_styles_provider_exports = {};
__export(global_styles_provider_exports, {
  useGlobalStylesContext: () => useGlobalStylesContext
});
module.exports = __toCommonJS(global_styles_provider_exports);
var import_block_editor = require("@wordpress/block-editor");
var import_core_data = require("@wordpress/core-data");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_global_styles_engine = require("@wordpress/global-styles-engine");
var import_lock_unlock = require("../../lock-unlock.cjs");
var { cleanEmptyObject } = (0, import_lock_unlock.unlock)(import_block_editor.privateApis);
function useGlobalStylesUserConfig() {
  const { globalStylesId, isReady, settings, styles, _links } = (0, import_data.useSelect)(
    (select) => {
      const {
        getEntityRecord,
        getEditedEntityRecord: getEditedEntityRecord2,
        hasFinishedResolution,
        canUser
      } = select(import_core_data.store);
      const _globalStylesId = select(import_core_data.store).__experimentalGetCurrentGlobalStylesId();
      let record;
      const userCanEditGlobalStyles = _globalStylesId ? canUser("update", {
        kind: "root",
        name: "globalStyles",
        id: _globalStylesId
      }) : null;
      if (_globalStylesId && /*
       * Test that the OPTIONS request for user capabilities is complete
       * before fetching the global styles entity record.
       * This is to avoid fetching the global styles entity unnecessarily.
       */
      typeof userCanEditGlobalStyles === "boolean") {
        if (userCanEditGlobalStyles) {
          record = getEditedEntityRecord2(
            "root",
            "globalStyles",
            _globalStylesId
          );
        } else {
          record = getEntityRecord(
            "root",
            "globalStyles",
            _globalStylesId,
            { context: "view" }
          );
        }
      }
      let hasResolved = false;
      if (hasFinishedResolution(
        "__experimentalGetCurrentGlobalStylesId"
      )) {
        if (_globalStylesId) {
          hasResolved = userCanEditGlobalStyles ? hasFinishedResolution("getEditedEntityRecord", [
            "root",
            "globalStyles",
            _globalStylesId
          ]) : hasFinishedResolution("getEntityRecord", [
            "root",
            "globalStyles",
            _globalStylesId,
            { context: "view" }
          ]);
        } else {
          hasResolved = true;
        }
      }
      return {
        globalStylesId: _globalStylesId,
        isReady: hasResolved,
        settings: record?.settings,
        styles: record?.styles,
        _links: record?._links
      };
    },
    []
  );
  const { getEditedEntityRecord } = (0, import_data.useSelect)(import_core_data.store);
  const { editEntityRecord } = (0, import_data.useDispatch)(import_core_data.store);
  const config = (0, import_element.useMemo)(() => {
    return {
      settings: settings ?? {},
      styles: styles ?? {},
      _links: _links ?? {}
    };
  }, [settings, styles, _links]);
  const setConfig = (0, import_element.useCallback)(
    /**
     * Set the global styles config.
     * @param {Function|Object} callbackOrObject If the callbackOrObject is a function, pass the current config to the callback so the consumer can merge values.
     *                                           Otherwise, overwrite the current config with the incoming object.
     * @param {Object}          options          Options for editEntityRecord Core selector.
     */
    (callbackOrObject, options = {}) => {
      const record = getEditedEntityRecord(
        "root",
        "globalStyles",
        globalStylesId
      );
      const currentConfig = {
        styles: record?.styles ?? {},
        settings: record?.settings ?? {},
        _links: record?._links ?? {}
      };
      const updatedConfig = typeof callbackOrObject === "function" ? callbackOrObject(currentConfig) : callbackOrObject;
      editEntityRecord(
        "root",
        "globalStyles",
        globalStylesId,
        {
          styles: cleanEmptyObject(updatedConfig.styles) || {},
          settings: cleanEmptyObject(updatedConfig.settings) || {},
          _links: cleanEmptyObject(updatedConfig._links) || {}
        },
        options
      );
    },
    [globalStylesId, editEntityRecord, getEditedEntityRecord]
  );
  return [isReady, config, setConfig];
}
function useGlobalStylesBaseConfig() {
  const baseConfig = (0, import_data.useSelect)(
    (select) => select(import_core_data.store).__experimentalGetCurrentThemeBaseGlobalStyles(),
    []
  );
  return [!!baseConfig, baseConfig];
}
function useGlobalStylesContext() {
  const [isUserConfigReady, userConfig, setUserConfig] = useGlobalStylesUserConfig();
  const [isBaseConfigReady, baseConfig] = useGlobalStylesBaseConfig();
  const mergedConfig = (0, import_element.useMemo)(() => {
    if (!baseConfig || !userConfig) {
      return {};
    }
    return (0, import_global_styles_engine.mergeGlobalStyles)(baseConfig, userConfig);
  }, [userConfig, baseConfig]);
  const context = (0, import_element.useMemo)(() => {
    return {
      isReady: isUserConfigReady && isBaseConfigReady,
      user: userConfig,
      base: baseConfig,
      merged: mergedConfig,
      setUserConfig
    };
  }, [
    mergedConfig,
    userConfig,
    baseConfig,
    setUserConfig,
    isUserConfigReady,
    isBaseConfigReady
  ]);
  return context;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useGlobalStylesContext
});
//# sourceMappingURL=index.cjs.map
