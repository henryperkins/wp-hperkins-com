// packages/nux/src/store/actions.js
function triggerGuide(tipIds) {
  return {
    type: "TRIGGER_GUIDE",
    tipIds
  };
}
function dismissTip(id) {
  return {
    type: "DISMISS_TIP",
    id
  };
}
function disableTips() {
  return {
    type: "DISABLE_TIPS"
  };
}
function enableTips() {
  return {
    type: "ENABLE_TIPS"
  };
}
export {
  disableTips,
  dismissTip,
  enableTips,
  triggerGuide
};
//# sourceMappingURL=actions.mjs.map
