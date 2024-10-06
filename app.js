const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const usersFilePath = path.join(__dirname, 'data', 'users.json');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'login.html'));
});
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'login.html'));
});
// Serve Registration page
app.get('/register.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'register.html'));
});

app.get('/cart.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'cart.html'));
});

// Serve E-Commerce page
app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'index.html'));
});
// Registration route
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  // Read existing users
  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading user data.' });
    }

    const users = JSON.parse(data || '[]');

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // Create new user and save
    const newUser = { username, email, password };
    users.push(newUser);

    fs.writeFile(usersFilePath, JSON.stringify(users), err => {
      if (err) {
        return res.status(500).json({ message: 'Error saving user data.' });
      }
      res.status(201).json({ message: 'User registered successfully!' });
    });
  });
});

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading user data.' });
    }

    const users = JSON.parse(data || '[]');

    // Check for user credentials
    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    res.status(200).json({ message: `Login successful! Welcome back, ${user.username}` });
  });
});

// API endpoint to fetch products (mock data)
app.get('/api/products', (req, res) => {
  // Sample product data
  const products = [
    { id: 1, title: 'Product 1', description: 'Description of product 1', price: 10.0, image: 'https://via.placeholder.com/150' },
    { id: 2, title: 'Product 2', description: 'Description of product 2', price: 15.0, image: 'https://via.placeholder.com/150' },
    // Add more products as needed
  ];

  res.json(products);
});

// Start the server
app.listen(9700, () => {
  console.log("Server is running @ http://localhost:9700");
});
