// packages/block-editor/src/components/block-visibility/viewport-visibility-info.js
import {
  Icon,
  __experimentalText as Text,
  __experimentalHStack as HStack,
  privateApis as componentsPrivateApis
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { unseen } from "@wordpress/icons";
import { unlock } from "../../lock-unlock.mjs";
import { store as blockEditorStore } from "../../store/index.mjs";
import useBlockVisibility from "./use-block-visibility.mjs";
import { deviceTypeKey } from "../../store/private-keys.mjs";
import { BLOCK_VISIBILITY_VIEWPORTS } from "./constants.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var { Badge } = unlock(componentsPrivateApis);
var DEFAULT_VISIBILITY_STATE = {
  currentBlockVisibility: void 0,
  hasParentHiddenEverywhere: false,
  selectedDeviceType: BLOCK_VISIBILITY_VIEWPORTS.desktop.value
};
function ViewportVisibilityInfo({ clientId }) {
  const {
    currentBlockVisibility,
    selectedDeviceType,
    hasParentHiddenEverywhere
  } = useSelect(
    (select) => {
      if (!clientId) {
        return DEFAULT_VISIBILITY_STATE;
      }
      const {
        getBlockAttributes,
        isBlockParentHiddenEverywhere,
        getSettings
      } = unlock(select(blockEditorStore));
      return {
        currentBlockVisibility: getBlockAttributes(clientId)?.metadata?.blockVisibility,
        selectedDeviceType: getSettings()?.[deviceTypeKey]?.toLowerCase() || BLOCK_VISIBILITY_VIEWPORTS.desktop.value,
        hasParentHiddenEverywhere: isBlockParentHiddenEverywhere(clientId)
      };
    },
    [clientId]
  );
  const { isBlockCurrentlyHidden, currentViewport } = useBlockVisibility({
    blockVisibility: currentBlockVisibility,
    deviceType: selectedDeviceType
  });
  const isBlockParentHiddenAtViewport = useSelect(
    (select) => {
      if (!clientId || !currentViewport) {
        return false;
      }
      return unlock(
        select(blockEditorStore)
      ).isBlockParentHiddenAtViewport(clientId, currentViewport);
    },
    [clientId, currentViewport]
  );
  if (!(isBlockCurrentlyHidden || hasParentHiddenEverywhere || isBlockParentHiddenAtViewport)) {
    return null;
  }
  let label;
  if (isBlockCurrentlyHidden) {
    if (currentBlockVisibility === false) {
      label = __("Block is hidden");
    } else {
      const viewportLabel = BLOCK_VISIBILITY_VIEWPORTS[currentViewport]?.label || currentViewport;
      label = sprintf(
        /* translators: %s: viewport name (Desktop, Tablet, Mobile) */
        __("Block is hidden on %s"),
        viewportLabel
      );
    }
  }
  if (hasParentHiddenEverywhere) {
    label = __("Parent block is hidden");
  } else if (isBlockParentHiddenAtViewport) {
    const viewportLabel = BLOCK_VISIBILITY_VIEWPORTS[currentViewport]?.label || currentViewport;
    label = sprintf(
      /* translators: %s: viewport name (Desktop, Tablet, Mobile) */
      __("Parent block is hidden on %s"),
      viewportLabel
    );
  }
  return /* @__PURE__ */ jsx(Badge, { className: "block-editor-block-visibility-info", children: /* @__PURE__ */ jsxs(HStack, { spacing: 2, justify: "start", children: [
    /* @__PURE__ */ jsx(Icon, { icon: unseen }),
    /* @__PURE__ */ jsx(Text, { children: label })
  ] }) });
}
export {
  ViewportVisibilityInfo as default
};
//# sourceMappingURL=viewport-visibility-info.mjs.map
