var _ = require("./utils");

/*
 * Get the chain of properties
 */
function parse(name) {
  return name.split(".");
}

/*
 * Get the value of the object property
 */
function pick(obj, name) {
  var key, keys = parse(name);
  while (key = keys.shift()) {
    if (keys.length === 0) { return obj[key]; }
    if (!_.isObject(obj[key])) { return; }
    obj = obj[key];
  }
}

/*
 * Set the value to the object property
 */
function put(obj, name, value) {
  if (!name) { return _.extend(obj, value); }
  var key, keys = parse(name);
  while (key = keys.shift()) {
    if (keys.length === 0) {
      if (_.isObject(obj[key])) {
        _.extend(obj[key], value);
      } else {
        obj[key] = _.clone(value);
      }
      return;
    }

    obj = _.isObject(obj[key])
      ? obj[key] : (obj[key] = {});
  }
}

module.exports = function(instance) {
  var config = instance ? _.clone(instance) : {} ;

  var manager = {
    setup: function() { return config; },
    get: function(name) { return pick(config, name); },
    set: function(name, value) {
      if (_.isObject(name)) {
        put(config, null, name);
        return manager;
      }

      if (typeof value === "undefined") {
        return function builder(value) {
          put(config, name, value);
          return builder;
        };
      }

      put(config, name, value);
      return manager;
    }
  };

  return manager;
}
