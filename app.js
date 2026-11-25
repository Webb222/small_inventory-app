// Mock inventory data
let inventory = [
    {
        id: 1,
        name: 'Laptop Pro 15"',
        category: 'Electronics',
        price: 850000,
        quantity: 15,
        sku: 'LAP-001',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop'
    },
    {
        id: 2,
        name: 'Wireless Mouse',
        category: 'Electronics',
        price: 15000,
        quantity: 45,
        sku: 'MOU-002',
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop'
    },
    {
        id: 3,
        name: 'Office Chair',
        category: 'Furniture',
        price: 125000,
        quantity: 8,
        sku: 'FUR-003',
        image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&h=300&fit=crop'
    },
    {
        id: 4,
        name: 'Standing Desk',
        category: 'Furniture',
        price: 320000,
        quantity: 5,
        sku: 'FUR-004',
        image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=400&h=300&fit=crop'
    },
    {
        id: 5,
        name: 'USB-C Cable',
        category: 'Electronics',
        price: 8500,
        quantity: 120,
        sku: 'CBL-005',
        image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=300&fit=crop'
    },
    {
        id: 6,
        name: 'Notebook Set',
        category: 'Office Supplies',
        price: 6500,
        quantity: 3,
        sku: 'OFF-006',
        image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&h=300&fit=crop'
    },
    {
        id: 7,
        name: 'Mechanical Keyboard',
        category: 'Electronics',
        price: 75000,
        quantity: 22,
        sku: 'KEY-007',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop'
    },
    {
        id: 8,
        name: 'Desk Lamp',
        category: 'Furniture',
        price: 25000,
        quantity: 18,
        sku: 'FUR-008',
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop'
    }
];

let editingItemId = null;

// DOM Elements
const inventoryGrid = document.getElementById('inventoryGrid');
const searchInput = document.getElementById('searchInput');
const addItemBtn = document.getElementById('addItemBtn');
const itemModal = document.getElementById('itemModal');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const itemForm = document.getElementById('itemForm');
const modalTitle = document.getElementById('modalTitle');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    renderInventory();
    updateStats();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    addItemBtn.addEventListener('click', openAddModal);
    closeModal.addEventListener('click', closeModalHandler);
    cancelBtn.addEventListener('click', closeModalHandler);
    itemForm.addEventListener('submit', handleFormSubmit);
    searchInput.addEventListener('input', handleSearch);
    
    // Close modal on outside click
    itemModal.addEventListener('click', (e) => {
        if (e.target === itemModal) {
            closeModalHandler();
        }
    });
}

// Render inventory items
function renderInventory(items = inventory) {
    inventoryGrid.innerHTML = '';
    
    if (items.length === 0) {
        inventoryGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-secondary);">
                <p style="font-size: 1.125rem;">No items found</p>
            </div>
        `;
        return;
    }
    
    items.forEach(item => {
        const itemCard = createItemCard(item);
        inventoryGrid.appendChild(itemCard);
    });
}

// Create item card
function createItemCard(item) {
    const card = document.createElement('div');
    card.className = 'inventory-item';
    
    const stockStatus = getStockStatus(item.quantity);
    const totalValue = formatNaira(item.price * item.quantity);
    
    card.innerHTML = `
        <div class="item-image">
            ${item.image ? `<img src="${item.image}" alt="${item.name}" onerror="this.parentElement.innerHTML='📦'">` : '📦'}
        </div>
        <div class="item-content">
            <div class="item-header">
                <div>
                    <div class="item-name">${item.name}</div>
                    <span class="item-category">${item.category}</span>
                </div>
            </div>
            <div class="item-sku">SKU: ${item.sku}</div>
            <div class="item-details">
                <div class="detail-group">
                    <span class="detail-label">Price</span>
                    <span class="detail-value">${formatNaira(item.price)}</span>
                </div>
                <div class="detail-group">
                    <span class="detail-label">Quantity</span>
                    <span class="detail-value">${item.quantity}</span>
                </div>
                <div class="detail-group">
                    <span class="detail-label">Value</span>
                    <span class="detail-value">${totalValue}</span>
                </div>
            </div>
            <div class="stock-status ${stockStatus.class}">
                ${stockStatus.icon} ${stockStatus.text}
            </div>
            <div class="item-actions">
                <button class="btn btn-edit" onclick="editItem(${item.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteItem(${item.id})">Delete</button>
            </div>
        </div>
    `;
    
    return card;
}

// Format currency to Naira
function formatNaira(amount) {
    return '₦' + amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Get stock status
function getStockStatus(quantity) {
    if (quantity <= 5) {
        return { class: 'low', icon: '⚠️', text: 'Low Stock' };
    } else if (quantity <= 20) {
        return { class: 'medium', icon: '📦', text: 'Medium Stock' };
    } else {
        return { class: 'high', icon: '✅', text: 'In Stock' };
    }
}

// Update statistics
function updateStats() {
    const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
    const lowStockItems = inventory.filter(item => item.quantity <= 5).length;
    const totalValue = inventory.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('lowStock').textContent = lowStockItems;
    document.getElementById('totalValue').textContent = formatNaira(totalValue);
}

// Search functionality
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = inventory.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm) ||
        item.sku.toLowerCase().includes(searchTerm)
    );
    renderInventory(filtered);
}

// Modal handlers
function openAddModal() {
    editingItemId = null;
    modalTitle.textContent = 'Add New Item';
    itemForm.reset();
    itemModal.classList.add('active');
}

function openEditModal(item) {
    editingItemId = item.id;
    modalTitle.textContent = 'Edit Item';
    
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemCategory').value = item.category;
    document.getElementById('itemPrice').value = item.price;
    document.getElementById('itemQuantity').value = item.quantity;
    document.getElementById('itemSKU').value = item.sku;
    document.getElementById('itemImage').value = item.image || '';
    
    itemModal.classList.add('active');
}

function closeModalHandler() {
    itemModal.classList.remove('active');
    itemForm.reset();
    editingItemId = null;
}

// Form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('itemName').value,
        category: document.getElementById('itemCategory').value,
        price: parseFloat(document.getElementById('itemPrice').value),
        quantity: parseInt(document.getElementById('itemQuantity').value),
        sku: document.getElementById('itemSKU').value,
        image: document.getElementById('itemImage').value
    };
    
    if (editingItemId) {
        // Update existing item
        const index = inventory.findIndex(item => item.id === editingItemId);
        if (index !== -1) {
            inventory[index] = { ...inventory[index], ...formData };
        }
    } else {
        // Add new item
        const newItem = {
            id: Date.now(),
            ...formData
        };
        inventory.push(newItem);
    }
    
    renderInventory();
    updateStats();
    closeModalHandler();
}

// Edit item
function editItem(id) {
    const item = inventory.find(item => item.id === id);
    if (item) {
        openEditModal(item);
    }
}

// Delete item
function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        inventory = inventory.filter(item => item.id !== id);
        renderInventory();
        updateStats();
    }
}
