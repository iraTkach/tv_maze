/**
 * @export
 * @param {*} hashMap 
 * @param {string} [namespace] 
 * @example
 * toForm({name: 'John Doe', login: 'john'}, 'user');
 * @returns {array}
 */
export const toForm = (hashMap, namespace = "") => {
  return Object.keys(hashMap).map((key) => ({
    name: namespace ? [namespace, key] : [key],
    value: hashMap[key],
  }));
};
