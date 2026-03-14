/**
 * Immutably sets a value inside an object. Like `lodash#set`, but returning a
 * new object. Treats nullish initial values as empty objects. Clones any
 * nested objects. Supports arrays, too.
 * Duplicated from `packages/global-styles-engine/src/utils/object.ts`
 *
 * @param object Object to set a value in.
 * @param path   Path in the object to modify.
 * @param value  New value to set.
 * @return Cloned object with the new value set.
 */
export declare function setImmutably(object: Object, path: string | number | (string | number)[], value: any): Object;
//# sourceMappingURL=set-immutably.d.ts.map