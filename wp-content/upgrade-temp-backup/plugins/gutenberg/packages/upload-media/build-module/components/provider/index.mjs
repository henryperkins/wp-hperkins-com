// packages/upload-media/src/components/provider/index.tsx
import { useEffect } from "@wordpress/element";
import { useDispatch } from "@wordpress/data";
import withRegistryProvider from "./with-registry-provider.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { store as uploadStore } from "../../store/index.mjs";
import { Fragment, jsx } from "react/jsx-runtime";
var MediaUploadProvider = withRegistryProvider((props) => {
  const { children, settings } = props;
  const { updateSettings } = unlock(useDispatch(uploadStore));
  useEffect(() => {
    updateSettings(settings);
  }, [settings, updateSettings]);
  return /* @__PURE__ */ jsx(Fragment, { children });
});
var provider_default = MediaUploadProvider;
export {
  provider_default as default
};
//# sourceMappingURL=index.mjs.map
