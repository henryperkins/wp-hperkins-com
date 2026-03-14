// packages/editor/src/components/collaborators-presence/index.tsx
import {
  Button,
  privateApis as componentsPrivateApis
} from "@wordpress/components";
import { useState } from "@wordpress/element";
import {
  privateApis
} from "@wordpress/core-data";
import { __, sprintf } from "@wordpress/i18n";
import { CollaboratorsList } from "./list.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { getAvatarUrl } from "../collaborators-overlay/get-avatar-url.mjs";
import { getAvatarBorderColor } from "../collab-sidebar/utils.mjs";

// packages/editor/src/components/collaborators-presence/styles/collaborators-presence.scss
if (typeof document !== "undefined" && process.env.NODE_ENV !== "test" && !document.head.querySelector("style[data-wp-hash='75307c1ddf']")) {
  const style = document.createElement("style");
  style.setAttribute("data-wp-hash", "75307c1ddf");
  style.appendChild(document.createTextNode(".editor-collaborators-presence{align-items:center;background:#f0f0f0;border-radius:4px;display:flex;flex-shrink:0;height:32px;margin-right:8px}.editor-collaborators-presence:hover{background-color:#e0e0e0}.editor-collaborators-presence__button.editor-collaborators-presence__button.components-button{align-items:center;background:#0000;border-radius:4px;box-sizing:border-box;color:#2f2f2f;cursor:pointer;display:flex;height:100%;padding:4px;position:relative}.editor-collaborators-presence__button.editor-collaborators-presence__button.components-button:hover{background:#0000;color:#2f2f2f}.editor-collaborators-presence__button.editor-collaborators-presence__button.components-button.is-pressed,.editor-collaborators-presence__button.editor-collaborators-presence__button.components-button.is-pressed:hover{background:#ddd;color:#2f2f2f}.editor-collaborators-presence__button.editor-collaborators-presence__button.components-button:focus:not(:active){box-shadow:inset 0 0 0 var(--wp-admin-border-width-focus,2px) var(--wp-admin-theme-color,#007cba);outline:none}"));
  document.head.appendChild(style);
}

// packages/editor/src/components/collaborators-presence/index.tsx
import { CollaboratorsOverlay } from "../collaborators-overlay/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { useActiveCollaborators } = unlock(privateApis);
var { Avatar, AvatarGroup } = unlock(componentsPrivateApis);
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
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [popoverAnchor, setPopoverAnchor] = useState(
    null
  );
  if (otherActiveCollaborators.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "editor-collaborators-presence", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          __next40pxDefaultSize: true,
          className: "editor-collaborators-presence__button",
          onClick: () => setIsPopoverVisible(!isPopoverVisible),
          isPressed: isPopoverVisible,
          ref: setPopoverAnchor,
          "aria-label": sprintf(
            // translators: %d: number of online collaborators.
            __("Collaborators list, %d online"),
            otherActiveCollaborators.length
          ),
          children: /* @__PURE__ */ jsx(AvatarGroup, { max: 3, children: otherActiveCollaborators.map(
            (collaboratorState) => /* @__PURE__ */ jsx(
              Avatar,
              {
                src: getAvatarUrl(
                  collaboratorState.collaboratorInfo.avatar_urls
                ),
                name: collaboratorState.collaboratorInfo.name,
                borderColor: getAvatarBorderColor(
                  collaboratorState.collaboratorInfo.id
                ),
                size: "small"
              },
              collaboratorState.clientId
            )
          ) })
        }
      ),
      isPopoverVisible && /* @__PURE__ */ jsx(
        CollaboratorsList,
        {
          activeCollaborators: otherActiveCollaborators,
          popoverAnchor,
          setIsPopoverVisible
        }
      )
    ] }),
    /* @__PURE__ */ jsx(CollaboratorsOverlay, { postId, postType })
  ] });
}
export {
  CollaboratorsPresence
};
//# sourceMappingURL=index.mjs.map
