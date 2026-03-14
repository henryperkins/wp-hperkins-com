// packages/edit-site/src/components/sidebar-identity/index.js
import { Page } from "@wordpress/admin-ui";
import { __ } from "@wordpress/i18n";
import { useSelect, useDispatch } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { DataForm } from "@wordpress/dataviews";
import { MediaEdit } from "@wordpress/fields";
import { jsx } from "react/jsx-runtime";
var fields = [
  {
    id: "site_logo",
    type: "media",
    label: __("Site Logo"),
    description: __(
      "Displays in your site's layout via the Site Logo block."
    ),
    placeholder: __("Choose logo"),
    Edit: MediaEdit,
    setValue: ({ value }) => ({
      site_logo: value ?? 0
    })
  },
  {
    id: "site_icon",
    type: "media",
    label: __("Site Icon"),
    description: __(
      "Shown in browser tabs, bookmarks, and mobile apps. It should be square and at least 512 by 512 pixels."
    ),
    placeholder: __("Choose icon"),
    Edit: MediaEdit,
    setValue: ({ value }) => ({
      site_icon: value ?? 0
    })
  }
];
var form = {
  layout: {
    type: "regular",
    labelPosition: "top"
  },
  fields: ["site_logo", "site_icon"]
};
function SidebarIdentity() {
  const data = useSelect(
    (select) => select(coreStore).getEditedEntityRecord("root", "site"),
    []
  );
  const { editEntityRecord } = useDispatch(coreStore);
  const onChange = (edits) => {
    editEntityRecord("root", "site", void 0, edits);
  };
  return /* @__PURE__ */ jsx(Page, { title: __("Identity"), hasPadding: true, children: /* @__PURE__ */ jsx(
    DataForm,
    {
      data,
      fields,
      form,
      onChange
    }
  ) });
}
export {
  SidebarIdentity as default
};
//# sourceMappingURL=index.mjs.map
