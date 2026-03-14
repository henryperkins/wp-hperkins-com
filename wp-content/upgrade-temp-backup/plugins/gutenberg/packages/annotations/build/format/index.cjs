// packages/annotations/src/format/index.js
var import_rich_text = require("@wordpress/rich-text");
var import_annotation = require("./annotation.cjs");
var { name, ...settings } = import_annotation.annotation;
(0, import_rich_text.registerFormatType)(name, settings);
//# sourceMappingURL=index.cjs.map
