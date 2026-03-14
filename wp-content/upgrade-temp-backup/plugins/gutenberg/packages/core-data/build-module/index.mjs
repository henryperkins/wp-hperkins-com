// packages/core-data/src/index.js
import { createReduxStore, register } from "@wordpress/data";
import reducer from "./reducer.mjs";
import * as selectors from "./selectors.mjs";
import * as privateSelectors from "./private-selectors.mjs";
import * as actions from "./actions.mjs";
import * as privateActions from "./private-actions.mjs";
import * as resolvers from "./resolvers.mjs";
import createLocksActions from "./locks/actions.mjs";
import {
  rootEntitiesConfig,
  additionalEntityConfigLoaders,
  getMethodName
} from "./entities.mjs";
import { STORE_NAME } from "./name.mjs";
import { unlock } from "./lock-unlock.mjs";
import { dynamicActions, dynamicSelectors } from "./dynamic-entities.mjs";
import logEntityDeprecation from "./utils/log-entity-deprecation.mjs";
import { SelectionType } from "./utils/crdt-user-selections.mjs";
import { default as default2 } from "./entity-provider.mjs";
export * from "./entity-provider.mjs";
export * from "./entity-types/index.mjs";
export * from "./awareness/types.mjs";
export * from "./fetch/index.mjs";
export * from "./hooks/index.mjs";
export * from "./private-apis.mjs";
export * from "./types.mjs";
var entitiesConfig = [
  ...rootEntitiesConfig,
  ...additionalEntityConfigLoaders.filter((config) => !!config.name)
];
var entitySelectors = entitiesConfig.reduce((result, entity) => {
  const { kind, name, plural } = entity;
  const getEntityRecordMethodName = getMethodName(kind, name);
  result[getEntityRecordMethodName] = (state, key, query) => {
    logEntityDeprecation(kind, name, getEntityRecordMethodName, {
      isShorthandSelector: true,
      alternativeFunctionName: "getEntityRecord"
    });
    return selectors.getEntityRecord(state, kind, name, key, query);
  };
  if (plural) {
    const getEntityRecordsMethodName = getMethodName(kind, plural, "get");
    result[getEntityRecordsMethodName] = (state, query) => {
      logEntityDeprecation(kind, name, getEntityRecordsMethodName, {
        isShorthandSelector: true,
        alternativeFunctionName: "getEntityRecords"
      });
      return selectors.getEntityRecords(state, kind, name, query);
    };
  }
  return result;
}, {});
var entityResolvers = entitiesConfig.reduce((result, entity) => {
  const { kind, name, plural } = entity;
  const getEntityRecordMethodName = getMethodName(kind, name);
  result[getEntityRecordMethodName] = (key, query) => {
    logEntityDeprecation(kind, name, getEntityRecordMethodName, {
      isShorthandSelector: true,
      alternativeFunctionName: "getEntityRecord"
    });
    return resolvers.getEntityRecord(kind, name, key, query);
  };
  if (plural) {
    const getEntityRecordsMethodName = getMethodName(kind, plural, "get");
    result[getEntityRecordsMethodName] = (...args) => {
      logEntityDeprecation(kind, plural, getEntityRecordsMethodName, {
        isShorthandSelector: true,
        alternativeFunctionName: "getEntityRecords"
      });
      return resolvers.getEntityRecords(kind, name, ...args);
    };
    result[getEntityRecordsMethodName].shouldInvalidate = (action) => resolvers.getEntityRecords.shouldInvalidate(action, kind, name);
  }
  return result;
}, {});
var entityActions = entitiesConfig.reduce((result, entity) => {
  const { kind, name } = entity;
  const saveEntityRecordMethodName = getMethodName(kind, name, "save");
  result[saveEntityRecordMethodName] = (record, options) => {
    logEntityDeprecation(kind, name, saveEntityRecordMethodName, {
      isShorthandSelector: true,
      alternativeFunctionName: "saveEntityRecord"
    });
    return actions.saveEntityRecord(kind, name, record, options);
  };
  const deleteEntityRecordMethodName = getMethodName(kind, name, "delete");
  result[deleteEntityRecordMethodName] = (key, query, options) => {
    logEntityDeprecation(kind, name, deleteEntityRecordMethodName, {
      isShorthandSelector: true,
      alternativeFunctionName: "deleteEntityRecord"
    });
    return actions.deleteEntityRecord(kind, name, key, query, options);
  };
  return result;
}, {});
var storeConfig = () => ({
  reducer,
  actions: {
    ...dynamicActions,
    ...actions,
    ...entityActions,
    ...createLocksActions()
  },
  selectors: {
    ...dynamicSelectors,
    ...selectors,
    ...entitySelectors
  },
  resolvers: { ...resolvers, ...entityResolvers }
});
var store = createReduxStore(STORE_NAME, storeConfig());
unlock(store).registerPrivateSelectors(privateSelectors);
unlock(store).registerPrivateActions(privateActions);
register(store);
export {
  default2 as EntityProvider,
  SelectionType,
  store
};
//# sourceMappingURL=index.mjs.map
