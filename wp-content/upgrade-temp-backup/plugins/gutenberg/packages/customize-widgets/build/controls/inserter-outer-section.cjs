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

// packages/customize-widgets/src/controls/inserter-outer-section.js
var inserter_outer_section_exports = {};
__export(inserter_outer_section_exports, {
  default: () => getInserterOuterSection
});
module.exports = __toCommonJS(inserter_outer_section_exports);
var import_keycodes = require("@wordpress/keycodes");
var import_dom = require("@wordpress/dom");
var import_data = require("@wordpress/data");
var import_store = require("../store/index.cjs");
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
          if (this.expanded() && (event.keyCode === import_keycodes.ESCAPE || event.code === "Escape") && !event.defaultPrevented) {
            event.preventDefault();
            event.stopPropagation();
            (0, import_data.dispatch)(import_store.store).setIsInserterOpened(
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
          (0, import_data.dispatch)(import_store.store).setIsInserterOpened(
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
            const searchBox = import_dom.focus.tabbable.find(contentContainer)[1];
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
//# sourceMappingURL=inserter-outer-section.cjs.map
