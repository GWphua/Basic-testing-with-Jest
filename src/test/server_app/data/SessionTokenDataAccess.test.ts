import { DataBase } from "../../../app/server_app/data/DataBase";
import { SessionTokenDataAccess } from "../../../app/server_app/data/SessionTokenDataAccess";

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

  beforeEach(() => {
    sut = new SessionTokenDataAccess();
    expect(DataBase).toBeCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
