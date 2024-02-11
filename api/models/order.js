// models/order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: Number,
  parent_id: Number,
  status: String,
  currency: String,
  date_created: Date,
  date_modified: Date,
  total: String,
  total_tax: String,
  billing: {
    first_name: String,
    last_name: String,
    company: String,
    address_1: String,
    address_2: String,
    city: String,
    state: String,
    postcode: String,
    country: String,
    email: String,
    phone: String,
  },
  shipping: {
    first_name: String,
    last_name: String,
    company: String,
    address_1: String,
    address_2: String,
    city: String,
    state: String,
    postcode: String,
    country: String,
    phone: String,
  },
  customer_note: String,
  date_completed: Date,
  date_paid: Date,
  // Assume meta_data, line_items, etc. are arrays of objects or IDs. Modify as necessary.
  line_items: [Object],
  shipping_lines: [Object],
  fee_lines: [Object],
  coupon_lines: [Object],
  refunds: [Object],
});

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order };
