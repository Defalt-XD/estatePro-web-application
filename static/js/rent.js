// Sample property data (in a real application, this would come from a backend)
const properties = [
    {
        id: 1,
        image: 'img1.jpg',
        price: 2500,
        title: 'Modern Downtown Apartment',
        location: 'Downtown',
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        type: 'apartment'
    },
    {
        id: 2,
        image: 'img2.jpg',
        price: 1800,
        title: 'Cozy Studio Apartment',
        location: 'Midtown',
        bedrooms: 1,
        bathrooms: 1,
        area: 800,
        type: 'apartment'
    },
    {
        id: 3,
        image: 'img3.jpeg',
        price: 3500,
        title: 'Luxury Waterfront Villa',
        location: 'Beachfront',
        bedrooms: 4,
        bathrooms: 3,
        area: 2500,
        type: 'villa'
    }
];

// Function to create property cards
function createPropertyCard(property) {
    return `
        <div class="property-card">
            <div class="property-image" style="background-image: url('${property.image}')"></div>
            <div class="property-info">
                <div class="property-price">$${property.price}/month</div>
                <h3>${property.title}</h3>
                <p><i class="fas fa-map-marker-alt"></i> ${property.location}</p>
                <div class="property-details">
                    <span><i class="fas fa-bed"></i> ${property.bedrooms} Beds</span>
                    <span><i class="fas fa-bath"></i> ${property.bathrooms} Baths</span>
                    <span><i class="fas fa-ruler-combined"></i> ${property.area} sq ft</span>
                </div>
                <button class="contact-agent" onclick="contactAgent(${property.id})">
                    Contact Agent
                </button>
            </div>
        </div>
    `;
}

// Function to render all properties
function renderProperties(propertiesToRender = properties) {
    const propertyGrid = document.getElementById('propertyGrid');
    propertyGrid.innerHTML = propertiesToRender
        .map(property => createPropertyCard(property))
        .join('');
}

// Function to filter properties
function filterProperties() {
    const propertyType = document.getElementById('propertyType').value;
    const priceRange = document.getElementById('priceRange').value;
    const bedrooms = document.getElementById('bedrooms').value;

    let filtered = properties;

    if (propertyType) {
        filtered = filtered.filter(p => p.type === propertyType);
    }

    if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        filtered = filtered.filter(p => {
            if (max) {
                return p.price >= min && p.price <= max;
            }
            return p.price >= min;
        });
    }

    if (bedrooms) {
        const bedroomNum = parseInt(bedrooms);
        filtered = filtered.filter(p => {
            if (bedrooms === '4+') {
                return p.bedrooms >= 4;
            }
            return p.bedrooms === bedroomNum;
        });
    }

    renderProperties(filtered);
}

// Function to handle property search
function searchProperties() {
    const searchInput = document.querySelector('.search-box input').value.toLowerCase();
    const filtered = properties.filter(property => 
        property.title.toLowerCase().includes(searchInput) ||
        property.location.toLowerCase().includes(searchInput)
    );
    renderProperties(filtered);
}

// Function to contact agent (show chatbox with dummy messages, no send functionality)
function contactAgent(propertyId) {
    const chatbox = document.getElementById('chatbox');
    const chatMessages = document.getElementById('chatbox-messages');
    chatbox.style.display = 'block';
    chatMessages.innerHTML = '';
    // Dummy messages
    const dummyMsgs = [
        {from: 'agent', text: 'Hello! How can I help you with this property?'},
        {from: 'user', text: 'I am interested in renting this property.'},
        {from: 'agent', text: 'Great! Do you have any questions or would you like to schedule a visit?'}
    ];
    dummyMsgs.forEach(msg => {
        const div = document.createElement('div');
        div.textContent = (msg.from === 'user' ? 'You: ' : 'Agent: ') + msg.text;
        div.className = msg.from === 'user' ? 'chat-msg user-msg' : 'chat-msg agent-msg';
        chatMessages.appendChild(div);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Chatbox close logic only (no send)
if (document.getElementById('close-chatbox')) {
    document.getElementById('close-chatbox').onclick = function() {
        document.getElementById('chatbox').style.display = 'none';
    };
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initial render
    renderProperties();

    // Add event listeners for filters
    document.getElementById('propertyType').addEventListener('change', filterProperties);
    document.getElementById('priceRange').addEventListener('change', filterProperties);
    document.getElementById('bedrooms').addEventListener('change', filterProperties);

    // Add event listener for search
    const searchButton = document.querySelector('.search-box button');
    searchButton.addEventListener('click', searchProperties);

    // Add event listener for search input (search as you type)
    const searchInput = document.querySelector('.search-box input');
    searchInput.addEventListener('input', searchProperties);
});

// Initialize map (placeholder - in a real application, you would use a mapping service like Google Maps)
function initMap() {
    // Map initialization code would go here
    console.log('Map initialized');
}

/* Chatbox styling */
const style = document.createElement('style');
style.innerHTML = `
.chatbox {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 320px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 16px rgba(0,0,0,0.18);
    z-index: 2000;
    display: none;
    flex-direction: column;
    font-family: 'Segoe UI', Arial, sans-serif;
}
.chatbox-header {
    background: #007bff;
    color: #fff;
    padding: 10px;
    border-radius: 10px 10px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    font-size: 1.1em;
}
#close-chatbox {
    background: none;
    border: none;
    color: #fff;
    font-size: 1.2em;
    cursor: pointer;
}
.chatbox-messages {
    height: 180px;
    overflow-y: auto;
    background: #f9f9f9;
    margin: 0;
    padding: 10px;
    font-size: 1em;
}
.chat-msg {
    margin: 8px 0;
    padding: 7px 12px;
    border-radius: 16px;
    max-width: 80%;
    display: inline-block;
    clear: both;
}
.user-msg {
    background: #e6f0ff;
    color: #333;
    float: right;
    text-align: right;
}
.agent-msg {
    background: #007bff;
    color: #fff;
    float: left;
    text-align: left;
}
#chatbox-form {
    display: none !important;
}
`;
document.head.appendChild(style);
