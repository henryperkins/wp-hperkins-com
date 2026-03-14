// packages/boot/src/components/root/single-page.tsx
import clsx from "clsx";
import { privateApis as routePrivateApis } from "@wordpress/route";
import { SnackbarNotices } from "@wordpress/notices";
import { SlotFillProvider } from "@wordpress/components";
import SavePanel from "../save-panel/index.mjs";
import CanvasRenderer from "../canvas-renderer/index.mjs";
import { unlock } from "../../lock-unlock.mjs";

// packages/boot/src/components/root/style.scss
if (typeof document !== "undefined" && process.env.NODE_ENV !== "test" && !document.head.querySelector("style[data-wp-hash='5f8c007634']")) {
  const style = document.createElement("style");
  style.setAttribute("data-wp-hash", "5f8c007634");
  style.appendChild(document.createTextNode(".boot-layout{background:var(--wpds-color-bg-surface-neutral-weak,#f0f0f0);color:var(--wpds-color-fg-content-neutral,#1e1e1e);display:flex;flex-direction:row;height:100%;isolation:isolate;width:100%}.boot-layout__sidebar-backdrop{background-color:#00000080;bottom:0;cursor:pointer;left:0;position:fixed;right:0;top:0;z-index:100002}.boot-layout__sidebar{flex-shrink:0;height:100%;overflow:hidden;position:relative;width:240px}.boot-layout__sidebar.is-mobile{background:var(--wpds-color-bg-surface-neutral-weak,#f0f0f0);bottom:0;box-shadow:2px 0 8px #0003;left:0;max-width:85vw;position:fixed;top:0;width:300px;z-index:100003}.boot-layout__mobile-sidebar-drawer{left:0;position:fixed;right:0;top:0}.boot-layout--single-page .boot-layout__mobile-sidebar-drawer{top:46px}.boot-layout__mobile-sidebar-drawer{align-items:center;background:var(--wpds-color-bg-surface-neutral,#fff);border-bottom:1px solid var(--wpds-color-stroke-surface-neutral-weak,#ddd);display:flex;justify-content:flex-start;padding:16px;z-index:3}.boot-layout__canvas.has-mobile-drawer{padding-top:65px;position:relative}.boot-layout__surfaces{display:flex;flex-grow:1;gap:8px;margin:0}@media (min-width:782px){.boot-layout__surfaces{margin:8px}.boot-layout--single-page .boot-layout__surfaces{margin-left:0;margin-top:0}}.boot-layout__inspector,.boot-layout__stage{background:var(--wpds-color-bg-surface-neutral,#fff);border-radius:0;bottom:0;color:var(--wpds-color-fg-content-neutral,#1e1e1e);flex:1;height:100vh;left:0;margin:0;overflow-y:auto;position:relative;position:fixed;right:0;top:0;width:100vw}.boot-layout--single-page .boot-layout__inspector,.boot-layout--single-page .boot-layout__stage{height:calc(100vh - 46px);top:46px}@media (min-width:782px){.boot-layout__inspector,.boot-layout__stage{border-radius:8px;height:auto;margin:0;position:static;width:auto}}.boot-layout__stage{z-index:2}@media (min-width:782px){.boot-layout__stage{z-index:auto}}.boot-layout__inspector{z-index:3}@media (min-width:782px){.boot-layout__inspector{z-index:auto}}.boot-layout__canvas{background:var(--wpds-color-bg-surface-neutral,#fff);border:1px solid var(--wpds-color-stroke-surface-neutral-weak,#ddd);border-radius:0;bottom:0;box-shadow:0 1px 3px #0000001a;color:var(--wpds-color-fg-content-neutral,#1e1e1e);flex:1;height:100vh;left:0;margin:0;overflow-y:auto;position:relative;position:fixed;right:0;top:0;width:100vw;z-index:1}.boot-layout--single-page .boot-layout__canvas{height:calc(100vh - 46px);top:46px}@media (min-width:782px){.boot-layout__canvas{border-radius:8px;height:auto;position:static;width:auto;z-index:auto}.boot-layout.has-canvas .boot-layout__stage,.boot-layout__inspector{max-width:400px}}.boot-layout__canvas .interface-interface-skeleton{height:100%;left:0!important;position:relative;top:0!important}.boot-layout.has-full-canvas .boot-layout__surfaces{gap:0;margin:0}.boot-layout.has-full-canvas .boot-layout__inspector,.boot-layout.has-full-canvas .boot-layout__stage{display:none}.boot-layout.has-full-canvas .boot-layout__canvas{border:none;border-radius:0;bottom:0;box-shadow:none;left:0;margin:0;max-width:none;overflow:hidden;position:fixed;right:0;top:0}.boot-layout--single-page .boot-layout.has-full-canvas .boot-layout__canvas{top:46px}@media (min-width:782px){.boot-layout--single-page .boot-layout.has-full-canvas .boot-layout__canvas{top:32px}}"));
  document.head.appendChild(style);
}

// packages/boot/src/components/root/single-page.tsx
import useRouteTitle from "../app/use-route-title.mjs";
import { UserThemeProvider } from "../user-theme-provider/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var { useMatches, Outlet } = unlock(routePrivateApis);
function RootSinglePage() {
  const matches = useMatches();
  const currentMatch = matches[matches.length - 1];
  const canvas = currentMatch?.loaderData?.canvas;
  const routeContentModule = currentMatch?.loaderData?.routeContentModule;
  const isFullScreen = canvas && !canvas.isPreview;
  useRouteTitle();
  return /* @__PURE__ */ jsx(SlotFillProvider, { children: /* @__PURE__ */ jsx(UserThemeProvider, { isRoot: true, color: { bg: "#f8f8f8" }, children: /* @__PURE__ */ jsx(UserThemeProvider, { color: { bg: "#1d2327" }, children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        "boot-layout boot-layout--single-page",
        {
          "has-canvas": !!canvas || canvas === null,
          "has-full-canvas": isFullScreen
        }
      ),
      children: [
        /* @__PURE__ */ jsx(SavePanel, {}),
        /* @__PURE__ */ jsx(SnackbarNotices, { className: "boot-notices__snackbar" }),
        /* @__PURE__ */ jsx("div", { className: "boot-layout__surfaces", children: /* @__PURE__ */ jsxs(UserThemeProvider, { color: { bg: "#ffffff" }, children: [
          /* @__PURE__ */ jsx(Outlet, {}),
          (canvas || canvas === null) && /* @__PURE__ */ jsx("div", { className: "boot-layout__canvas", children: /* @__PURE__ */ jsx(
            CanvasRenderer,
            {
              canvas,
              routeContentModule
            }
          ) })
        ] }) })
      ]
    }
  ) }) }) });
}
export {
  RootSinglePage as default
};
//# sourceMappingURL=single-page.mjs.map
