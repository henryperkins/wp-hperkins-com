// packages/format-library/src/index.js
import { registerFormatType } from "@wordpress/rich-text";
import formats from "./default-formats.mjs";
formats.forEach(
  ({ name, ...settings }) => registerFormatType(name, settings)
);
//# sourceMappingURL=index.mjs.map
