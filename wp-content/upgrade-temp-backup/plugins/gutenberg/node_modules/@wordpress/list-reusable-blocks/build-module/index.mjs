// packages/list-reusable-blocks/src/index.js
import { createRoot, StrictMode } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import exportReusableBlock from "./utils/export.mjs";
import ImportDropdown from "./components/import-dropdown/index.mjs";
import { jsx } from "react/jsx-runtime";
document.body.addEventListener("click", (event) => {
  if (!event.target.classList.contains("wp-list-reusable-blocks__export")) {
    return;
  }
  event.preventDefault();
  exportReusableBlock(event.target.dataset.id);
});
document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".page-title-action");
  if (!button) {
    return;
  }
  const showNotice = () => {
    const notice = document.createElement("div");
    notice.className = "notice notice-success is-dismissible";
    notice.innerHTML = `<p>${__("Pattern imported successfully!")}</p>`;
    const headerEnd = document.querySelector(".wp-header-end");
    if (!headerEnd) {
      return;
    }
    headerEnd.parentNode.insertBefore(notice, headerEnd);
  };
  const container = document.createElement("div");
  container.className = "list-reusable-blocks__container";
  button.parentNode.insertBefore(container, button);
  createRoot(container).render(
    /* @__PURE__ */ jsx(StrictMode, { children: /* @__PURE__ */ jsx(ImportDropdown, { onUpload: showNotice }) })
  );
});
//# sourceMappingURL=index.mjs.map
