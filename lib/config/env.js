require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}.local`,
});

export const PORT = process.env.PORT || 5121;
export const Environment = process.env.NODE_ENV;
export const MONGOURI = process.env.NODE_ENV;
export const Salt = process.env.SALT;
export const URL = process.env.URL;