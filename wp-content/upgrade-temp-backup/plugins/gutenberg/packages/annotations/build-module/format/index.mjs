// packages/annotations/src/format/index.js
import { registerFormatType } from "@wordpress/rich-text";
import { annotation } from "./annotation.mjs";
var { name, ...settings } = annotation;
registerFormatType(name, settings);
//# sourceMappingURL=index.mjs.map
