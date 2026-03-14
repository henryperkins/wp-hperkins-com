// packages/annotations/src/format/annotation.js
import { __ } from "@wordpress/i18n";
import { applyFormat, removeFormat } from "@wordpress/rich-text";
import { STORE_NAME } from "../store/constants.mjs";
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
    record = applyFormat(
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
  return removeFormat(record, "core/annotation", 0, record.text.length);
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
  title: __("Annotation"),
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
        STORE_NAME
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
      removeAnnotation: dispatch(STORE_NAME).__experimentalRemoveAnnotation,
      updateAnnotationRange: dispatch(STORE_NAME).__experimentalUpdateAnnotationRange
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
export {
  annotation,
  applyAnnotations,
  removeAnnotations
};
//# sourceMappingURL=annotation.mjs.map
