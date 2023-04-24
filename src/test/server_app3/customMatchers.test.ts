import { Reservation } from "../../app/server_app/model/ReservationModel";

interface CustomMatchers<R> {
  toBeValidReservation(): R;
  toHaveUser(user: string): R;
}

declare global {
  namespace jest {
    interface Matchers<R> extends CustomMatchers<R> {}
  }
}

expect.extend({
  toBeValidReservation(reservation: Reservation) {
    const validId = reservation.id.length > 5;
    const validUser = reservation.user.length > 5;

    return {
      pass: validId && validUser,
      message: () => "Expected reservation to have valid id and user",
    };
  },
  toHaveUser(reservation: Reservation, user: string) {
    const hasValidUser = user == reservation.user;

    return {
      pass: hasValidUser,
      message: () =>
        `Expected reservation to have user ${user}, received ${reservation.user}`,
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
    expect(someReservation).toHaveUser("someUser");
  });
});
