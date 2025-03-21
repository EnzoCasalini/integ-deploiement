import { describe, it, expect, beforeEach } from "vitest";
import { calculateAge } from "../module.js";

let people20years;
beforeEach(() => {
  let date = new Date();
  people20years = {
    birth: new Date(date.setFullYear(date.getFullYear() - 20))
  };
});

describe("calculateAge Unit Test", () => {
  it("should return a correct age", () => {
    const enzo = {
      birth: new Date("11-21-2002"),
    };
    let dateDiff = new Date(Date.now() - enzo.birth.getTime());
    let date = Math.abs(dateDiff.getUTCFullYear() - 1970);
    expect(calculateAge(enzo)).toEqual(date);
  });

  it("should throw a 'missing param p' error", () => {
    expect(() => calculateAge()).toThrow("missing param p");
  });

  it("should throw an error if argument is not an object", () => {
    expect(() => calculateAge(42)).toThrow("Parameter must be an object");
    expect(() => calculateAge("test")).toThrow("Parameter must be an object");
    expect(() => calculateAge([])).toThrow("Parameter must be an object");
  });

  it("should throw an error if object has no 'birth' property", () => {
    expect(() => calculateAge({})).toThrow("Object must have a 'birth' property");
  });

  it("should throw an error if birth is not a valid Date", () => {
    expect(() => calculateAge({ birth: "2002-11-21" })).toThrow("'birth' must be a valid Date");
    expect(() => calculateAge({ birth: new Date("invalid-date") })).toThrow("'birth' must be a valid Date");
  });

  it("should throw an error if birth is in the future", () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    expect(() => calculateAge({ birth: futureDate })).toThrow("'birth' cannot be in the future");
  });

  it("should correctly return 0 for a newborn", () => {
    const today = new Date();
    expect(calculateAge({ birth: today })).toEqual(0);
  });
});