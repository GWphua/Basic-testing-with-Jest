## Course notes

### Test Doubles

- Why do we need test doubles?
  - Some units are'nt fast, or easily accessible, so we replace them in tests.

- What are test doubles
  - Pretend objects used in place of a real object for testing purposes.
    1. Dummy: Passed around but not used.
    2. Fake: Simplified working implementation, take a shortcut.
    3. Stubs: Incomplete objects used as arguments.
    4. Spies: Track information about how a unit is called.
    5. Mocks: Pre-programmed with expectations.
  - Note for Jest: Mocks and spies have a lot in common.

### Mocks
- Most used, most debated.
- The way we use them greatly influences the way we write tests.
- If need to use them too much, there is something wrong with our code.
- Testing / Mocking stiles: London / Chicago.

#### Mocks vs spies
- Spies are not directly injected into SUT.
- Original functionality is preserved with spies.
- Spies usually are used to track method calls.