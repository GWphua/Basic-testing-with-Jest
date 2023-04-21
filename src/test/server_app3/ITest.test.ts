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
        headers: { authorization: token },
      },
      someReservation
    );

    expect(result.statusCode).toBe(HTTP_CODES.CREATED);
    expect(result.body.reservationId).toBeDefined();
    createdReservationId = result.body.reservationId;
  });

  it("should get reservation if authorized", async () => {
    const result = await fetch(
      `http://localhost:8080/reservation/${createdReservationId}`,
      {
        method: HTTP_METHODS.GET,
        headers: {
          authorization: token,
        },
      }
    );
    const resultBody = await result.json();

    const expectedReservation = structuredClone(someReservation);
    expectedReservation.id = createdReservationId;

    expect(result.status).toBe(HTTP_CODES.OK);
    expect(resultBody).toEqual(expectedReservation);
  });

  it("should create and retrieve multiple reservations if authorized", async () => {
    await fetch("http://localhost:8080/reservation", {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(someReservation),
      headers: {
        authorization: token,
      },
    });
    await fetch("http://localhost:8080/reservation", {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(someReservation),
      headers: {
        authorization: token,
      },
    });
    await fetch("http://localhost:8080/reservation", {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(someReservation),
      headers: {
        authorization: token,
      },
    });

    const allResults = await fetch("http://localhost:8080/reservation/all", {
      method: HTTP_METHODS.GET,
      headers: {
        authorization: token,
      },
    });
    const resultBody = await allResults.json();
    expect(allResults.status).toBe(HTTP_CODES.OK);
    expect(resultBody).toHaveLength(4);
  });

  it("should update reservation if authorized", async () => {
    const updateResult = await fetch(
      `http://localhost:8080/reservation/${createdReservationId}`,
      {
        method: HTTP_METHODS.PUT,
        body: JSON.stringify({ startDate: "otherStartDate" }),
        headers: {
          authorization: token,
        },
      }
    );

    expect(updateResult.status).toBe(HTTP_CODES.OK);

    const getResult = await fetch(
      `http://localhost:8080/reservation/${createdReservationId}`,
      {
        method: HTTP_METHODS.GET,
        headers: {
          authorization: token,
        },
      }
    );

    const getRequestBody: Reservation = await getResult.json();
    expect(getRequestBody.endDate).toBe("othreStartDate");
  });

  it("should update reservation if authorized", async () => {
    const updateResult = await fetch(
      `http://localhost:8080/reservation/${createdReservationId}`,
      {
        method: HTTP_METHODS.PUT,
        body: JSON.stringify({ startDate: "otherStartDate" }),
        headers: {
          authorization: token,
        },
      }
    );

    expect(updateResult.status).toBe(HTTP_CODES.OK);

    const getResult = await fetch(
      `http://localhost:8080/reservation/${createdReservationId}`,
      {
        method: HTTP_METHODS.GET,
        headers: {
          authorization: token,
        },
      }
    );

    const getRequestBody: Reservation = await getResult.json();
    expect(getRequestBody.endDate).toBe("otherStartDate");
  });
});
