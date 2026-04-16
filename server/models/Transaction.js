const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  amount: Number,
  type: String, // income / expense
  category: String,
  note: String,
  date: {
    type: Date,
    default: Date.now,
  },
  isPinned: {
  type: Boolean,
  default: false,
},
}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);