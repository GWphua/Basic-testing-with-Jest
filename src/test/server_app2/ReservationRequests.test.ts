import { DataBase } from "../../app/server_app/data/DataBase";
import {
  HTTP_CODES,
  HTTP_METHODS,
} from "../../app/server_app/model/ServerModel";
import { Server } from "../../app/server_app/server/Server";
import { RequestTestWrapper } from "./test_utils/RequestTestWrapper";
import { ResponseTestWrapper } from "./test_utils/ResponseTestWrapper";

jest.mock("../../app/server_app/data/DataBase");

const requestWrapper = new RequestTestWrapper();
const responseWrapper = new ResponseTestWrapper();

const fakeServer = {
  listen: () => {},
  close: () => {},
};

jest.mock("http", () => ({
  createServer: (cb: Function) => {
    cb(requestWrapper, responseWrapper);
    return fakeServer;
  },
}));

const someReservation = {
  id: "",
  room: "someRoom",
  user: "someUser",
  startDate: "someStartDate",
  endDate: "someEndDate",
};

const someId = "1234";

const jsonHeader = {
  "Content-Type": "application/json",
};

describe("Reservation requests test suite", () => {
  const insertSpy = jest.spyOn(DataBase.prototype, "insert");
  const getBySpy = jest.spyOn(DataBase.prototype, "getBy");
  const getAllElementsSpy = jest.spyOn(DataBase.prototype, "getAllElements");
  const updateSpy = jest.spyOn(DataBase.prototype, "update");
  const deleteSpy = jest.spyOn(DataBase.prototype, "delete");

  beforeEach(() => {
    requestWrapper.headers["user-agent"] = "jest tests";
    requestWrapper.headers["authorization"] = "someToken";

    // Authenticate calls:
    getBySpy.mockResolvedValueOnce({ valid: true });
  });

  afterEach(() => {
    requestWrapper.clearFields();
    responseWrapper.clearFields();
    jest.clearAllMocks();
  });

  describe("POST requests", () => {
    it("should create reservation for valid reservation", async () => {
      requestWrapper.method = HTTP_METHODS.POST;
      requestWrapper.body = someReservation;
      requestWrapper.url = "localhost:8080/reservation";
      insertSpy.mockResolvedValueOnce(someId);

      await new Server().startServer();
      await new Promise(process.nextTick);

      expect(responseWrapper.statusCode).toBe(HTTP_CODES.CREATED);
      expect(responseWrapper.body).toEqual({ reservationId: someId });
      expect(responseWrapper.headers).toContainEqual(jsonHeader);
    });

    it("should not create reservation for invalid reservation", async () => {
      requestWrapper.method = HTTP_METHODS.POST;
      requestWrapper.body = {};
      requestWrapper.url = "localhost:8080/reservation";

      await new Server().startServer();
      await new Promise(process.nextTick);

      expect(responseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseWrapper.body).toEqual("Incomplete reservation!");
    });
  });

  describe("GET requests", () => {
    it("should get all reservations", async () => {
      requestWrapper.method = HTTP_METHODS.GET;
      requestWrapper.url = "localhost:8080/reservation/all";
      getAllElementsSpy.mockResolvedValueOnce([
        someReservation,
        someReservation,
      ]);

      await new Server().startServer();
      await new Promise(process.nextTick);

      expect(responseWrapper.statusCode).toBe(HTTP_CODES.OK);
      expect(responseWrapper.headers).toContainEqual(jsonHeader);
      expect(responseWrapper.body).toEqual([someReservation, someReservation]);
    });

    it("should get reservation for correct id", async () => {
      requestWrapper.method = HTTP_METHODS.GET;
      requestWrapper.url = `localhost:8080/reservation/${someId}`;
      getBySpy.mockResolvedValueOnce(someReservation);

      await new Server().startServer();
      await new Promise(process.nextTick);

      expect(responseWrapper.statusCode).toBe(HTTP_CODES.OK);
      expect(responseWrapper.headers).toContainEqual(jsonHeader);
      expect(responseWrapper.body).toEqual(someReservation);
    });

    it("should not get reservation for correct id", async () => {
      requestWrapper.method = HTTP_METHODS.GET;
      requestWrapper.url = `localhost:8080/reservation/${someId}`;
      getBySpy.mockResolvedValueOnce(undefined);

      await new Server().startServer();
      await new Promise(process.nextTick);

      expect(responseWrapper.statusCode).toBe(HTTP_CODES.NOT_FOUND);
      expect(responseWrapper.body).toEqual(
        `Reservation with id ${someId} not found`
      );
    });

    it("should return bad request if no id is provided", async () => {
      requestWrapper.method = HTTP_METHODS.GET;
      requestWrapper.url = "localhost:8080/reservation";

      await new Server().startServer();
      await new Promise(process.nextTick);

      expect(responseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseWrapper.body).toEqual("Please provide an ID!");
    });
  });

  describe("PUT requests", () => {
    it("should update reservation for correct input", async () => {
      requestWrapper.method = HTTP_METHODS.PUT;
      requestWrapper.url = `localhost:8080/reservation/${someId}`;
      getBySpy.mockResolvedValueOnce(someReservation);
      requestWrapper.body = {
        user: "someOtherUser",
        startDate: "someOtherStartDate",
      };
      updateSpy.mockResolvedValueOnce(undefined);

      await new Server().startServer();
      await new Promise(process.nextTick);

      expect(responseWrapper.statusCode).toBe(HTTP_CODES.OK);
      expect(responseWrapper.body).toBe(
        `Updated user,startDate of reservation ${someId}`
      );
      expect(responseWrapper.headers).toContainEqual(jsonHeader);
    });

    it("should return bad request for invalid fields", async () => {
      requestWrapper.method = HTTP_METHODS.PUT;
      requestWrapper.url = `localhost:8080/reservation/${someId}`;
      getBySpy.mockResolvedValueOnce(someReservation);
      requestWrapper.body = {
        user: "someOtherUser",
        startDate: "someOtherStartDate",
        someOtherField: "someField",
      };
      updateSpy.mockResolvedValueOnce(undefined);

      await new Server().startServer();
      await new Promise(process.nextTick);

      expect(responseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseWrapper.body).toBe(
        "Please provide valid fields to update!"
      );
    });

    it("should return not found for invalid id", async () => {
      requestWrapper.method = HTTP_METHODS.PUT;
      requestWrapper.url = `localhost:8080/reservation/${someId}`;
      getBySpy.mockResolvedValueOnce(undefined);

      await new Server().startServer();
      await new Promise(process.nextTick);

      expect(responseWrapper.statusCode).toBe(HTTP_CODES.NOT_FOUND);
      expect(responseWrapper.body).toBe(
        `Reservation with id ${someId} not found`
      );
    });

    it("should return bad request if no id is provided", async () => {
      requestWrapper.method = HTTP_METHODS.PUT;
      requestWrapper.url = "localhost:8080/reservation";

      await new Server().startServer();
      await new Promise(process.nextTick);

      expect(responseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseWrapper.body).toBe("Please provide an ID!");
    });
  });

  describe("DELETE requests", () => {
    it("should delete reservation for valid id", async () => {
      requestWrapper.method = HTTP_METHODS.DELETE;
      requestWrapper.url = `localhost:8080/reservation/${someId}`;
      deleteSpy.mockResolvedValueOnce(undefined);

      await new Server().startServer();
      await new Promise(process.nextTick);

      expect(responseWrapper.statusCode).toBe(HTTP_CODES.OK);
      expect(responseWrapper.body).toEqual(
        `Deleted reservation with id ${someId}`
      );
    });

    it("should return bad request if no id is provided", async () => {
      requestWrapper.method = HTTP_METHODS.DELETE;
      requestWrapper.url = "localhost:8080/reservation";

      await new Server().startServer();
      await new Promise(process.nextTick);

      expect(responseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseWrapper.body).toEqual("Please provide an ID!");
    });
  });

  it("should do nothing for not supported methods", async () => {
    requestWrapper.method = HTTP_METHODS.OPTIONS;
    requestWrapper.url = "localhost:8080/reservation";

    await new Server().startServer();
    await new Promise(process.nextTick);

    expect(responseWrapper.statusCode).toBeUndefined();
    expect(responseWrapper.body).toBeUndefined();
    expect(responseWrapper.headers).toHaveLength(0);
  });

  it("should return not authorized if request is not authorized", async () => {
    requestWrapper.method = HTTP_METHODS.POST;
    requestWrapper.body = {};
    requestWrapper.url = "localhost:8080/reservation";

    getBySpy.mockReset();
    getBySpy.mockResolvedValueOnce(undefined);

    await new Server().startServer();
    await new Promise(process.nextTick);

    expect(responseWrapper.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
    expect(responseWrapper.body).toEqual("Unauthorized operation!");
  });
});
