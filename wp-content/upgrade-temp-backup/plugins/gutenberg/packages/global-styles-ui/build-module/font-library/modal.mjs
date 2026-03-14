// packages/global-styles-ui/src/font-library/modal.tsx
import { __, _x } from "@wordpress/i18n";
import {
  Modal,
  privateApis as componentsPrivateApis
} from "@wordpress/components";
import { store as coreStore, useEntityRecords } from "@wordpress/core-data";
import { useSelect } from "@wordpress/data";
import InstalledFonts from "./installed-fonts.mjs";
import FontCollection from "./font-collection.mjs";
import UploadFonts from "./upload-fonts.mjs";
import { unlock } from "../lock-unlock.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var { Tabs } = unlock(componentsPrivateApis);
var DEFAULT_TAB = {
  id: "installed-fonts",
  title: _x("Library", "Font library")
};
var UPLOAD_TAB = {
  id: "upload-fonts",
  title: _x("Upload", "noun")
};
var tabsFromCollections = (collections) => collections.map(({ slug, name }) => ({
  id: slug,
  title: collections.length === 1 && slug === "google-fonts" ? __("Install Fonts") : name
}));
function FontLibraryModal({
  onRequestClose,
  defaultTabId = "installed-fonts"
}) {
  const { records: collections = [] } = useEntityRecords("root", "fontCollection", {
    _fields: "slug,name,description"
  });
  const canUserCreate = useSelect((select) => {
    return select(coreStore).canUser("create", {
      kind: "postType",
      name: "wp_font_family"
    });
  }, []);
  const tabs = [DEFAULT_TAB];
  if (canUserCreate) {
    tabs.push(UPLOAD_TAB);
    tabs.push(...tabsFromCollections(collections || []));
  }
  return /* @__PURE__ */ jsx(
    Modal,
    {
      title: __("Fonts"),
      onRequestClose,
      isFullScreen: true,
      className: "font-library-modal",
      children: /* @__PURE__ */ jsxs(Tabs, { defaultTabId, children: [
        /* @__PURE__ */ jsx("div", { className: "font-library-modal__tablist-container", children: /* @__PURE__ */ jsx(Tabs.TabList, { children: tabs.map(({ id, title }) => /* @__PURE__ */ jsx(Tabs.Tab, { tabId: id, children: title }, id)) }) }),
        tabs.map(({ id }) => {
          let contents;
          switch (id) {
            case "upload-fonts":
              contents = /* @__PURE__ */ jsx(UploadFonts, {});
              break;
            case "installed-fonts":
              contents = /* @__PURE__ */ jsx(InstalledFonts, {});
              break;
            default:
              contents = /* @__PURE__ */ jsx(FontCollection, { slug: id });
          }
          return /* @__PURE__ */ jsx(
            Tabs.TabPanel,
            {
              tabId: id,
              focusable: false,
              className: "font-library-modal__tab-panel",
              children: contents
            },
            id
          );
        })
      ] })
    }
  );
}
var modal_default = FontLibraryModal;
export {
  modal_default as default
};
//# sourceMappingURL=modal.mjs.map
