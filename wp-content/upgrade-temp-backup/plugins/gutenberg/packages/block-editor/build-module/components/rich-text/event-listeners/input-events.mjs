// packages/block-editor/src/components/rich-text/event-listeners/input-events.js
var input_events_default = (props) => (element) => {
  const { inputEvents } = props.current;
  function onInput(event) {
    for (const keyboardShortcut of inputEvents.current) {
      keyboardShortcut(event);
    }
  }
  element.addEventListener("input", onInput);
  return () => {
    element.removeEventListener("input", onInput);
  };
};
export {
  input_events_default as default
};
//# sourceMappingURL=input-events.mjs.map
