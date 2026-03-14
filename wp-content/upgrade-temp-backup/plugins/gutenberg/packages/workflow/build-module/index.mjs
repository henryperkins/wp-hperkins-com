// packages/workflow/src/index.js
import { createRoot, createElement } from "@wordpress/element";
import { WorkflowMenu } from "./components/workflow-menu.mjs";
var root = document.createElement("div");
document.body.appendChild(root);
createRoot(root).render(createElement(WorkflowMenu));
//# sourceMappingURL=index.mjs.map
