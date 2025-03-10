export const response = (res, statusCode, ok, data, message = "") => {
  return res.status(statusCode).json({
    ok,
    data,
    message,
  });
};
