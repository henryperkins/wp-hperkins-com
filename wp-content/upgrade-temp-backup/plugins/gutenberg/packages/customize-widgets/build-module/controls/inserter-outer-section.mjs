// packages/customize-widgets/src/controls/inserter-outer-section.js
import { ESCAPE } from "@wordpress/keycodes";
import { focus } from "@wordpress/dom";
import { dispatch } from "@wordpress/data";
import { store as customizeWidgetsStore } from "../store/index.mjs";
function getInserterOuterSection() {
  const {
    wp: { customize }
  } = window;
  const OuterSection = customize.OuterSection;
  customize.OuterSection = class extends OuterSection {
    onChangeExpanded(expanded, args) {
      if (expanded) {
        customize.section.each((section) => {
          if (section.params.type === "outer" && section.id !== this.id) {
            if (section.expanded()) {
              section.collapse();
            }
          }
        });
      }
      return super.onChangeExpanded(expanded, args);
    }
  };
  customize.sectionConstructor.outer = customize.OuterSection;
  return class InserterOuterSection extends customize.OuterSection {
    constructor(...args) {
      super(...args);
      this.params.type = "outer";
      this.activeElementBeforeExpanded = null;
      const ownerWindow = this.contentContainer[0].ownerDocument.defaultView;
      ownerWindow.addEventListener(
        "keydown",
        (event) => {
          if (this.expanded() && (event.keyCode === ESCAPE || event.code === "Escape") && !event.defaultPrevented) {
            event.preventDefault();
            event.stopPropagation();
            dispatch(customizeWidgetsStore).setIsInserterOpened(
              false
            );
          }
        },
        // Use capture mode to make this run before other event listeners.
        true
      );
      this.contentContainer.addClass("widgets-inserter");
      this.isFromInternalAction = false;
      this.expanded.bind(() => {
        if (!this.isFromInternalAction) {
          dispatch(customizeWidgetsStore).setIsInserterOpened(
            this.expanded()
          );
        }
        this.isFromInternalAction = false;
      });
    }
    open() {
      if (!this.expanded()) {
        const contentContainer = this.contentContainer[0];
        this.activeElementBeforeExpanded = contentContainer.ownerDocument.activeElement;
        this.isFromInternalAction = true;
        this.expand({
          completeCallback() {
            const searchBox = focus.tabbable.find(contentContainer)[1];
            if (searchBox) {
              searchBox.focus();
            }
          }
        });
      }
    }
    close() {
      if (this.expanded()) {
        const contentContainer = this.contentContainer[0];
        const activeElement = contentContainer.ownerDocument.activeElement;
        this.isFromInternalAction = true;
        this.collapse({
          completeCallback() {
            if (contentContainer.contains(activeElement)) {
              if (this.activeElementBeforeExpanded) {
                this.activeElementBeforeExpanded.focus();
              }
            }
          }
        });
      }
    }
  };
}
export {
  getInserterOuterSection as default
};
//# sourceMappingURL=inserter-outer-section.mjs.map
