const express = require("express");
const router = express.Router();
const Metadata = require("../models/Metadata"); // adjust path if needed
require('dotenv').config();

const encode = str => encodeURIComponent(str);

// Simple text + tag search
router.get("/", async (req, res) => {
  try {
    const { q, tags } = req.query;
    const query = {};

    // Searching in the 'fileName', 'description', 'category', and 'uploadedBy' fields
    if (q) {
      query.$or = [
        { fileName: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
        { uploadedBy: { $regex: q, $options: "i" } },
      ];
    }

    // Handling the 'tags' array query
    if (tags) {
      const tagArray = tags.split(",").map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    // Query the Metadata collection
    const results = await Metadata.find(query).sort({ uploadedAt: -1 }).limit(50);

    // Format the response to match frontend expectations
    const formattedResults = results.map(doc => {
      const fileUrl = doc.fileUrl;

      if (
        !fileUrl ||
        typeof fileUrl !== "string" ||
        fileUrl.includes("http") ||  // This prevents full URLs like https://...
        fileUrl.includes("undefined")
      ) {
        console.log("Invalid fileUrl:", fileUrl);
        return null;
      }

      console.log("Found fileUrl:", fileUrl);

      const encodedPath = encode(fileUrl);

      return {
        id: doc._id,
        title: doc.fileName || "Untitled",
        excerpt: doc.description || "No description available",
        type: doc.category || "Unknown",
        relevance: `${Math.floor(Math.random() * 21) + 80}%`,
        fileUrl: `${process.env.REACT_APP_SEARCH_BACKEND_URL}/search/download/${encodedPath}`,
        uploadedAt: doc.uploadedAt,
      };
    }).filter(item => item !== null);

    console.log("Formatted results with valid fileUrl:", formattedResults.map(r => r.fileUrl));
    res.json(formattedResults);

  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/download/:encodedPath", async (req, res) => {
  try {
    const blobPath = decodeURIComponent(req.params.encodedPath);
    console.log("Decoded blobPath:", blobPath);

    const blobUrl = `https://${process.env.ACCOUNT_NAME}.blob.core.windows.net/${process.env.CONTAINER_NAME}/${blobPath}`;
    return res.redirect(blobUrl);
  } catch (err) {
    console.error("Redirect download error:", err.message);
    res.status(500).send("Failed to redirect to file.");
  }
});

module.exports = router;
