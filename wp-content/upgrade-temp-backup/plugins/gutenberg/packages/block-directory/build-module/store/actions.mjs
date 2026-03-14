// packages/block-directory/src/store/actions.js
import {
  store as blocksStore,
  unstable__bootstrapServerSideBlockDefinitions
} from "@wordpress/blocks";
import { __, sprintf } from "@wordpress/i18n";
import apiFetch from "@wordpress/api-fetch";
import { store as noticesStore } from "@wordpress/notices";
import { addQueryArgs } from "@wordpress/url";
import { loadAssets } from "./load-assets.mjs";
import getPluginUrl from "./utils/get-plugin-url.mjs";
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
    const url = getPluginUrl(block);
    let links = {};
    if (url) {
      await apiFetch({
        method: "PUT",
        url,
        data: { status: "active" }
      });
    } else {
      const response = await apiFetch({
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
    await apiFetch({
      path: addQueryArgs(`/wp/v2/block-types/${name}`, {
        _fields: metadataFields
      })
    }).catch(() => {
    }).then((response) => {
      if (!response) {
        return;
      }
      unstable__bootstrapServerSideBlockDefinitions({
        [name]: Object.fromEntries(
          Object.entries(response).filter(
            ([key]) => metadataFields.includes(key)
          )
        )
      });
    });
    await loadAssets();
    const registeredBlocks = registry.select(blocksStore).getBlockTypes();
    if (!registeredBlocks.some((i) => i.name === name)) {
      throw new Error(
        __("Error registering block. Try reloading the page.")
      );
    }
    registry.dispatch(noticesStore).createInfoNotice(
      sprintf(
        // translators: %s is the block title.
        __("Block %s installed and added."),
        block.title
      ),
      {
        speak: true,
        type: "snackbar"
      }
    );
    success = true;
  } catch (error) {
    let message = error.message || __("An error occurred.");
    let isFatal = error instanceof Error;
    const fatalAPIErrors = {
      folder_exists: __(
        "This block is already installed. Try reloading the page."
      ),
      unable_to_connect_to_filesystem: __(
        "Error installing block. You can reload the page and try again."
      )
    };
    if (fatalAPIErrors[error.code]) {
      isFatal = true;
      message = fatalAPIErrors[error.code];
    }
    dispatch.setErrorNotice(id, message, isFatal);
    registry.dispatch(noticesStore).createErrorNotice(message, {
      speak: true,
      isDismissible: true
    });
  }
  dispatch.setIsInstalling(id, false);
  return success;
};
var uninstallBlockType = (block) => async ({ registry, dispatch }) => {
  try {
    const url = getPluginUrl(block);
    await apiFetch({
      method: "PUT",
      url,
      data: { status: "inactive" }
    });
    await apiFetch({
      method: "DELETE",
      url
    });
    dispatch.removeInstalledBlockType(block);
  } catch (error) {
    registry.dispatch(noticesStore).createErrorNotice(
      error.message || __("An error occurred.")
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
export {
  addInstalledBlockType,
  clearErrorNotice,
  fetchDownloadableBlocks,
  installBlockType,
  receiveDownloadableBlocks,
  removeInstalledBlockType,
  setErrorNotice,
  setIsInstalling,
  uninstallBlockType
};
//# sourceMappingURL=actions.mjs.map
