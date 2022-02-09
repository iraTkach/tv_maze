/**
 * @export
 * @param {*} hashMap
 * @param {string} [namespace]
 * @example
 * toForm({name: 'John Doe', login: 'john', permissions: {...}}, 'user');
 * >> [
 *  {
 *    name: 'name',
 *    value: 'John Doe'
 *  },
 *  {
 *    name: 'login',
 *    value: 'john'
 *  },
 * ]
 * @returns {array}
 */
export const toForm = (hashMap, namespace = "") => {
  return Object.keys(hashMap).map((key) => {
    if (typeof hashMap[key] === "object") {
      if (Array.isArray(hashMap[key])) {
        // TODO (Ira Tkach): Adapt code.
      }
    }
    return {
      name: namespace ? [namespace, key] : [key],
      value: hashMap[key],
    };
  });
};

/**
 * @export
 * @param {*} hashMap
 * @returns
 */
export const sanitize = (obj) => {
  return JSON.parse(
    JSON.stringify(obj, (key, value) => (value === null ? undefined : value))
  );
};
