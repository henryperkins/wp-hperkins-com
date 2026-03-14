// packages/edit-site/src/components/block-editor/use-viewport-sync.js
import { useEffect } from "@wordpress/element";
import { useDispatch } from "@wordpress/data";
import { privateApis as routerPrivateApis } from "@wordpress/router";
import { store as editorStore } from "@wordpress/editor";
import { unlock } from "../../lock-unlock.mjs";
var { useLocation } = unlock(routerPrivateApis);
var DEFAULT_DEVICE_TYPE = "Desktop";
var VALID_DEVICE_TYPES = ["desktop", "tablet", "mobile"];
var capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
function useViewportSync() {
  const { query } = useLocation();
  const { setDeviceType } = useDispatch(editorStore);
  useEffect(() => {
    const viewport = query?.viewport?.toLowerCase();
    const isValid = VALID_DEVICE_TYPES.includes(viewport);
    setDeviceType(isValid ? capitalize(viewport) : DEFAULT_DEVICE_TYPE);
  }, [query?.viewport, setDeviceType]);
}
function ViewportSync() {
  useViewportSync();
  return null;
}
export {
  DEFAULT_DEVICE_TYPE,
  ViewportSync,
  useViewportSync as default
};
//# sourceMappingURL=use-viewport-sync.mjs.map
