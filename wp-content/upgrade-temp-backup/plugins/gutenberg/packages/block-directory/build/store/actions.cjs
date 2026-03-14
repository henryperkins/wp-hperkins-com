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

// packages/block-directory/src/store/actions.js
var actions_exports = {};
__export(actions_exports, {
  addInstalledBlockType: () => addInstalledBlockType,
  clearErrorNotice: () => clearErrorNotice,
  fetchDownloadableBlocks: () => fetchDownloadableBlocks,
  installBlockType: () => installBlockType,
  receiveDownloadableBlocks: () => receiveDownloadableBlocks,
  removeInstalledBlockType: () => removeInstalledBlockType,
  setErrorNotice: () => setErrorNotice,
  setIsInstalling: () => setIsInstalling,
  uninstallBlockType: () => uninstallBlockType
});
module.exports = __toCommonJS(actions_exports);
var import_blocks = require("@wordpress/blocks");
var import_i18n = require("@wordpress/i18n");
var import_api_fetch = __toESM(require("@wordpress/api-fetch"));
var import_notices = require("@wordpress/notices");
var import_url = require("@wordpress/url");
var import_load_assets = require("./load-assets.cjs");
var import_get_plugin_url = __toESM(require("./utils/get-plugin-url.cjs"));
function fetchDownloadableBlocks(filterValue) {
  return { type: "FETCH_DOWNLOADABLE_BLOCKS", filterValue };
}
function receiveDownloadableBlocks(downloadableBlocks, filterValue) {
  return {
    type: "RECEIVE_DOWNLOADABLE_BLOCKS",
    downloadableBlocks,
    filterValue
  };
}
var installBlockType = (block) => async ({ registry, dispatch }) => {
  const { id, name } = block;
  let success = false;
  dispatch.clearErrorNotice(id);
  try {
    dispatch.setIsInstalling(id, true);
    const url = (0, import_get_plugin_url.default)(block);
    let links = {};
    if (url) {
      await (0, import_api_fetch.default)({
        method: "PUT",
        url,
        data: { status: "active" }
      });
    } else {
      const response = await (0, import_api_fetch.default)({
        method: "POST",
        path: "wp/v2/plugins",
        data: { slug: id, status: "active" }
      });
      links = response._links;
    }
    dispatch.addInstalledBlockType({
      ...block,
      links: { ...block.links, ...links }
    });
    const metadataFields = [
      "api_version",
      "title",
      "category",
      "parent",
      "ancestor",
      "icon",
      "description",
      "keywords",
      "attributes",
      "provides_context",
      "uses_context",
      "selectors",
      "supports",
      "styles",
      "example",
      "variations",
      "allowed_blocks",
      "block_hooks"
    ];
    await (0, import_api_fetch.default)({
      path: (0, import_url.addQueryArgs)(`/wp/v2/block-types/${name}`, {
        _fields: metadataFields
      })
    }).catch(() => {
    }).then((response) => {
      if (!response) {
        return;
      }
      (0, import_blocks.unstable__bootstrapServerSideBlockDefinitions)({
        [name]: Object.fromEntries(
          Object.entries(response).filter(
            ([key]) => metadataFields.includes(key)
          )
        )
      });
    });
    await (0, import_load_assets.loadAssets)();
    const registeredBlocks = registry.select(import_blocks.store).getBlockTypes();
    if (!registeredBlocks.some((i) => i.name === name)) {
      throw new Error(
        (0, import_i18n.__)("Error registering block. Try reloading the page.")
      );
    }
    registry.dispatch(import_notices.store).createInfoNotice(
      (0, import_i18n.sprintf)(
        // translators: %s is the block title.
        (0, import_i18n.__)("Block %s installed and added."),
        block.title
      ),
      {
        speak: true,
        type: "snackbar"
      }
    );
    success = true;
  } catch (error) {
    let message = error.message || (0, import_i18n.__)("An error occurred.");
    let isFatal = error instanceof Error;
    const fatalAPIErrors = {
      folder_exists: (0, import_i18n.__)(
        "This block is already installed. Try reloading the page."
      ),
      unable_to_connect_to_filesystem: (0, import_i18n.__)(
        "Error installing block. You can reload the page and try again."
      )
    };
    if (fatalAPIErrors[error.code]) {
      isFatal = true;
      message = fatalAPIErrors[error.code];
    }
    dispatch.setErrorNotice(id, message, isFatal);
    registry.dispatch(import_notices.store).createErrorNotice(message, {
      speak: true,
      isDismissible: true
    });
  }
  dispatch.setIsInstalling(id, false);
  return success;
};
var uninstallBlockType = (block) => async ({ registry, dispatch }) => {
  try {
    const url = (0, import_get_plugin_url.default)(block);
    await (0, import_api_fetch.default)({
      method: "PUT",
      url,
      data: { status: "inactive" }
    });
    await (0, import_api_fetch.default)({
      method: "DELETE",
      url
    });
    dispatch.removeInstalledBlockType(block);
  } catch (error) {
    registry.dispatch(import_notices.store).createErrorNotice(
      error.message || (0, import_i18n.__)("An error occurred.")
    );
  }
};
function addInstalledBlockType(item) {
  return {
    type: "ADD_INSTALLED_BLOCK_TYPE",
    item
  };
}
function removeInstalledBlockType(item) {
  return {
    type: "REMOVE_INSTALLED_BLOCK_TYPE",
    item
  };
}
function setIsInstalling(blockId, isInstalling) {
  return {
    type: "SET_INSTALLING_BLOCK",
    blockId,
    isInstalling
  };
}
function setErrorNotice(blockId, message, isFatal = false) {
  return {
    type: "SET_ERROR_NOTICE",
    blockId,
    message,
    isFatal
  };
}
function clearErrorNotice(blockId) {
  return {
    type: "CLEAR_ERROR_NOTICE",
    blockId
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addInstalledBlockType,
  clearErrorNotice,
  fetchDownloadableBlocks,
  installBlockType,
  receiveDownloadableBlocks,
  removeInstalledBlockType,
  setErrorNotice,
  setIsInstalling,
  uninstallBlockType
});
//# sourceMappingURL=actions.cjs.map
