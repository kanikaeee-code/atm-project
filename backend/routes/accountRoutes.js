const express = require("express");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const jwt = require("jsonwebtoken");

const router = express.Router();

// middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// BALANCE
router.get("/balance", auth, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json({ balance: user.balance });
});

// DEPOSIT
router.post("/deposit", auth, async (req, res) => {
  const { amount } = req.body;

  const user = await User.findById(req.userId);
  user.balance += amount;
  await user.save();

  await Transaction.create({
    userId: req.userId,
    type: "Deposit",
    amount
  });

  res.json({ message: "Deposit successful" });
});

// WITHDRAW
router.post("/withdraw", auth, async (req, res) => {
  const { amount } = req.body;

  const user = await User.findById(req.userId);

  if (user.balance < amount)
    return res.status(400).json({ message: "Insufficient balance" });

  user.balance -= amount;
  await user.save();

  await Transaction.create({
    userId: req.userId,
    type: "Withdraw",
    amount
  });

  res.json({ message: "Withdraw successful" });
});

// HISTORY
router.get("/history", auth, async (req, res) => {
  const data = await Transaction.find({ userId: req.userId });
  res.json(data);
});

module.exports = router;