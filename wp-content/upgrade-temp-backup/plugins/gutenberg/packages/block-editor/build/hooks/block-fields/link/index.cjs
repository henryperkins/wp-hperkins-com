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

// packages/block-editor/src/hooks/block-fields/link/index.js
var link_exports = {};
__export(link_exports, {
  NEW_TAB_REL: () => NEW_TAB_REL,
  NEW_TAB_TARGET: () => NEW_TAB_TARGET,
  NOFOLLOW_REL: () => NOFOLLOW_REL,
  default: () => Link,
  getUpdatedLinkAttributes: () => getUpdatedLinkAttributes
});
module.exports = __toCommonJS(link_exports);
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_url = require("@wordpress/url");
var import_link_control = __toESM(require("../../../components/link-control/index.cjs"));
var import_use_inspector_popover_placement = require("../use-inspector-popover-placement.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var NEW_TAB_REL = "noreferrer noopener";
var NEW_TAB_TARGET = "_blank";
var NOFOLLOW_REL = "nofollow";
function getUpdatedLinkAttributes({
  rel = "",
  url = "",
  opensInNewTab,
  nofollow
}) {
  let newLinkTarget;
  let updatedRel = rel;
  if (opensInNewTab) {
    newLinkTarget = NEW_TAB_TARGET;
    updatedRel = updatedRel?.includes(NEW_TAB_REL) ? updatedRel : updatedRel + ` ${NEW_TAB_REL}`;
  } else {
    const relRegex = new RegExp(`\\b${NEW_TAB_REL}\\s*`, "g");
    updatedRel = updatedRel?.replace(relRegex, "").trim();
  }
  if (nofollow) {
    updatedRel = updatedRel?.includes(NOFOLLOW_REL) ? updatedRel : (updatedRel + ` ${NOFOLLOW_REL}`).trim();
  } else {
    const relRegex = new RegExp(`\\b${NOFOLLOW_REL}\\s*`, "g");
    updatedRel = updatedRel?.replace(relRegex, "").trim();
  }
  return {
    url: (0, import_url.prependHTTP)(url),
    linkTarget: newLinkTarget,
    rel: updatedRel || void 0
  };
}
function Link({ data, field, onChange }) {
  const [isLinkControlOpen, setIsLinkControlOpen] = (0, import_element.useState)(false);
  const { popoverProps } = (0, import_use_inspector_popover_placement.useInspectorPopoverPlacement)({
    isControl: true
  });
  const value = field.getValue({ item: data });
  const url = value?.url;
  const rel = value?.rel || "";
  const target = value?.linkTarget;
  const opensInNewTab = target === NEW_TAB_TARGET;
  const nofollow = rel === NOFOLLOW_REL;
  const linkValue = (0, import_element.useMemo)(
    () => ({ url, opensInNewTab, nofollow }),
    [url, opensInNewTab, nofollow]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Button,
      {
        __next40pxDefaultSize: true,
        className: "block-editor-content-only-controls__link",
        onClick: () => {
          setIsLinkControlOpen(true);
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          import_components.__experimentalGrid,
          {
            rowGap: 0,
            columnGap: 8,
            templateColumns: "24px 1fr",
            className: "block-editor-content-only-controls__link-row",
            children: [
              url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Icon, { icon: import_icons.link, size: 24 }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "block-editor-content-only-controls__link-title", children: url })
              ] }),
              !url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_components.Icon,
                  {
                    icon: import_icons.link,
                    size: 24,
                    style: { opacity: 0.3 }
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "block-editor-content-only-controls__link-title", children: (0, import_i18n.__)("Link") })
              ] })
            ]
          }
        )
      }
    ),
    isLinkControlOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Popover,
      {
        onClose: () => {
          setIsLinkControlOpen(false);
        },
        ...popoverProps ?? {},
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_link_control.default,
          {
            value: linkValue,
            onChange: (newValues) => {
              const updatedAttrs = getUpdatedLinkAttributes({
                rel,
                ...newValues
              });
              onChange(
                field.setValue({
                  item: data,
                  value: updatedAttrs
                })
              );
            },
            onRemove: () => {
              onChange(
                field.setValue({
                  item: data,
                  value: {}
                })
              );
            }
          }
        )
      }
    )
  ] });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  NEW_TAB_REL,
  NEW_TAB_TARGET,
  NOFOLLOW_REL,
  getUpdatedLinkAttributes
});
//# sourceMappingURL=index.cjs.map
