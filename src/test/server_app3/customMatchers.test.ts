import { Reservation } from "../../app/server_app/model/ReservationModel";

interface CustomMatchers<R> {
  toBeValidReservation(): R;
}

declare global {
  namespace jest {
    interface Matchers<R> extends CustomMatchers<R> {}
  }
}

expect.extend({
  tobeValidReservation(reservation: Reservation) {
    const validId = reservation.id.length > 5;
    const validUser = reservation.user.length > 5;

    return {
      pass: validId && validUser,
      message: () => "Expected rservation to have valid id and user",
    };
  },
});

const someReservation: Reservation = {
  id: "123456",
  endDate: "someEndDate",
  startDate: "someStartDate",
  room: "someRoom",
  user: "someUser",
};

describe("custom matchers test", () => {
  it("check for valid reservation", () => {
    expect(someReservation).toBeValidReservation();
  });
});
