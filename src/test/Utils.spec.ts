import { getStringInfo, StringUtils, toUpperCase } from "../app/Utils";

describe("Utils test suite", () => {
  describe.only("StringUtils tests", () => {
    let sut: StringUtils;

    beforeEach(() => {
      sut = new StringUtils();
    });

    it("Should return correct upper case", () => {
      const sut = new StringUtils();

      const actual = sut.toUpperCase("abc");

      expect(actual).toBe("ABC");
    });
    it("Should throw error on invalid argument - arrow function", () => {
      function expectError() {
        const actual = sut.toUpperCase("");
      }

      expect(() => {
        sut.toUpperCase("");
      }).toThrow();
      expect(() => {
        sut.toUpperCase("");
      }).toThrowError("Invalid argument!");
    });
    it("Should throw error on invalid argument - try catch block", (done) => {
      try {
        sut.toUpperCase("");
        done("GetStringInfo should throw error for invalid argument!");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toHaveProperty("message", "Invalid argument!");
        done();
      }
    });
  });

  it("should return uppercase of valid string", () => {
    //arrange
    const sut = toUpperCase;
    const expected = "ABC";

    //act
    const actual = sut("abc");

    //assert
    expect(actual).toBe(expected);
  });

  describe("ToUpperCase examples", () => {
    it.each([
      { input: "abc", expected: "ABC" },
      { input: "My-String", expected: "MY-STRING" },
      { input: "def", expected: "DEF" },
    ])("$input toUpperCase should be $expected", ({ input, expected }) => {
      const actual = toUpperCase(input);
      expect(actual).toBe(expected);
    });
  });

  describe("getStringInfo for arg My-String should", () => {
    test("return right length", () => {
      const actual = getStringInfo("My-String");
      expect(actual.characters).toHaveLength(9);
    });
    test("return right lower case", () => {
      const actual = getStringInfo("My-String");
      expect(actual.lowerCase).toBe("my-string");
    });
    test("return right upper case", () => {
      const actual = getStringInfo("My-String");
      expect(actual.upperCase).toBe("MY-STRING");
    });
    test("return right characters", () => {
      const actual = getStringInfo("My-String");
      expect(actual.characters).toEqual([
        "M",
        "y",
        "-",
        "S",
        "t",
        "r",
        "i",
        "n",
        "g",
      ]);
      expect(actual.characters).toContain<string>("M");
      expect(actual.characters).toEqual(
        expect.arrayContaining(["S", "t", "r", "i", "n", "g", "M", "y", "-"])
      );
    });
    test("return defined extra info", () => {
      const actual = getStringInfo("My-String");
      expect(actual.extraInfo).toBeDefined();
    });
    test("return right extra info", () => {
      const actual = getStringInfo("My-String");

      expect(actual.extraInfo).toEqual({});
      expect(actual.extraInfo).toBeTruthy();
    });
  });
});

/*
FIRST principles

Fast
Unit tests should be fast. 
Test suites may contain a lot of unit tests.
- Faster tests = faster feedback if something is wrong.

Independent
Unit Tests should be isolated from one another
Unit Tests should be isolated from external environment.
- No sharing of state with other tests
- The order in which tests run does not matter
- Tests should run their own set-up and teardown. 
  => Comes in a bit of contradiction with the Fast principle,
  as individual tests have a small overhead in set-up and teardown.

Repeatable
Same result with the same input.
- Challenge: Random / Date values - Often we will mock these.
- Tests that writes to database: Need their own teardown.

Self-validating
After the test complete, it's results must be clear
- Either pass/fail, we cannot output both.

Thorough
Cover all cases/path/scenarios
- Happy paths/bad paths/edge cases
- Invalid input
- Large values

100% code coverage: Not a great indicator.
*/


/*
Test aliases

it.skip / xit
it.only / fit
it.todo
it.concurrent

*/