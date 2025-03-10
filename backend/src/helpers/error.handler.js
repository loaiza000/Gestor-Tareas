import { response } from "./response.js";

export const handleError = (res, error) => {
  console.error("Error:", error);
  return response(
    res,
    error.status || 500,
    false,
    "",
    error.message || "Error interno del servidor"
  );
};
