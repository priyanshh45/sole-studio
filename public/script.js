// public/script.js

let cart = [];


// --- Event Listener Setup ---
// Wait for the DOM to be fully loaded before setting up event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Select all buttons with the 'add-to-cart' class
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Get product data from the button's data attributes
            const product = {
                id: e.target.dataset.id,
                name: e.target.dataset.name,
                price: parseInt(e.target.dataset.price)
            };
            addToCart(product);
        });
    });

    // Initial setup for the customizer price
    updatePrice();
});

// Add item to cart
function addToCart(product) {
  // Check if an item is already in the cart and update quantity (optional enhancement)
  // For simplicity, we just push a new item now.
  cart.push(product);
  updateCartCount();
  alert(`${product.name} added to cart!`);
}


function updateCartCount() {
  document.getElementById('cartCount').textContent = cart.length;
}


// Cart Modal (No change needed)
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');


cartBtn.onclick = () => {
  cartModal.classList.remove('hidden');
  renderCart();
};
closeCart.onclick = () => cartModal.classList.add('hidden');


function renderCart() {
  cartItems.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    const li = document.createElement('li');
    // Ensure the display logic works for both standard and custom shoes
    const itemPrice = item.price || 0; // Use 0 if price is missing for safety
    li.textContent = `${item.name} — ₹${itemPrice}`;
    cartItems.appendChild(li);
    total += itemPrice;
  });
  cartTotal.textContent = `Total: ₹${total}`;
}


// Checkout Modal (No change needed)
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckout = document.getElementById('closeCheckout');
const checkoutForm = document.getElementById('checkoutForm');


checkoutBtn.onclick = () => {
  cartModal.classList.add('hidden');
  checkoutModal.classList.remove('hidden');
};
closeCheckout.onclick = () => checkoutModal.classList.add('hidden');


checkoutForm.onsubmit = e => {
  e.preventDefault();
  alert('Order placed successfully! Thank you for shopping.');
  cart = [];
  updateCartCount();
  checkoutModal.classList.add('hidden');
  // In a real app, you would send the cart data to the server here.
};


// Customize Section (No significant change needed)
const colorSelect = document.getElementById('colorSelect');
const materialSelect = document.getElementById('materialSelect');
const totalPrice = document.getElementById('totalPrice');
const preview = document.getElementById('customPreview');


function updatePrice() {
  const baseElement = colorSelect.selectedOptions[0];
  const matElement = materialSelect.selectedOptions[0];
  
  // Use fallbacks for parseInt in case data-price is missing
  const base = parseInt(baseElement.dataset.price) || 0;
  const mat = parseInt(matElement.dataset.price) || 0;
  
  totalPrice.textContent = `Total: ₹${base + mat}`;
}
colorSelect.onchange = updatePrice;
materialSelect.onchange = updatePrice;


document.getElementById('addCustomToCart').onclick = () => {
  const color = colorSelect.value;
  const material = materialSelect.value;
  const base = parseInt(colorSelect.selectedOptions[0].dataset.price);
  const mat = parseInt(materialSelect.selectedOptions[0].dataset.price);
  const price = base + mat;
  
  const customProduct = { 
    id: `custom-${Date.now()}`, // Unique ID for custom item
    name: `${color} Custom (${material})`, 
    price: price 
  };
  cart.push(customProduct);
  updateCartCount();
  alert('Customized shoe added to cart!');
};