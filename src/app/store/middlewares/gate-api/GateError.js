export default class GateError extends Error {
  constructor(originalError) {
    super(`GateError: ${(originalError && originalError.message) || 'Internal Server Error'}`);
    this.code = (originalError && originalError.code) || -32601;
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
    };
  }
}
