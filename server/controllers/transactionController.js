const Transaction = require("../models/Transaction");

// Add transaction
exports.addTransaction = async (req, res) => {
  try {
    const { amount, type, category, note, date } = req.body;

    // basic validation
    if (!amount || !type) {
      return res.status(400).json({ message: "Amount and type are required" });
    }

    // type validation
    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    const transaction = await Transaction.create({
      userId: req.user._id,
      amount,
      type,
      category,
      note,
      date,
    });

    res.json(transaction);

  } catch (error) {
    res.status(500).json({ message: "Error adding transaction" });
  }
};

// Get all transactions (user specific)
exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({
            userId: req.user._id,
        }).sort({ createdAt: -1 });

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching transactions" });
    }
};

// Delete
exports.deleteTransaction = async (req, res) => {
    try {
        await Transaction.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });
        res.json({ message: "Deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting" });
    }
};

// Summary
exports.getSummary = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user._id });

        let income = 0;
        let expense = 0;

        transactions.forEach((t) => {
            if (t.type === "income") income += t.amount;
            else expense += t.amount;
        });

        res.json({
            income,
            expense,
            balance: income - expense,
        });

    } catch (error) {
        res.status(500).json({ message: "Error fetching summary" });
    }
};

exports.updateTransaction = async (req, res) => {
  try {
    const { amount, type, category, note, date } = req.body;

    // basic validation
    if (!amount || !type) {
      return res.status(400).json({ message: "Amount and type are required" });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    const updated = await Transaction.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id, // 🔒 security
      },
      { amount, type, category, note, date },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating transaction" });
  }
};