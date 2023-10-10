const Block = require('../js/block.js');

test('creating Block stores values', () => {
  let block = new Block(100, 123, 20, 200);
  expect(block.loc.x).toBe(100);
  expect(block.loc.y).toBe(123);
  expect(block.size.x).toBe(20);
  expect(block.size.y).toBe(200);
});