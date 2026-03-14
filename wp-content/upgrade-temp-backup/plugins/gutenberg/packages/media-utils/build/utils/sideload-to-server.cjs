"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/media-utils/src/utils/sideload-to-server.ts
var sideload_to_server_exports = {};
__export(sideload_to_server_exports, {
  sideloadToServer: () => sideloadToServer
});
module.exports = __toCommonJS(sideload_to_server_exports);
var import_api_fetch = __toESM(require("@wordpress/api-fetch"));
var import_flatten_form_data = require("./flatten-form-data.cjs");
var import_transform_attachment = require("./transform-attachment.cjs");
async function sideloadToServer(file, attachmentId, additionalData = {}, signal) {
  const data = new FormData();
  data.append("file", file, file.name || file.type.replace("/", "."));
  for (const [key, value] of Object.entries(additionalData)) {
    (0, import_flatten_form_data.flattenFormData)(
      data,
      key,
      value
    );
  }
  return (0, import_transform_attachment.transformAttachment)(
    await (0, import_api_fetch.default)({
      path: `/wp/v2/media/${attachmentId}/sideload`,
      body: data,
      method: "POST",
      signal
    })
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  sideloadToServer
});
//# sourceMappingURL=sideload-to-server.cjs.map
