/**
 * Sets the value at path of object.
 * If a portion of path doesn’t exist, it’s created.
 * Arrays are created for missing index properties while objects are created
 * for all other missing properties.
 *
 * This function intentionally mutates the input object.
 *
 * Inspired by _.set().
 *
 * @see https://lodash.com/docs/4.17.15#set
 *
 * @todo Needs to be deduplicated with its copy in `@wordpress/core-data`.
 *
 * @param {Object} object Object to modify
 * @param {Array}  path   Path of the property to set.
 * @param {*}      value  Value to set.
 */
export default function setNestedValue(object: Object, path: any[], value: any): Object;
//# sourceMappingURL=set-nested-value.d.ts.map