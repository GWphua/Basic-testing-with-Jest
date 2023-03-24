import {
  calculateComplexity,
  toUpperCaseWithCallback,
} from "../../app/doubles/OtherUtils";

describe("OtherUtils test suite", () => {
  it("Calculates complexity", () => {
    const someInfo = {
      length: 5,
      extraInfo: {
        field1: "someInfo",
        field2: "someOtherInfo",
      },
    };

    const actual = calculateComplexity(someInfo as any);

    expect(actual).toBe(10);
  });

  it("Converts to upper case - calls callback for invalid argument", () => {
    // () => {} is a fake -- simplifying working implementations
    const actual = toUpperCaseWithCallback("", () => {});
    expect(actual).toBeUndefined();
  });

  it("Converts to upper case - calls callback for invalid argument", () => {
    const actual = toUpperCaseWithCallback("abc", () => {});
    expect(actual).toBe("ABC");
  });
});
