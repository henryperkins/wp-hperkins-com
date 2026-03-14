// packages/list-reusable-blocks/src/components/import-dropdown/index.js
import { pipe } from "@wordpress/compose";
import { __ } from "@wordpress/i18n";
import { Dropdown, Button } from "@wordpress/components";
import ImportForm from "../import-form/index.mjs";
import { jsx } from "react/jsx-runtime";
function ImportDropdown({ onUpload }) {
  return /* @__PURE__ */ jsx(
    Dropdown,
    {
      popoverProps: { placement: "bottom-start" },
      contentClassName: "list-reusable-blocks-import-dropdown__content",
      renderToggle: ({ isOpen, onToggle }) => /* @__PURE__ */ jsx(
        Button,
        {
          size: "compact",
          className: "list-reusable-blocks-import-dropdown__button",
          "aria-expanded": isOpen,
          onClick: onToggle,
          variant: "primary",
          children: __("Import from JSON")
        }
      ),
      renderContent: ({ onClose }) => /* @__PURE__ */ jsx(ImportForm, { onUpload: pipe(onClose, onUpload) })
    }
  );
}
var import_dropdown_default = ImportDropdown;
export {
  import_dropdown_default as default
};
//# sourceMappingURL=index.mjs.map
