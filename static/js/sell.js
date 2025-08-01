document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    setupPropertyForm();
    loadRecentSales();
    setupEventListeners();
});

// Initialize Market Insights Charts
function initializeCharts() {
    // Property Values Chart
    const propertyValuesCtx = document.getElementById('propertyValuesChart').getContext('2d');
    new Chart(propertyValuesCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Average Property Value',
                data: [300000, 310000, 305000, 315000, 325000, 330000],
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
                    beginAtZero: false,
                    grid: {
                        borderDash: [2, 4]
                    }
                }
            }
        }
    });

    // Market Trends Chart
    const marketTrendsCtx = document.getElementById('marketTrendsChart').getContext('2d');
    new Chart(marketTrendsCtx, {
        type: 'bar',
        data: {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [{
                label: 'Sales Volume',
                data: [120, 150, 180, 160],
                backgroundColor: '#2ecc71'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Setup Property Listing Form
function setupPropertyForm() {
    const form = document.querySelector('.property-listing-form');
    const uploadBox = document.querySelector('.upload-box');
    const photoPreview = document.querySelector('.photo-preview');
    const fileInput = uploadBox.querySelector('input[type="file"]');

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        submitPropertyListing(form);
    });

    // Handle file upload
    uploadBox.addEventListener('click', () => {
        fileInput.click();
    });

    uploadBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadBox.style.borderColor = var('--secondary-color');
    });

    uploadBox.addEventListener('dragleave', () => {
        uploadBox.style.borderColor = '#ddd';
    });

    uploadBox.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadBox.style.borderColor = '#ddd';
        handleFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', () => {
        handleFiles(fileInput.files);
    });
}

// Handle file uploads
function handleFiles(files) {
    const photoPreview = document.querySelector('.photo-preview');
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));

    validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.createElement('div');
            preview.className = 'preview-item';
            preview.innerHTML = `
                <img src="${e.target.result}" alt="Property Photo">
                <button class="remove-photo"><i class="fas fa-times"></i></button>
            `;
            photoPreview.appendChild(preview);

            preview.querySelector('.remove-photo').addEventListener('click', () => {
                preview.remove();
            });
        };
        reader.readAsDataURL(file);
    });
}

// Submit property listing
function submitPropertyListing(form) {
    const formData = new FormData(form);
    // Simulate API call
    showNotification('Submitting your property listing...');
    
    setTimeout(() => {
        showNotification('Property listing submitted successfully!');
        form.reset();
        document.querySelector('.photo-preview').innerHTML = '';
    }, 2000);
}

// Load recent sales data
function loadRecentSales() {
    const salesList = document.querySelector('.recent-sales-list');
    const recentSales = [
        {
            address: '123 Main St',
            price: '$450,000',
            date: '2 days ago'
        },
        {
            address: '456 Oak Ave',
            price: '$380,000',
            date: '1 week ago'
        },
        {
            address: '789 Pine Rd',
            price: '$525,000',
            date: '2 weeks ago'
        }
    ];

    salesList.innerHTML = recentSales.map(sale => `
        <li class="sale-item">
            <div class="sale-info">
                <h4>${sale.address}</h4>
                <p class="sale-price">${sale.price}</p>
            </div>
            <span class="sale-date">${sale.date}</span>
        </li>
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
    const listPropertyBtn = document.querySelector('.list-property-btn');
    const valueEstimateBtn = document.querySelector('.value-estimate-btn');
    const saveDraftBtn = document.querySelector('.save-draft-btn');

    listPropertyBtn.addEventListener('click', () => {
        document.getElementById('listPropertyForm').scrollIntoView({ behavior: 'smooth' });
    });

    valueEstimateBtn.addEventListener('click', () => {
        openValueEstimateModal();
    });

    saveDraftBtn.addEventListener('click', () => {
        savePropertyDraft();
    });
}

// Open value estimate modal
function openValueEstimateModal() {
    const modal = document.createElement('div');
    modal.className = 'modal value-estimate-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Get Property Value Estimate</h2>
            <form id="estimate-form">
                <div class="form-group">
                    <label>Property Address</label>
                    <input type="text" required>
                </div>
                <div class="form-group">
                    <label>Property Type</label>
                    <select required>
                        <option value="">Select Type</option>
                        <option value="house">House</option>
                        <option value="apartment">Apartment</option>
                        <option value="condo">Condo</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Square Feet</label>
                    <input type="number" required>
                </div>
                <div class="form-group">
                    <label>Bedrooms</label>
                    <input type="number" required>
                </div>
                <div class="form-group">
                    <label>Bathrooms</label>
                    <input type="number" required>
                </div>
                <button type="submit">Get Estimate</button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.close').addEventListener('click', () => {
        modal.remove();
    });

    modal.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        // Simulate API call for value estimate
        showNotification('Calculating property value...');
        setTimeout(() => {
            modal.remove();
            showEstimateResult();
        }, 2000);
    });
}

// Show estimate result
function showEstimateResult() {
    const modal = document.createElement('div');
    modal.className = 'modal estimate-result-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Property Value Estimate</h2>
            <div class="estimate-result">
                <h3>Estimated Value Range</h3>
                <p class="estimate-range">$450,000 - $500,000</p>
                <div class="estimate-details">
                    <p>Based on recent sales in your area and property details provided.</p>
                    <p>This is an automated estimate and may not reflect the actual market value.</p>
                </div>
                <button class="list-property-btn">List Your Property</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.close').addEventListener('click', () => {
        modal.remove();
    });

    modal.querySelector('.list-property-btn').addEventListener('click', () => {
        modal.remove();
        document.getElementById('listPropertyForm').scrollIntoView({ behavior: 'smooth' });
    });
}

// Save property draft
function savePropertyDraft() {
    const form = document.querySelector('.property-listing-form');
    const formData = new FormData(form);
    const draftData = {};
    
    formData.forEach((value, key) => {
        draftData[key] = value;
    });

    // Save to localStorage
    localStorage.setItem('propertyDraft', JSON.stringify(draftData));
    showNotification('Draft saved successfully!');
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}
