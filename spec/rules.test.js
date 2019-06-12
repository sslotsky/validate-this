import expect from "expect";
import * as rules from "../src/rules";

describe("required", () => {
  describe("with no value", () => {
    it("returns an error", () => {
      expect(rules.required()).toEqual("required");
    });
  });

  describe("with a value", () => {
    it("returns nothing", () => {
      expect(rules.required("any value")).toBe(undefined);
    });
  });
});

describe("matches", () => {
  const rule = rules.matches("password");
  const values = { password: "foo" };

  describe("when values do not match", () => {
    it("returns an error", () => {
      expect(rule("bar", values)).toEqual("mismatch");
    });
  });

  describe("when values match", () => {
    it("returns nothing", () => {
      expect(rule(values.password, values)).toBe(undefined);
    });
  });
});

describe("numeric", () => {
  describe("when value is an integer", () => {
    it("returns nothing", () => {
      expect(rules.numeric("4")).toBe(undefined);
    });
  });

  describe("when value is a float", () => {
    it("returns nothing", () => {
      expect(rules.numeric("4.0")).toBe(undefined);
    });
  });

  describe("when value is not numeric", () => {
    it("returns an error", () => {
      expect(rules.numeric("a4")).toEqual("expected_numeric");
    });
  });
});
