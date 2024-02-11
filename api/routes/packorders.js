require("dotenv").config();
const fs = require("fs");
const path = require("path");
const express = require("express");
const bwipjs = require("bwip-js"); // Import bwip-js for barcode generation
const PDFDocument = require("pdf-lib").PDFDocument;
const { Order } = require("../models/order");
const { ProductA1 } = require("../models/productsA1");
const router = express.Router();

router.get("/processing-orders", async (req, res) => {
  try {
    // Update the query to include both 'processing' and 'betaltbestilling' statuses
    const orders = await Order.find({
      status: { $in: ["processing", "betaltbestilling", "forsinketleverin"] },
    }).sort({ orderId: 1 });

    // Check if the orders array is empty
    if (orders.length === 0) {
      // Send a 200 OK status with a message indicating there are no orders to pack
      return res.status(200).json({ message: "No orders to pack" });
    }

    // If there are orders, send them as the response
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/product-details", async (req, res) => {
  try {
    // Extracting SKUs array from request body
    const { skus } = req.body;
    if (!skus || !Array.isArray(skus) || skus.length === 0) {
      return res
        .status(400)
        .json({ message: "A non-empty array of SKUs must be provided" });
    }

    // Array to hold the results
    const results = [];

    for (const sku of skus) {
      const product = await ProductA1.findOne({ productId: sku });
      if (product) {
        // Push an object with the SKU, name, and EAN of the product into the results array
        results.push({
          SKU: product.productId,
          name: product.name,
          EAN: product.EAN,
        });
      }
    }

    // Respond with the array of product details
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/orderdata", async (req, res) => {
  const { orderId } = req.body; // Extracting orderId from the request body

  if (!orderId) {
    return res.status(400).json({ message: "Order ID is required" });
  }

  try {
    // Find the order with the given orderId and specified statuses
    const order = await Order.findOne({
      orderId: orderId,
      status: { $in: ["processing", "betaltbestilling", "forsinketleverin"] },
    });

    if (!order) {
      // If the order is not found
      return res.status(404).json({ message: "Order not found" });
    }

    // Send the found order as the response
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

function wrapText(text, maxWidth, fontSize, page) {
  const lines = [];
  const words = text.split(" ");
  let currentLine = words[0];

  const averageCharacterWidth = fontSize * 0.6; // Approximation
  const maxCharactersPerLine = maxWidth / averageCharacterWidth;

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    if ((currentLine + " " + word).length < maxCharactersPerLine) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine); // Add the last line
  return lines;
}

// Helper function to generate barcode as a Promise
function generateBarcode(orderId) {
  return new Promise((resolve, reject) => {
    bwipjs.toBuffer(
      {
        bcid: "code128", // Barcode type
        text: orderId, // Text to encode
        scale: 4, // 3x scaling factor
        height: 15, // Bar height
        includetext: false, // Include human-readable text
        textxalign: "center", // Center-align text
      },
      (err, pngBuffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(pngBuffer);
        }
      }
    );
  });
}

router.post("/fill-pdf", async (req, res) => {
  try {
    const { orderId, labelAmount } = req.body;
    const order = await Order.findOne({ orderId: orderId });
    if (!order) {
      return res.status(404).send("Order not found");
    }

    // Extracting order details
    const { first_name, last_name, address_1, address_2, city, postcode } =
      order.shipping; // Ensure this matches your data structure
    const { phone } = order.billing;
    const { company } = order.shipping || "";

    const Budcode = postcode.substring(0, 1);
    const customer_note = order.customer_note || "";

    const templatePath = path.join(__dirname, "./template.pdf");
    const templateBytes = fs.readFileSync(templatePath);
    const templatePdfDoc = await PDFDocument.load(templateBytes);

    const pdfDoc = await PDFDocument.create();

    for (let i = 0; i < labelAmount; i++) {
      const [templatePage] = await pdfDoc.copyPages(templatePdfDoc, [0]);
      const page = pdfDoc.addPage(templatePage);

      const pngBuffer = await generateBarcode(orderId);
      const barcodeImage = await pdfDoc.embedPng(pngBuffer);

      const { width, height } = page.getSize();

      page.drawImage(barcodeImage, {
        x: 180,
        y: height - 190,
        width: barcodeImage.width / 3,
        height: barcodeImage.height / 3,
      });

      // Wrap and draw text
      const maxWidth = 220; // Adjust based on your template's layout
      const fontSize = 8;
      const lineHeight = fontSize * 1.2;
      const lines = wrapText(customer_note, maxWidth, fontSize, page);
      lines.forEach((line, index) => {
        page.drawText(line, {
          x: 7,
          y: height - 360 - index * lineHeight,
          size: fontSize,
        });
      });

      // Add other text elements
      // Ensure these values are placed correctly in your template
      page.drawText(`${Budcode}`, {
        x: 40,
        y: height - 55,
        size: 28,
      });

      page.drawText(`${first_name} ${last_name}`, {
        x: 18,
        y: height - 240,
        size: 14,
      });
      page.drawText(`${address_1}`, {
        x: 18,
        y: height - 258,
        size: 14,
      });
      page.drawText(`${address_2}`, {
        x: 18,
        y: height - 276,
        size: 14,
      });

      page.drawText(`${i + 1} / ${labelAmount}`, {
        x: 105,
        y: 325,
        size: 14,
      });

      page.drawText(`${postcode} ${city}`, {
        x: 18,
        y: height - 294,
        size: 14,
      });
      page.drawText(`TLF: ${phone}`, { x: 18, y: height - 312, size: 14 });
      page.drawText(`${orderId}`, {
        x: 185,
        y: height - 385,
        size: 28,
      });

      page.drawText(`${company}`, {
        x: 18,
        y: height - 330,
        size: 14,
      });

      // Additional content can be added here in the same way
    }

    const pdfBytes = await pdfDoc.save();
    const filename = `label-${Date.now()}.pdf`;
    const filePath = path.join(__dirname, "../public", filename);
    fs.writeFileSync(filePath, pdfBytes);

    const BackendURL = process.env.BACKEND_URL;
    const BackendPORT = process.env.PORT;
    const fileUrl = `${BackendURL}:${BackendPORT}/${filename}`;

    res.json({ url: fileUrl });
  } catch (error) {
    console.error("Error filling PDF:", error);
    res.status(500).send("Error processing PDF");
  }
});

module.exports = router;
