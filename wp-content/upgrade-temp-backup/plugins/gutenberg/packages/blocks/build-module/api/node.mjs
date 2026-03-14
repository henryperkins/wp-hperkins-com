// packages/blocks/src/api/node.js
import deprecated from "@wordpress/deprecated";
import * as children from "./children.mjs";
function isNodeOfType(node, type) {
  deprecated("wp.blocks.node.isNodeOfType", {
    since: "6.1",
    version: "6.3",
    link: "https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/introducing-attributes-and-editable-fields/"
  });
  return node && node.type === type;
}
function getNamedNodeMapAsObject(nodeMap) {
  const result = {};
  for (let i = 0; i < nodeMap.length; i++) {
    const { name, value } = nodeMap[i];
    result[name] = value;
  }
  return result;
}
function fromDOM2(domNode) {
  deprecated("wp.blocks.node.fromDOM", {
    since: "6.1",
    version: "6.3",
    alternative: "wp.richText.create",
    link: "https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/introducing-attributes-and-editable-fields/"
  });
  if (domNode.nodeType === domNode.TEXT_NODE) {
    return domNode.nodeValue;
  }
  if (domNode.nodeType !== domNode.ELEMENT_NODE) {
    throw new TypeError(
      "A block node can only be created from a node of type text or element."
    );
  }
  return {
    type: domNode.nodeName.toLowerCase(),
    props: {
      ...getNamedNodeMapAsObject(domNode.attributes),
      children: children.fromDOM(domNode.childNodes)
    }
  };
}
function toHTML2(node) {
  deprecated("wp.blocks.node.toHTML", {
    since: "6.1",
    version: "6.3",
    alternative: "wp.richText.toHTMLString",
    link: "https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/introducing-attributes-and-editable-fields/"
  });
  return children.toHTML([node]);
}
function matcher(selector) {
  deprecated("wp.blocks.node.matcher", {
    since: "6.1",
    version: "6.3",
    alternative: "html source",
    link: "https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/introducing-attributes-and-editable-fields/"
  });
  return (domNode) => {
    let match = domNode;
    if (selector) {
      match = domNode.querySelector(selector);
    }
    try {
      return fromDOM2(match);
    } catch (error) {
      return null;
    }
  };
}
var node_default = {
  isNodeOfType,
  fromDOM: fromDOM2,
  toHTML: toHTML2,
  matcher
};
export {
  node_default as default,
  fromDOM2 as fromDOM,
  getNamedNodeMapAsObject,
  matcher,
  toHTML2 as toHTML
};
//# sourceMappingURL=node.mjs.map
