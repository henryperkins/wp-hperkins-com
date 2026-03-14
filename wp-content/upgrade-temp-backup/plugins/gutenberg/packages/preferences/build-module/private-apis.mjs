// packages/preferences/src/private-apis.ts
import PreferenceBaseOption from "./components/preference-base-option/index.mjs";
import PreferenceToggleControl from "./components/preference-toggle-control/index.mjs";
import PreferencesModal from "./components/preferences-modal/index.mjs";
import PreferencesModalSection from "./components/preferences-modal-section/index.mjs";
import PreferencesModalTabs from "./components/preferences-modal-tabs/index.mjs";
import { lock } from "./lock-unlock.mjs";
var privateApis = {};
lock(privateApis, {
  PreferenceBaseOption,
  PreferenceToggleControl,
  PreferencesModal,
  PreferencesModalSection,
  PreferencesModalTabs
});
export {
  privateApis
};
//# sourceMappingURL=private-apis.mjs.map
