const test = require('ava');
const m = require('..');

test('should verify a precomputed hash', async (t) => {
  // Precomputed hash for "password"
  const hash =
    '$bcrypt$v=98$r=10$tAe1bhm5zoo0Sx7ZfrCd7w$0T4Cf8htpt/8FbjK+cErdaTh8T6ClYQ';

  t.true(await m.verify(hash, 'password'));
});

test('should throw an error if the identifier is unsupported', async (t) => {
  const wrong =
    '$bcript$v=98$r=10$tAe1bhm5zoo0Sx7ZfrCd7w$0T4Cf8htpt/8FbjK+cErdaTh8T6ClYQ';

  const error = await t.throwsAsync(m.verify(wrong, 'password'));
  t.is(error.message, 'Incompatible bcript identifier found in the hash');
});

test('should throw an error if the version is not supported', async (t) => {
  const wrong =
    '$bcrypt$v=10$r=10$tAe1bhm5zoo0Sx7ZfrCd7w$0T4Cf8htpt/8FbjK+cErdaTh8T6ClYQ';

  const error = await t.throwsAsync(m.verify(wrong, 'password'));
  t.is(error.message, 'Unsupported 10 version');
});

test('should throw an error if the param section is empty', async (t) => {
  const wrong =
    '$bcrypt$v=98$tAe1bhm5zoo0Sx7ZfrCd7w$0T4Cf8htpt/8FbjK+cErdaTh8T6ClYQ';

  const error = await t.throwsAsync(m.verify(wrong, 'password'));
  t.is(error.message, 'The param section cannot be empty');
});

test("should throw an error if the 'r' parameter is missing", async (t) => {
  const wrong =
    '$bcrypt$v=98$i=12$tAe1bhm5zoo0Sx7ZfrCd7w$0T4Cf8htpt/8FbjK+cErdaTh8T6ClYQ';

  const error = await t.throwsAsync(m.verify(wrong, 'password'));
  t.is(error.message, "The 'r' param must be an integer");
});

test("should throw an error if the 'r' parameter is out of range", async (t) => {
  let wrong =
    '$bcrypt$v=98$r=0$tAe1bhm5zoo0Sx7ZfrCd7w$0T4Cf8htpt/8FbjK+cErdaTh8T6ClYQ';

  let error = await t.throwsAsync(m.verify(wrong, 'password'));
  t.regex(error.message, /The 'r' param must be in the range/);

  wrong =
    '$bcrypt$v=98$r=32$tAe1bhm5zoo0Sx7ZfrCd7w$0T4Cf8htpt/8FbjK+cErdaTh8T6ClYQ';

  error = await t.throwsAsync(m.verify(wrong, 'password'));
  t.regex(error.message, /The 'r' param must be in the range/);
});

test('should throw an error if salt is not given', async (t) => {
  const wrong = '$bcrypt$v=98$r=8';

  const error = await t.throwsAsync(m.verify(wrong, 'password'));
  t.is(error.message, 'No salt found in the given string');
});

test('should throw an error if hash is not given', async (t) => {
  const wrong = '$bcrypt$v=98$r=8$aM15713r3Xsvxbi31lqr1Q';

  const error = await t.throwsAsync(m.verify(wrong, 'password'));
  t.is(error.message, 'No hash found in the given string');
});

test('should throw an error if the hash is not in PHC format', async (t) => {
  const hash = '$2b$10$r.czZfk3xmmyQv5XdpAb5uyR2Ad6frnr96DZhI8aCpbYRf6R4AjWO';

  await t.throwsAsync(m.verify(hash, 'password'));
});
