// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const cityRoutes = require('./routes/cities');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/cities', cityRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection failed:', err));


// server/models/City.js
const mongoose = require('mongoose');

const CitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
});

module.exports = mongoose.model('City', CitySchema);


// server/routes/cities.js
const express = require('express');
const router = express.Router();
const City = require('../models/City');

// GET all cities
router.get('/', async (req, res) => {
  try {
    const cities = await City.find();
    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new city
router.post('/', async (req, res) => {
  const { name, image } = req.body;
  try {
    const newCity = new City({ name, image });
    await newCity.save();
    res.status(201).json(newCity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE city
router.delete('/:id', async (req, res) => {
  try {
    await City.findByIdAndDelete(req.params.id);
    res.json({ message: 'City deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
