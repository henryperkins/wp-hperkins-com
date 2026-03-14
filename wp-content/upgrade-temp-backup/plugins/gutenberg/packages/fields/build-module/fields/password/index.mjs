// packages/fields/src/fields/password/index.tsx
import { __ } from "@wordpress/i18n";
import PasswordEdit from "./edit.mjs";
var passwordField = {
  id: "password",
  type: "text",
  label: __("Password"),
  Edit: PasswordEdit,
  enableSorting: false,
  enableHiding: false,
  isVisible: (item) => item.status !== "private",
  filterBy: false
};
var password_default = passwordField;
export {
  password_default as default
};
//# sourceMappingURL=index.mjs.map
