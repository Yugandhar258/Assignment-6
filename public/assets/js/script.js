$(document).ready(function () {
  // Handle Registration
  $('#registrationForm').on('submit', function (e) {
      e.preventDefault(); // Prevent the default form submission
      const username = $('#username').val();
      const email = $('#email').val();
      const password = $('#password').val();

      // Send registration data to the server
      $.post('/register', { username, email, password })
          .done(function (data) {
              alert(data.message);
              window.location.href = 'login.html'; // Redirect to login page
          })
          .fail(function (err) {
              alert(err.responseJSON.message);
          });
  });

  // Handle Login
  $('#loginForm').on('submit', function (e) {
      e.preventDefault(); // Prevent the default form submission
      const email = $('#loginEmail').val();
      const password = $('#loginPassword').val();

      // Send login data to the server
      $.post('/login', { email, password })
          .done(function (data) {
              alert(data.message);
              window.location.href = 'index.html'; // Redirect to e-commerce page
          })
          .fail(function (err) {
              alert(err.responseJSON.message);
          });
  });

  // Fetch product data
  $(document).ready(async () => {
      try {
          const response = await fetch('/api/products');

          // Check if the request was successful
          if (!response.ok) {
              throw new Error(`Network response was not ok: ${response.status}`);
          }

          // Parse the response as JSON
          const products = await response.json();

          // Render products in the productContainer
          const productContainer = $('.productContainer');

          products.forEach(product => {
              productContainer.append(`
                  <div class="pd-div min-w-24 hover:shadow-2xl shadow-blue-500/300">
                      <div class="card">
                          <div class ="columns con-img-d flex justify-center">
                              <img src="${product.image}" class="w-2/3 aspect-square card-img-top con-img hover:drop-shadow-2xl" alt="${product.title}"/>
                          </div>
                          <div class="columns card-body">
                              <h5 class="truncate card-title font-bold">${product.title}</h5>
                              <p class="truncate card-text">${product.description}</p>
                              <p class="truncate card-text font-bold">Price: ${product.price}$</p>
                              <button class="btn btn-add-to-cart">Add to Cart</button>
                          </div>
                      </div>
                  </div>
              `);
          });
      } catch (error) {
          console.error('Error fetching products:', error);
      }
  });
});


// Sample data for products
const products = [
    { id: 1, name: "Product 1", price: 100 },
    { id: 2, name: "Product 2", price: 200 },
    { id: 3, name: "Product 3", price: 300 },
    { id: 4, name: "Product 4", price: 400 }
];

let cart = [];

// Function to render product list dynamically
function renderProducts() {
    const productListDiv = document.getElementById('product-list');
    productListDiv.innerHTML = ''; // Clear existing products

    products.forEach(product => {
        productListDiv.innerHTML += `
            <div class="col-md-3 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">Price: $${product.price}</p>
                        <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
    });
}

// Function to add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        // If the product is already in the cart, increment the quantity
        cartItem.quantity++;
    } else {
        // Add the new product to the cart
        cart.push({ ...product, quantity: 1 });
    }

    renderCart(); // Update the cart UI
}

// Function to render cart items
function renderCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    cartItemsDiv.innerHTML = ''; // Clear existing items

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Your cart is empty</p>';
        return;
    }

    cart.forEach(item => {
        cartItemsDiv.innerHTML += `
            <div class="cart-item mb-3">
                <p>${item.name} - $${item.price} (Qty: ${item.quantity})</p>
                <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
    });
}

// Function to remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    renderCart(); // Update the cart UI
}

// Initialize the page by rendering products and empty cart
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    renderCart(); // Start with an empty cart
});
