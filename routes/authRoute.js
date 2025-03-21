const express = require("express");
const User = require("../models/User");
const crypto = require("crypto");
const router = express.Router();

// Store nonces in memory (should use Redis or similar in production)
const nonces = {};

// Request a nonce for wallet connection
router.get("/api/auth/nonce/:walletAddress", async (req, res) => {
  const { walletAddress } = req.params;

  // Generate a random nonce
  const nonce = crypto.randomBytes(16).toString("hex");

  // Store the nonce (with an expiration time in a real app)
  nonces[walletAddress] = nonce;

  res.status(200).json({ nonce });
});

// Connect wallet
router.post("/api/auth/connect", async (req, res) => {
  const { walletAddress, signature, username } = req.body;

  try {
    // Get the stored nonce
    const nonce = nonces[walletAddress];
    if (!nonce) {
      return res.status(400).json({ error: "No nonce found for this wallet. Please request a nonce first." });
    }

    // Connect wallet and get/create user
    const user = await User.connectWallet(walletAddress, signature, nonce, username);

    // Clear the used nonce
    delete nonces[walletAddress];

    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;