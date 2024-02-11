// models/productA1.js
const mongoose = require("mongoose");

const productA1Schema = new mongoose.Schema({
  productId: String,
  name: String,
  producer: String,
  categoryId: String,
  warranty: String,
  priceNet: String,
  vat: String,
  vatType: String,
  pkwiu: String,
  externalWarehouse: String,
  available: String,
  date: Date,
  onOrder: String,
  specialOffer: String,
  smallPallet: String,
  productIsLarge: String,
  reported: String,
  EAN: String,
  manufacturerPartNumber: String,
  sizeWidth: String,
  sizeLength: String,
  sizeHeight: String,
  weight: String,
  sizeMeasurementUnit: String,
  weightMeasurementUnit: String,
  dimensionalWeight: String,
  additionalAvailabilityInfo: String,
  shippingTimeInHour: String,
  expiryDate: Date,
  ETA: String,
  incomingStock: String,
  mainCategoryTree: String,
  categoryTree: String,
  subCategoryTree: String,
  // Define arrays for images and technical specifications if necessary
  images: [
    {
      url: String,
      isMain: Boolean,
      date: Date,
      copyright: String,
    },
  ],
  // Add more fields as necessary based on XML structure
});

const ProductA1 = mongoose.model("ProductA1", productA1Schema);

module.exports = { ProductA1 };
