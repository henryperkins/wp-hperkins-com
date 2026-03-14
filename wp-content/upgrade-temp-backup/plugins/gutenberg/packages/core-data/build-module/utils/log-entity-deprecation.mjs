// packages/core-data/src/utils/log-entity-deprecation.ts
import deprecated from "@wordpress/deprecated";
import { deprecatedEntities } from "../entities.mjs";
var loggedAlready = false;
function logEntityDeprecation(kind, name, functionName, {
  alternativeFunctionName,
  isShorthandSelector = false
} = {}) {
  const deprecation = deprecatedEntities[kind]?.[name];
  if (!deprecation) {
    return;
  }
  if (!loggedAlready) {
    const { alternative } = deprecation;
    const message = isShorthandSelector ? `'${functionName}'` : `The '${kind}', '${name}' entity (used via '${functionName}')`;
    let alternativeMessage = `the '${alternative.kind}', '${alternative.name}' entity`;
    if (alternativeFunctionName) {
      alternativeMessage += ` via the '${alternativeFunctionName}' function`;
    }
    deprecated(message, {
      ...deprecation,
      alternative: alternativeMessage
    });
  }
  loggedAlready = true;
  setTimeout(() => {
    loggedAlready = false;
  }, 0);
}
export {
  logEntityDeprecation as default
};
//# sourceMappingURL=log-entity-deprecation.mjs.map
