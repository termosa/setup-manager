var assert = require("chai").assert;
var utils = require("../utils");

describe("Utils", function() {
  describe("clone()", function() {
    var clone = utils.clone;

    it("should create totally same copy of an object", function() {
      var source = { a: 1, b: { c: 3 }};
      var expect = { a: 1, b: { c: 3 }};
      assert.deepEqual(clone(source), expect);
    });

    it("should create an object not related to the source one", function() {
      var source = { a: 1, b: { c: 3 }};
      var result = clone(source);
      result.a = 2;
      assert.notDeepEqual(result, source);
    });
  });

  describe("extend()", function() {
    var extend = utils.extend;

    it("should copy properties from the source object", function() {
      var source = { a: 1 };
      var dist = {};
      extend(dist, source);
      assert.deepEqual(dist, source);
    });

    it("should keep properties of destination object", function() {
      var source = { a: 1 };
      var dist = { b: 2 };
      extend(dist, source);
      assert.propertyVal(dist, "a", 1);
      assert.propertyVal(dist, "b", 2);
    });

    it("should replace properties of destination object with same named properties from source object", function() {
      var source = { a: 1 };
      var dist = { a: 2 };
      extend(dist, source);
      assert.propertyVal(dist, "a", 1);
    });
  });

  describe("isArray()", function() {
    var isArray = utils.isArray;

    it("should return true if array is passed", function() {
      assert.ok(isArray([]));
    });

    it("should return false if not array is passed", function() {
      assert.notOk(isArray({}));
      assert.notOk(isArray(""));
      assert.notOk(isArray("not an array"));
      assert.notOk(isArray());
    });
  });

  describe("isObject()", function() {
    var isObject = utils.isObject;

    it("should return true if object is passed", function() {
      assert.ok(isObject({}));
      assert.ok(isObject([]));
      assert.ok(isObject(new function(){}));
    });

    it("should return false if not object is passed", function() {
      assert.notOk(isObject(""));
      assert.notOk(isObject("not an object"));
      assert.notOk(isObject(42));
      assert.notOk(isObject());
    });
  });
});
