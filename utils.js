var clone = require("clone");

function toString(object) {
  return Object.prototype.toString.call(object);
}

function isObject(variable) {
  return typeof variable === "object";
}

function isArray(variable) {
  return isObject(variable) && toString(variable) === '[object Array]';
}

function extendObject(hash, values) {
  return Object.assign(hash, values);
}

function extendArray(list, values) {
  if (isArray(values)) {
    values.forEach(function(value) {
      list.push(value);
    });
  } else {
    list.push(values);
  }
  return list;
}

function assign(object, values) {
  return isArray(object)
    ? extendArray(object, values)
    : extendObject(object, values);
}

module.exports = {
  assign: assign,
  clone: clone,
  isArray: isArray,
  isObject: isObject
};
