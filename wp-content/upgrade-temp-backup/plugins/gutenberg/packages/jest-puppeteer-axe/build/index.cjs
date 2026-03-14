var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// packages/jest-puppeteer-axe/src/index.ts
var import_puppeteer = __toESM(require("@axe-core/puppeteer"));
function formatViolations(violations) {
  return violations.map(({ help, helpUrl, id, nodes }) => {
    let output = `Rule: "${id}" (${help})
Help: ${helpUrl}
Affected Nodes:
`;
    nodes.forEach((node) => {
      if (node.any.length) {
        output += `  ${node.target}
`;
        output += "    Fix ANY of the following:\n";
        node.any.forEach((item) => {
          output += `    - ${item.message}
`;
        });
      }
      if (node.all.length) {
        output += `  ${node.target}
`;
        output += "    Fix ALL of the following:\n";
        node.all.forEach((item) => {
          output += `      - ${item.message}.
`;
        });
      }
      if (node.none.length) {
        output += `  ${node.target}
`;
        output += "    Fix ALL of the following:\n";
        node.none.forEach((item) => {
          output += `      - ${item.message}.
`;
        });
      }
    });
    return output;
  }).join("\n");
}
async function toPassAxeTests(page, { include, exclude, disabledRules, options, config } = {}) {
  const axe = new import_puppeteer.default(page);
  if (include) {
    axe.include(include);
  }
  if (exclude) {
    axe.exclude(exclude);
  }
  if (options) {
    axe.options(options);
  }
  if (disabledRules) {
    axe.disableRules(disabledRules);
  }
  if (config) {
    axe.configure(config);
  }
  const { violations } = await axe.analyze();
  const pass = violations.length === 0;
  const message = pass ? () => {
    return this.utils.matcherHint(".not.toPassAxeTests") + "\n\nExpected page to contain accessibility check violations.\nNo violations found.";
  } : () => {
    return this.utils.matcherHint(".toPassAxeTests") + "\n\nExpected page to pass Axe accessibility tests.\nViolations found:\n" + this.utils.RECEIVED_COLOR(formatViolations(violations));
  };
  return {
    message,
    pass
  };
}
expect.extend({
  toPassAxeTests
});
//# sourceMappingURL=index.cjs.map
