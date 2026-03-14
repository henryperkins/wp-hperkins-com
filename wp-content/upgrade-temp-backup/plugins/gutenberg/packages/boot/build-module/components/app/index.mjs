// packages/boot/src/components/app/index.tsx
import { createRoot, StrictMode } from "@wordpress/element";
import { dispatch, useSelect } from "@wordpress/data";
import Router from "./router.mjs";
import RootSinglePage from "../root/single-page.mjs";
import { store } from "../../store/index.mjs";
import { jsx } from "react/jsx-runtime";
function App({ rootComponent }) {
  const routes = useSelect((select) => select(store).getRoutes(), []);
  return /* @__PURE__ */ jsx(Router, { routes, rootComponent });
}
async function init({
  mountId,
  menuItems,
  routes,
  initModules,
  dashboardLink
}) {
  (menuItems ?? []).forEach((menuItem) => {
    dispatch(store).registerMenuItem(menuItem.id, menuItem);
  });
  (routes ?? []).forEach((route) => {
    dispatch(store).registerRoute(route);
  });
  if (dashboardLink) {
    dispatch(store).setDashboardLink(dashboardLink);
  }
  for (const moduleId of initModules ?? []) {
    const module = await import(moduleId);
    await module.init();
  }
  const rootElement = document.getElementById(mountId);
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
      /* @__PURE__ */ jsx(StrictMode, { children: /* @__PURE__ */ jsx(App, {}) })
    );
  }
}
async function initSinglePage({
  mountId,
  routes
}) {
  (routes ?? []).forEach((route) => {
    dispatch(store).registerRoute(route);
  });
  const rootElement = document.getElementById(mountId);
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
      /* @__PURE__ */ jsx(StrictMode, { children: /* @__PURE__ */ jsx(App, { rootComponent: RootSinglePage }) })
    );
  }
}
export {
  init,
  initSinglePage
};
//# sourceMappingURL=index.mjs.map
