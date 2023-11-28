document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const productForm = document.getElementById('productForm');
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const productName = document.getElementById('productName').value;
        const productPrice = document.getElementById('productPrice').value;
        socket.emit('new-product', { title: productName, price: productPrice });
    });

    socket.on('product-added', (product) => {
        const productList = document.getElementById('productList');
        const listItem = document.createElement('li');
        listItem.textContent = `${product.title} - Price: $${product.price}`;
        productList.appendChild(listItem);
    });
});
