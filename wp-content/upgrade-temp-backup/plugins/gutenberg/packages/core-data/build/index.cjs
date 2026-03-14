"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/core-data/src/index.js
var index_exports = {};
__export(index_exports, {
  EntityProvider: () => import_entity_provider.default,
  SelectionType: () => import_crdt_user_selections.SelectionType,
  store: () => store
});
module.exports = __toCommonJS(index_exports);
var import_data = require("@wordpress/data");
var import_reducer = __toESM(require("./reducer.cjs"));
var selectors = __toESM(require("./selectors.cjs"));
var privateSelectors = __toESM(require("./private-selectors.cjs"));
var actions = __toESM(require("./actions.cjs"));
var privateActions = __toESM(require("./private-actions.cjs"));
var resolvers = __toESM(require("./resolvers.cjs"));
var import_actions = __toESM(require("./locks/actions.cjs"));
var import_entities = require("./entities.cjs");
var import_name = require("./name.cjs");
var import_lock_unlock = require("./lock-unlock.cjs");
var import_dynamic_entities = require("./dynamic-entities.cjs");
var import_log_entity_deprecation = __toESM(require("./utils/log-entity-deprecation.cjs"));
var import_crdt_user_selections = require("./utils/crdt-user-selections.cjs");
var import_entity_provider = __toESM(require("./entity-provider.cjs"));
__reExport(index_exports, require("./entity-provider.cjs"), module.exports);
__reExport(index_exports, require("./entity-types/index.cjs"), module.exports);
__reExport(index_exports, require("./awareness/types.cjs"), module.exports);
__reExport(index_exports, require("./fetch/index.cjs"), module.exports);
__reExport(index_exports, require("./hooks/index.cjs"), module.exports);
__reExport(index_exports, require("./private-apis.cjs"), module.exports);
__reExport(index_exports, require("./types.cjs"), module.exports);
var entitiesConfig = [
  ...import_entities.rootEntitiesConfig,
  ...import_entities.additionalEntityConfigLoaders.filter((config) => !!config.name)
];
var entitySelectors = entitiesConfig.reduce((result, entity) => {
  const { kind, name, plural } = entity;
  const getEntityRecordMethodName = (0, import_entities.getMethodName)(kind, name);
  result[getEntityRecordMethodName] = (state, key, query) => {
    (0, import_log_entity_deprecation.default)(kind, name, getEntityRecordMethodName, {
      isShorthandSelector: true,
      alternativeFunctionName: "getEntityRecord"
    });
    return selectors.getEntityRecord(state, kind, name, key, query);
  };
  if (plural) {
    const getEntityRecordsMethodName = (0, import_entities.getMethodName)(kind, plural, "get");
    result[getEntityRecordsMethodName] = (state, query) => {
      (0, import_log_entity_deprecation.default)(kind, name, getEntityRecordsMethodName, {
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
  const getEntityRecordMethodName = (0, import_entities.getMethodName)(kind, name);
  result[getEntityRecordMethodName] = (key, query) => {
    (0, import_log_entity_deprecation.default)(kind, name, getEntityRecordMethodName, {
      isShorthandSelector: true,
      alternativeFunctionName: "getEntityRecord"
    });
    return resolvers.getEntityRecord(kind, name, key, query);
  };
  if (plural) {
    const getEntityRecordsMethodName = (0, import_entities.getMethodName)(kind, plural, "get");
    result[getEntityRecordsMethodName] = (...args) => {
      (0, import_log_entity_deprecation.default)(kind, plural, getEntityRecordsMethodName, {
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
  const saveEntityRecordMethodName = (0, import_entities.getMethodName)(kind, name, "save");
  result[saveEntityRecordMethodName] = (record, options) => {
    (0, import_log_entity_deprecation.default)(kind, name, saveEntityRecordMethodName, {
      isShorthandSelector: true,
      alternativeFunctionName: "saveEntityRecord"
    });
    return actions.saveEntityRecord(kind, name, record, options);
  };
  const deleteEntityRecordMethodName = (0, import_entities.getMethodName)(kind, name, "delete");
  result[deleteEntityRecordMethodName] = (key, query, options) => {
    (0, import_log_entity_deprecation.default)(kind, name, deleteEntityRecordMethodName, {
      isShorthandSelector: true,
      alternativeFunctionName: "deleteEntityRecord"
    });
    return actions.deleteEntityRecord(kind, name, key, query, options);
  };
  return result;
}, {});
var storeConfig = () => ({
  reducer: import_reducer.default,
  actions: {
    ...import_dynamic_entities.dynamicActions,
    ...actions,
    ...entityActions,
    ...(0, import_actions.default)()
  },
  selectors: {
    ...import_dynamic_entities.dynamicSelectors,
    ...selectors,
    ...entitySelectors
  },
  resolvers: { ...resolvers, ...entityResolvers }
});
var store = (0, import_data.createReduxStore)(import_name.STORE_NAME, storeConfig());
(0, import_lock_unlock.unlock)(store).registerPrivateSelectors(privateSelectors);
(0, import_lock_unlock.unlock)(store).registerPrivateActions(privateActions);
(0, import_data.register)(store);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EntityProvider,
  SelectionType,
  store,
  ...require("./entity-provider.cjs"),
  ...require("./entity-types/index.cjs"),
  ...require("./awareness/types.cjs"),
  ...require("./fetch/index.cjs"),
  ...require("./hooks/index.cjs"),
  ...require("./private-apis.cjs"),
  ...require("./types.cjs")
});
//# sourceMappingURL=index.cjs.map
