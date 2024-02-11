// Include necessary modules
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const sax = require("sax");
const { ProductA1 } = require("../models/productsA1");

const TEMP_DIR = path.join(__dirname, "temp");
const TEMP_XML_FILE = path.join(TEMP_DIR, "tempDownloadedFile.xml");

// Ensure the temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR);
}

let isRunning = false;
let retryCount = 0;
const maxRetries = 10; // Maximum retries
const retryDelays = [
  // Defining different retry delays in milliseconds
  300000, // 5 minutes
  300000, // 5 minutes
  300000, // 5 minutes
  300000, // 5 minutes
  300000, // 5 minutes
  600000, // 10 minutes
  5400000, // 1.5 hours
  5400000, // 1.5 hours
  5400000, // 1.5 hours
  5400000, // 1.5 hours
];

function delay(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

function downloadFile(url) {
  console.log("Attempting to fetch from:", url);
  axios({
    method: "get",
    url: url,
    responseType: "stream",
  })
    .then((response) => {
      if (response.status === 200) {
        console.log("Response Status:", response.status);
        response.data
          .pipe(fs.createWriteStream(TEMP_XML_FILE))
          .on("finish", () => {
            console.log("File has been downloaded successfully");
            processXMLFile();
            retryCount = 0; // Reset retry count after successful download
          });
      } else {
        console.log("Unexpected response status:", response.status);
        handleDownloadError(
          new Error(`Unexpected status code: ${response.status}`)
        );
      }
    })
    .catch((error) => handleDownloadError(error));
}

function handleDownloadError(error) {
  console.error("Error downloading the file:", error.message);
  if (retryCount < maxRetries) {
    console.log(
      `Waiting ${retryDelays[retryCount] / 60000} minutes to retry... Attempt ${
        retryCount + 1
      } of ${maxRetries}`
    );
    delay(retryDelays[retryCount]).then(() =>
      downloadFile(process.env.PRODUCTS_A1_API_URL)
    );
    retryCount++;
  } else {
    console.error(
      "Error Data:",
      error.response ? error.response.data : "No additional error data"
    );
    isRunning = false;
  }
}

function fetchAndProcessProductsA1() {
  if (isRunning) {
    console.log("The previous job is still running. Exiting this job.");
    return;
  }
  isRunning = true;
  downloadFile(process.env.PRODUCTS_A1_API_URL);
}

function processXMLFile() {
  const stream = sax.createStream(true);
  let currentElement = {};
  let inProduct = false;

  console.log("Beginning to parse XML...");

  stream.on("opentag", (node) => {
    if (node.name === "Product") {
      inProduct = true; // Set the flag to true
      currentElement = {
        productId: "A1" + node.attributes.id, // Add prefix
        // Assign other attributes based on their names in the XML
        name: node.attributes.name,
        producer: node.attributes.producer,
        categoryId: node.attributes.categoryId,
        warranty: node.attributes.warranty,
        priceNet: node.attributes.priceNet,
        vat: node.attributes.vat,
        vat_type: node.attributes.vat_type,
        pkwiu: node.attributes.pkwiu,
        externalWarehouse: node.attributes.externalWarehouse,
        available: node.attributes.available,
        date: node.attributes.date, // Might require conversion to Date object
        onOrder: node.attributes.onOrder,
        specialOffer: node.attributes.specialOffer,
        smallPallet: node.attributes.smallPallet,
        productIsLarge: node.attributes.productIsLarge,
        reported: node.attributes.reported,
        EAN: node.attributes.EAN,
        manufacturerPartNumber: node.attributes.manufacturerPartNumber,
        sizeWidth: node.attributes.sizeWidth,
        sizeLength: node.attributes.sizeLength,
        sizeHeight: node.attributes.sizeHeight,
        weight: node.attributes.weight,
        sizeMeasurementUnit: node.attributes.sizeMeasurementUnit,
        weightMeasurementUnit: node.attributes.weightMeasurementUnit,
        dimensionalWeight: node.attributes.dimensionalWeight,
        additionalAvailabilityInfo: node.attributes.additionalAvailabilityInfo,
        shippingTimeInHour: node.attributes.shippingTimeInHour,
        expiryDate: node.attributes.expiryDate, // Might require conversion to Date object
        ETA: node.attributes.ETA,
        incomingStock: node.attributes.incomingStock,
        mainCategoryTree: node.attributes.mainCategoryTree,
        categoryTree: node.attributes.categoryTree,
        subCategoryTree: node.attributes.subCategoryTree,
        images: [], // Initialize the images array
        // Initialize other fields as required
      };
    } else if (inProduct && node.name === "Image") {
      // Initialize the images array if it doesn't exist
      if (!currentElement.images) {
        currentElement.images = [];
      }

      currentElement.images.push({
        url: node.attributes.url,
        isMain: node.attributes.isMain === "1", // Assuming '1' is the marker for main image
        date: new Date(node.attributes.date), // Might require conversion to Date object
        copyright: node.attributes.copyright,
      });
    }
    // Add additional else if conditions here for other nested tags as necessary
  });

  stream.on("closetag", async (tagName) => {
    if (tagName === "Product" && inProduct) {
      inProduct = false;
      if (currentElement.productId) {
        try {
          await ProductA1.findOneAndUpdate(
            { productId: currentElement.productId },
            { $set: currentElement },
            { upsert: true, new: true }
          );
          // console.log(
          //   "Successfully updated/inserted product",
          //   currentElement.productId
          // );
        } catch (err) {
          console.error(
            "Error updating/inserting product",
            currentElement.productId,
            err
          );
        }
      } else {
      }
      currentElement = {};
    }
  });

  stream.on("error", (error) => {
    console.error("Parsing error:", error);
    stream._parser.error = null;
    stream._parser.resume();
  });

  stream.on("end", () => {
    console.log("Finished parsing XML!");
    isRunning = false;

    fs.unlink(TEMP_XML_FILE, (err) => {
      if (err) console.error("Error deleting temp file:", err);
      else console.log(TEMP_XML_FILE, "was deleted");
    });
  });

  fs.createReadStream(TEMP_XML_FILE)
    .on("error", (error) => {
      console.error("Error reading XML file:", error);
      isRunning = false;
    })
    .pipe(stream);
}

module.exports = { fetchAndProcessProductsA1 };
