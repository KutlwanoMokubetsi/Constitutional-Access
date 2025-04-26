require('dotenv').config();
const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL);

const { MulterAzureStorage } = require("multer-azure-blob-storage");



const azureStorage = new MulterAzureStorage({
  accessKey: process.env.ACCESS_KEY,
  accountName: process.env.ACCOUNT_NAME,
  containerName: process.env.CONTAINER_NAME,
  containerAccessLevel: 'blob',
  blobName: (req, file) => {
    return new Promise((resolve, reject) => {

      const category = req.query.category; 
      const blobName = `${category}/${Date.now()}-${file.originalname}`;
      resolve(blobName);
    });
  },
});


const upload = multer({ storage: azureStorage });


app.post('/upload', upload.array("files"), (req, res) => {
  console.log("Files received:", req.files);
  console.log("Body received:", req.body);

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  const fileUrls = req.files.map(file => {
    return `https://${process.env.ACCOUNT_NAME}.blob.core.windows.net/${process.env.CONTAINER_NAME}/${file.blobName}`;
  });

  console.log("File URLs generated:", fileUrls);

  res.status(200).json({
    message: "Files uploaded successfully",
    files: req.files,
    fileUrls: fileUrls,
  });
});



const MetadataSchema = new mongoose.Schema({
  fileName: String,
  description: String,
  category: String,
  uploadedBy: String,
  tags: [String],           
  fileUrl: String,
  uploadedAt: { type: Date, default: Date.now },
});

const Metadata = mongoose.model('Metadata', MetadataSchema);

app.post("/upload/metadata", async (req, res) => {
  console.log("POST /upload/metadata hit");
  try {
      // Log incoming metadata

    const { fileName, description, category, uploadedBy, tags, fileUrl } = req.body;
    console.log("Metadata received:", req.body);

    const newMeta = new Metadata({
      fileName,
      description,
      category,
      uploadedBy,
      tags,
      fileUrl,
    });

    await newMeta.save();
    res.status(201).json({ message: "Metadata saved", metadata: newMeta });
  } catch (err) {
    console.error("Error saving metadata:", err);  
    res.status(500).json({ error: err.message });
  }
});





app.listen(5000, () => console.log("Listening on port 5000..."));
