document.addEventListener('DOMContentLoaded', () => {
    initializeMap();
    loadProperties();
    setupViewToggle();
    setupFilters();
    loadFeaturedAgents();
});


function initializeMap() {
    mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
    const map = new mapboxgl.Map({
        container: 'properties-map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-74.5, 40],
        zoom: 9
    });

  
    map.addControl(new mapboxgl.NavigationControl());

    addPropertyMarkers(map);
}

function addPropertyMarkers(map) {
    const properties = [
        {
            coordinates: [-74.5, 40],
            title: 'Luxury Apartment',
            price: '$450,000',
            image: 'deatail img 1.jpg'
        },
  
    ];

    properties.forEach(property => {
      
        const el = document.createElement('div');
        el.className = 'property-marker';

        new mapboxgl.Marker(el)
            .setLngLat(property.coordinates)
            .setPopup(new mapboxgl.Popup({ offset: 25 })
                .setHTML(`
                    <div class="map-popup">
                        <img src="${property.image}" alt="${property.title}">
                        <h3>${property.title}</h3>
                        <p>${property.price}</p>
                    </div>
                `))
            .addTo(map);
    });
}

// Load properties into grid view
function loadProperties() {
    const propertyGrid = document.querySelector('.property-grid');
    const properties = [
        {
            id: 1,
            image: 'img1.jpg',
            title: 'Modern Apartment',
            location: 'Downtown Miami',
            price: '$450,000',
            beds: 2,
            baths: 2,
            sqft: 1200,
            type: 'Apartment'
        },
       
    ];

    propertyGrid.innerHTML = properties.map(property => `
        <div class="property-card" data-id="${property.id}">
            <div class="property-image">
                <img src="${property.image}" alt="${property.title}">
                <button class="favorite-btn"><i class="far fa-heart"></i></button>
                <div class="property-type">${property.type}</div>
            </div>
            <div class="property-content">
                <h3>${property.title}</h3>
                <p class="location"><i class="fas fa-map-marker-alt"></i> ${property.location}</p>
                <p class="price">${property.price}</p>
                <div class="property-features">
                    <span><i class="fas fa-bed"></i> ${property.beds} beds</span>
                    <span><i class="fas fa-bath"></i> ${property.baths} baths</span>
                    <span><i class="fas fa-ruler-combined"></i> ${property.sqft} sq ft</span>
                </div>
                <button class="view-details-btn">View Details</button>
            </div>
        </div>
    `).join('');

    setupPropertyCards();
}

// Setup property card interactions
function setupPropertyCards() {
    const propertyCards = document.querySelectorAll('.property-card');
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');

    favoriteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const icon = button.querySelector('i');
            icon.classList.toggle('far');
            icon.classList.toggle('fas');
            showNotification(icon.classList.contains('fas') ? 
                'Property added to favorites!' : 
                'Property removed from favorites!');
        });
    });

    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', () => {
            const propertyId = button.closest('.property-card').dataset.id;
            window.location.href = `property-details.html?id=${propertyId}`;
        });
    });
}

// Setup view toggle between grid and map
function setupViewToggle() {
    const viewButtons = document.querySelectorAll('.view-toggle button');
    const propertyGrid = document.querySelector('.property-grid');
    const mapView = document.querySelector('.map-view');

    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            viewButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            if (button.textContent.includes('Grid')) {
                propertyGrid.style.display = 'grid';
                mapView.style.display = 'none';
            } else {
                propertyGrid.style.display = 'none';
                mapView.style.display = 'block';
                // Trigger map resize for proper rendering
                window.dispatchEvent(new Event('resize'));
            }
        });
    });
}

// Setup search filters
function setupFilters() {
    const searchBtn = document.querySelector('.search-btn');
    const clearFiltersBtn = document.querySelector('.clear-filters-btn');
    const saveSearchBtn = document.querySelector('.save-search-btn');
    const sortSelect = document.querySelector('.sort-select');

    searchBtn.addEventListener('click', () => {
        // Implement search functionality
        showNotification('Searching properties...');
    });

    clearFiltersBtn.addEventListener('click', () => {
        // Clear all form inputs
        document.querySelectorAll('input, select').forEach(input => {
            if (input.type === 'checkbox') {
                input.checked = false;
            } else {
                input.value = '';
            }
        });
        showNotification('Filters cleared!');
    });

    saveSearchBtn.addEventListener('click', () => {
        // Implement save search functionality
        showNotification('Search preferences saved!');
    });

    sortSelect.addEventListener('change', () => {
        // Implement sorting functionality
        showNotification('Sorting properties...');
    });
}

// Load featured agents
function loadFeaturedAgents() {
    const agentsGrid = document.querySelector('.agents-grid');
    const agents = [
        {
            name: 'Muzamil Anwar',
            image: 'img2.jpg',
            title: 'Luxury Property Specialist',
            rating: 4.9,
            sales: 150
        },
    
    ];

    agentsGrid.innerHTML = agents.map(agent => `
        <div class="agent-card">
            <img src="${agent.image}" alt="${agent.name}" class="agent-image">
            <div class="agent-info">
                <h3>${agent.name}</h3>
                <p class="agent-title">${agent.title}</p>
                <div class="agent-stats">
                    <span><i class="fas fa-star"></i> ${agent.rating}</span>
                    <span><i class="fas fa-home"></i> ${agent.sales}+ sales</span>
                </div>
                <button class="contact-agent-btn">Contact Agent</button>
            </div>
        </div>
    `).join('');

    setupAgentCards();
}


function setupAgentCards() {
    const contactButtons = document.querySelectorAll('.contact-agent-btn');

    contactButtons.forEach(button => {
        button.addEventListener('click', () => {
            const agentName = button.closest('.agent-card').querySelector('h3').textContent;
            openContactModal(agentName);
        });
    });
}


function openContactModal(agentName) {
    const modal = document.createElement('div');
    modal.className = 'modal contact-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Contact ${agentName}</h2>
            <form id="contact-form">
                <div class="form-group">
                    <label>Your Name</label>
                    <input type="text" required>
                </div>
                <div class="form-group">
                    <label>Your Email</label>
                    <input type="email" required>
                </div>
                <div class="form-group">
                    <label>Your Phone</label>
                    <input type="tel">
                </div>
                <div class="form-group">
                    <label>Message</label>
                    <textarea required></textarea>
                </div>
                <button type="submit">Send Message</button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.close').addEventListener('click', () => {
        modal.remove();
    });

    modal.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        modal.remove();
        showNotification('Message sent successfully!');
    });
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
