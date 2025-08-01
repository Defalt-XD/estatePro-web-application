document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
    initializeCharts();
    loadProperties();
    setupEventListeners();
});

// Dashboard Navigation
function initializeDashboard() {
    const navLinks = document.querySelectorAll('.dashboard-nav a');
    const sections = document.querySelectorAll('.dashboard-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);

            // Update active states
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });
        });
    });
}

// Charts and Analytics
function initializeCharts() {
    const ctx = document.getElementById('propertyViewsChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Property Views',
                data: [150, 300, 250, 400, 450, 350],
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        borderDash: [2, 4]
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Property Management
function loadProperties() {
    const propertyGrid = document.querySelector('.property-grid');
    const properties = [
        {
            id: 1,
            image: 'my property.jpeg',
            title: 'Modern Apartment',
            location: 'Downtown Miami',
            price: '$450,000',
            status: 'For Sale',
            views: 1234
        },
        // Add more properties
    ];

    propertyGrid.innerHTML = properties.map(property => `
        <div class="property-card">
            <img src="${property.image}" alt="${property.title}">
            <div class="property-info">
                <h3>${property.title}</h3>
                <p class="location"><i class="fas fa-map-marker-alt"></i> ${property.location}</p>
                <p class="price">${property.price}</p>
                <div class="property-stats">
                    <span><i class="fas fa-eye"></i> ${property.views} views</span>
                    <span class="status ${property.status.toLowerCase().replace(' ', '-')}">${property.status}</span>
                </div>
                <div class="property-actions">
                    <button class="edit-btn"><i class="fas fa-edit"></i> Edit</button>
                    <button class="delete-btn"><i class="fas fa-trash"></i> Delete</button>
                </div>
            </div>
        </div>
    `).join('');

    // Add event listeners to property cards
    setupPropertyCardEvents();
}

function setupPropertyCardEvents() {
    const editButtons = document.querySelectorAll('.edit-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');

    editButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const propertyCard = e.target.closest('.property-card');
            openPropertyEditor(propertyCard);
        });
    });

    deleteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const propertyCard = e.target.closest('.property-card');
            confirmDeleteProperty(propertyCard);
        });
    });
}

function openPropertyEditor(propertyCard) {
    // Create and show property editor modal
    const modal = document.createElement('div');
    modal.className = 'modal property-editor';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Edit Property</h2>
            <form id="edit-property-form">
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" value="${propertyCard.querySelector('h3').textContent}">
                </div>
                <div class="form-group">
                    <label>Location</label>
                    <input type="text" value="${propertyCard.querySelector('.location').textContent.trim()}">
                </div>
                <div class="form-group">
                    <label>Price</label>
                    <input type="text" value="${propertyCard.querySelector('.price').textContent}">
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select>
                        <option>For Sale</option>
                        <option>For Rent</option>
                        <option>Sold</option>
                    </select>
                </div>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    // Handle modal close
    modal.querySelector('.close').addEventListener('click', () => {
        modal.remove();
    });

    // Handle form submission
    modal.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        // Update property card with new values
        modal.remove();
        showNotification('Property updated successfully!');
    });
}

function confirmDeleteProperty(propertyCard) {
    const modal = document.createElement('div');
    modal.className = 'modal confirm-delete';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this property?</p>
            <div class="modal-actions">
                <button class="cancel-btn">Cancel</button>
                <button class="delete-btn">Delete</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.cancel-btn').addEventListener('click', () => {
        modal.remove();
    });

    modal.querySelector('.delete-btn').addEventListener('click', () => {
        propertyCard.remove();
        modal.remove();
        showNotification('Property deleted successfully!');
    });
}

// Event Listeners
function setupEventListeners() {
    // Add Property Button
    const addPropertyBtn = document.querySelector('.add-property-btn');
    addPropertyBtn.addEventListener('click', () => {
        openAddPropertyModal();
    });

    // Property Filters
    const filterSelects = document.querySelectorAll('.property-filters select');
    filterSelects.forEach(select => {
        select.addEventListener('change', () => {
            filterProperties();
        });
    });

    // Notifications
    const notifButton = document.querySelector('.notifications');
    notifButton.addEventListener('click', () => {
        toggleNotifications();
    });

    // Messages
    const msgButton = document.querySelector('.messages');
    msgButton.addEventListener('click', () => {
        toggleMessages();
    });
}

function openAddPropertyModal() {
    const modal = document.createElement('div');
    modal.className = 'modal add-property';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Add New Property</h2>
            <form id="add-property-form">
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" required>
                </div>
                <div class="form-group">
                    <label>Location</label>
                    <input type="text" required>
                </div>
                <div class="form-group">
                    <label>Price</label>
                    <input type="text" required>
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select required>
                        <option>For Sale</option>
                        <option>For Rent</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Images</label>
                    <input type="file" multiple accept="image/*">
                </div>
                <button type="submit">Add Property</button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.close').addEventListener('click', () => {
        modal.remove();
    });

    modal.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        // Handle new property addition
        modal.remove();
        showNotification('Property added successfully!');
        loadProperties(); // Reload property grid
    });
}

function filterProperties() {
    // Implement property filtering logic
    console.log('Filtering properties...');
}

function toggleNotifications() {
    // Implement notifications panel
    console.log('Toggling notifications...');
}

function toggleMessages() {
    // Implement messages panel
    console.log('Toggling messages...');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}
