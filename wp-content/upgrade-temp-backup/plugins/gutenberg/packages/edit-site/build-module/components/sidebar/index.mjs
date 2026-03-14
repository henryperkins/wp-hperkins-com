// packages/edit-site/src/components/sidebar/index.js
import clsx from "clsx";
import {
  createContext,
  useContext,
  useState,
  useRef,
  useLayoutEffect
} from "@wordpress/element";
import { focus } from "@wordpress/dom";
import { jsx } from "react/jsx-runtime";
var SidebarNavigationContext = createContext(() => {
});
SidebarNavigationContext.displayName = "SidebarNavigationContext";
function focusSidebarElement(el, direction, focusSelector) {
  let elementToFocus;
  if (direction === "back" && focusSelector) {
    elementToFocus = el.querySelector(focusSelector);
  }
  if (direction !== null && !elementToFocus) {
    const [firstTabbable] = focus.tabbable.find(el);
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
  const navState = useContext(SidebarNavigationContext);
  const wrapperRef = useRef();
  const [navAnimation, setNavAnimation] = useState(null);
  useLayoutEffect(() => {
    const { direction, focusSelector } = navState.get();
    focusSidebarElement(wrapperRef.current, direction, focusSelector);
    setNavAnimation(direction);
  }, [navState]);
  const wrapperCls = clsx(
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
  return /* @__PURE__ */ jsx("div", { ref: wrapperRef, className: wrapperCls, children });
}
function SidebarNavigationProvider({ children }) {
  const [navState] = useState(createNavState);
  return /* @__PURE__ */ jsx(SidebarNavigationContext.Provider, { value: navState, children });
}
function SidebarContent({ routeKey, shouldAnimate, children }) {
  return /* @__PURE__ */ jsx("div", { className: "edit-site-sidebar__content", children: /* @__PURE__ */ jsx(
    SidebarContentWrapper,
    {
      shouldAnimate,
      children
    },
    routeKey
  ) });
}
export {
  SidebarContent,
  SidebarNavigationContext,
  SidebarNavigationProvider
};
//# sourceMappingURL=index.mjs.map
