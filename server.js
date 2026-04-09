// server.js

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// ----- Models -----
const Product = require('./models/Product');
const Review = require('./models/Review');

// ----- Setup -----
const app = express();
const PORT = 3000;

const MONGODB_URI = 'mongodb+srv://soleadmin:7TPW294DV5ya@cluster0.gti6dg6.mongodb.net/sole_studio_db?retryWrites=true&w=majority';

// ----- Middleware -----
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ----- Connect to MongoDB -----
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
  initializeProducts();
})
.catch(err => console.error('❌ MongoDB connection error:', err));

// ----- Seed Products on First Run -----
async function initializeProducts() {
  const productData = require('./public/products.json');
  const count = await Product.countDocuments();

  if (count === 0) {
    await Product.insertMany(productData);
    console.log('📦 Products seeded into MongoDB.');
  }
}

// ----- ROUTES -----

// Home/Shop page (shows products)
app.get('/', async (req, res) => {
  const products = await Product.find({});
  res.render('index', { products });
});

// Products API (JSON GET for frontend AJAX)
app.get('/api/products', async (req, res) => {
  res.json(await Product.find({}));
});

// CRUD API for Products
app.post('/api/products', async (req, res) => {
  const prod = await Product.create(req.body);
  res.status(201).json(prod);
});
app.put('/api/products/:id', async (req, res) => {
  const prod = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(prod);
});
app.delete('/api/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// ----- REVIEWS -----
app.get('/reviews', async (req, res) => {
  const reviews = await Review.find({});
  res.render('reviews', { reviews });
});

// Reviews API (for AJAX filtering)
app.get('/api/reviews', async (req, res) => {
  let filter = {};
  if (req.query.rating) filter.rating = +req.query.rating;
  res.json(await Review.find(filter));
});

// Add a review by form (redirects to reviews page)
app.post('/reviews', async (req, res) => {
  const { user, rating, message } = req.body;
  await Review.create({ user, rating, message });
  res.redirect('/reviews');
});

// Update a review (API, if needed)
app.put('/api/reviews/:id', async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(review);
});

// Delete a review (API, if needed)
app.delete('/api/reviews/:id', async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// ----- Server Start -----
app.listen(PORT, () => {
  console.log(`🌍 Server running on http://localhost:${PORT}`);
  console.log('Monitor for changes with Nodemon...');
});
