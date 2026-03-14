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

// packages/edit-site/src/components/sidebar/index.js
var sidebar_exports = {};
__export(sidebar_exports, {
  SidebarContent: () => SidebarContent,
  SidebarNavigationContext: () => SidebarNavigationContext,
  SidebarNavigationProvider: () => SidebarNavigationProvider
});
module.exports = __toCommonJS(sidebar_exports);
var import_clsx = __toESM(require("clsx"));
var import_element = require("@wordpress/element");
var import_dom = require("@wordpress/dom");
var import_jsx_runtime = require("react/jsx-runtime");
var SidebarNavigationContext = (0, import_element.createContext)(() => {
});
SidebarNavigationContext.displayName = "SidebarNavigationContext";
function focusSidebarElement(el, direction, focusSelector) {
  let elementToFocus;
  if (direction === "back" && focusSelector) {
    elementToFocus = el.querySelector(focusSelector);
  }
  if (direction !== null && !elementToFocus) {
    const [firstTabbable] = import_dom.focus.tabbable.find(el);
    elementToFocus = firstTabbable ?? el;
  }
  elementToFocus?.focus();
}
function createNavState() {
  let state = {
    direction: null,
    focusSelector: null
  };
  return {
    get() {
      return state;
    },
    navigate(direction, focusSelector = null) {
      state = {
        direction,
        focusSelector: direction === "forward" && focusSelector ? focusSelector : state.focusSelector
      };
    }
  };
}
function SidebarContentWrapper({ children, shouldAnimate }) {
  const navState = (0, import_element.useContext)(SidebarNavigationContext);
  const wrapperRef = (0, import_element.useRef)();
  const [navAnimation, setNavAnimation] = (0, import_element.useState)(null);
  (0, import_element.useLayoutEffect)(() => {
    const { direction, focusSelector } = navState.get();
    focusSidebarElement(wrapperRef.current, direction, focusSelector);
    setNavAnimation(direction);
  }, [navState]);
  const wrapperCls = (0, import_clsx.default)(
    "edit-site-sidebar__screen-wrapper",
    /*
     * Some panes do not have sub-panes and therefore
     * should not animate when clicked on.
     */
    shouldAnimate ? {
      "slide-from-left": navAnimation === "back",
      "slide-from-right": navAnimation === "forward"
    } : {}
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: wrapperRef, className: wrapperCls, children });
}
function SidebarNavigationProvider({ children }) {
  const [navState] = (0, import_element.useState)(createNavState);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarNavigationContext.Provider, { value: navState, children });
}
function SidebarContent({ routeKey, shouldAnimate, children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "edit-site-sidebar__content", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    SidebarContentWrapper,
    {
      shouldAnimate,
      children
    },
    routeKey
  ) });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SidebarContent,
  SidebarNavigationContext,
  SidebarNavigationProvider
});
//# sourceMappingURL=index.cjs.map
