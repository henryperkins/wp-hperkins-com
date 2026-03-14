// packages/customize-widgets/src/controls/sidebar-control.js
import { dispatch } from "@wordpress/data";
import SidebarAdapter from "../components/sidebar-block-editor/sidebar-adapter.mjs";
import getInserterOuterSection from "./inserter-outer-section.mjs";
import { store as customizeWidgetsStore } from "../store/index.mjs";
var getInserterId = (controlId) => `widgets-inserter-${controlId}`;
function getSidebarControl() {
  const {
    wp: { customize }
  } = window;
  return class SidebarControl extends customize.Control {
    constructor(...args) {
      super(...args);
      this.subscribers = /* @__PURE__ */ new Set();
    }
    ready() {
      const InserterOuterSection = getInserterOuterSection();
      this.inserter = new InserterOuterSection(
        getInserterId(this.id),
        {}
      );
      customize.section.add(this.inserter);
      this.sectionInstance = customize.section(this.section());
      this.inspector = this.sectionInstance.inspector;
      this.sidebarAdapter = new SidebarAdapter(this.setting, customize);
    }
    subscribe(callback) {
      this.subscribers.add(callback);
      return () => {
        this.subscribers.delete(callback);
      };
    }
    onChangeSectionExpanded(expanded, args) {
      if (!args.unchanged) {
        if (!expanded) {
          dispatch(customizeWidgetsStore).setIsInserterOpened(
            false
          );
        }
        this.subscribers.forEach(
          (subscriber) => subscriber(expanded, args)
        );
      }
    }
  };
}
export {
  getSidebarControl as default
};
//# sourceMappingURL=sidebar-control.mjs.map
