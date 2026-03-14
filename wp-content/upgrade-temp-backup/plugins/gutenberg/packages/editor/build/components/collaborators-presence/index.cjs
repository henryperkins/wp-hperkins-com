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

// packages/editor/src/components/collaborators-presence/index.tsx
var collaborators_presence_exports = {};
__export(collaborators_presence_exports, {
  CollaboratorsPresence: () => CollaboratorsPresence
});
module.exports = __toCommonJS(collaborators_presence_exports);
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_core_data = require("@wordpress/core-data");
var import_i18n = require("@wordpress/i18n");
var import_list = require("./list.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_get_avatar_url = require("../collaborators-overlay/get-avatar-url.cjs");
var import_utils = require("../collab-sidebar/utils.cjs");

// packages/editor/src/components/collaborators-presence/styles/collaborators-presence.scss
if (typeof document !== "undefined" && process.env.NODE_ENV !== "test" && !document.head.querySelector("style[data-wp-hash='75307c1ddf']")) {
  const style = document.createElement("style");
  style.setAttribute("data-wp-hash", "75307c1ddf");
  style.appendChild(document.createTextNode(".editor-collaborators-presence{align-items:center;background:#f0f0f0;border-radius:4px;display:flex;flex-shrink:0;height:32px;margin-right:8px}.editor-collaborators-presence:hover{background-color:#e0e0e0}.editor-collaborators-presence__button.editor-collaborators-presence__button.components-button{align-items:center;background:#0000;border-radius:4px;box-sizing:border-box;color:#2f2f2f;cursor:pointer;display:flex;height:100%;padding:4px;position:relative}.editor-collaborators-presence__button.editor-collaborators-presence__button.components-button:hover{background:#0000;color:#2f2f2f}.editor-collaborators-presence__button.editor-collaborators-presence__button.components-button.is-pressed,.editor-collaborators-presence__button.editor-collaborators-presence__button.components-button.is-pressed:hover{background:#ddd;color:#2f2f2f}.editor-collaborators-presence__button.editor-collaborators-presence__button.components-button:focus:not(:active){box-shadow:inset 0 0 0 var(--wp-admin-border-width-focus,2px) var(--wp-admin-theme-color,#007cba);outline:none}"));
  document.head.appendChild(style);
}

// packages/editor/src/components/collaborators-presence/index.tsx
var import_collaborators_overlay = require("../collaborators-overlay/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { useActiveCollaborators } = (0, import_lock_unlock.unlock)(import_core_data.privateApis);
var { Avatar, AvatarGroup } = (0, import_lock_unlock.unlock)(import_components.privateApis);
function CollaboratorsPresence({
  postId,
  postType
}) {
  const activeCollaborators = useActiveCollaborators(
    postId,
    postType
  );
  const otherActiveCollaborators = activeCollaborators.filter(
    (collaborator) => !collaborator.isMe
  );
  const [isPopoverVisible, setIsPopoverVisible] = (0, import_element.useState)(false);
  const [popoverAnchor, setPopoverAnchor] = (0, import_element.useState)(
    null
  );
  if (otherActiveCollaborators.length === 0) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "editor-collaborators-presence", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.Button,
        {
          __next40pxDefaultSize: true,
          className: "editor-collaborators-presence__button",
          onClick: () => setIsPopoverVisible(!isPopoverVisible),
          isPressed: isPopoverVisible,
          ref: setPopoverAnchor,
          "aria-label": (0, import_i18n.sprintf)(
            // translators: %d: number of online collaborators.
            (0, import_i18n.__)("Collaborators list, %d online"),
            otherActiveCollaborators.length
          ),
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarGroup, { max: 3, children: otherActiveCollaborators.map(
            (collaboratorState) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Avatar,
              {
                src: (0, import_get_avatar_url.getAvatarUrl)(
                  collaboratorState.collaboratorInfo.avatar_urls
                ),
                name: collaboratorState.collaboratorInfo.name,
                borderColor: (0, import_utils.getAvatarBorderColor)(
                  collaboratorState.collaboratorInfo.id
                ),
                size: "small"
              },
              collaboratorState.clientId
            )
          ) })
        }
      ),
      isPopoverVisible && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_list.CollaboratorsList,
        {
          activeCollaborators: otherActiveCollaborators,
          popoverAnchor,
          setIsPopoverVisible
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_collaborators_overlay.CollaboratorsOverlay, { postId, postType })
  ] });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CollaboratorsPresence
});
//# sourceMappingURL=index.cjs.map
