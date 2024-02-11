require("dotenv").config();
const express = require("express");
const { PackingOrder } = require("../models/packing");

const router = express.Router();

router.post("/status", async (req, res) => {
  const { orderId } = req.body; // Extracting orderId from the request body

  if (!orderId) {
    return res.status(400).json({ message: "Order ID is required" });
  }

  try {
    const packingOrder = await PackingOrder.findOne({ orderId: orderId });

    if (packingOrder) {
      // If the order is found, return its progress
      return res.status(200).json({ progress: packingOrder.progress });
    } else {
      // If the order is not found, return a not found message
      return res.status(404).json({ message: "PackingOrder not found" });
    }
  } catch (error) {
    // Handle any other errors
    console.error("Error fetching PackingOrder:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching the PackingOrder" });
  }
});

module.exports = router;
