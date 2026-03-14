// packages/customize-widgets/src/controls/sidebar-section.js
import { __ } from "@wordpress/i18n";
import getInspectorSection from "./inspector-section.mjs";
var getInspectorSectionId = (sidebarId) => `widgets-inspector-${sidebarId}`;
function getSidebarSection() {
  const {
    wp: { customize }
  } = window;
  const reduceMotionMediaQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );
  let isReducedMotion = reduceMotionMediaQuery.matches;
  reduceMotionMediaQuery.addEventListener("change", (event) => {
    isReducedMotion = event.matches;
  });
  return class SidebarSection extends customize.Section {
    ready() {
      const InspectorSection = getInspectorSection();
      this.inspector = new InspectorSection(
        getInspectorSectionId(this.id),
        {
          title: __("Block Settings"),
          parentSection: this,
          customizeAction: [
            __("Customizing"),
            __("Widgets"),
            this.params.title
          ].join(" \u25B8 ")
        }
      );
      customize.section.add(this.inspector);
      this.contentContainer[0].classList.add(
        "customize-widgets__sidebar-section"
      );
    }
    hasSubSectionOpened() {
      return this.inspector.expanded();
    }
    onChangeExpanded(expanded, _args) {
      const controls = this.controls();
      const args = {
        ..._args,
        completeCallback() {
          controls.forEach((control) => {
            control.onChangeSectionExpanded?.(expanded, args);
          });
          _args.completeCallback?.();
        }
      };
      if (args.manualTransition) {
        if (expanded) {
          this.contentContainer.addClass(["busy", "open"]);
          this.contentContainer.removeClass("is-sub-section-open");
          this.contentContainer.closest(".wp-full-overlay").addClass("section-open");
        } else {
          this.contentContainer.addClass([
            "busy",
            "is-sub-section-open"
          ]);
          this.contentContainer.closest(".wp-full-overlay").addClass("section-open");
          this.contentContainer.removeClass("open");
        }
        const handleTransitionEnd = () => {
          this.contentContainer.removeClass("busy");
          args.completeCallback();
        };
        if (isReducedMotion) {
          handleTransitionEnd();
        } else {
          this.contentContainer.one(
            "transitionend",
            handleTransitionEnd
          );
        }
      } else {
        super.onChangeExpanded(expanded, args);
      }
    }
  };
}
export {
  getSidebarSection as default
};
//# sourceMappingURL=sidebar-section.mjs.map
