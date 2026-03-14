// packages/customize-widgets/src/controls/inspector-section.js
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
export {
  getInspectorSection as default
};
//# sourceMappingURL=inspector-section.mjs.map
