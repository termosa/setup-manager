Setup Manager — The interface to create JSON configurations within code
========================================================================

[![NPM version](https://badge.fury.io/js/setup-manager.svg)](http://badge.fury.io/js/setup-manager)
[![Build Status](https://travis-ci.org/termosa/setup-manager.svg?branch=master)](https://travis-ci.org/termosa/setup-manager)
[![Join the chat at https://gitter.im/termosa/setup-manager](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/termosa/setup-manager)

Simple API to extend and generate deep nested hash objects in JavaScript.

Installation
------------

To install Setup Manager, simply:

```bash
$ npm install --save setup-manager
```

API
---

#### Constructor

Constructor can receive an optional object to clone it and use as a base.

##### constructor(/\* object \*/ source)

```javascript
var constructor = require("setup-manager");
var manager = constructor(source);
```

It returns an object with the list of functions

##### manager.set(/\* string | object \*/ name, value)

It sets the dot-separated property with passed ```value``` to the result object.

It has several uncommon features:

* Extends exists object in specified property with value's properties if ```value``` is an object.
* Concatenates exists array in specified property if ```value``` is an array.
* Uses ```name``` to extend core object if ```name``` is an object.
* Returns setter-function if ```value``` is not defined. This function can be called with value to set the property defined in ```set``` method.

```javascript
constructor().set("name", "value").setup();
// Returns: { "name": "value" }

constructor().set("name", { prop: "value" }).setup();
// Returns: { "name": { "prop": "value" }}

constructor().set("name.prop", "value").setup();
// Returns: { "name": { "prop": "value" }}

constructor()
  .set("name.prop1", "value1")
  .set("name.prop2", "value2")
  .setup();
// Returns: { "name": { "prop1": "value1", "prop2": "value2" }}

var config = constructor();
var builder = config.set("list");
builder([ 7, 13 ])([ 42 ]);
config.setup();
// Returns: { list: [ 7, 13, 42 ] }
```

##### manager.get(/\* string \*/ name)

It returns the value of specified property

```javascript
constructor().set("user.name", "John").get("user.name");
// Returns: "John"
```

##### manager.setup()

It returns the object with all sets applied to it

```javascript
constructor()
  .set("user.name", "Alice")
  .set("user.email", "alice@setup-manager.npm")
  .setup(); 
// Returns: { "user": { "name": "Alice", "email": "alice@setup-manager.npm" }}

Usage
-----

To create the plain list:

```javascript
var session = require("setup-manager")();

session.set("username", "John Mora");
session.set("email", "john.mora@setup-manager.npm");

module.exports = session.setup();

/* Will return:
 * {
 *   "username": "John Mora",
 *   "email":    "john.mora@setup-manager.npm"
 * }
 */
```

To create the nested object:

```javascript
var server = require("setup-manager");

server.set("name", "slave-01");
server.set("host.domain", "localhost");
server.set("host.port", 7364);

module.exports = server.setup();

/* Will return:
 * {
 *   "name": "slave-01",
 *   "host": {
 *     "domain": "setup-manager.npm",
 *     "port":   7364
 *   }
 * }
 */
```

To extend the object:

```javascript
// default.config.js
var config = require("setup-manager");

config.set("env", "production");
config.set("host", {
  protocol: "https",
  domain:   "setup-manager.npm",
  port:     7364
});

module.exports = config.setup();
```

```javascript
// local.config.js
var base_configuration = require("./default.config.js");
var config = require("setup-manager")(base_configuration);

config.set("env", "development");
config.set("host", {
  domain: "localhost",
  port:   3080
});

module.exports = config.setup();

/* Will return:
 * {
 *   "env": "development",
 *   "host": {
 *     "protocol": "https",
 *     "host":     "localhost",
 *     "port":     3080
 *   }
 * }
 */
```

To create the complex configuration:

```javascript
var SuperPlugin = require("SuperPlugin");
var base_configuration = require("./default.config.js");
var config = require("setup-manager")(base_configuration);

var setAlias = config.set("resolve.alias");
var setPlugins = config.set("plugins");

function addAlias(name, source) {
  var alias = {};
  alias[name] = source;
  setAlias(alias);
}

function addPlugin(plugin) {
  setPlugins([plugin]);
}

// set vendor aliases
addAlias("module", "./modules");
addAlias("style", "./styles");

// setup an extra plugin
addPlugin(new SuperPlugin({ mode: "unsafe" }));
addAlias("super", "./node_modules/SuperPlugin/vendors");

module.exports = config.setup();

/* Will return:
 * {
 *   "plugins": [ SuperPlugin { mode: "unsafe" } ],
 *   "resolve": {
 *     "alias": {
 *       "modue": "./modules",
 *       "style": "./styles",
 *       "super": "./node_modules/SuperPlugin/vendors"
 *     }
 *   }
 */
```

