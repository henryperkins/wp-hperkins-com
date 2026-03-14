// packages/editor/src/components/global-styles/hooks.js
import { useMemo, useCallback } from "@wordpress/element";
import {
  mergeGlobalStyles,
  getStyle,
  getSetting
} from "@wordpress/global-styles-engine";
import { store as coreStore } from "@wordpress/core-data";
import { useSelect, useDispatch } from "@wordpress/data";
import { privateApis as blockEditorPrivateApis } from "@wordpress/block-editor";
import { unlock } from "../../lock-unlock.mjs";
var { cleanEmptyObject } = unlock(blockEditorPrivateApis);
function useGlobalStylesUserConfig() {
  const { globalStylesId, isReady, settings, styles, _links } = useSelect(
    (select) => {
      const {
        getEntityRecord,
        getEditedEntityRecord: getEditedEntityRecord2,
        hasFinishedResolution,
        canUser
      } = select(coreStore);
      const _globalStylesId = select(coreStore).__experimentalGetCurrentGlobalStylesId();
      let record;
      const userCanEditGlobalStyles = _globalStylesId ? canUser("update", {
        kind: "root",
        name: "globalStyles",
        id: _globalStylesId
      }) : null;
      if (_globalStylesId && typeof userCanEditGlobalStyles === "boolean") {
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
  const { getEditedEntityRecord } = useSelect(coreStore);
  const { editEntityRecord } = useDispatch(coreStore);
  const config = useMemo(() => {
    return {
      settings: settings ?? {},
      styles: styles ?? {},
      _links: _links ?? {}
    };
  }, [settings, styles, _links]);
  const setConfig = useCallback(
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
  const baseConfig = useSelect(
    (select) => select(coreStore).__experimentalGetCurrentThemeBaseGlobalStyles(),
    []
  );
  return [!!baseConfig, baseConfig];
}
function useGlobalStyles() {
  const [isUserConfigReady, userConfig, setUserConfig] = useGlobalStylesUserConfig();
  const [isBaseConfigReady, baseConfig] = useGlobalStylesBaseConfig();
  const merged = useMemo(() => {
    if (!isUserConfigReady || !isBaseConfigReady) {
      return {};
    }
    return mergeGlobalStyles(baseConfig || {}, userConfig);
  }, [isUserConfigReady, isBaseConfigReady, baseConfig, userConfig]);
  return {
    merged,
    base: baseConfig || {},
    user: userConfig,
    setUser: setUserConfig,
    isReady: isUserConfigReady && isBaseConfigReady
  };
}
function useStyle(path, blockName) {
  const { merged } = useGlobalStyles();
  return useMemo(
    () => getStyle(merged, path, blockName),
    [merged, path, blockName]
  );
}
function useSetting(path, blockName) {
  const { merged } = useGlobalStyles();
  return useMemo(
    () => getSetting(merged, path, blockName),
    [merged, path, blockName]
  );
}
export {
  useGlobalStyles,
  useSetting,
  useStyle
};
//# sourceMappingURL=hooks.mjs.map
