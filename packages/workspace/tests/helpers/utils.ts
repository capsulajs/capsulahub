import { helpers } from '@capsulajs/capsulahub-utils/src';

export const testPendingPromise = (promise: Promise<any>) => {
  const timeoutError = 'timeout';
  return helpers
    .getTimeoutPromise({ promise, timeout: 1000, errorMessage: timeoutError })
    .catch((error: Error) => expect(error.message).toEqual(timeoutError));
};
