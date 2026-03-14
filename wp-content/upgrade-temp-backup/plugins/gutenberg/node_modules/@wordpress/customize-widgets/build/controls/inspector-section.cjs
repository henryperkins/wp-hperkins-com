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

// packages/customize-widgets/src/controls/inspector-section.js
var inspector_section_exports = {};
__export(inspector_section_exports, {
  default: () => getInspectorSection
});
module.exports = __toCommonJS(inspector_section_exports);
function getInspectorSection() {
  const {
    wp: { customize }
  } = window;
  return class InspectorSection extends customize.Section {
    constructor(id, options) {
      super(id, options);
      this.parentSection = options.parentSection;
      this.returnFocusWhenClose = null;
      this._isOpen = false;
    }
    get isOpen() {
      return this._isOpen;
    }
    set isOpen(value) {
      this._isOpen = value;
      this.triggerActiveCallbacks();
    }
    ready() {
      this.contentContainer[0].classList.add(
        "customize-widgets-layout__inspector"
      );
    }
    isContextuallyActive() {
      return this.isOpen;
    }
    onChangeExpanded(expanded, args) {
      super.onChangeExpanded(expanded, args);
      if (this.parentSection && !args.unchanged) {
        if (expanded) {
          this.parentSection.collapse({
            manualTransition: true
          });
        } else {
          this.parentSection.expand({
            manualTransition: true,
            completeCallback: () => {
              if (this.returnFocusWhenClose && !this.contentContainer[0].contains(
                this.returnFocusWhenClose
              )) {
                this.returnFocusWhenClose.focus();
              }
            }
          });
        }
      }
    }
    open({ returnFocusWhenClose } = {}) {
      this.isOpen = true;
      this.returnFocusWhenClose = returnFocusWhenClose;
      this.expand({
        allowMultiple: true
      });
    }
    close() {
      this.collapse({
        allowMultiple: true
      });
    }
    collapse(options) {
      this.isOpen = false;
      super.collapse(options);
    }
    triggerActiveCallbacks() {
      this.active.callbacks.fireWith(this.active, [false, true]);
    }
  };
}
//# sourceMappingURL=inspector-section.cjs.map
