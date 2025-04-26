// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const searchRoutes = require('./routes/search');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Routes
app.use('/api/search', searchRoutes);



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
