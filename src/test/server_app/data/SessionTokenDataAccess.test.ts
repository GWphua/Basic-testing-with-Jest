import { DataBase } from "../../../app/server_app/data/DataBase";
import { SessionTokenDataAccess } from "../../../app/server_app/data/SessionTokenDataAccess";
import { Account } from "../../../app/server_app/model/AuthModel";

const insertMock = jest.fn();
const updateMock = jest.fn();
const getByMock = jest.fn();

jest.mock("../../../app/server_app/data/DataBase", () => {
  return {
    DataBase: jest.fn().mockImplementation(() => {
      return {
        insert: insertMock,
        update: updateMock,
        getBy: getByMock,
      };
    }),
  };
});

describe("SessionTokenDataAccess test suite", () => {
  let sut: SessionTokenDataAccess;

  const someId = "1234";

  const someUser: Account = {
    id: "",
    userName: "someUserName",
    password: "somePassword",
  };

  beforeEach(() => {
    sut = new SessionTokenDataAccess();
    expect(DataBase).toHaveBeenCalledTimes(1);
    jest.spyOn(global.Date, "now").mockReturnValue(0);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should generate token", async () => {
    insertMock.mockResolvedValueOnce(someId);

    const actual = await sut.generateToken(someUser);

    expect(actual).toBe(someId);
    expect(insertMock).toBeCalledWith({
      id: "",
      userName: someUser.userName,
      valid: true,
      expirationDate: new Date(1000 * 60 * 60),
    });
  });

  it("should invalidate token", async () => {
    await sut.invalidateToken(someId);

    expect(updateMock).toBeCalledWith(someId, "valid", false);
  });

  it("should check valid token", async () => {
    getByMock.mockResolvedValueOnce({ valid: true });

    const actual = await sut.isValidToken(someId);

    expect(actual).toBe(true);
    expect(getByMock).toBeCalledWith("id", someId);
  });

  it("should check invalid token", async () => {
    getByMock.mockResolvedValueOnce({ valid: false });

    const actual = await sut.isValidToken(someId);

    expect(actual).toBe(false);
    expect(getByMock).toBeCalledWith("id", someId);
  });

  it("should check inexistent token", async () => {
    getByMock.mockResolvedValueOnce(undefined);

    const actual = await sut.isValidToken(someId);

    expect(actual).toBe(false);
  });
});
