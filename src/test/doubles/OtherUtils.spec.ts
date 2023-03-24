import {
  calculateComplexity,
  OtherStringUtils,
  toUpperCaseWithCallback,
} from "../../app/doubles/OtherUtils";
import { toUpperCase } from "../../app/Utils";

describe("OtherUtils test suite", () => {
  describe("OtherStringUtils tests with spies", () => {
    let sut: OtherStringUtils;

    beforeEach(() => {
      sut = new OtherStringUtils();
    });

    test("Use a spy to track calls", () => {
      const toUpperCaseSpy = jest.spyOn(sut, "toUpperCase");
      sut.toUpperCase("asa");
      expect(toUpperCaseSpy).toBeCalledWith("asa");
    });

    test("Use a spy to track calls to other modules", () => {
      const logStringSpy = jest.spyOn(sut, "logString");
      sut.logString("abc");
      expect(logStringSpy).toBeCalledWith("abc");
    });

    test("Use a spy to replace the implementation of a method", () => {
      // Not a good practice, but also a last-resort if we want to replace the implementation of a method.
      jest.spyOn(sut as any, "callExternalService").mockImplementation(() => {
        console.log("Calling mocked implementation");
      });

      (sut as any).callExternalService();
    });
  });

  describe("Tracking callbacks with Jest mocks", () => {
    const callbackMock = jest.fn();

    afterEach(() => {
      jest.clearAllMocks();
    });

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
