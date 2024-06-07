import utils from "node:util";

test("just log", () => {
  console.log(
    utils.formatWithOptions({ colors: true }, "See object %O", { foo: 42 })
  );

  expect(1 + 1).toBe(2);
});
