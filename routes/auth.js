const { verifyPassword, findByEmail } = require("../models/user");

const authRouter = require("express").Router();

authRouter.post("/checkCredentials", async (req, res) => {
  const { email, password } = req.body;
  const isEmail = await findByEmail(email);

  if (!isEmail)
    return res.status(401).json("Incorrect email or wrong password");

  const check = await verifyPassword(password, isEmail.hashedPassword);

  if (check) res.status(200).json("ok");
  else res.status(401).json("Wrong password");
});

module.exports = authRouter;
