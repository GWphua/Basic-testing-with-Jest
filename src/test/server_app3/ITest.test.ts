import * as generate from "../../app/server_app/data/IdGenerator";
import { Account } from "../../app/server_app/model/AuthModel";
import { Reservation } from "../../app/server_app/model/ReservationModel";
import {
  HTTP_CODES,
  HTTP_METHODS,
} from "../../app/server_app/model/ServerModel";
import { Server } from "../../app/server_app/server/Server";
import { makeAwesomeRequest } from "./utils/http-client";

describe("Server app integration tests", () => {
  let server: Server;

  beforeAll(() => {
    server = new Server();
    server.startServer();
  });

  afterAll(() => {
    server.stopServer();
  });

  const someUser: Account = {
    id: "",
    userName: "someUserName",
    password: "somePassword",
  };

  const someReservation: Reservation = {
    id: "",
    endDate: "someEndDate",
    startDate: "someStartDate",
    room: "someRoom",
    user: "someUser",
  };

  it("should register new user", async () => {
    const result = await makeAwesomeRequest(
      {
        host: "localhost",
        port: 8080,
        method: HTTP_METHODS.POST,
        path: "/register",
      },
      someUser
    );

    expect(result.statusCode).toBe(HTTP_CODES.CREATED);
    expect(result.body.userId).toBeDefined();
    console.log(`connecting to address: ${process.env.HOST}`);
  });

  it("should register new user", async () => {
    const result = await makeAwesomeRequest(
      {
        host: "localhost",
        port: 8080,
        method: HTTP_METHODS.POST,
        path: "/register",
      },
      someUser
    );

    expect(result.statusCode).toBe(HTTP_CODES.CREATED);
    expect(result.body.userId).toBeDefined();
  });

  let token: string;
  it("should login a registered user", async () => {
    const result = await makeAwesomeRequest(
      {
        host: "localhost",
        port: 8080,
        method: HTTP_METHODS.POST,
        path: "/login",
      },
      someUser
    );

    expect(result.statusCode).toBe(HTTP_CODES.CREATED);
    expect(result.body.token).toBeDefined();
    token = result.body.token;
  });

  let createdReservationId: string;
  it("should create reservation if authorized", async () => {
    const result = await makeAwesomeRequest(
      {
        host: "localhost",
        port: 8080,
        method: HTTP_METHODS.POST,
        path: "/reservation",
        headers: {
          authorization: token,
        },
      },
      someReservation
    );

    expect(result.statusCode).toBe(HTTP_CODES.CREATED);
    expect(result.body.reservationId).toBeDefined();
    createdReservationId = result.body.reservationId;
  });

  it("should get reservation if authorized", async () => {
    const result = await makeAwesomeRequest({
      host: "localhost",
      port: 8080,
      method: HTTP_METHODS.GET,
      path: `/reservation/${createdReservationId}`,
      headers: {
        authorization: token,
      },
    });

    const expectedReservation = {
      ...someReservation,
      id: createdReservationId,
    };

    expect(result.statusCode).toBe(HTTP_CODES.OK);
    expect(result.body).toEqual(expectedReservation);
  });

  it("should create and retrieve multiple reservations if authorized", async () => {
    await makeAwesomeRequest(
      {
        host: "localhost",
        port: 8080,
        method: HTTP_METHODS.POST,
        path: "/reservation",
        headers: {
          authorization: token,
        },
      },
      someReservation
    );

    await makeAwesomeRequest(
      {
        host: "localhost",
        port: 8080,
        method: HTTP_METHODS.POST,
        path: "/reservation",
        headers: {
          authorization: token,
        },
      },
      someReservation
    );

    await makeAwesomeRequest(
      {
        host: "localhost",
        port: 8080,
        method: HTTP_METHODS.POST,
        path: "/reservation",
        headers: {
          authorization: token,
        },
      },
      someReservation
    );

    const allResults = await makeAwesomeRequest({
      host: "localhost",
      port: 8080,
      method: HTTP_METHODS.GET,
      path: "/reservation/all",
      headers: {
        authorization: token,
      },
    });

    expect(allResults.statusCode).toBe(HTTP_CODES.OK);
    expect(allResults.body).toHaveLength(4);
  });

  it("should update reservation if authorized", async () => {
    const updateResult = await makeAwesomeRequest(
      {
        host: "localhost",
        port: 8080,
        method: HTTP_METHODS.PUT,
        path: `/reservation/${createdReservationId}`,
        headers: {
          authorization: token,
        },
      },
      { startDate: "someOtherStartDate" }
    );

    expect(updateResult.statusCode).toBe(HTTP_CODES.OK);

    const getResult = await makeAwesomeRequest({
      host: "localhost",
      port: 8080,
      method: HTTP_METHODS.GET,
      path: `/reservation/${createdReservationId}`,
      headers: {
        authorization: token,
      },
    });

    expect(getResult.body.startDate).toBe("someOtherStartDate");
  });

  it("should delete reservation if authorized", async () => {
    const deleteResult = await makeAwesomeRequest({
      host: "localhost",
      port: 8080,
      method: HTTP_METHODS.DELETE,
      path: `/reservation/${createdReservationId}`,
      headers: {
        authorization: token,
      },
    });

    expect(deleteResult.statusCode).toBe(HTTP_CODES.OK);

    const getResult = await makeAwesomeRequest({
      host: "localhost",
      port: 8080,
      method: HTTP_METHODS.GET,
      path: `/reservation/${createdReservationId}`,
      headers: {
        authorization: token,
      },
    });

    expect(getResult.statusCode).toBe(HTTP_CODES.NOT_FOUND);
  });

  it("snapshot test", async () => {
    jest.spyOn(generate, "generateRandomId").mockReturnValueOnce("12345");

    await makeAwesomeRequest(
      {
        host: "localhost",
        port: 8080,
        method: HTTP_METHODS.POST,
        path: "/reservation",
        headers: {
          authorization: token,
        },
      },
      someReservation
    );

    const getResult = await makeAwesomeRequest({
      host: "localhost",
      port: 8080,
      method: HTTP_METHODS.GET,
      path: `/reservation/1234`,
      headers: {
        authorization: token,
      },
    });

    expect(getResult.body).toMatchSnapshot();
  });
});
