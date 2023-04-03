import { generateRandomId } from "../../../app/server_app/data/IdGenerator"

describe("IdGenerator test suite" , () => {
  it("should return random bytes of length 10", () => {
    const randomId = generateRandomId();

    expect(randomId.length).toBe(20);
  })
})