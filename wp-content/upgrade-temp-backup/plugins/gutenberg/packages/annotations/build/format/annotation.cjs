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

// packages/annotations/src/format/annotation.js
var annotation_exports = {};
__export(annotation_exports, {
  annotation: () => annotation,
  applyAnnotations: () => applyAnnotations,
  removeAnnotations: () => removeAnnotations
});
module.exports = __toCommonJS(annotation_exports);
var import_i18n = require("@wordpress/i18n");
var import_rich_text = require("@wordpress/rich-text");
var import_constants = require("../store/constants.cjs");
var FORMAT_NAME = "core/annotation";
var ANNOTATION_ATTRIBUTE_PREFIX = "annotation-text-";
function applyAnnotations(record, annotations = []) {
  annotations.forEach((annotation2) => {
    let { start, end } = annotation2;
    if (start > record.text.length) {
      start = record.text.length;
    }
    if (end > record.text.length) {
      end = record.text.length;
    }
    const className = ANNOTATION_ATTRIBUTE_PREFIX + annotation2.source;
    const id = ANNOTATION_ATTRIBUTE_PREFIX + annotation2.id;
    record = (0, import_rich_text.applyFormat)(
      record,
      {
        type: FORMAT_NAME,
        attributes: {
          className,
          id
        }
      },
      start,
      end
    );
  });
  return record;
}
function removeAnnotations(record) {
  return (0, import_rich_text.removeFormat)(record, "core/annotation", 0, record.text.length);
}
function retrieveAnnotationPositions(formats) {
  const positions = {};
  formats.forEach((characterFormats, i) => {
    characterFormats = characterFormats || [];
    characterFormats = characterFormats.filter(
      (format) => format.type === FORMAT_NAME
    );
    characterFormats.forEach((format) => {
      let { id } = format.attributes;
      id = id.replace(ANNOTATION_ATTRIBUTE_PREFIX, "");
      if (!positions.hasOwnProperty(id)) {
        positions[id] = {
          start: i
        };
      }
      positions[id].end = i + 1;
    });
  });
  return positions;
}
function updateAnnotationsWithPositions(annotations, positions, { removeAnnotation, updateAnnotationRange }) {
  annotations.forEach((currentAnnotation) => {
    const position = positions[currentAnnotation.id];
    if (!position) {
      removeAnnotation(currentAnnotation.id);
      return;
    }
    const { start, end } = currentAnnotation;
    if (start !== position.start || end !== position.end) {
      updateAnnotationRange(
        currentAnnotation.id,
        position.start,
        position.end
      );
    }
  });
}
var annotation = {
  name: FORMAT_NAME,
  title: (0, import_i18n.__)("Annotation"),
  tagName: "mark",
  className: "annotation-text",
  attributes: {
    className: "class",
    id: "id"
  },
  edit() {
    return null;
  },
  __experimentalGetPropsForEditableTreePreparation(select, { richTextIdentifier, blockClientId }) {
    return {
      annotations: select(
        import_constants.STORE_NAME
      ).__experimentalGetAnnotationsForRichText(
        blockClientId,
        richTextIdentifier
      )
    };
  },
  __experimentalCreatePrepareEditableTree({ annotations }) {
    return (formats, text) => {
      if (annotations.length === 0) {
        return formats;
      }
      let record = { formats, text };
      record = applyAnnotations(record, annotations);
      return record.formats;
    };
  },
  __experimentalGetPropsForEditableTreeChangeHandler(dispatch) {
    return {
      removeAnnotation: dispatch(import_constants.STORE_NAME).__experimentalRemoveAnnotation,
      updateAnnotationRange: dispatch(import_constants.STORE_NAME).__experimentalUpdateAnnotationRange
    };
  },
  __experimentalCreateOnChangeEditableValue(props) {
    return (formats) => {
      const positions = retrieveAnnotationPositions(formats);
      const { removeAnnotation, updateAnnotationRange, annotations } = props;
      updateAnnotationsWithPositions(annotations, positions, {
        removeAnnotation,
        updateAnnotationRange
      });
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  annotation,
  applyAnnotations,
  removeAnnotations
});
//# sourceMappingURL=annotation.cjs.map
