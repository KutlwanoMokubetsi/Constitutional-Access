require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const bodyParser = require("body-parser");
const cors = require("cors");
const uploadRoutes = require("./admin_backend/routes/uploadRoutes");
const searchRoutes = require('./admin_backend/routes/search'); 

const app = express();

const corsOptions = {
  origin: 'https://gray-flower-0a4bfd703.6.azurestaticapps.net',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // handle pre-flight requests

app.use(bodyParser.json());

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
}

app.use("/api", uploadRoutes);
app.use("/api/search", searchRoutes);

module.exports = app;
