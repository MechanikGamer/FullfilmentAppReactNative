const mongoose = require("mongoose");

// Embedding Item Schema directly within PackingOrder Schema
const ItemSchema = new mongoose.Schema({
  SKU: {
    type: String,
    required: true,
  },
  EAN: {
    type: String,
    required: true,
  },
  numberOfPieces: {
    type: Number,
    required: true,
    default: 0,
  },
});

// PackingOrder Schema
const PackingOrderSchema = new mongoose.Schema({
  orderId: {
    type: Number,
    required: true,
    unique: true,
  },
  packedBy: {
    type: Number,
    required: true,
  },
  statusPacked: {
    type: Boolean,
    default: false,
  },
  progress: {
    type: String,
    enum: ["Not Started", "Started", "Finished"],
    default: "NotStarted",
  },
  timeStamp: {
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
  },
  note: {
    type: String,
  },
  numberOfPackages: {
    type: String,
  },
  itemsPacked: [
    {
      item: ItemSchema, // Embedding ItemSchema directly
      quantityPacked: Number,
    },
  ],
});

// Middleware to set the updated at date
PackingOrderSchema.pre("save", function (next) {
  this.timeStamp.updatedAt = new Date();
  next();
});

const PackingOrder = mongoose.model("PackingOrder", PackingOrderSchema);

// Exporting PackingOrder model only, as Item is now embedded

module.exports = { PackingOrder };
