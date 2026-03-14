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

// packages/editor/src/components/collaborators-presence/list.tsx
var list_exports = {};
__export(list_exports, {
  CollaboratorsList: () => CollaboratorsList
});
module.exports = __toCommonJS(list_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_icons = require("@wordpress/icons");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_get_avatar_url = require("../collaborators-overlay/get-avatar-url.cjs");
var import_utils = require("../collab-sidebar/utils.cjs");

// packages/editor/src/components/collaborators-presence/styles/collaborators-list.scss
if (typeof document !== "undefined" && process.env.NODE_ENV !== "test" && !document.head.querySelector("style[data-wp-hash='0d3429a67b']")) {
  const style = document.createElement("style");
  style.setAttribute("data-wp-hash", "0d3429a67b");
  style.appendChild(document.createTextNode(".editor-collaborators-presence__list.components-popover .components-popover__content{background:#fff;border:1px solid #ddd;border-radius:8px;border-width:1px 0 0 1px;box-shadow:0 1px 2px #0000000d,0 2px 3px #0000000a,0 6px 6px #00000008,0 8px 8px #00000005}.editor-collaborators-presence__list.components-popover .editor-collaborators-presence__list-content{min-width:280px}.editor-collaborators-presence__list.components-popover .editor-collaborators-presence__list-header{align-items:center;display:flex;justify-content:space-between;padding:0 16px}.editor-collaborators-presence__list.components-popover .editor-collaborators-presence__list-header-title{font-size:13px;font-weight:499;line-height:20px;padding:14px 0;text-transform:uppercase}.editor-collaborators-presence__list.components-popover .editor-collaborators-presence__list-header-title span{color:#757575}.editor-collaborators-presence__list.components-popover .editor-collaborators-presence__list-header-action{padding:8px 0}.editor-collaborators-presence__list.components-popover .editor-collaborators-presence__list-header-action button{color:#1e1e1e;height:24px;padding:0;width:24px}.editor-collaborators-presence__list.components-popover .editor-collaborators-presence__list-items{display:flex;flex-direction:column;padding:0 10px 16px}.editor-collaborators-presence__list.components-popover .editor-collaborators-presence__list-item{all:unset;align-items:center;border-radius:12px;box-sizing:border-box;cursor:pointer;display:flex;gap:8px;padding:6px;transition:background-color .2s ease;width:100%}.editor-collaborators-presence__list.components-popover .editor-collaborators-presence__list-item:hover:not(:disabled){background-color:#0000000d}.editor-collaborators-presence__list.components-popover .editor-collaborators-presence__list-item:active:not(:disabled){background-color:#00000014}.editor-collaborators-presence__list.components-popover .editor-collaborators-presence__list-item:focus-visible{outline:2px solid var(--wp-admin-theme-color,#007cba);outline-offset:-2px}.editor-collaborators-presence__list.components-popover .editor-collaborators-presence__list-item:disabled{cursor:default}.editor-collaborators-presence__list.components-popover .editor-collaborators-presence__list-item-info{display:flex;flex:1;flex-direction:column;font-size:12px;line-height:16px}"));
  document.head.appendChild(style);
}

// packages/editor/src/components/collaborators-presence/list.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var { Avatar } = (0, import_lock_unlock.unlock)(import_components.privateApis);
function CollaboratorsList({
  activeCollaborators,
  popoverAnchor,
  setIsPopoverVisible
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Popover,
    {
      anchor: popoverAnchor,
      placement: "bottom",
      offset: 8,
      className: "editor-collaborators-presence__list",
      onClose: () => setIsPopoverVisible(false),
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "editor-collaborators-presence__list-content", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "editor-collaborators-presence__list-header", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "editor-collaborators-presence__list-header-title", children: [
            (0, import_i18n.__)("Collaborators"),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
              " ",
              activeCollaborators.length,
              " "
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "editor-collaborators-presence__list-header-action", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              __next40pxDefaultSize: true,
              icon: import_icons.close,
              iconSize: 16,
              label: (0, import_i18n.__)("Close Collaborators List"),
              onClick: () => setIsPopoverVisible(false)
            }
          ) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "editor-collaborators-presence__list-items", children: activeCollaborators.map((collaboratorState) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "button",
          {
            className: "editor-collaborators-presence__list-item",
            disabled: true,
            style: {
              opacity: collaboratorState.isConnected ? 1 : 0.5
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Avatar,
                {
                  src: (0, import_get_avatar_url.getAvatarUrl)(
                    collaboratorState.collaboratorInfo.avatar_urls
                  ),
                  name: collaboratorState.collaboratorInfo.name,
                  borderColor: (0, import_utils.getAvatarBorderColor)(
                    collaboratorState.collaboratorInfo.id
                  )
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "editor-collaborators-presence__list-item-info", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "editor-collaborators-presence__list-item-name", children: collaboratorState.collaboratorInfo.name }) })
            ]
          },
          collaboratorState.clientId
        )) })
      ] })
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CollaboratorsList
});
//# sourceMappingURL=list.cjs.map
