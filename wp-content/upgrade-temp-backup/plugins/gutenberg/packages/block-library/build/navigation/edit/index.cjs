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

// packages/block-library/src/navigation/edit/index.js
var edit_exports = {};
__export(edit_exports, {
  default: () => edit_default
});
module.exports = __toCommonJS(edit_exports);
var import_clsx = __toESM(require("clsx"));
var import_element = require("@wordpress/element");
var import_block_editor = require("@wordpress/block-editor");
var import_core_data = require("@wordpress/core-data");
var import_data = require("@wordpress/data");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_a11y = require("@wordpress/a11y");
var import_icons = require("@wordpress/icons");
var import_blocks = require("@wordpress/blocks");
var import_compose = require("@wordpress/compose");
var import_use_navigation_menu = __toESM(require("../use-navigation-menu.cjs"));
var import_placeholder = __toESM(require("./placeholder/index.cjs"));
var import_responsive_wrapper = __toESM(require("./responsive-wrapper.cjs"));
var import_inner_blocks = __toESM(require("./inner-blocks.cjs"));
var import_navigation_menu_name_control = __toESM(require("./navigation-menu-name-control.cjs"));
var import_unsaved_inner_blocks = __toESM(require("./unsaved-inner-blocks.cjs"));
var import_navigation_menu_delete_control = __toESM(require("./navigation-menu-delete-control.cjs"));
var import_use_navigation_notice = __toESM(require("./use-navigation-notice.cjs"));
var import_overlay_menu_preview = __toESM(require("./overlay-menu-preview.cjs"));
var import_overlay_panel = __toESM(require("./overlay-panel.cjs"));
var import_use_convert_classic_menu_to_block_menu = __toESM(require("./use-convert-classic-menu-to-block-menu.cjs"));
var import_use_create_navigation_menu = __toESM(require("./use-create-navigation-menu.cjs"));
var import_use_inner_blocks = require("./use-inner-blocks.cjs");
var import_utils = require("./utils.cjs");
var import_manage_menus_button = __toESM(require("./manage-menus-button.cjs"));
var import_menu_inspector_controls = __toESM(require("./menu-inspector-controls.cjs"));
var import_deleted_navigation_warning = __toESM(require("./deleted-navigation-warning.cjs"));
var import_accessible_description = __toESM(require("./accessible-description.cjs"));
var import_accessible_menu_description = __toESM(require("./accessible-menu-description.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_hooks = require("../../utils/hooks.cjs");
var import_is_within_overlay = require("../../utils/is-within-overlay.cjs");
var import_constants = require("../constants.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function NavigationAddPageButton({ clientId }) {
  const { insertBlock } = (0, import_data.useDispatch)(import_block_editor.store);
  const { getBlockCount } = (0, import_data.useSelect)(import_block_editor.store);
  const onAddPage = (0, import_element.useCallback)(() => {
    const blockCount = getBlockCount(clientId);
    const newBlock = (0, import_blocks.createBlock)(import_constants.DEFAULT_BLOCK.name, {
      kind: import_constants.DEFAULT_BLOCK.attributes.kind,
      type: import_constants.DEFAULT_BLOCK.attributes.type
    });
    insertBlock(newBlock, blockCount, clientId);
  }, [clientId, insertBlock, getBlockCount]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockControls, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.ToolbarGroup, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.ToolbarButton,
    {
      name: "add-page",
      icon: import_icons.page,
      onClick: onAddPage,
      children: (0, import_i18n.__)("Add page")
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
  const [detectedBackgroundColor, setDetectedBackgroundColor] = (0, import_element.useState)();
  const [detectedColor, setDetectedColor] = (0, import_element.useState)();
  const [
    detectedOverlayBackgroundColor,
    setDetectedOverlayBackgroundColor
  ] = (0, import_element.useState)();
  const [detectedOverlayColor, setDetectedOverlayColor] = (0, import_element.useState)();
  const isWithinOverlay = (0, import_data.useSelect)(() => (0, import_is_within_overlay.isWithinNavigationOverlay)(), []);
  const enableContrastChecking = import_element.Platform.OS === "web";
  (0, import_element.useEffect)(() => {
    if (!enableContrastChecking) {
      return;
    }
    (0, import_utils.detectColors)(
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
      (0, import_utils.detectColors)(
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
  const colorGradientSettings = (0, import_block_editor.__experimentalUseMultipleOriginColorsAndGradients)();
  if (!colorGradientSettings.hasColorsOrGradients) {
    return null;
  }
  const colorSettings = [
    {
      colorValue: textColor.color,
      label: (0, import_i18n.__)("Text"),
      onColorChange: setTextColor,
      resetAllFilter: () => setTextColor(),
      clearable: true,
      enableAlpha: true
    },
    {
      colorValue: backgroundColor.color,
      label: (0, import_i18n.__)("Background"),
      onColorChange: setBackgroundColor,
      resetAllFilter: () => setBackgroundColor(),
      clearable: true,
      enableAlpha: true
    }
  ];
  colorSettings.push(
    {
      colorValue: overlayTextColor.color,
      label: hasCustomOverlay || isWithinOverlay ? (0, import_i18n.__)("Submenu text") : (0, import_i18n.__)("Submenu & overlay text"),
      onColorChange: setOverlayTextColor,
      resetAllFilter: () => setOverlayTextColor(),
      clearable: true,
      enableAlpha: true
    },
    {
      colorValue: overlayBackgroundColor.color,
      label: hasCustomOverlay || isWithinOverlay ? (0, import_i18n.__)("Submenu background") : (0, import_i18n.__)("Submenu & overlay background"),
      onColorChange: setOverlayBackgroundColor,
      resetAllFilter: () => setOverlayBackgroundColor(),
      clearable: true,
      enableAlpha: true
    }
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_block_editor.__experimentalColorGradientSettingsDropdown,
      {
        __experimentalIsRenderedInSidebar: true,
        settings: colorSettings,
        panelId: clientId,
        ...colorGradientSettings,
        gradients: [],
        disableCustomGradients: true
      }
    ),
    enableContrastChecking && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_block_editor.ContrastChecker,
        {
          backgroundColor: detectedBackgroundColor,
          textColor: detectedColor
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_block_editor.ContrastChecker,
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
  const setRef = (0, import_element.useCallback)(
    (postId) => {
      setAttributes({ ref: postId });
    },
    [setAttributes]
  );
  (0, import_element.useEffect)(() => {
    if (orientation === "horizontal" && submenuVisibility === "always") {
      setAttributes({
        submenuVisibility: "hover",
        showSubmenuIcon: true
      });
    }
  }, [orientation, submenuVisibility, setAttributes]);
  const recursionId = `navigationMenu/${ref}`;
  const recursionDetected = (0, import_block_editor.useHasRecursion)(recursionId);
  const { isPreviewMode, onNavigateToEntityRecord, currentTheme } = (0, import_data.useSelect)(
    (select) => {
      const { getSettings } = select(import_block_editor.store);
      const settings = getSettings();
      return {
        isPreviewMode: settings.isPreviewMode,
        onNavigateToEntityRecord: settings?.onNavigateToEntityRecord,
        // Needed to construct the template part ID for the overlay preview.
        currentTheme: select(import_core_data.store).getCurrentTheme()?.stylesheet
      };
    },
    []
  );
  const hasAlreadyRendered = isPreviewMode ? false : recursionDetected;
  const blockEditingMode = (0, import_block_editor.useBlockEditingMode)();
  const { records: classicMenus } = (0, import_core_data.useEntityRecords)("root", "menu", {
    per_page: -1,
    context: "view"
  });
  const [showNavigationMenuStatusNotice, hideNavigationMenuStatusNotice] = (0, import_use_navigation_notice.default)({
    name: "block-library/core/navigation/status"
  });
  const [showClassicMenuConversionNotice, hideClassicMenuConversionNotice] = (0, import_use_navigation_notice.default)({
    name: "block-library/core/navigation/classic-menu-conversion"
  });
  const [
    showNavigationMenuPermissionsNotice,
    hideNavigationMenuPermissionsNotice
  ] = (0, import_use_navigation_notice.default)({
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
  } = (0, import_use_create_navigation_menu.default)(clientId);
  const createUntitledEmptyNavigationMenu = async () => {
    await createNavigationMenu("");
  };
  const {
    hasUncontrolledInnerBlocks,
    uncontrolledInnerBlocks,
    isInnerBlockSelected,
    innerBlocks
  } = (0, import_use_inner_blocks.useInnerBlocks)(clientId);
  const hasPageListWithSubmenuRef = (0, import_element.useRef)(false);
  const hasSubmenus = (0, import_data.useSelect)(
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
      const { getBlocks } = select(import_block_editor.store);
      const pageListBlocks = getBlocks(pageList.clientId);
      if (pageListBlocks.length > 0) {
        hasPageListWithSubmenuRef.current = true;
        return true;
      }
      return false;
    },
    [innerBlocks]
  );
  const { records: overlayTemplateParts } = (0, import_core_data.useEntityRecords)(
    "postType",
    "wp_template_part",
    {
      per_page: -1
    }
  );
  const hasOverlays = overlayTemplateParts?.some(
    (templatePart) => templatePart.area === import_constants.NAVIGATION_OVERLAY_TEMPLATE_PART_AREA
  ) ?? false;
  const {
    replaceInnerBlocks,
    selectBlock,
    __unstableMarkNextChangeAsNotPersistent
  } = (0, import_data.useDispatch)(import_block_editor.store);
  const [isResponsiveMenuOpen, setResponsiveMenuVisibility] = (0, import_element.useState)(false);
  const [overlayMenuPreview, setOverlayMenuPreview] = (0, import_element.useState)(false);
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
  } = (0, import_use_navigation_menu.default)(ref);
  const navMenuResolvedButMissing = hasResolvedNavigationMenus && isNavigationMenuMissing;
  const {
    convert: convertClassicMenu,
    status: classicMenuConversionStatus,
    error: classicMenuConversionError
  } = (0, import_use_convert_classic_menu_to_block_menu.default)(createNavigationMenu);
  const isConvertingClassicMenu = classicMenuConversionStatus === import_use_convert_classic_menu_to_block_menu.CLASSIC_MENU_CONVERSION_PENDING;
  const handleUpdateMenu = (0, import_element.useCallback)(
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
  const { getNavigationFallbackId } = (0, import_lock_unlock.unlock)((0, import_data.useSelect)(import_core_data.store));
  const navigationFallbackId = !(ref || hasUnsavedBlocks) ? getNavigationFallbackId() : null;
  (0, import_element.useEffect)(() => {
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
  const navRef = (0, import_element.useRef)();
  const isWithinOverlay = (0, import_data.useSelect)(() => (0, import_is_within_overlay.isWithinNavigationOverlay)(), []);
  const TagName = isWithinOverlay ? "div" : "nav";
  const isPlaceholder = !ref && !isCreatingNavigationMenu && !isConvertingClassicMenu && hasResolvedNavigationMenus && classicMenus?.length === 0 && !hasUncontrolledInnerBlocks;
  const isLoading = !hasResolvedNavigationMenus || isCreatingNavigationMenu || isConvertingClassicMenu || !!(ref && !isEntityAvailable && !isConvertingClassicMenu);
  const textDecoration = attributes.style?.typography?.textDecoration;
  const hasBlockOverlay = (0, import_data.useSelect)(
    (select) => select(import_block_editor.store).__unstableHasActiveBlockOverlayActive(
      clientId
    ),
    [clientId]
  );
  const hasSetOverlayDefault = (0, import_element.useRef)(false);
  (0, import_element.useEffect)(() => {
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
  const blockProps = (0, import_block_editor.useBlockProps)({
    ref: navRef,
    className: (0, import_clsx.default)(
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
        [(0, import_block_editor.getColorClassName)("color", textColor?.slug)]: !!textColor?.slug,
        "has-background": !!backgroundColor.color || backgroundColor.class,
        [(0, import_block_editor.getColorClassName)(
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
  (0, import_element.useEffect)(() => {
    hideNavigationMenuStatusNotice();
    if (isCreatingNavigationMenu) {
      (0, import_a11y.speak)((0, import_i18n.__)(`Creating Navigation Menu.`));
    }
    if (createNavigationMenuIsSuccess) {
      handleUpdateMenu(createNavigationMenuPost?.id, {
        focusNavigationBlock: true
      });
      showNavigationMenuStatusNotice(
        (0, import_i18n.__)(`Navigation Menu successfully created.`)
      );
    }
    if (createNavigationMenuIsError) {
      showNavigationMenuStatusNotice(
        (0, import_i18n.__)("Failed to create Navigation Menu.")
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
  (0, import_element.useEffect)(() => {
    hideClassicMenuConversionNotice();
    if (classicMenuConversionStatus === import_use_convert_classic_menu_to_block_menu.CLASSIC_MENU_CONVERSION_PENDING) {
      (0, import_a11y.speak)((0, import_i18n.__)("Classic menu importing."));
    }
    if (classicMenuConversionStatus === import_use_convert_classic_menu_to_block_menu.CLASSIC_MENU_CONVERSION_SUCCESS) {
      showClassicMenuConversionNotice(
        (0, import_i18n.__)("Classic menu imported successfully.")
      );
      handleUpdateMenu(createNavigationMenuPost?.id, {
        focusNavigationBlock: true
      });
    }
    if (classicMenuConversionStatus === import_use_convert_classic_menu_to_block_menu.CLASSIC_MENU_CONVERSION_ERROR) {
      showClassicMenuConversionNotice(
        (0, import_i18n.__)("Classic menu import failed.")
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
  (0, import_element.useEffect)(() => {
    if (!isSelected && !isInnerBlockSelected) {
      hideNavigationMenuPermissionsNotice();
    }
    if (isSelected || isInnerBlockSelected) {
      if (ref && !navMenuResolvedButMissing && hasResolvedCanUserUpdateNavigationMenu && !canUserUpdateNavigationMenu) {
        showNavigationMenuPermissionsNotice(
          (0, import_i18n.__)(
            "You do not have permission to edit this Menu. Any changes made will not be saved."
          )
        );
      }
      if (!ref && hasResolvedCanUserCreateNavigationMenus && !canUserCreateNavigationMenus) {
        showNavigationMenuPermissionsNotice(
          (0, import_i18n.__)(
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
  const overlayMenuPreviewClasses = (0, import_clsx.default)(
    "wp-block-navigation__overlay-menu-preview",
    { open: overlayMenuPreview }
  );
  const submenuAccessibilityNotice = !showSubmenuIcon && submenuVisibility !== "click" && submenuVisibility !== "always" ? (0, import_i18n.__)(
    'The current menu options offer reduced accessibility for users and are not recommended. Enabling either "Open on Click" or "Show arrow" offers enhanced accessibility by allowing keyboard users to browse submenus selectively.'
  ) : "";
  const isFirstRender = (0, import_element.useRef)(true);
  (0, import_element.useEffect)(() => {
    if (!isFirstRender.current && submenuAccessibilityNotice) {
      (0, import_a11y.speak)(submenuAccessibilityNotice);
    }
    isFirstRender.current = false;
  }, [submenuAccessibilityNotice]);
  const overlayMenuPreviewId = (0, import_compose.useInstanceId)(
    import_overlay_menu_preview.default,
    `overlay-menu-preview`
  );
  const dropdownMenuProps = (0, import_hooks.useToolsPanelDropdownMenuProps)();
  const stylingInspectorControls = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.InspectorControls, { children: hasSubmenus && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.__experimentalToolsPanel,
      {
        label: (0, import_i18n.__)("Display"),
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
        children: hasSubmenus && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "wp-block-navigation__submenu-header", children: (0, import_i18n.__)("Submenus") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.__experimentalToolsPanelItem,
            {
              hasValue: () => submenuVisibility !== "hover",
              label: (0, import_i18n.__)("Submenu Visibility"),
              onDeselect: () => setAttributes({
                submenuVisibility: "hover"
              }),
              isShownByDefault: true,
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                import_components.__experimentalToggleGroupControl,
                {
                  __next40pxDefaultSize: true,
                  label: (0, import_i18n.__)("Submenu Visibility"),
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
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      import_components.__experimentalToggleGroupControlOption,
                      {
                        value: "hover",
                        label: (0, import_i18n.__)("Hover")
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      import_components.__experimentalToggleGroupControlOption,
                      {
                        value: "click",
                        label: (0, import_i18n.__)("Click")
                      }
                    ),
                    orientation === "vertical" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      import_components.__experimentalToggleGroupControlOption,
                      {
                        value: "always",
                        label: (0, import_i18n.__)("Always")
                      }
                    )
                  ]
                }
              )
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.__experimentalToolsPanelItem,
            {
              hasValue: () => !showSubmenuIcon,
              label: (0, import_i18n.__)("Show arrow"),
              onDeselect: () => setAttributes({
                showSubmenuIcon: true
              }),
              isDisabled: submenuVisibility === "click" || submenuVisibility === "always",
              isShownByDefault: true,
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_components.ToggleControl,
                {
                  checked: showSubmenuIcon,
                  onChange: (value) => {
                    setAttributes({
                      showSubmenuIcon: value
                    });
                  },
                  disabled: submenuVisibility === "click" || submenuVisibility === "always",
                  label: (0, import_i18n.__)("Show arrow")
                }
              )
            }
          ),
          submenuAccessibilityNotice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Notice,
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
    !isWithinOverlay && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.InspectorControls, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_overlay_panel.default,
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
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.InspectorControls, { group: "color", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      TagName,
      {
        ...blockProps,
        "aria-describedby": !isPlaceholder ? accessibleDescriptionId : void 0,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_accessible_description.default, { id: accessibleDescriptionId, children: (0, import_i18n.__)("Unsaved Navigation Menu.") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_menu_inspector_controls.default,
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
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_responsive_wrapper.default,
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
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_unsaved_inner_blocks.default,
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
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TagName, { ...blockProps, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_menu_inspector_controls.default,
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
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_deleted_navigation_warning.default,
        {
          onCreateNew: createUntitledEmptyNavigationMenu
        }
      )
    ] });
  }
  if (isEntityAvailable && hasAlreadyRendered) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ...blockProps, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.Warning, { children: (0, import_i18n.__)("Block cannot be rendered inside itself.") }) });
  }
  const PlaceholderComponent = CustomPlaceholder ? CustomPlaceholder : import_placeholder.default;
  if (isPlaceholder && CustomPlaceholder) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TagName, { ...blockProps, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_core_data.EntityProvider, { kind: "postType", type: "wp_navigation", id: ref, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_block_editor.RecursionProvider, { uniqueId: recursionId, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_menu_inspector_controls.default,
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
    blockEditingMode === "contentOnly" && isEntityAvailable && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavigationAddPageButton, { clientId }),
    blockEditingMode === "default" && isEntityAvailable && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_block_editor.InspectorControls, { group: "advanced", children: [
      hasResolvedCanUserUpdateNavigationMenu && canUserUpdateNavigationMenu && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_navigation_menu_name_control.default, {}),
      hasResolvedCanUserDeleteNavigationMenu && canUserDeleteNavigationMenu && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_navigation_menu_delete_control.default,
        {
          onDelete: () => {
            replaceInnerBlocks(clientId, []);
            showNavigationMenuStatusNotice(
              (0, import_i18n.__)(
                "Navigation Menu successfully deleted."
              )
            );
          }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_manage_menus_button.default,
        {
          disabled: isManageMenusButtonDisabled,
          className: "wp-block-navigation-manage-menus-button"
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      TagName,
      {
        ...blockProps,
        "aria-describedby": !isPlaceholder && !isLoading ? accessibleDescriptionId : void 0,
        children: [
          isLoading && !isHiddenByDefault && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "wp-block-navigation__loading-indicator-container", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Spinner, { className: "wp-block-navigation__loading-indicator" }) }),
          (!isLoading || isHiddenByDefault) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_accessible_menu_description.default,
              {
                id: accessibleDescriptionId
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_responsive_wrapper.default,
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
                children: isEntityAvailable && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_inner_blocks.default,
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
var edit_default = (0, import_block_editor.withColors)(
  { textColor: "color" },
  { backgroundColor: "color" },
  { overlayBackgroundColor: "color" },
  { overlayTextColor: "color" }
)(Navigation);
//# sourceMappingURL=index.cjs.map
