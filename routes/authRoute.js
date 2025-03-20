const express = require("express");
const UserService = require("../services/UserService");
const router = express.Router();

router.post("/api/auth/register", async (req, res) => {
  const { username, email, password, userType } = req.body;
  try {
    const user = await UserService.registerUser(username, email, password, userType);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const { token, user } = await UserService.loginUser(email, password);
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
