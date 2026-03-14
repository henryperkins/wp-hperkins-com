"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/global-styles-ui/src/screen-revisions/revisions-buttons.tsx
var revisions_buttons_exports = {};
__export(revisions_buttons_exports, {
  default: () => revisions_buttons_default
});
module.exports = __toCommonJS(revisions_buttons_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_date = require("@wordpress/date");
var import_core_data = require("@wordpress/core-data");
var import_data = require("@wordpress/data");
var import_global_styles_engine = require("@wordpress/global-styles-engine");
var import_keycodes = require("@wordpress/keycodes");
var import_jsx_runtime = require("react/jsx-runtime");
var DAY_IN_MILLISECONDS = 60 * 60 * 1e3 * 24;
function ChangesSummary({ revision, previousRevision }) {
  const changes = (0, import_global_styles_engine.getGlobalStylesChanges)(
    revision,
    previousRevision,
    {
      maxResults: 7
    }
  );
  if (!changes.length) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "ul",
    {
      "data-testid": "global-styles-revision-changes",
      className: "global-styles-ui-screen-revisions__changes",
      children: changes.map((change) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: change }, change))
    }
  );
}
function getRevisionLabel(id, authorDisplayName, formattedModifiedDate, areStylesEqual) {
  if ("parent" === id) {
    return (0, import_i18n.__)("Reset the styles to the theme defaults");
  }
  if ("unsaved" === id) {
    return (0, import_i18n.sprintf)(
      /* translators: %s: author display name */
      (0, import_i18n.__)("Unsaved changes by %s"),
      authorDisplayName
    );
  }
  return areStylesEqual ? (0, import_i18n.sprintf)(
    // translators: 1: author display name. 2: revision creation date.
    (0, import_i18n.__)(
      "Changes saved by %1$s on %2$s. This revision matches current editor styles."
    ),
    authorDisplayName,
    formattedModifiedDate
  ) : (0, import_i18n.sprintf)(
    // translators: 1: author display name. 2: revision creation date.
    (0, import_i18n.__)("Changes saved by %1$s on %2$s"),
    authorDisplayName,
    formattedModifiedDate
  );
}
function RevisionsButtons({
  userRevisions,
  selectedRevisionId,
  onChange,
  canApplyRevision,
  onApplyRevision
}) {
  const { currentThemeName, currentUser } = (0, import_data.useSelect)((select) => {
    const { getCurrentTheme, getCurrentUser } = select(import_core_data.store);
    const currentTheme = getCurrentTheme();
    return {
      currentThemeName: currentTheme?.name?.rendered || currentTheme?.stylesheet,
      currentUser: getCurrentUser()
    };
  }, []);
  const dateNowInMs = (0, import_date.getDate)(null).getTime();
  const { datetimeAbbreviated } = (0, import_date.getSettings)().formats;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Composite,
    {
      orientation: "vertical",
      className: "global-styles-ui-screen-revisions__revisions-list",
      "aria-label": (0, import_i18n.__)("Global styles revisions list"),
      role: "listbox",
      children: userRevisions.map((revision, index) => {
        const { id, author, modified } = revision;
        const isUnsaved = "unsaved" === id;
        const revisionAuthor = isUnsaved ? currentUser : author;
        const authorDisplayName = revisionAuthor?.name || (0, import_i18n.__)("User");
        const authorAvatar = revisionAuthor?.avatar_urls?.["48"];
        const isFirstItem = index === 0;
        const isSelected = selectedRevisionId ? selectedRevisionId === id : isFirstItem;
        const areStylesEqual = !canApplyRevision && isSelected;
        const isReset = "parent" === id;
        const modifiedString = modified instanceof Date ? modified.toISOString() : modified;
        const modifiedDate = (0, import_date.getDate)(modifiedString ?? null);
        const displayDate = modifiedString && dateNowInMs - modifiedDate.getTime() > DAY_IN_MILLISECONDS ? (0, import_date.dateI18n)(datetimeAbbreviated, modifiedDate) : (0, import_date.humanTimeDiff)(
          modifiedString ?? modifiedDate,
          void 0
        );
        const revisionLabel = getRevisionLabel(
          id,
          authorDisplayName,
          (0, import_date.dateI18n)(datetimeAbbreviated, modifiedDate),
          areStylesEqual
        );
        return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          import_components.Composite.Item,
          {
            className: "global-styles-ui-screen-revisions__revision-item",
            "aria-current": isSelected,
            role: "option",
            onKeyDown: (event) => {
              const { keyCode } = event;
              if (keyCode === import_keycodes.ENTER || keyCode === import_keycodes.SPACE) {
                onChange(revision);
              }
            },
            onClick: (event) => {
              event.preventDefault();
              onChange(revision);
            },
            "aria-selected": isSelected,
            "aria-label": revisionLabel,
            render: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "global-styles-ui-screen-revisions__revision-item-wrapper", children: isReset ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "global-styles-ui-screen-revisions__description", children: [
                (0, import_i18n.__)("Default styles"),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "global-styles-ui-screen-revisions__meta", children: currentThemeName })
              ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "global-styles-ui-screen-revisions__description", children: [
                isUnsaved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "global-styles-ui-screen-revisions__date", children: (0, import_i18n.__)("(Unsaved)") }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "time",
                  {
                    className: "global-styles-ui-screen-revisions__date",
                    dateTime: modifiedString,
                    children: displayDate
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "global-styles-ui-screen-revisions__meta", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    "img",
                    {
                      alt: authorDisplayName,
                      src: authorAvatar
                    }
                  ),
                  authorDisplayName
                ] }),
                isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  ChangesSummary,
                  {
                    revision,
                    previousRevision: index < userRevisions.length ? userRevisions[index + 1] : void 0
                  }
                )
              ] }) }),
              isSelected && (areStylesEqual ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "global-styles-ui-screen-revisions__applied-text", children: (0, import_i18n.__)(
                "These styles are already applied to your site."
              ) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_components.Button,
                {
                  size: "compact",
                  variant: "primary",
                  className: "global-styles-ui-screen-revisions__apply-button",
                  onClick: onApplyRevision,
                  "aria-label": (0, import_i18n.__)(
                    "Apply the selected revision to your site."
                  ),
                  children: isReset ? (0, import_i18n.__)("Reset to defaults") : (0, import_i18n.__)("Apply")
                }
              ))
            ]
          },
          id
        );
      })
    }
  );
}
var revisions_buttons_default = RevisionsButtons;
//# sourceMappingURL=revisions-buttons.cjs.map
