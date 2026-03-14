// packages/block-editor/src/components/block-list/block-crash-boundary.js
import { Component } from "@wordpress/element";
var BlockCrashBoundary = class extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      hasError: false
    };
  }
  componentDidCatch() {
    this.setState({
      hasError: true
    });
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
};
var block_crash_boundary_default = BlockCrashBoundary;
export {
  block_crash_boundary_default as default
};
//# sourceMappingURL=block-crash-boundary.mjs.map
