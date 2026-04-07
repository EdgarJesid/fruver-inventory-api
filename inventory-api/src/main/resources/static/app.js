const API = 'http://localhost:8080/api/products';
const LOW_STOCK_THRESHOLD = 5;

async function loadProducts() {
    const res = await fetch(API);
    const products = await res.json();
    renderProducts(products);
    checkLowStock(products);
}

function renderProducts(products) {
    const tbody = document.getElementById('productList');
    tbody.innerHTML = '';
    products.forEach(p => {
        const isLow = p.quantity <= LOW_STOCK_THRESHOLD;
        tbody.innerHTML += `
            <tr class="${isLow ? 'low-stock' : ''}">
                <td>${p.id}</td>
                <td>${p.name}</td>
                <td><span class="badge ${p.category}">${p.category}</span></td>
                <td>$${p.price}</td>
                <td>${p.quantity} kg</td>
                <td>
                    <button class="edit" onclick="editProduct(${p.id}, '${p.name}', '${p.category}', ${p.price}, ${p.quantity})">Edit</button>
                    <button class="delete" onclick="deleteProduct(${p.id})">Delete</button>
                </td>
            </tr>`;
    });
}

function checkLowStock(products) {
    const lowItems = products.filter(p => p.quantity <= LOW_STOCK_THRESHOLD);
    const banner = document.getElementById('alertBanner');
    const list = document.getElementById('alertList');

    if (lowItems.length > 0) {
        banner.style.display = 'block';
        list.innerHTML = '';
        lowItems.forEach(p => {
            list.innerHTML += `<li>${p.name} — only ${p.quantity} kg left</li>`;
        });
    } else {
        banner.style.display = 'none';
    }
}

async function saveProduct() {
    const id = document.getElementById('productId').value;
    const product = {
        name: document.getElementById('name').value,
        category: document.getElementById('category').value,
        price: document.getElementById('price').value,
        quantity: document.getElementById('quantity').value
    };

    if (id) {
        await fetch(`${API}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
    } else {
        await fetch(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
    }

    cancelEdit();
    loadProducts();
}

function editProduct(id, name, category, price, quantity) {
    document.getElementById('productId').value = id;
    document.getElementById('name').value = name;
    document.getElementById('category').value = category;
    document.getElementById('price').value = price;
    document.getElementById('quantity').value = quantity;
    document.getElementById('form-title').innerText = 'Edit Product';
    document.querySelector('button[onclick="saveProduct()"]').innerText = 'Update';
    document.getElementById('cancelBtn').style.display = 'inline-block';
}

function cancelEdit() {
    document.getElementById('productId').value = '';
    document.getElementById('name').value = '';
    document.getElementById('category').value = '';
    document.getElementById('price').value = '';
    document.getElementById('quantity').value = '';
    document.getElementById('form-title').innerText = 'Add Product';
    document.querySelector('button[onclick="saveProduct()"]').innerText = 'Add';
    document.getElementById('cancelBtn').style.display = 'none';
}

async function deleteProduct(id) {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    loadProducts();
}

loadProducts();