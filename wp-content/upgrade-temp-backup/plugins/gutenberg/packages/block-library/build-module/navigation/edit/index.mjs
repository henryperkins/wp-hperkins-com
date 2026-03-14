// packages/block-library/src/navigation/edit/index.js
import clsx from "clsx";
import {
  useCallback,
  useState,
  useEffect,
  useRef,
  Platform
} from "@wordpress/element";
import {
  InspectorControls,
  useBlockProps,
  RecursionProvider,
  useHasRecursion,
  store as blockEditorStore,
  withColors,
  ContrastChecker,
  getColorClassName,
  Warning,
  __experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
  __experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
  useBlockEditingMode,
  BlockControls
} from "@wordpress/block-editor";
import {
  EntityProvider,
  store as coreStore,
  useEntityRecords
} from "@wordpress/core-data";
import { useDispatch, useSelect } from "@wordpress/data";
import {
  __experimentalToolsPanel as ToolsPanel,
  __experimentalToolsPanelItem as ToolsPanelItem,
  ToggleControl,
  __experimentalToggleGroupControl as ToggleGroupControl,
  __experimentalToggleGroupControlOption as ToggleGroupControlOption,
  Spinner,
  Notice,
  ToolbarButton,
  ToolbarGroup
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { speak } from "@wordpress/a11y";
import { page } from "@wordpress/icons";
import { createBlock } from "@wordpress/blocks";
import { useInstanceId } from "@wordpress/compose";
import useNavigationMenu from "../use-navigation-menu.mjs";
import Placeholder from "./placeholder/index.mjs";
import ResponsiveWrapper from "./responsive-wrapper.mjs";
import NavigationInnerBlocks from "./inner-blocks.mjs";
import NavigationMenuNameControl from "./navigation-menu-name-control.mjs";
import UnsavedInnerBlocks from "./unsaved-inner-blocks.mjs";
import NavigationMenuDeleteControl from "./navigation-menu-delete-control.mjs";
import useNavigationNotice from "./use-navigation-notice.mjs";
import OverlayMenuPreview from "./overlay-menu-preview.mjs";
import OverlayPanel from "./overlay-panel.mjs";
import useConvertClassicToBlockMenu, {
  CLASSIC_MENU_CONVERSION_ERROR,
  CLASSIC_MENU_CONVERSION_PENDING,
  CLASSIC_MENU_CONVERSION_SUCCESS
} from "./use-convert-classic-menu-to-block-menu.mjs";
import useCreateNavigationMenu from "./use-create-navigation-menu.mjs";
import { useInnerBlocks } from "./use-inner-blocks.mjs";
import { detectColors } from "./utils.mjs";
import ManageMenusButton from "./manage-menus-button.mjs";
import MenuInspectorControls from "./menu-inspector-controls.mjs";
import DeletedNavigationWarning from "./deleted-navigation-warning.mjs";
import AccessibleDescription from "./accessible-description.mjs";
import AccessibleMenuDescription from "./accessible-menu-description.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { useToolsPanelDropdownMenuProps } from "../../utils/hooks.mjs";
import { isWithinNavigationOverlay } from "../../utils/is-within-overlay.mjs";
import {
  DEFAULT_BLOCK,
  NAVIGATION_OVERLAY_TEMPLATE_PART_AREA
} from "../constants.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function NavigationAddPageButton({ clientId }) {
  const { insertBlock } = useDispatch(blockEditorStore);
  const { getBlockCount } = useSelect(blockEditorStore);
  const onAddPage = useCallback(() => {
    const blockCount = getBlockCount(clientId);
    const newBlock = createBlock(DEFAULT_BLOCK.name, {
      kind: DEFAULT_BLOCK.attributes.kind,
      type: DEFAULT_BLOCK.attributes.type
    });
    insertBlock(newBlock, blockCount, clientId);
  }, [clientId, insertBlock, getBlockCount]);
  return /* @__PURE__ */ jsx(BlockControls, { children: /* @__PURE__ */ jsx(ToolbarGroup, { children: /* @__PURE__ */ jsx(
    ToolbarButton,
    {
      name: "add-page",
      icon: page,
      onClick: onAddPage,
      children: __("Add page")
    }
  ) }) });
}
function ColorTools({
  textColor,
  setTextColor,
  backgroundColor,
  setBackgroundColor,
  overlayTextColor,
  setOverlayTextColor,
  overlayBackgroundColor,
  setOverlayBackgroundColor,
  clientId,
  navRef,
  hasCustomOverlay
}) {
  const [detectedBackgroundColor, setDetectedBackgroundColor] = useState();
  const [detectedColor, setDetectedColor] = useState();
  const [
    detectedOverlayBackgroundColor,
    setDetectedOverlayBackgroundColor
  ] = useState();
  const [detectedOverlayColor, setDetectedOverlayColor] = useState();
  const isWithinOverlay = useSelect(() => isWithinNavigationOverlay(), []);
  const enableContrastChecking = Platform.OS === "web";
  useEffect(() => {
    if (!enableContrastChecking) {
      return;
    }
    detectColors(
      navRef.current,
      setDetectedColor,
      setDetectedBackgroundColor
    );
    const subMenuElement = navRef.current?.querySelector(
      '[data-type="core/navigation-submenu"] [data-type="core/navigation-link"]'
    );
    if (!subMenuElement) {
      return;
    }
    if (overlayTextColor.color || overlayBackgroundColor.color) {
      detectColors(
        subMenuElement,
        setDetectedOverlayColor,
        setDetectedOverlayBackgroundColor
      );
    }
  }, [
    enableContrastChecking,
    overlayTextColor.color,
    overlayBackgroundColor.color,
    navRef
  ]);
  const colorGradientSettings = useMultipleOriginColorsAndGradients();
  if (!colorGradientSettings.hasColorsOrGradients) {
    return null;
  }
  const colorSettings = [
    {
      colorValue: textColor.color,
      label: __("Text"),
      onColorChange: setTextColor,
      resetAllFilter: () => setTextColor(),
      clearable: true,
      enableAlpha: true
    },
    {
      colorValue: backgroundColor.color,
      label: __("Background"),
      onColorChange: setBackgroundColor,
      resetAllFilter: () => setBackgroundColor(),
      clearable: true,
      enableAlpha: true
    }
  ];
  colorSettings.push(
    {
      colorValue: overlayTextColor.color,
      label: hasCustomOverlay || isWithinOverlay ? __("Submenu text") : __("Submenu & overlay text"),
      onColorChange: setOverlayTextColor,
      resetAllFilter: () => setOverlayTextColor(),
      clearable: true,
      enableAlpha: true
    },
    {
      colorValue: overlayBackgroundColor.color,
      label: hasCustomOverlay || isWithinOverlay ? __("Submenu background") : __("Submenu & overlay background"),
      onColorChange: setOverlayBackgroundColor,
      resetAllFilter: () => setOverlayBackgroundColor(),
      clearable: true,
      enableAlpha: true
    }
  );
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      ColorGradientSettingsDropdown,
      {
        __experimentalIsRenderedInSidebar: true,
        settings: colorSettings,
        panelId: clientId,
        ...colorGradientSettings,
        gradients: [],
        disableCustomGradients: true
      }
    ),
    enableContrastChecking && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        ContrastChecker,
        {
          backgroundColor: detectedBackgroundColor,
          textColor: detectedColor
        }
      ),
      /* @__PURE__ */ jsx(
        ContrastChecker,
        {
          backgroundColor: detectedOverlayBackgroundColor,
          textColor: detectedOverlayColor
        }
      )
    ] })
  ] });
}
function Navigation({
  attributes,
  setAttributes,
  clientId,
  isSelected,
  className,
  backgroundColor,
  setBackgroundColor,
  textColor,
  setTextColor,
  overlayBackgroundColor,
  setOverlayBackgroundColor,
  overlayTextColor,
  setOverlayTextColor,
  // These props are used by the navigation editor to override specific
  // navigation block settings.
  customPlaceholder: CustomPlaceholder = null,
  __unstableLayoutClassNames: layoutClassNames
}) {
  const {
    submenuVisibility,
    overlayMenu,
    overlay,
    showSubmenuIcon,
    templateLock,
    layout: {
      justifyContent,
      orientation = "horizontal",
      flexWrap = "wrap"
    } = {},
    hasIcon,
    icon = "handle"
  } = attributes;
  const ref = attributes.ref;
  const setRef = useCallback(
    (postId) => {
      setAttributes({ ref: postId });
    },
    [setAttributes]
  );
  useEffect(() => {
    if (orientation === "horizontal" && submenuVisibility === "always") {
      setAttributes({
        submenuVisibility: "hover",
        showSubmenuIcon: true
      });
    }
  }, [orientation, submenuVisibility, setAttributes]);
  const recursionId = `navigationMenu/${ref}`;
  const recursionDetected = useHasRecursion(recursionId);
  const { isPreviewMode, onNavigateToEntityRecord, currentTheme } = useSelect(
    (select) => {
      const { getSettings } = select(blockEditorStore);
      const settings = getSettings();
      return {
        isPreviewMode: settings.isPreviewMode,
        onNavigateToEntityRecord: settings?.onNavigateToEntityRecord,
        // Needed to construct the template part ID for the overlay preview.
        currentTheme: select(coreStore).getCurrentTheme()?.stylesheet
      };
    },
    []
  );
  const hasAlreadyRendered = isPreviewMode ? false : recursionDetected;
  const blockEditingMode = useBlockEditingMode();
  const { records: classicMenus } = useEntityRecords("root", "menu", {
    per_page: -1,
    context: "view"
  });
  const [showNavigationMenuStatusNotice, hideNavigationMenuStatusNotice] = useNavigationNotice({
    name: "block-library/core/navigation/status"
  });
  const [showClassicMenuConversionNotice, hideClassicMenuConversionNotice] = useNavigationNotice({
    name: "block-library/core/navigation/classic-menu-conversion"
  });
  const [
    showNavigationMenuPermissionsNotice,
    hideNavigationMenuPermissionsNotice
  ] = useNavigationNotice({
    name: "block-library/core/navigation/permissions/update"
  });
  const {
    create: createNavigationMenu,
    status: createNavigationMenuStatus,
    error: createNavigationMenuError,
    value: createNavigationMenuPost,
    isPending: isCreatingNavigationMenu,
    isSuccess: createNavigationMenuIsSuccess,
    isError: createNavigationMenuIsError
  } = useCreateNavigationMenu(clientId);
  const createUntitledEmptyNavigationMenu = async () => {
    await createNavigationMenu("");
  };
  const {
    hasUncontrolledInnerBlocks,
    uncontrolledInnerBlocks,
    isInnerBlockSelected,
    innerBlocks
  } = useInnerBlocks(clientId);
  const hasPageListWithSubmenuRef = useRef(false);
  const hasSubmenus = useSelect(
    (select) => {
      const hasNavigationSubmenu = innerBlocks.some(
        (block) => block.name === "core/navigation-submenu"
      );
      if (hasNavigationSubmenu) {
        return true;
      }
      const pageList = innerBlocks.find(
        (block) => block.name === "core/page-list"
      );
      if (!pageList) {
        hasPageListWithSubmenuRef.current = false;
        return false;
      }
      if (hasPageListWithSubmenuRef.current) {
        return true;
      }
      const { getBlocks } = select(blockEditorStore);
      const pageListBlocks = getBlocks(pageList.clientId);
      if (pageListBlocks.length > 0) {
        hasPageListWithSubmenuRef.current = true;
        return true;
      }
      return false;
    },
    [innerBlocks]
  );
  const { records: overlayTemplateParts } = useEntityRecords(
    "postType",
    "wp_template_part",
    {
      per_page: -1
    }
  );
  const hasOverlays = overlayTemplateParts?.some(
    (templatePart) => templatePart.area === NAVIGATION_OVERLAY_TEMPLATE_PART_AREA
  ) ?? false;
  const {
    replaceInnerBlocks,
    selectBlock,
    __unstableMarkNextChangeAsNotPersistent
  } = useDispatch(blockEditorStore);
  const [isResponsiveMenuOpen, setResponsiveMenuVisibility] = useState(false);
  const [overlayMenuPreview, setOverlayMenuPreview] = useState(false);
  const {
    hasResolvedNavigationMenus,
    isNavigationMenuResolved,
    isNavigationMenuMissing,
    canUserUpdateNavigationMenu,
    hasResolvedCanUserUpdateNavigationMenu,
    canUserDeleteNavigationMenu,
    hasResolvedCanUserDeleteNavigationMenu,
    canUserCreateNavigationMenus,
    isResolvingCanUserCreateNavigationMenus,
    hasResolvedCanUserCreateNavigationMenus
  } = useNavigationMenu(ref);
  const navMenuResolvedButMissing = hasResolvedNavigationMenus && isNavigationMenuMissing;
  const {
    convert: convertClassicMenu,
    status: classicMenuConversionStatus,
    error: classicMenuConversionError
  } = useConvertClassicToBlockMenu(createNavigationMenu);
  const isConvertingClassicMenu = classicMenuConversionStatus === CLASSIC_MENU_CONVERSION_PENDING;
  const handleUpdateMenu = useCallback(
    (menuId, options = { focusNavigationBlock: false }) => {
      const { focusNavigationBlock } = options;
      setRef(menuId);
      if (focusNavigationBlock) {
        selectBlock(clientId);
      }
    },
    [selectBlock, clientId, setRef]
  );
  const isEntityAvailable = !isNavigationMenuMissing && isNavigationMenuResolved;
  const hasUnsavedBlocks = hasUncontrolledInnerBlocks && !isEntityAvailable;
  const { getNavigationFallbackId } = unlock(useSelect(coreStore));
  const navigationFallbackId = !(ref || hasUnsavedBlocks) ? getNavigationFallbackId() : null;
  useEffect(() => {
    if (ref || hasUnsavedBlocks || !navigationFallbackId) {
      return;
    }
    __unstableMarkNextChangeAsNotPersistent();
    setRef(navigationFallbackId);
  }, [
    ref,
    setRef,
    hasUnsavedBlocks,
    navigationFallbackId,
    __unstableMarkNextChangeAsNotPersistent
  ]);
  const navRef = useRef();
  const isWithinOverlay = useSelect(() => isWithinNavigationOverlay(), []);
  const TagName = isWithinOverlay ? "div" : "nav";
  const isPlaceholder = !ref && !isCreatingNavigationMenu && !isConvertingClassicMenu && hasResolvedNavigationMenus && classicMenus?.length === 0 && !hasUncontrolledInnerBlocks;
  const isLoading = !hasResolvedNavigationMenus || isCreatingNavigationMenu || isConvertingClassicMenu || !!(ref && !isEntityAvailable && !isConvertingClassicMenu);
  const textDecoration = attributes.style?.typography?.textDecoration;
  const hasBlockOverlay = useSelect(
    (select) => select(blockEditorStore).__unstableHasActiveBlockOverlayActive(
      clientId
    ),
    [clientId]
  );
  const hasSetOverlayDefault = useRef(false);
  useEffect(() => {
    if (!isWithinOverlay) {
      return;
    }
    if (overlayMenu !== "never") {
      setAttributes({ overlayMenu: "never" });
    }
    if (!hasSetOverlayDefault.current && !ref) {
      hasSetOverlayDefault.current = true;
      setAttributes({
        submenuVisibility: "always",
        layout: {
          ...attributes.layout,
          orientation: "vertical"
        },
        showSubmenuIcon: false
      });
    }
  }, [
    attributes.layout,
    isWithinOverlay,
    overlayMenu,
    ref,
    setAttributes
  ]);
  const isResponsive = "never" !== overlayMenu;
  const blockProps = useBlockProps({
    ref: navRef,
    className: clsx(
      className,
      {
        "items-justified-right": justifyContent === "right",
        "items-justified-space-between": justifyContent === "space-between",
        "items-justified-left": justifyContent === "left",
        "items-justified-center": justifyContent === "center",
        "is-vertical": orientation === "vertical",
        "no-wrap": flexWrap === "nowrap",
        "is-responsive": isResponsive,
        "has-text-color": !!textColor.color || !!textColor?.class,
        [getColorClassName("color", textColor?.slug)]: !!textColor?.slug,
        "has-background": !!backgroundColor.color || backgroundColor.class,
        [getColorClassName(
          "background-color",
          backgroundColor?.slug
        )]: !!backgroundColor?.slug,
        [`has-text-decoration-${textDecoration}`]: textDecoration,
        "block-editor-block-content-overlay": hasBlockOverlay
      },
      layoutClassNames
    ),
    style: {
      color: !textColor?.slug && textColor?.color,
      backgroundColor: !backgroundColor?.slug && backgroundColor?.color
    }
  });
  const onSelectClassicMenu = async (classicMenu) => {
    return convertClassicMenu(classicMenu.id, classicMenu.name, "draft");
  };
  const onSelectNavigationMenu = (menuId) => {
    handleUpdateMenu(menuId);
  };
  useEffect(() => {
    hideNavigationMenuStatusNotice();
    if (isCreatingNavigationMenu) {
      speak(__(`Creating Navigation Menu.`));
    }
    if (createNavigationMenuIsSuccess) {
      handleUpdateMenu(createNavigationMenuPost?.id, {
        focusNavigationBlock: true
      });
      showNavigationMenuStatusNotice(
        __(`Navigation Menu successfully created.`)
      );
    }
    if (createNavigationMenuIsError) {
      showNavigationMenuStatusNotice(
        __("Failed to create Navigation Menu.")
      );
    }
  }, [
    createNavigationMenuStatus,
    createNavigationMenuError,
    createNavigationMenuPost?.id,
    createNavigationMenuIsError,
    createNavigationMenuIsSuccess,
    isCreatingNavigationMenu,
    handleUpdateMenu,
    hideNavigationMenuStatusNotice,
    showNavigationMenuStatusNotice
  ]);
  useEffect(() => {
    hideClassicMenuConversionNotice();
    if (classicMenuConversionStatus === CLASSIC_MENU_CONVERSION_PENDING) {
      speak(__("Classic menu importing."));
    }
    if (classicMenuConversionStatus === CLASSIC_MENU_CONVERSION_SUCCESS) {
      showClassicMenuConversionNotice(
        __("Classic menu imported successfully.")
      );
      handleUpdateMenu(createNavigationMenuPost?.id, {
        focusNavigationBlock: true
      });
    }
    if (classicMenuConversionStatus === CLASSIC_MENU_CONVERSION_ERROR) {
      showClassicMenuConversionNotice(
        __("Classic menu import failed.")
      );
    }
  }, [
    classicMenuConversionStatus,
    classicMenuConversionError,
    hideClassicMenuConversionNotice,
    showClassicMenuConversionNotice,
    createNavigationMenuPost?.id,
    handleUpdateMenu
  ]);
  useEffect(() => {
    if (!isSelected && !isInnerBlockSelected) {
      hideNavigationMenuPermissionsNotice();
    }
    if (isSelected || isInnerBlockSelected) {
      if (ref && !navMenuResolvedButMissing && hasResolvedCanUserUpdateNavigationMenu && !canUserUpdateNavigationMenu) {
        showNavigationMenuPermissionsNotice(
          __(
            "You do not have permission to edit this Menu. Any changes made will not be saved."
          )
        );
      }
      if (!ref && hasResolvedCanUserCreateNavigationMenus && !canUserCreateNavigationMenus) {
        showNavigationMenuPermissionsNotice(
          __(
            "You do not have permission to create Navigation Menus."
          )
        );
      }
    }
  }, [
    isSelected,
    isInnerBlockSelected,
    canUserUpdateNavigationMenu,
    hasResolvedCanUserUpdateNavigationMenu,
    canUserCreateNavigationMenus,
    hasResolvedCanUserCreateNavigationMenus,
    ref,
    hideNavigationMenuPermissionsNotice,
    showNavigationMenuPermissionsNotice,
    navMenuResolvedButMissing
  ]);
  const hasManagePermissions = canUserCreateNavigationMenus || canUserUpdateNavigationMenu;
  const overlayMenuPreviewClasses = clsx(
    "wp-block-navigation__overlay-menu-preview",
    { open: overlayMenuPreview }
  );
  const submenuAccessibilityNotice = !showSubmenuIcon && submenuVisibility !== "click" && submenuVisibility !== "always" ? __(
    'The current menu options offer reduced accessibility for users and are not recommended. Enabling either "Open on Click" or "Show arrow" offers enhanced accessibility by allowing keyboard users to browse submenus selectively.'
  ) : "";
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (!isFirstRender.current && submenuAccessibilityNotice) {
      speak(submenuAccessibilityNotice);
    }
    isFirstRender.current = false;
  }, [submenuAccessibilityNotice]);
  const overlayMenuPreviewId = useInstanceId(
    OverlayMenuPreview,
    `overlay-menu-preview`
  );
  const dropdownMenuProps = useToolsPanelDropdownMenuProps();
  const stylingInspectorControls = /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(InspectorControls, { children: hasSubmenus && /* @__PURE__ */ jsx(
      ToolsPanel,
      {
        label: __("Display"),
        resetAll: () => {
          setAttributes({
            showSubmenuIcon: true,
            submenuVisibility: "hover",
            overlayMenu: "mobile",
            hasIcon: true,
            icon: "handle"
          });
        },
        dropdownMenuProps,
        children: hasSubmenus && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("h3", { className: "wp-block-navigation__submenu-header", children: __("Submenus") }),
          /* @__PURE__ */ jsx(
            ToolsPanelItem,
            {
              hasValue: () => submenuVisibility !== "hover",
              label: __("Submenu Visibility"),
              onDeselect: () => setAttributes({
                submenuVisibility: "hover"
              }),
              isShownByDefault: true,
              children: /* @__PURE__ */ jsxs(
                ToggleGroupControl,
                {
                  __next40pxDefaultSize: true,
                  label: __("Submenu Visibility"),
                  value: submenuVisibility,
                  onChange: (value) => {
                    const newAttributes = {
                      submenuVisibility: value
                    };
                    const prevSubmenuVisibility = submenuVisibility;
                    if (value === "always") {
                      newAttributes.showSubmenuIcon = false;
                    } else if (value === "click" || prevSubmenuVisibility === "always") {
                      newAttributes.showSubmenuIcon = true;
                    }
                    setAttributes(newAttributes);
                  },
                  isBlock: true,
                  children: [
                    /* @__PURE__ */ jsx(
                      ToggleGroupControlOption,
                      {
                        value: "hover",
                        label: __("Hover")
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      ToggleGroupControlOption,
                      {
                        value: "click",
                        label: __("Click")
                      }
                    ),
                    orientation === "vertical" && /* @__PURE__ */ jsx(
                      ToggleGroupControlOption,
                      {
                        value: "always",
                        label: __("Always")
                      }
                    )
                  ]
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(
            ToolsPanelItem,
            {
              hasValue: () => !showSubmenuIcon,
              label: __("Show arrow"),
              onDeselect: () => setAttributes({
                showSubmenuIcon: true
              }),
              isDisabled: submenuVisibility === "click" || submenuVisibility === "always",
              isShownByDefault: true,
              children: /* @__PURE__ */ jsx(
                ToggleControl,
                {
                  checked: showSubmenuIcon,
                  onChange: (value) => {
                    setAttributes({
                      showSubmenuIcon: value
                    });
                  },
                  disabled: submenuVisibility === "click" || submenuVisibility === "always",
                  label: __("Show arrow")
                }
              )
            }
          ),
          submenuAccessibilityNotice && /* @__PURE__ */ jsx(
            Notice,
            {
              spokenMessage: null,
              status: "warning",
              isDismissible: false,
              className: "wp-block-navigation__submenu-accessibility-notice",
              children: submenuAccessibilityNotice
            }
          )
        ] })
      }
    ) }),
    !isWithinOverlay && /* @__PURE__ */ jsx(InspectorControls, { children: /* @__PURE__ */ jsx(
      OverlayPanel,
      {
        overlayMenu,
        overlay,
        setAttributes,
        onNavigateToEntityRecord,
        overlayMenuPreview,
        setOverlayMenuPreview,
        hasIcon,
        icon,
        overlayMenuPreviewClasses,
        overlayMenuPreviewId,
        isResponsive,
        currentTheme,
        hasOverlays
      }
    ) }),
    /* @__PURE__ */ jsx(InspectorControls, { group: "color", children: /* @__PURE__ */ jsx(
      ColorTools,
      {
        textColor,
        setTextColor,
        backgroundColor,
        setBackgroundColor,
        overlayTextColor,
        setOverlayTextColor,
        overlayBackgroundColor,
        setOverlayBackgroundColor,
        clientId,
        navRef,
        hasCustomOverlay: !!overlay
      }
    ) })
  ] });
  const accessibleDescriptionId = `${clientId}-desc`;
  const isHiddenByDefault = "always" === overlayMenu;
  const isManageMenusButtonDisabled = !hasManagePermissions || !hasResolvedNavigationMenus;
  if (hasUnsavedBlocks && !isCreatingNavigationMenu) {
    return /* @__PURE__ */ jsxs(
      TagName,
      {
        ...blockProps,
        "aria-describedby": !isPlaceholder ? accessibleDescriptionId : void 0,
        children: [
          /* @__PURE__ */ jsx(AccessibleDescription, { id: accessibleDescriptionId, children: __("Unsaved Navigation Menu.") }),
          /* @__PURE__ */ jsx(
            MenuInspectorControls,
            {
              clientId,
              createNavigationMenuIsSuccess,
              createNavigationMenuIsError,
              currentMenuId: ref,
              isNavigationMenuMissing,
              isManageMenusButtonDisabled,
              onCreateNew: createUntitledEmptyNavigationMenu,
              onSelectClassicMenu,
              onSelectNavigationMenu,
              isLoading,
              blockEditingMode
            }
          ),
          blockEditingMode === "default" && stylingInspectorControls,
          /* @__PURE__ */ jsx(
            ResponsiveWrapper,
            {
              id: clientId,
              onToggle: setResponsiveMenuVisibility,
              isOpen: isResponsiveMenuOpen,
              hasIcon,
              icon,
              isResponsive,
              isHiddenByDefault,
              overlayBackgroundColor,
              overlayTextColor,
              overlay,
              onNavigateToEntityRecord,
              children: /* @__PURE__ */ jsx(
                UnsavedInnerBlocks,
                {
                  createNavigationMenu,
                  blocks: uncontrolledInnerBlocks,
                  hasSelection: isSelected || isInnerBlockSelected
                }
              )
            }
          )
        ]
      }
    );
  }
  if (ref && isNavigationMenuMissing) {
    return /* @__PURE__ */ jsxs(TagName, { ...blockProps, children: [
      /* @__PURE__ */ jsx(
        MenuInspectorControls,
        {
          clientId,
          createNavigationMenuIsSuccess,
          createNavigationMenuIsError,
          currentMenuId: ref,
          isNavigationMenuMissing,
          isManageMenusButtonDisabled,
          onCreateNew: createUntitledEmptyNavigationMenu,
          onSelectClassicMenu,
          onSelectNavigationMenu,
          isLoading,
          blockEditingMode
        }
      ),
      /* @__PURE__ */ jsx(
        DeletedNavigationWarning,
        {
          onCreateNew: createUntitledEmptyNavigationMenu
        }
      )
    ] });
  }
  if (isEntityAvailable && hasAlreadyRendered) {
    return /* @__PURE__ */ jsx("div", { ...blockProps, children: /* @__PURE__ */ jsx(Warning, { children: __("Block cannot be rendered inside itself.") }) });
  }
  const PlaceholderComponent = CustomPlaceholder ? CustomPlaceholder : Placeholder;
  if (isPlaceholder && CustomPlaceholder) {
    return /* @__PURE__ */ jsx(TagName, { ...blockProps, children: /* @__PURE__ */ jsx(
      PlaceholderComponent,
      {
        isSelected,
        currentMenuId: ref,
        clientId,
        canUserCreateNavigationMenus,
        isResolvingCanUserCreateNavigationMenus,
        onSelectNavigationMenu,
        onSelectClassicMenu,
        onCreateEmpty: createUntitledEmptyNavigationMenu
      }
    ) });
  }
  return /* @__PURE__ */ jsx(EntityProvider, { kind: "postType", type: "wp_navigation", id: ref, children: /* @__PURE__ */ jsxs(RecursionProvider, { uniqueId: recursionId, children: [
    /* @__PURE__ */ jsx(
      MenuInspectorControls,
      {
        clientId,
        createNavigationMenuIsSuccess,
        createNavigationMenuIsError,
        currentMenuId: ref,
        isNavigationMenuMissing,
        isManageMenusButtonDisabled,
        onCreateNew: createUntitledEmptyNavigationMenu,
        onSelectClassicMenu,
        onSelectNavigationMenu,
        isLoading,
        blockEditingMode
      }
    ),
    blockEditingMode === "default" && stylingInspectorControls,
    blockEditingMode === "contentOnly" && isEntityAvailable && /* @__PURE__ */ jsx(NavigationAddPageButton, { clientId }),
    blockEditingMode === "default" && isEntityAvailable && /* @__PURE__ */ jsxs(InspectorControls, { group: "advanced", children: [
      hasResolvedCanUserUpdateNavigationMenu && canUserUpdateNavigationMenu && /* @__PURE__ */ jsx(NavigationMenuNameControl, {}),
      hasResolvedCanUserDeleteNavigationMenu && canUserDeleteNavigationMenu && /* @__PURE__ */ jsx(
        NavigationMenuDeleteControl,
        {
          onDelete: () => {
            replaceInnerBlocks(clientId, []);
            showNavigationMenuStatusNotice(
              __(
                "Navigation Menu successfully deleted."
              )
            );
          }
        }
      ),
      /* @__PURE__ */ jsx(
        ManageMenusButton,
        {
          disabled: isManageMenusButtonDisabled,
          className: "wp-block-navigation-manage-menus-button"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(
      TagName,
      {
        ...blockProps,
        "aria-describedby": !isPlaceholder && !isLoading ? accessibleDescriptionId : void 0,
        children: [
          isLoading && !isHiddenByDefault && /* @__PURE__ */ jsx("div", { className: "wp-block-navigation__loading-indicator-container", children: /* @__PURE__ */ jsx(Spinner, { className: "wp-block-navigation__loading-indicator" }) }),
          (!isLoading || isHiddenByDefault) && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              AccessibleMenuDescription,
              {
                id: accessibleDescriptionId
              }
            ),
            /* @__PURE__ */ jsx(
              ResponsiveWrapper,
              {
                id: clientId,
                onToggle: setResponsiveMenuVisibility,
                hasIcon,
                icon,
                isOpen: isResponsiveMenuOpen,
                isResponsive,
                isHiddenByDefault,
                overlayBackgroundColor,
                overlayTextColor,
                overlay,
                onNavigateToEntityRecord,
                children: isEntityAvailable && /* @__PURE__ */ jsx(
                  NavigationInnerBlocks,
                  {
                    clientId,
                    hasCustomPlaceholder: !!CustomPlaceholder,
                    templateLock,
                    orientation
                  }
                )
              }
            )
          ] })
        ]
      }
    )
  ] }) });
}
var edit_default = withColors(
  { textColor: "color" },
  { backgroundColor: "color" },
  { overlayBackgroundColor: "color" },
  { overlayTextColor: "color" }
)(Navigation);
export {
  edit_default as default
};
//# sourceMappingURL=index.mjs.map
