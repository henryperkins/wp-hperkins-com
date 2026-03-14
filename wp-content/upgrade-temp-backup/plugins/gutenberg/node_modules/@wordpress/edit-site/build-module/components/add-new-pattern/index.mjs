// packages/edit-site/src/components/add-new-pattern/index.js
import { DropdownMenu } from "@wordpress/components";
import { useState, useRef } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { symbol, symbolFilled, upload } from "@wordpress/icons";
import { useSelect, useDispatch } from "@wordpress/data";
import { privateApis as routerPrivateApis } from "@wordpress/router";
import {
  privateApis as editPatternsPrivateApis,
  store as patternsStore
} from "@wordpress/patterns";
import { store as noticesStore } from "@wordpress/notices";
import { store as coreStore } from "@wordpress/core-data";
import { privateApis as editorPrivateApis } from "@wordpress/editor";
import { unlock } from "../../lock-unlock.mjs";
import {
  PATTERN_TYPES,
  PATTERN_DEFAULT_CATEGORY,
  TEMPLATE_PART_POST_TYPE
} from "../../utils/constants.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { useHistory, useLocation } = unlock(routerPrivateApis);
var { CreatePatternModal, useAddPatternCategory } = unlock(
  editPatternsPrivateApis
);
var { CreateTemplatePartModal } = unlock(editorPrivateApis);
function AddNewPattern() {
  const history = useHistory();
  const location = useLocation();
  const [showPatternModal, setShowPatternModal] = useState(false);
  const [showTemplatePartModal, setShowTemplatePartModal] = useState(false);
  const { createPatternFromFile } = unlock(useDispatch(patternsStore));
  const { createSuccessNotice, createErrorNotice } = useDispatch(noticesStore);
  const patternUploadInputRef = useRef();
  const {
    isBlockBasedTheme,
    addNewPatternLabel,
    addNewTemplatePartLabel,
    canCreatePattern,
    canCreateTemplatePart
  } = useSelect((select) => {
    const { getCurrentTheme, getPostType, canUser } = select(coreStore);
    return {
      isBlockBasedTheme: getCurrentTheme()?.is_block_theme,
      addNewPatternLabel: getPostType(PATTERN_TYPES.user)?.labels?.add_new_item,
      addNewTemplatePartLabel: getPostType(TEMPLATE_PART_POST_TYPE)?.labels?.add_new_item,
      // Blocks refers to the wp_block post type, this checks the ability to create a post of that type.
      canCreatePattern: canUser("create", {
        kind: "postType",
        name: PATTERN_TYPES.user
      }),
      canCreateTemplatePart: canUser("create", {
        kind: "postType",
        name: TEMPLATE_PART_POST_TYPE
      })
    };
  }, []);
  function handleCreatePattern({ pattern }) {
    setShowPatternModal(false);
    history.navigate(
      `/${PATTERN_TYPES.user}/${pattern.id}?canvas=edit`
    );
  }
  function handleCreateTemplatePart(templatePart) {
    setShowTemplatePartModal(false);
    history.navigate(
      `/${TEMPLATE_PART_POST_TYPE}/${templatePart.id}?canvas=edit`
    );
  }
  function handleError() {
    setShowPatternModal(false);
    setShowTemplatePartModal(false);
  }
  const controls = [];
  if (canCreatePattern) {
    controls.push({
      icon: symbol,
      onClick: () => setShowPatternModal(true),
      title: addNewPatternLabel
    });
  }
  if (isBlockBasedTheme && canCreateTemplatePart) {
    controls.push({
      icon: symbolFilled,
      onClick: () => setShowTemplatePartModal(true),
      title: addNewTemplatePartLabel
    });
  }
  if (canCreatePattern) {
    controls.push({
      icon: upload,
      onClick: () => {
        patternUploadInputRef.current.click();
      },
      title: __("Import pattern from JSON")
    });
  }
  const { categoryMap, findOrCreateTerm } = useAddPatternCategory();
  if (controls.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    addNewPatternLabel && /* @__PURE__ */ jsx(
      DropdownMenu,
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
    showPatternModal && /* @__PURE__ */ jsx(
      CreatePatternModal,
      {
        onClose: () => setShowPatternModal(false),
        onSuccess: handleCreatePattern,
        onError: handleError
      }
    ),
    showTemplatePartModal && /* @__PURE__ */ jsx(
      CreateTemplatePartModal,
      {
        closeModal: () => setShowTemplatePartModal(false),
        blocks: [],
        onCreate: handleCreateTemplatePart,
        onError: handleError
      }
    ),
    /* @__PURE__ */ jsx(
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
            if (location.query.postType !== TEMPLATE_PART_POST_TYPE) {
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
                `/pattern?categoryId=${PATTERN_DEFAULT_CATEGORY}`
              );
            }
            createSuccessNotice(
              sprintf(
                // translators: %s: The imported pattern's title.
                __('Imported "%s" from JSON.'),
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
export {
  AddNewPattern as default
};
//# sourceMappingURL=index.mjs.map
