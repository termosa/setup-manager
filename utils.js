var clone = require("clone");

function isObject(variable) {
  return typeof variable === "object";
}

function isArray(variable) {
  return isObject(variable) && variable.toString() === '[object Array]';
}

function extendObject(hash, values) {
  return Object.assign(hash, values);
}

function extendArray(list, values) {
  if (isArray(values)) {
    values.forEach(list.push.bind(list));
  } else {
    list.push(values);
  }
  return list;
}

function extend(object, values) {
  return isArray(object)
    ? extendArray(object, values)
    : extendObject(object, values);
}

module.exports = {
  extend: extend,
  clone: clone,
  isObject: isObject,
  isArray: isArray
};
