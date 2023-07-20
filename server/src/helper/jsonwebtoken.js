const jwt = require("jsonwebtoken");

const createJSONWebToken = (payload, secretKey, expiresIn) => {
  if (typeof payload !== "object" || !payload) {
    throw new Error("Payload must be a non-empty object");
  }

  if (typeof secretKey !== "string" || secretKey === "") {
    throw new Error("secretKey must be a non-empty string");
  }

  try {
    const token = jwt.sign(payload, secretKey, { expiresIn: expiresIn });
    return token;
  } catch (error) {
    console.error("Failed to sign the JWT: ", error);
  }

  return token;
};

module.exports = { createJSONWebToken };
