let cart = [];

window.onload = async () => {
    // Fetch products from the backend
    const response = await fetch('/api/products');
    const products = await response.json();
    displayProducts(products);
};

// Display products in the store
function displayProducts(products) {
    const productList = document.getElementById('product-list');
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');

        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>$${product.price}</p>
            <button onclick="addToCart('${product._id}', '${product.name}', ${product.price})">Add to Cart</button>
        `;

        productList.appendChild(productDiv);
    });
}

// Add product to cart
function addToCart(productId, name, price) {
    const cartItem = cart.find(item => item.productId === productId);
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ productId, name, price, quantity: 1 });
    }
    updateCart();
}

// Update cart UI
function updateCart() {
    const cartItemsList = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    cartItemsList.innerHTML = '';

    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        const listItem = document.createElement('li');
        listItem.innerText = `${item.name} - ${item.quantity} x $${item.price}`;
        cartItemsList.appendChild(listItem);
    });

    cartTotal.innerText = total;
}

// Checkout
document.getElementById('checkout-btn').onclick = async () => {
    const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: cart }),
    });

    const result = await response.json();
    alert(result.message);
    cart = [];
    updateCart();
};
