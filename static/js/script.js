// Initialize Mapbox
mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'; // Replace with your Mapbox access token
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-74.5, 40], // Default center coordinates
    zoom: 9
});

// Sample property data (replace with actual data from your backend)
const properties = [
    {
        id: 1,
        title: 'Modern Apartment',
        price: 250000,
        type: 'apartment',
        location: [-74.5, 40],
        image: 'img3.jpeg',
        description: 'Beautiful 2-bedroom apartment with city views'
    },
    // Add more properties here
];

// Add navigation controls to the map
map.addControl(new mapboxgl.NavigationControl());

// Function to add property markers to the map
function addPropertyMarkers() {
    properties.forEach(property => {
        // Create marker element
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = 'url(https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png)';
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.backgroundSize = 'cover';

        // Add marker to map
        new mapboxgl.Marker(el)
            .setLngLat(property.location)
            .setPopup(new mapboxgl.Popup({ offset: 25 })
                .setHTML(`
                    <h3>${property.title}</h3>
                    <p>$${property.price.toLocaleString()}</p>
                `))
            .addTo(map);
    });
}

// Function to create property cards
function createPropertyCards() {
    const propertyList = document.querySelector('.property-cards');
    propertyList.innerHTML = '';

    properties.forEach(property => {
        const card = document.createElement('div');
        card.className = 'property-card';
        card.innerHTML = `
            <img src="${property.image}" alt="${property.title}">
            <div class="property-info">
                <h3>${property.title}</h3>
                <p class="price">$${property.price.toLocaleString()}</p>
                <p class="description">${property.description}</p>
                <button onclick="viewProperty(${property.id})">View Details</button>
            </div>
        `;
        propertyList.appendChild(card);
    });
}

// Function to handle property search
function searchProperties() {
    const searchBtn = document.querySelector('.search-btn');
    searchBtn.addEventListener('click', () => {
        const location = document.querySelector('input[type="text"]').value;
        const propertyType = document.querySelector('select:nth-of-type(1)').value;
        const priceRange = document.querySelector('select:nth-of-type(2)').value;

        // Implement search logic here
        console.log('Searching for:', { location, propertyType, priceRange });
    });
}

// Function to view property details
function viewProperty(id) {
    const property = properties.find(p => p.id === id);
    if (property) {
        map.flyTo({
            center: property.location,
            zoom: 15,
            essential: true
        });
    }
}

// Function to handle notifications
function setupNotifications() {
    const notifBtn = document.querySelector('.notifications');
    notifBtn.addEventListener('click', () => {
        // Implement notifications logic
        console.log('Opening notifications');
    });
}

// Function to handle messages
function setupMessages() {
    const msgBtn = document.querySelector('.messages');
    msgBtn.addEventListener('click', () => {
        // Implement messaging logic
        console.log('Opening messages');
    });
}

// Initialize all functionality when the page loads
document.addEventListener('DOMContentLoaded', () => {
    addPropertyMarkers();
    createPropertyCards();
    searchProperties();
    setupNotifications();
    setupMessages();

    // Add map loading event
    map.on('load', () => {
        console.log('Map loaded successfully');
    });
});

// Add responsive navigation
const setupResponsiveNav = () => {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navLinks.style.display = 'flex';
        } else {
            navLinks.style.display = 'none';
        }
    });
};

setupResponsiveNav();
