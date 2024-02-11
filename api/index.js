const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { Order } = require("./models/order");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const cron = require("node-cron");
const {
  fetchAndProcessProductsA1,
} = require("./tasks/fetchAndProcessProductsA1");

const app = express();
const port = process.env.PORT || 8000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

// Connect to MongoDB
mongoose
  .connect(process.env.DATABASE_URL, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Import routes
const userRoutes = require("./routes/users");
const packorderRoutes = require("./routes/packorders");
const verifyToken = require("./middleware/verifyToken"); // adjust path as necessary
const Packing = require("./routes/packing");

// Use routes
app.use("/api/users", userRoutes);
app.use("/api/orders", verifyToken, packorderRoutes);
app.use("/api/packing", verifyToken, Packing);

async function fetchAndUpdateOrders() {
  let page = 1; // Start from page 1
  const perPage = 100; // Adjust per_page value as needed, up to the API max

  try {
    while (true) {
      // Keep looping until no more pages
      const apiUrl = `${process.env.WP_API_URL}?consumer_key=${process.env.WP_API_KEY}&consumer_secret=${process.env.WP_API_SECRET}&per_page=${perPage}&page=${page}`;
      const response = await axios.get(apiUrl);
      const orders = response.data;

      if (orders.length === 0) {
        // No more orders to fetch
        break;
      }

      for (let orderData of orders) {
        // Construct order data from response
        const orderToSaveOrUpdate = {
          orderId: orderData.id,
          parent_id: orderData.parent_id,
          status: orderData.status,
          currency: orderData.currency,
          date_created: orderData.date_created,
          date_modified: orderData.date_modified,
          total: orderData.total,
          total_tax: orderData.total_tax,
          billing: orderData.billing, // Assuming these are direct mappings
          shipping: orderData.shipping,
          customer_note: orderData.customer_note,
          date_completed: orderData.date_completed,
          date_paid: orderData.date_paid,
          // meta_data and other array fields would need specific handling if they are more complex
          line_items: orderData.line_items,
          shipping_lines: orderData.shipping_lines,
          fee_lines: orderData.fee_lines,
          coupon_lines: orderData.coupon_lines,
          refunds: orderData.refunds,
        };

        const existingOrder = await Order.findOne({ orderId: orderData.id });
        if (existingOrder) {
          // Update existing order
          await Order.updateOne(
            { orderId: orderData.id },
            { $set: orderToSaveOrUpdate }
          );
        } else {
          // Create a new order in the database
          const newOrder = new Order(orderToSaveOrUpdate);
          await newOrder.save();
        }
      }

      console.log(`Orders fetched and updated for page ${page}.`);
      page += 1; // Move to the next page
    }

    console.log("All orders fetched and updated successfully");
  } catch (error) {
    console.error("Failed to fetch or update orders:", error);
  }
}

// Schedule tasks to run at the interval specified in your .env file
cron.schedule(process.env.CRON_INTERVAL, () => {
  console.log("Fetching and updating orders...");
  fetchAndUpdateOrders();
});

cron.schedule(process.env.CRON_ACTION_INTERVAL, () => {
  console.log("Running the fetchAndProcessProductsA1 job...");
  fetchAndProcessProductsA1();
});

function deletePDFsInPublic() {
  const directoryPath = path.join(__dirname, "public");

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Could not list the directory.", err);
      return;
    }

    files.forEach((file) => {
      if (path.extname(file) === ".pdf") {
        // Construct the full path for each file
        const filePath = path.join(directoryPath, file);

        // Delete the file
        fs.unlink(filePath, (error) => {
          if (error) {
            console.error("Could not delete file.", error);
            return;
          }
        });
      }
    });
  });
}

cron.schedule("0 0 * * *", () => {
  console.log("Daily cleaning public folder for labels");
  deletePDFsInPublic();
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
