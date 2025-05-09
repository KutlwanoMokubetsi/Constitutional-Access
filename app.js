require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const bodyParser = require("body-parser");
const cors = require("cors");
const uploadRoutes = require("./routes/uploadRoutes");
const searchRoutes = require('./routes/search'); 

const app = express();
app.use(cors());
app.use(bodyParser.json());


if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
}

app.use("/api", uploadRoutes);
app.use("/api/search", searchRoutes);  

module.exports = app;
