// packages/plugins/src/components/plugin-error-boundary/index.tsx
import { Component } from "@wordpress/element";
var PluginErrorBoundary = class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    const { name, onError } = this.props;
    if (onError) {
      onError(name, error);
    }
  }
  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }
    return null;
  }
};
export {
  PluginErrorBoundary
};
//# sourceMappingURL=index.mjs.map
