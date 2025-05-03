const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileRoutes = require('./routes/files');
require('dotenv').config(); // ✅ Load environment variables

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));


// ✅ Use the .env MongoDB connection string
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.use('/api/files', fileRoutes);

app.listen(5000, () => {
  console.log('🚀 Server running at http://localhost:5000');
});
