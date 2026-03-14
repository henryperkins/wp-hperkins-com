// packages/boot/src/components/user-theme-provider/index.tsx
import {
  privateApis as themePrivateApis
} from "@wordpress/theme";
import { unlock } from "../../lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
var ThemeProvider = unlock(themePrivateApis).ThemeProvider;
var THEME_PRIMARY_COLORS = /* @__PURE__ */ new Map([
  ["light", "#0085ba"],
  ["modern", "#3858e9"],
  ["blue", "#096484"],
  ["coffee", "#46403c"],
  ["ectoplasm", "#523f6d"],
  ["midnight", "#e14d43"],
  ["ocean", "#627c83"],
  ["sunrise", "#dd823b"]
]);
function getAdminThemePrimaryColor() {
  const theme = document.body.className.match(/admin-color-([a-z]+)/)?.[1];
  return theme && THEME_PRIMARY_COLORS.get(theme);
}
function UserThemeProvider({
  color,
  ...restProps
}) {
  const primary = getAdminThemePrimaryColor();
  return /* @__PURE__ */ jsx(ThemeProvider, { ...restProps, color: { primary, ...color } });
}
export {
  UserThemeProvider,
  getAdminThemePrimaryColor
};
//# sourceMappingURL=index.mjs.map
