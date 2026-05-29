# TODO - Fix failing integration tests (userController)

## Information gathered

- test/integration/userController.spec.ts uses `mongodb-memory-server` and
  starts it in `beforeAll`, stops it in `afterAll`.
- CI failures show: MongoDB internal error (fassert) leading to Jest hook
  timeout in `afterEach` and `mongoServer` being `undefined` in `afterAll`.
- Routes for users apply `ensureAdminKey` middleware for POST/GET/PUT/DELETE.

## Plan

1. Reproduce/focus on root cause by running only `userController.spec.ts`.
2. Fix the lifecycle/timeout issue in `userController.spec.ts`:
   - increase Jest hook/test timeout,
   - ensure `mongoServer` is safely checked before calling `.stop()`,
   - ensure DB connection is closed even when beforeAll fails.
3. Run tests again to confirm API status expectations (403 with wrong admin key,
   500 invalid id) pass.
4. If the MongoDB in-memory server still fails, adjust
   `MongoMemoryServer.create()` options (instance/replica settings) and/or
   mongoose connection options.

## Dependent files to edit

- test/integration/userController.spec.ts (primary)

## Followup steps

- Run `npm test -- userController.spec.ts` (or equivalent) until green.
