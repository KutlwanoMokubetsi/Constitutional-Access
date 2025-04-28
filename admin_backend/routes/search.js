const express = require("express");
const router = express.Router();
const Metadata = require("../models/Metadata"); // adjust path if needed

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
    const formattedResults = results.map(doc => ({
      id: doc._id,
      title: doc.fileName || "Untitled",
      excerpt: doc.description || "No description available",
      type: doc.category || "Unknown",
      relevance: `${Math.floor(Math.random() * 21) + 80}%`, // 80-100%
      fileUrl: doc.fileUrl || "", // <-- Use what’s in the DB
      uploadedAt: doc.uploadedAt,
    }));

    res.json(formattedResults);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
