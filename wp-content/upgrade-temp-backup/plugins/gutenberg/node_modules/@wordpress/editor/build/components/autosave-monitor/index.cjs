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

// packages/editor/src/components/autosave-monitor/index.js
var autosave_monitor_exports = {};
__export(autosave_monitor_exports, {
  AutosaveMonitor: () => AutosaveMonitor,
  default: () => autosave_monitor_default
});
module.exports = __toCommonJS(autosave_monitor_exports);
var import_element = require("@wordpress/element");
var import_compose = require("@wordpress/compose");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_store = require("../../store/index.cjs");
var AutosaveMonitor = class extends import_element.Component {
  constructor(props) {
    super(props);
    this.needsAutosave = !!(props.isDirty && props.isAutosaveable);
  }
  componentDidMount() {
    if (!this.props.disableIntervalChecks) {
      this.setAutosaveTimer();
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.disableIntervalChecks) {
      if (this.props.editsReference !== prevProps.editsReference) {
        this.props.autosave();
      }
      return;
    }
    if (this.props.interval !== prevProps.interval) {
      clearTimeout(this.timerId);
      this.setAutosaveTimer();
    }
    if (!this.props.isDirty) {
      this.needsAutosave = false;
      return;
    }
    if (this.props.isAutosaving && !prevProps.isAutosaving) {
      this.needsAutosave = false;
      return;
    }
    if (this.props.editsReference !== prevProps.editsReference) {
      this.needsAutosave = true;
    }
  }
  componentWillUnmount() {
    clearTimeout(this.timerId);
  }
  setAutosaveTimer(timeout = this.props.interval * 1e3) {
    this.timerId = setTimeout(() => {
      this.autosaveTimerHandler();
    }, timeout);
  }
  autosaveTimerHandler() {
    if (!this.props.isAutosaveable) {
      this.setAutosaveTimer(1e3);
      return;
    }
    if (this.needsAutosave) {
      this.needsAutosave = false;
      this.props.autosave();
    }
    this.setAutosaveTimer();
  }
  render() {
    return null;
  }
};
var autosave_monitor_default = (0, import_compose.compose)([
  (0, import_data.withSelect)((select, ownProps) => {
    const { getReferenceByDistinctEdits } = select(import_core_data.store);
    const {
      isEditedPostDirty,
      isEditedPostAutosaveable,
      isAutosavingPost,
      getEditorSettings
    } = select(import_store.store);
    const { interval = getEditorSettings().autosaveInterval } = ownProps;
    return {
      editsReference: getReferenceByDistinctEdits(),
      isDirty: isEditedPostDirty(),
      isAutosaveable: isEditedPostAutosaveable(),
      isAutosaving: isAutosavingPost(),
      interval
    };
  }),
  (0, import_data.withDispatch)((dispatch, ownProps) => ({
    autosave() {
      const { autosave = dispatch(import_store.store).autosave } = ownProps;
      autosave();
    }
  }))
])(AutosaveMonitor);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AutosaveMonitor
});
//# sourceMappingURL=index.cjs.map
