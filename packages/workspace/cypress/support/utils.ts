export const expectError = (promise: Promise<any>, errorMessage: string) => {
  return promise.catch((error: Error) => {
    expect(error.message).to.equal(errorMessage);
    expect(error).to.instanceOf(Error);
  });
};
