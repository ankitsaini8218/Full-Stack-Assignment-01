const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let products = [
  { id: 1, name: 'Smart Watch Pro', price: 199.99, description: 'AMOLED display with heart-rate tracking', stock: 15 },
  { id: 2, name: 'Laptop Backpack', price: 49.99, description: 'Water-resistant 16-inch travel backpack', stock: 30 },
  { id: 3, name: 'Bluetooth Speaker', price: 69.99, description: '360-degree deep bass portable speaker', stock: 20 }
];
let orders = [];
let nextProductId = 4;

// Get all products
app.get('/api/products', (req, res) => res.json(products));

// Seller Master Panel: Add product
app.post('/api/products', (req, res) => {
  const { name, price, description, stock } = req.body;
  const newProduct = {
    id: nextProductId++,
    name,
    price: parseFloat(price),
    description,
    stock: parseInt(stock || 10, 10)
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Seller Master Panel: Edit product
app.put('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  const { name, price, description, stock } = req.body;
  product.name = name ?? product.name;
  product.price = price != null ? parseFloat(price) : product.price;
  product.description = description ?? product.description;
  product.stock = stock != null ? parseInt(stock, 10) : product.stock;
  res.json(product);
});

// Checkout & Payment Processing
app.post('/api/checkout', (req, res) => {
  const { items, total, paymentMethod, customerName } = req.body;
  if (!items || !items.length) {
    return res.status(400).json({ error: 'Cart is empty' });
  }
  const order = {
    orderId: 'ORD-' + Date.now(),
    customerName: customerName || 'Guest Customer',
    items,
    total,
    paymentMethod,
    status: 'Paid & Confirmed',
    date: new Date().toLocaleString()
  };
  orders.unshift(order);
  res.status(201).json(order);
});

// Get successful orders
app.get('/api/orders', (req, res) => res.json(orders));

const PORT = 3005;
app.listen(PORT, () => console.log(`E-Commerce App running at http://localhost:${PORT}`));
