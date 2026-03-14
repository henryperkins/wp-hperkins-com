// packages/editor/src/components/pattern-duplicate-modal/index.js
import { useDispatch, useSelect } from "@wordpress/data";
import { privateApis as patternsPrivateApis } from "@wordpress/patterns";
import { store as coreStore } from "@wordpress/core-data";
import { store as interfaceStore } from "@wordpress/interface";
import { unlock } from "../../lock-unlock.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { PATTERN_POST_TYPE } from "../../store/constants.mjs";
import { jsx } from "react/jsx-runtime";
var { DuplicatePatternModal } = unlock(patternsPrivateApis);
var modalName = "editor/pattern-duplicate";
function PatternDuplicateModal() {
  const isActive = useSelect(
    (select) => select(interfaceStore).isModalActive(modalName)
  );
  const { record, postType } = useSelect(
    (select) => {
      if (!isActive) {
        return {};
      }
      const { getCurrentPostType, getCurrentPostId } = select(editorStore);
      const { getEditedEntityRecord } = select(coreStore);
      const _postType = getCurrentPostType();
      return {
        record: getEditedEntityRecord(
          "postType",
          _postType,
          getCurrentPostId()
        ),
        postType: _postType
      };
    },
    [isActive]
  );
  const { closeModal } = useDispatch(interfaceStore);
  if (!isActive || postType !== PATTERN_POST_TYPE) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    DuplicatePatternModal,
    {
      onClose: closeModal,
      onSuccess: () => closeModal(),
      pattern: record
    }
  );
}
export {
  PatternDuplicateModal as default,
  modalName
};
//# sourceMappingURL=index.mjs.map
