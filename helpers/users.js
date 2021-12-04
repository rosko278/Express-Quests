const jwt = require("jsonwebtoken");

const PRIVATE_KEY = "superSecretStringNowoneShouldKnowOrTheCanGenerateTokens";

const calculateToken = (userEmail = "", user_id) => {
  return jwt.sign({ email: userEmail, user_id }, PRIVATE_KEY);
};

const decode = (token) => {
  return jwt.decode(token);
};

module.exports = { calculateToken, decode };
