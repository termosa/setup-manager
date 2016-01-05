var assert = require("chai").assert;
var setupManager = require("../setup-manager");

describe("Setup Manager API", function() {
  describe("Initialization", function() {
    it("should be created with an empty object", function() {
      var manager = setupManager();
      var emptyObject = {};
      assert.deepEqual(manager.setup(), emptyObject);
    });

    it("should be created with cloned object if one is passed as an argument", function() {
      var source = { a: 1, b: { c: [3] }};
      var expect = { a: 1, b: { c: [3] }};
      var manager = setupManager(source);
      assert.deepEqual(manager.setup(), expect);
      source.b.c.push(4);
      assert.deepEqual(manager.setup(), expect);
    });
  });

  describe("Setting", function() {
    it("should set properties to plain object", function() {
      var manager = setupManager();
      var expect = { prop: "value" };
      manager.set("prop", "value");
      assert.deepEqual(manager.setup(), expect);
    });

    it("should set inherit properties to plain object", function() {
      var manager = setupManager();
      var expect = { prop: { inherit_prop: "value" }};
      manager.set("prop.inherit_prop", "value");
      assert.deepEqual(manager.setup(), expect);
    });

    it("should create property with an array if array is passed", function() {
      var manager = setupManager();
      var expect = { list: [ 1, 2 ] };
      manager.set("list", [ 1, 2 ]);
      assert.deepEqual(manager.setup(), expect);
    });
  });

  describe("Extending", function() {
    it("should extend object with passed object", function() {
      var source = { a: 1 };
      var expect = { a: 1, b: 2 };
      var manager = setupManager(source);
      manager.set({ b: 2 });
      assert.deepEqual(manager.setup(), expect);
    });

    it("should extend created objects", function() {
      var manager = setupManager();
      var expect = { prop: { a: 1, b: 2 }};
      manager.set("prop.a", 1);
      manager.set("prop.b", 2);
      assert.deepEqual(manager.setup(), expect);
    });

    it("should extend created object with passed object", function() {
      var source = { a: { b: 2 }};
      var expect = { a: { b: 2, c: 3 }};
      var manager = setupManager(source);
      manager.set("a", { c: 3 });
      assert.deepEqual(manager.setup(), expect);
    });

    it("should add values to an array property if array is passed", function() {
      var source = { list: [ 1 ] };
      var expect = { list: [ 1, 2, 3 ] };
      var manager = setupManager(source);
      manager.set("list", [ 2, 3 ]);
      assert.deepEqual(manager.setup(), expect);
    });
  });

  describe("Builder", function() {
    it("should return builder function if value is not defined", function() {
      var manager = setupManager();
      var builder = manager.set("property");
      assert.isFunction(builder);
    });

    it("should define property if builder is called with value", function() {
      var manager = setupManager();
      var expect = { prop: "value" };
      manager.set("prop")("value");
      assert.deepEqual(manager.setup(), expect);
    });

    it("should extend existing object-typed property if object is passed", function() {
      var source = { prop: { a: 1 }};
      var expect = { prop: { a: 1, b: 2 }};
      var manager = setupManager(source);
      manager.set("prop")({ b: 2 });
      assert.deepEqual(manager.setup(), expect);
    });

    it("should extend existing object-typed property infinite times", function() {
      var source = { prop: { a: 1 }};
      var expect = { prop: { a: 1, b: 2, c: 3 }};
      var manager = setupManager(source);
      var builder = manager.set("prop");
      builder({ b: 2 });
      builder({ c: 3 });
      assert.deepEqual(manager.setup(), expect);
    });

    it("should return builder on calling builder to add ability for chaining", function() {
      var source = { prop: { a: 1 }};
      var expect = { prop: { a: 1, b: 2, c: 3 }};
      var manager = setupManager(source);
      manager.set("prop")({ b: 2 })({ c: 3 });
      assert.deepEqual(manager.setup(), expect);
    });

    it("should concat array if builder is called on array-typed property with array passed", function() {
      var manager = setupManager();
      var expect = { list: [ 1, 2, 3 ] };
      manager.set("list")([])([ 1 ])([ 2, 3 ]);
      assert.deepEqual(manager.setup(), expect);
    });
  });
});
