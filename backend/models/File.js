const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: String,
  filetype: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  uploadedBy: {
    type: String,
    required: true
  },
  blobUrl: String // e.g., Azure blob URL or local file path
});

module.exports = mongoose.model('File', fileSchema);
