// packages/editor/src/components/autosave-monitor/index.js
import { Component } from "@wordpress/element";
import { compose } from "@wordpress/compose";
import { withSelect, withDispatch } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { store as editorStore } from "../../store/index.mjs";
var AutosaveMonitor = class extends Component {
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
var autosave_monitor_default = compose([
  withSelect((select, ownProps) => {
    const { getReferenceByDistinctEdits } = select(coreStore);
    const {
      isEditedPostDirty,
      isEditedPostAutosaveable,
      isAutosavingPost,
      getEditorSettings
    } = select(editorStore);
    const { interval = getEditorSettings().autosaveInterval } = ownProps;
    return {
      editsReference: getReferenceByDistinctEdits(),
      isDirty: isEditedPostDirty(),
      isAutosaveable: isEditedPostAutosaveable(),
      isAutosaving: isAutosavingPost(),
      interval
    };
  }),
  withDispatch((dispatch, ownProps) => ({
    autosave() {
      const { autosave = dispatch(editorStore).autosave } = ownProps;
      autosave();
    }
  }))
])(AutosaveMonitor);
export {
  AutosaveMonitor,
  autosave_monitor_default as default
};
//# sourceMappingURL=index.mjs.map
