const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { updateTransaction } = require("../controllers/transactionController");

const {
  addTransaction,
  getTransactions,
  deleteTransaction,
  getSummary,
} = require("../controllers/transactionController");

router.post("/", protect, addTransaction);
router.get("/", protect, getTransactions);
router.delete("/:id", protect, deleteTransaction);
router.get("/summary", protect, getSummary);
router.put("/:id", protect, updateTransaction);

module.exports = router;