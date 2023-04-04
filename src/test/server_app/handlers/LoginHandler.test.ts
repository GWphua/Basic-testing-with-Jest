import { IncomingMessage, ServerResponse } from "http";
import { Authorizer } from "../../../app/server_app/auth/Authorizer";
import { LoginHandler } from "../../../app/server_app/handlers/LoginHandler";
import { Account } from "../../../app/server_app/model/AuthModel";
import {
  HTTP_CODES,
  HTTP_METHODS,
} from "../../../app/server_app/model/ServerModel";

const requestBodyMock = jest.fn();

jest.mock("../../../app/server_app/utils/Utils", () => ({
  getRequestBody: () => requestBodyMock(),
}));

describe("LoginHandler test suite", () => {
  let sut: LoginHandler;

  const request = {
    method: undefined,
  };

  const responseMock = {
    statusCode: 0,
    writeHead: jest.fn(),
    write: jest.fn(),
  };

  const authorizerMock = {
    login: jest.fn(),
  };

  const someAccount: Account = {
    id: "",
    userName: "someUserName",
    password: "somePassword",
  };

  const someToken = "someToken";

  beforeEach(() => {
    sut = new LoginHandler(
      request as IncomingMessage,
      responseMock as any as ServerResponse,
      authorizerMock as any as Authorizer
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create token for valid account in requests", async () => {
    request.method = HTTP_METHODS.POST;
    requestBodyMock.mockResolvedValueOnce(someAccount);
    authorizerMock.login.mockResolvedValueOnce(someToken);

    await sut.handleRequest();

    expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED);
    expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.CREATED, {
      "Content-Type": "application/json",
    });
    expect(responseMock.write).toBeCalledWith(JSON.stringify({ token: someToken }));
  });

  it("should not create token for non-existent account in requests", async () => {
    request.method = HTTP_METHODS.POST;
    requestBodyMock.mockResolvedValueOnce(someAccount);
    authorizerMock.login.mockResolvedValueOnce(undefined);

    await sut.handleRequest();

    expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_FOUND);
    expect(responseMock.write).toBeCalledWith(
      JSON.stringify("wrong username or password")
    );
  });

  it("should return bad request for invalid account in requests", async () => {
    request.method = HTTP_METHODS.POST;
    requestBodyMock.mockResolvedValueOnce({} as any);

    await sut.handleRequest();

    expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.BAD_REQUEST, {
      "Content-Type": "application/json",
    });
    expect(responseMock.write).toBeCalledWith(
      JSON.stringify("userName and password required")
    );
  });

  it("should do nothing for not supported http methods", async () => {
    request.method = HTTP_METHODS.GET;
    await sut.handleRequest();

    expect(responseMock.writeHead).not.toBeCalled();
    expect(responseMock.write).not.toBeCalled();
    expect(requestBodyMock).not.toBeCalled();
  });
});
