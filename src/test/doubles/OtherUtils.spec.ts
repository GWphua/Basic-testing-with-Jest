import {
  calculateComplexity,
  toUpperCaseWithCallback,
} from "../../app/doubles/OtherUtils";

describe("OtherUtils test suite", () => {
  describe("Tracking callbacks with Jest mocks", () => {
    const callbackMock = jest.fn();

    afterEach(() => {
      jest.clearAllMocks();
    })

    it("Calls callback for invalid argument - track calls", () => {
      const actual = toUpperCaseWithCallback("", callbackMock);
      expect(actual).toBeUndefined();
      expect(callbackMock).toBeCalledWith("Invalid argument!");
      expect(callbackMock).toBeCalledTimes(1);
    });

    it("Calls callback for valid argument - track calls", () => {
      const actual = toUpperCaseWithCallback("abc", callbackMock);
      expect(actual).toBe("ABC");
      expect(callbackMock).toBeCalledWith(`Called function with abc`);
      expect(callbackMock).toBeCalledTimes(1);
    });
  });

  describe("Tracking callbacks", () => {
    let callbackArguments = [];
    let timesCalled = 0;

    function callbackMock(arg: string) {
      callbackArguments.push(arg);
      timesCalled++;
    }

    afterEach(() => {
      callbackArguments = [];
      timesCalled = 0;
    });

    it("Calls callback for invalid argument - track calls", () => {
      const actual = toUpperCaseWithCallback("", callbackMock);
      expect(actual).toBeUndefined();
      expect(callbackArguments).toContain("Invalid argument!");
      expect(timesCalled).toBe(1);
    });

    it("Calls callback for valid argument - track calls", () => {
      const actual = toUpperCaseWithCallback("abc", callbackMock);
      expect(actual).toBe("ABC");
      expect(callbackArguments).toContain(`Called function with abc`);
      expect(timesCalled).toBe(1);
    });
  });

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
