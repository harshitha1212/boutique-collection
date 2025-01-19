const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost/boutique-store', { useNewUrlParser: true, useUnifiedTopology: true });

// Product Model
const Product = mongoose.model('Product', new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    image: String,
    size: [String],  // Available sizes like 'S', 'M', 'L'
    color: [String], // Available colors
}));

// Order Model
const Order = mongoose.model('Order', new mongoose.Schema({
    items: [{
        productId: mongoose.Schema.Types.ObjectId,
        quantity: Number,
        size: String,
        color: String,
    }],
    total: Number,
    date: { type: Date, default: Date.now },
}));

// Routes
// Fetch all products
app.get('/api/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// Create an order
app.post('/api/order', async (req, res) => {
    const { items } = req.body;
    let total = 0;

    // Calculate the total cost of the order
    for (const item of items) {
        const product = await Product.findById(item.productId);
        total += product.price * item.quantity;
    }

    const order = new Order({ items, total });
    await order.save();

    res.json({ message: 'Order placed successfully!', order });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});