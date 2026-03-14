// packages/block-library/src/navigation/edit/menu-inspector-controls.js
import {
  privateApis as blockEditorPrivateApis,
  InspectorControls,
  store as blockEditorStore
} from "@wordpress/block-editor";
import { PanelBody, Spinner } from "@wordpress/components";
import { useSelect, useDispatch } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { useContext } from "@wordpress/element";
import NavigationMenuSelector from "./navigation-menu-selector.mjs";
import { unlock } from "../../lock-unlock.mjs";
import DeletedNavigationWarning from "./deleted-navigation-warning.mjs";
import useNavigationMenu from "../use-navigation-menu.mjs";
import LeafMoreMenu from "./leaf-more-menu.mjs";
import { NavigationLinkUI } from "./navigation-link-ui.mjs";
import NavigationListViewHeader from "./navigation-list-view-header.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var actionLabel = (
  /* translators: %s: The name of a menu. */
  __("Switch to '%s'")
);
var {
  PrivateListView,
  PrivateBlockContext,
  useListViewPanelState,
  useBlockDisplayTitle
} = unlock(blockEditorPrivateApis);
var MainContent = ({
  clientId,
  currentMenuId,
  isLoading,
  isNavigationMenuMissing,
  onCreateNew,
  expandRevision
}) => {
  const hasChildren = useSelect(
    (select) => {
      return !!select(blockEditorStore).getBlockCount(clientId);
    },
    [clientId]
  );
  const { openListViewContentPanel } = unlock(
    useDispatch(blockEditorStore)
  );
  const { navigationMenu } = useNavigationMenu(currentMenuId);
  if (currentMenuId && isNavigationMenuMissing) {
    return /* @__PURE__ */ jsx(DeletedNavigationWarning, { onCreateNew, isNotice: true });
  }
  if (isLoading) {
    return /* @__PURE__ */ jsx(Spinner, {});
  }
  const description = navigationMenu ? sprintf(
    /* translators: %s: The name of a menu. */
    __("Structure for Navigation Menu: %s"),
    navigationMenu?.title || __("Untitled menu")
  ) : __(
    "You have not yet created any menus. Displaying a list of your Pages"
  );
  return /* @__PURE__ */ jsxs("div", { className: "wp-block-navigation__menu-inspector-controls", children: [
    !hasChildren && /* @__PURE__ */ jsx("p", { className: "wp-block-navigation__menu-inspector-controls__empty-message", children: __("This Navigation Menu is empty.") }),
    /* @__PURE__ */ jsx(
      PrivateListView,
      {
        rootClientId: clientId,
        isExpanded: true,
        description,
        showAppender: true,
        blockSettingsMenu: LeafMoreMenu,
        additionalBlockContent: NavigationLinkUI,
        onSelect: openListViewContentPanel
      },
      `${clientId}-${expandRevision}`
    )
  ] });
};
var MenuInspectorControls = (props) => {
  const {
    clientId,
    createNavigationMenuIsSuccess,
    createNavigationMenuIsError,
    currentMenuId = null,
    onCreateNew,
    onSelectClassicMenu,
    onSelectNavigationMenu,
    isManageMenusButtonDisabled,
    blockEditingMode
  } = props;
  const { isSelectionWithinCurrentSection } = useContext(PrivateBlockContext);
  const blockTitle = useBlockDisplayTitle({
    clientId,
    context: "list-view"
  });
  const showBlockTitle = isSelectionWithinCurrentSection;
  const { isOpened, expandRevision, handleToggle } = useListViewPanelState(clientId);
  if (!showBlockTitle) {
    return /* @__PURE__ */ jsx(InspectorControls, { group: "list", children: /* @__PURE__ */ jsxs(PanelBody, { title: null, children: [
      /* @__PURE__ */ jsx(
        NavigationListViewHeader,
        {
          clientId,
          blockEditingMode,
          currentMenuId,
          onSelectClassicMenu,
          onSelectNavigationMenu,
          onCreateNew,
          createNavigationMenuIsSuccess,
          createNavigationMenuIsError,
          isManageMenusButtonDisabled
        }
      ),
      /* @__PURE__ */ jsx(
        MainContent,
        {
          ...props,
          expandRevision
        }
      )
    ] }) });
  }
  return /* @__PURE__ */ jsx(InspectorControls, { group: "list", children: /* @__PURE__ */ jsxs(
    PanelBody,
    {
      title: blockTitle,
      opened: isOpened,
      onToggle: handleToggle,
      children: [
        blockEditingMode === "default" && /* @__PURE__ */ jsx(
          NavigationMenuSelector,
          {
            currentMenuId,
            onSelectClassicMenu,
            onSelectNavigationMenu,
            onCreateNew,
            createNavigationMenuIsSuccess,
            createNavigationMenuIsError,
            actionLabel,
            isManageMenusButtonDisabled
          }
        ),
        /* @__PURE__ */ jsx(MainContent, { ...props, expandRevision })
      ]
    }
  ) });
};
var menu_inspector_controls_default = MenuInspectorControls;
export {
  menu_inspector_controls_default as default
};
//# sourceMappingURL=menu-inspector-controls.mjs.map
