import { Authorizer } from "../../../app/server_app/auth/Authorizer";

jest.mock("../../../app/server_app/data/SessionTokenDataAccess");
jest.mock("../../../app/server_app/data/UserCredentialsDataAccess");

describe("Authorizer test suite", () => {
  let sut: Authorizer;

  beforeEach(() => {
    sut = new Authorizer();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it("should return true for valid token", ()=>{

  })
});
