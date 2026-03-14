// packages/global-styles-ui/src/screen-revisions/revisions-buttons.tsx
import { __, sprintf } from "@wordpress/i18n";
import { Button, Composite } from "@wordpress/components";
import { dateI18n, getDate, humanTimeDiff, getSettings } from "@wordpress/date";
import { store as coreStore } from "@wordpress/core-data";
import { useSelect } from "@wordpress/data";
import { getGlobalStylesChanges } from "@wordpress/global-styles-engine";
import { ENTER, SPACE } from "@wordpress/keycodes";
import { jsx, jsxs } from "react/jsx-runtime";
var DAY_IN_MILLISECONDS = 60 * 60 * 1e3 * 24;
function ChangesSummary({ revision, previousRevision }) {
  const changes = getGlobalStylesChanges(
    revision,
    previousRevision,
    {
      maxResults: 7
    }
  );
  if (!changes.length) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    "ul",
    {
      "data-testid": "global-styles-revision-changes",
      className: "global-styles-ui-screen-revisions__changes",
      children: changes.map((change) => /* @__PURE__ */ jsx("li", { children: change }, change))
    }
  );
}
function getRevisionLabel(id, authorDisplayName, formattedModifiedDate, areStylesEqual) {
  if ("parent" === id) {
    return __("Reset the styles to the theme defaults");
  }
  if ("unsaved" === id) {
    return sprintf(
      /* translators: %s: author display name */
      __("Unsaved changes by %s"),
      authorDisplayName
    );
  }
  return areStylesEqual ? sprintf(
    // translators: 1: author display name. 2: revision creation date.
    __(
      "Changes saved by %1$s on %2$s. This revision matches current editor styles."
    ),
    authorDisplayName,
    formattedModifiedDate
  ) : sprintf(
    // translators: 1: author display name. 2: revision creation date.
    __("Changes saved by %1$s on %2$s"),
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
  const { currentThemeName, currentUser } = useSelect((select) => {
    const { getCurrentTheme, getCurrentUser } = select(coreStore);
    const currentTheme = getCurrentTheme();
    return {
      currentThemeName: currentTheme?.name?.rendered || currentTheme?.stylesheet,
      currentUser: getCurrentUser()
    };
  }, []);
  const dateNowInMs = getDate(null).getTime();
  const { datetimeAbbreviated } = getSettings().formats;
  return /* @__PURE__ */ jsx(
    Composite,
    {
      orientation: "vertical",
      className: "global-styles-ui-screen-revisions__revisions-list",
      "aria-label": __("Global styles revisions list"),
      role: "listbox",
      children: userRevisions.map((revision, index) => {
        const { id, author, modified } = revision;
        const isUnsaved = "unsaved" === id;
        const revisionAuthor = isUnsaved ? currentUser : author;
        const authorDisplayName = revisionAuthor?.name || __("User");
        const authorAvatar = revisionAuthor?.avatar_urls?.["48"];
        const isFirstItem = index === 0;
        const isSelected = selectedRevisionId ? selectedRevisionId === id : isFirstItem;
        const areStylesEqual = !canApplyRevision && isSelected;
        const isReset = "parent" === id;
        const modifiedString = modified instanceof Date ? modified.toISOString() : modified;
        const modifiedDate = getDate(modifiedString ?? null);
        const displayDate = modifiedString && dateNowInMs - modifiedDate.getTime() > DAY_IN_MILLISECONDS ? dateI18n(datetimeAbbreviated, modifiedDate) : humanTimeDiff(
          modifiedString ?? modifiedDate,
          void 0
        );
        const revisionLabel = getRevisionLabel(
          id,
          authorDisplayName,
          dateI18n(datetimeAbbreviated, modifiedDate),
          areStylesEqual
        );
        return /* @__PURE__ */ jsxs(
          Composite.Item,
          {
            className: "global-styles-ui-screen-revisions__revision-item",
            "aria-current": isSelected,
            role: "option",
            onKeyDown: (event) => {
              const { keyCode } = event;
              if (keyCode === ENTER || keyCode === SPACE) {
                onChange(revision);
              }
            },
            onClick: (event) => {
              event.preventDefault();
              onChange(revision);
            },
            "aria-selected": isSelected,
            "aria-label": revisionLabel,
            render: /* @__PURE__ */ jsx("div", {}),
            children: [
              /* @__PURE__ */ jsx("span", { className: "global-styles-ui-screen-revisions__revision-item-wrapper", children: isReset ? /* @__PURE__ */ jsxs("span", { className: "global-styles-ui-screen-revisions__description", children: [
                __("Default styles"),
                /* @__PURE__ */ jsx("span", { className: "global-styles-ui-screen-revisions__meta", children: currentThemeName })
              ] }) : /* @__PURE__ */ jsxs("span", { className: "global-styles-ui-screen-revisions__description", children: [
                isUnsaved ? /* @__PURE__ */ jsx("span", { className: "global-styles-ui-screen-revisions__date", children: __("(Unsaved)") }) : /* @__PURE__ */ jsx(
                  "time",
                  {
                    className: "global-styles-ui-screen-revisions__date",
                    dateTime: modifiedString,
                    children: displayDate
                  }
                ),
                /* @__PURE__ */ jsxs("span", { className: "global-styles-ui-screen-revisions__meta", children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      alt: authorDisplayName,
                      src: authorAvatar
                    }
                  ),
                  authorDisplayName
                ] }),
                isSelected && /* @__PURE__ */ jsx(
                  ChangesSummary,
                  {
                    revision,
                    previousRevision: index < userRevisions.length ? userRevisions[index + 1] : void 0
                  }
                )
              ] }) }),
              isSelected && (areStylesEqual ? /* @__PURE__ */ jsx("p", { className: "global-styles-ui-screen-revisions__applied-text", children: __(
                "These styles are already applied to your site."
              ) }) : /* @__PURE__ */ jsx(
                Button,
                {
                  size: "compact",
                  variant: "primary",
                  className: "global-styles-ui-screen-revisions__apply-button",
                  onClick: onApplyRevision,
                  "aria-label": __(
                    "Apply the selected revision to your site."
                  ),
                  children: isReset ? __("Reset to defaults") : __("Apply")
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
export {
  revisions_buttons_default as default
};
//# sourceMappingURL=revisions-buttons.mjs.map
