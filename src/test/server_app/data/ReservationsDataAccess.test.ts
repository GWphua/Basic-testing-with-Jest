import { DataBase } from "../../../app/server_app/data/DataBase";
import { ReservationsDataAccess } from "../../../app/server_app/data/ReservationsDataAccess";
import { Reservation } from "../../../app/server_app/model/ReservationModel";

const insertMock = jest.fn();
const updateMock = jest.fn();
const deleteMock = jest.fn();
const getByMock = jest.fn();
const getAllMock = jest.fn();

jest.mock("../../../app/server_app/data/DataBase", () => {
  return {
    DataBase: jest.fn().mockImplementation(() => {
      return {
        insert: insertMock,
        update: updateMock,
        delete: deleteMock,
        getBy: getByMock,
        getAllElements: getAllMock,
      };
    }),
  };
});

describe("ReservationsDataAccess test suite", () => {
  let sut: ReservationsDataAccess;

  const someId = "1234";

  const reservation: Reservation = {
    id: "",
    room: "someRoom",
    user: "someUser",
    startDate: "someStartDate",
    endDate: "someEndDate",
  };

  beforeEach(() => {
    sut = new ReservationsDataAccess();
    expect(DataBase).toBeCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a reservation", async () => {
    insertMock.mockResolvedValueOnce(someId);

    const actual = await sut.createReservation(reservation);

    expect(actual).toBe(someId);
  });
});
