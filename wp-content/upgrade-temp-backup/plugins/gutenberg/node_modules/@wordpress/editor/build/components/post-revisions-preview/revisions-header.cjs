"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/components/post-revisions-preview/revisions-header.js
var revisions_header_exports = {};
__export(revisions_header_exports, {
  default: () => revisions_header_default
});
module.exports = __toCommonJS(revisions_header_exports);
var import_data = require("@wordpress/data");
var import_components = require("@wordpress/components");
var import_interface = require("@wordpress/interface");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_header_skeleton = __toESM(require("../header/header-skeleton.cjs"));
var import_more_menu = __toESM(require("../more-menu/index.cjs"));
var import_post_preview_button = __toESM(require("../post-preview-button/index.cjs"));
var import_revisions_slider = __toESM(require("./revisions-slider.cjs"));
var import_store = require("../../store/index.cjs");
var import_constants = require("../sidebar/constants.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function RevisionsHeader({ showDiff, onToggleDiff }) {
  const { currentRevisionId, sidebarIsOpened } = (0, import_data.useSelect)((select) => {
    return {
      currentRevisionId: (0, import_lock_unlock.unlock)(
        select(import_store.store)
      ).getCurrentRevisionId(),
      sidebarIsOpened: !!select(import_interface.store).getActiveComplementaryArea(
        "core"
      )
    };
  }, []);
  const { setCurrentRevisionId, restoreRevision } = (0, import_lock_unlock.unlock)(
    (0, import_data.useDispatch)(import_store.store)
  );
  const { enableComplementaryArea, disableComplementaryArea } = (0, import_data.useDispatch)(import_interface.store);
  const canRestore = !!currentRevisionId;
  const handleRestore = () => {
    if (currentRevisionId) {
      restoreRevision(currentRevisionId);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_header_skeleton.default,
    {
      className: "editor-revisions-header",
      toolbar: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.Button,
        {
          __next40pxDefaultSize: true,
          size: "compact",
          icon: import_icons.seen,
          label: (0, import_i18n._x)("Show changes", "revisions"),
          isPressed: showDiff,
          onClick: onToggleDiff
        }
      ),
      center: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_revisions_slider.default, {}),
      settings: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_preview_button.default, { className: "editor-header__post-preview-button" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            __next40pxDefaultSize: true,
            icon: (0, import_i18n.isRTL)() ? import_icons.drawerLeft : import_icons.drawerRight,
            label: (0, import_i18n._x)("Settings", "panel button label"),
            isPressed: sidebarIsOpened,
            "aria-expanded": sidebarIsOpened,
            onClick: () => {
              if (sidebarIsOpened) {
                disableComplementaryArea("core");
              } else {
                enableComplementaryArea(
                  "core",
                  import_constants.sidebars.document
                );
              }
            },
            size: "compact"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            __next40pxDefaultSize: true,
            variant: "secondary",
            size: "compact",
            onClick: () => setCurrentRevisionId(null),
            children: (0, import_i18n.__)("Exit")
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            __next40pxDefaultSize: true,
            accessibleWhenDisabled: true,
            variant: "primary",
            size: "compact",
            className: "editor-revisions-header__restore-button",
            disabled: !canRestore,
            onClick: handleRestore,
            children: (0, import_i18n.__)("Restore")
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_more_menu.default, { disabled: true })
      ] })
    }
  );
}
var revisions_header_default = RevisionsHeader;
//# sourceMappingURL=revisions-header.cjs.map
