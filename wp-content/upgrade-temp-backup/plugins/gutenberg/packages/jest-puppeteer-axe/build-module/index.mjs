// packages/jest-puppeteer-axe/src/index.ts
import AxePuppeteer from "@axe-core/puppeteer";
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
  const axe = new AxePuppeteer(page);
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
//# sourceMappingURL=index.mjs.map
