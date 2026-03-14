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

// packages/edit-site/src/components/add-new-pattern/index.js
var add_new_pattern_exports = {};
__export(add_new_pattern_exports, {
  default: () => AddNewPattern
});
module.exports = __toCommonJS(add_new_pattern_exports);
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_data = require("@wordpress/data");
var import_router = require("@wordpress/router");
var import_patterns = require("@wordpress/patterns");
var import_notices = require("@wordpress/notices");
var import_core_data = require("@wordpress/core-data");
var import_editor = require("@wordpress/editor");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_constants = require("../../utils/constants.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { useHistory, useLocation } = (0, import_lock_unlock.unlock)(import_router.privateApis);
var { CreatePatternModal, useAddPatternCategory } = (0, import_lock_unlock.unlock)(
  import_patterns.privateApis
);
var { CreateTemplatePartModal } = (0, import_lock_unlock.unlock)(import_editor.privateApis);
function AddNewPattern() {
  const history = useHistory();
  const location = useLocation();
  const [showPatternModal, setShowPatternModal] = (0, import_element.useState)(false);
  const [showTemplatePartModal, setShowTemplatePartModal] = (0, import_element.useState)(false);
  const { createPatternFromFile } = (0, import_lock_unlock.unlock)((0, import_data.useDispatch)(import_patterns.store));
  const { createSuccessNotice, createErrorNotice } = (0, import_data.useDispatch)(import_notices.store);
  const patternUploadInputRef = (0, import_element.useRef)();
  const {
    isBlockBasedTheme,
    addNewPatternLabel,
    addNewTemplatePartLabel,
    canCreatePattern,
    canCreateTemplatePart
  } = (0, import_data.useSelect)((select) => {
    const { getCurrentTheme, getPostType, canUser } = select(import_core_data.store);
    return {
      isBlockBasedTheme: getCurrentTheme()?.is_block_theme,
      addNewPatternLabel: getPostType(import_constants.PATTERN_TYPES.user)?.labels?.add_new_item,
      addNewTemplatePartLabel: getPostType(import_constants.TEMPLATE_PART_POST_TYPE)?.labels?.add_new_item,
      // Blocks refers to the wp_block post type, this checks the ability to create a post of that type.
      canCreatePattern: canUser("create", {
        kind: "postType",
        name: import_constants.PATTERN_TYPES.user
      }),
      canCreateTemplatePart: canUser("create", {
        kind: "postType",
        name: import_constants.TEMPLATE_PART_POST_TYPE
      })
    };
  }, []);
  function handleCreatePattern({ pattern }) {
    setShowPatternModal(false);
    history.navigate(
      `/${import_constants.PATTERN_TYPES.user}/${pattern.id}?canvas=edit`
    );
  }
  function handleCreateTemplatePart(templatePart) {
    setShowTemplatePartModal(false);
    history.navigate(
      `/${import_constants.TEMPLATE_PART_POST_TYPE}/${templatePart.id}?canvas=edit`
    );
  }
  function handleError() {
    setShowPatternModal(false);
    setShowTemplatePartModal(false);
  }
  const controls = [];
  if (canCreatePattern) {
    controls.push({
      icon: import_icons.symbol,
      onClick: () => setShowPatternModal(true),
      title: addNewPatternLabel
    });
  }
  if (isBlockBasedTheme && canCreateTemplatePart) {
    controls.push({
      icon: import_icons.symbolFilled,
      onClick: () => setShowTemplatePartModal(true),
      title: addNewTemplatePartLabel
    });
  }
  if (canCreatePattern) {
    controls.push({
      icon: import_icons.upload,
      onClick: () => {
        patternUploadInputRef.current.click();
      },
      title: (0, import_i18n.__)("Import pattern from JSON")
    });
  }
  const { categoryMap, findOrCreateTerm } = useAddPatternCategory();
  if (controls.length === 0) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    addNewPatternLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.DropdownMenu,
      {
        controls,
        icon: null,
        toggleProps: {
          variant: "primary",
          showTooltip: false,
          __next40pxDefaultSize: true
        },
        text: addNewPatternLabel,
        label: addNewPatternLabel
      }
    ),
    showPatternModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      CreatePatternModal,
      {
        onClose: () => setShowPatternModal(false),
        onSuccess: handleCreatePattern,
        onError: handleError
      }
    ),
    showTemplatePartModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      CreateTemplatePartModal,
      {
        closeModal: () => setShowTemplatePartModal(false),
        blocks: [],
        onCreate: handleCreateTemplatePart,
        onError: handleError
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "input",
      {
        type: "file",
        accept: ".json",
        hidden: true,
        ref: patternUploadInputRef,
        onChange: async (event) => {
          const file = event.target.files?.[0];
          if (!file) {
            return;
          }
          try {
            let currentCategoryId;
            if (location.query.postType !== import_constants.TEMPLATE_PART_POST_TYPE) {
              const currentCategory = Array.from(
                categoryMap.values()
              ).find(
                (term) => term.name === location.query.categoryId
              );
              if (currentCategory) {
                currentCategoryId = currentCategory.id || await findOrCreateTerm(
                  currentCategory.label
                );
              }
            }
            const pattern = await createPatternFromFile(
              file,
              currentCategoryId ? [currentCategoryId] : void 0
            );
            if (!currentCategoryId && location.query.categoryId !== "my-patterns") {
              history.navigate(
                `/pattern?categoryId=${import_constants.PATTERN_DEFAULT_CATEGORY}`
              );
            }
            createSuccessNotice(
              (0, import_i18n.sprintf)(
                // translators: %s: The imported pattern's title.
                (0, import_i18n.__)('Imported "%s" from JSON.'),
                pattern.title.raw
              ),
              {
                type: "snackbar",
                id: "import-pattern-success"
              }
            );
          } catch (err) {
            createErrorNotice(err.message, {
              type: "snackbar",
              id: "import-pattern-error"
            });
          } finally {
            event.target.value = "";
          }
        }
      }
    )
  ] });
}
//# sourceMappingURL=index.cjs.map
