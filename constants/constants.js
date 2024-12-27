module.exports = Object.freeze({
  TOKEN_EXPIRED_ERR: 'TokenExpiredError: jwt expired',
  PASSWORD: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/,
  EMAIL: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
});
