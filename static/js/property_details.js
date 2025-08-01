document.addEventListener('DOMContentLoaded', () => {
    initializeGallery();
    initializeMortgageCalculator();
    loadSimilarProperties();
    setupActionButtons();
});

// Gallery functionality
function initializeGallery() {
    const mainImage = document.querySelector('.main-image img');
    const thumbnails = document.querySelectorAll('.thumbnail-grid img');
    const viewAllButton = document.querySelector('.view-all-photos');

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            mainImage.src = thumbnail.src;
            mainImage.alt = thumbnail.alt;
        });
    });

    viewAllButton.addEventListener('click', () => {
        openGalleryModal();
    });
}

function openGalleryModal() {
    const modal = document.createElement('div');
    modal.className = 'gallery-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="gallery-grid">
                <!-- Gallery images will be dynamically added here -->
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    loadGalleryImages(modal);

    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
}

function loadGalleryImages(modal) {
    // Simulate loading gallery images
    const galleryGrid = modal.querySelector('.gallery-grid');
    const imageUrls = [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
        // Add more image URLs
    ];

    imageUrls.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Property Image';
        galleryGrid.appendChild(img);
    });
}

// Mortgage Calculator
function initializeMortgageCalculator() {
    const calculator = document.querySelector('.mortgage-calculator');
    const calculateBtn = calculator.querySelector('.calculate-btn');
    const monthlyPayment = calculator.querySelector('.monthly-payment .amount');

    calculateBtn.addEventListener('click', () => {
        const downPayment = parseFloat(calculator.querySelector('input[type="text"]').value.replace(/[$,]/g, ''));
        const loanTerm = parseInt(calculator.querySelector('select').value);
        const interestRate = parseFloat(calculator.querySelector('input[type="text"]:last-of-type').value) / 100;

        const monthlyRate = interestRate / 12;
        const numberOfPayments = loanTerm * 12;
        const loanAmount = 2500000 - downPayment; // Property price - down payment

        const payment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
                       (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

        monthlyPayment.textContent = `$${Math.round(payment).toLocaleString()}`;
    });
}

// Similar Properties
function loadSimilarProperties() {
    const carousel = document.querySelector('.property-carousel');
    const similarProperties = [
        {
            image: 'S.image.jpg',
            title: 'Modern Beachfront Condo',
            price: '$1,800,000',
            location: 'Miami Beach, FL',
            features: '3 bed • 2 bath • 1,800 sq ft'
        },
        // Add more similar properties
    ];

    similarProperties.forEach(property => {
        const propertyCard = createPropertyCard(property);
        carousel.appendChild(propertyCard);
    });
}

function createPropertyCard(property) {
    const card = document.createElement('div');
    card.className = 'property-card';
    card.innerHTML = `
        <img src="${property.image}" alt="${property.title}">
        <div class="card-content">
            <h3>${property.title}</h3>
            <p class="price">${property.price}</p>
            <p class="location"><i class="fas fa-map-marker-alt"></i> ${property.location}</p>
            <p class="features">${property.features}</p>
        </div>
    `;
    return card;
}

// Action Buttons
function setupActionButtons() {
    const contactAgent = document.querySelector('.contact-agent');
    const scheduleTour = document.querySelector('.schedule-tour');
    const makeOffer = document.querySelector('.make-offer');
    const saveProperty = document.querySelector('.save-property');
    const chatbox = document.getElementById('chatbox');
    const closeChatbox = document.getElementById('close-chatbox');

    contactAgent.addEventListener('click', () => {
        chatbox.style.display = 'block';
        document.getElementById('chatbox-input').focus();
    });

    if (closeChatbox) {
        closeChatbox.addEventListener('click', () => {
            chatbox.style.display = 'none';
        });
    }

    // Chatbox send message
    const chatForm = document.getElementById('chatbox-form');
    const chatMessages = document.getElementById('chatbox-messages');
    if (chatForm) {
        chatForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = document.getElementById('chatbox-input');
            const msg = input.value.trim();
            if (msg) {
                const msgDiv = document.createElement('div');
                msgDiv.textContent = 'You: ' + msg;
                msgDiv.style.margin = '5px 0';
                chatMessages.appendChild(msgDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
                input.value = '';
                // Simulate agent reply
                setTimeout(() => {
                    const agentDiv = document.createElement('div');
                    agentDiv.textContent = 'Agent: Thank you for your message!';
                    agentDiv.style.margin = '5px 0 5px 20px';
                    agentDiv.style.color = '#007bff';
                    chatMessages.appendChild(agentDiv);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 1000);
            }
        });
    }

    scheduleTour.addEventListener('click', () => {
        openContactModal('tour');
    });

    makeOffer.addEventListener('click', () => {
        openContactModal('offer');
    });

    saveProperty.addEventListener('click', () => {
        toggleSaveProperty();
    });
}

function openContactModal(type) {
    const modal = document.createElement('div');
    modal.className = 'contact-modal';
    
    let title, content;
    switch(type) {
        case 'agent':
            title = 'Contact Agent';
            content = `
                <form id="contact-form">
                    <input type="text" placeholder="Your Name" required>
                    <input type="email" placeholder="Your Email" required>
                    <input type="tel" placeholder="Your Phone">
                    <textarea placeholder="Your Message" required></textarea>
                    <button type="submit">Send Message</button>
                </form>
            `;
            break;
        case 'tour':
            title = 'Schedule a Tour';
            content = `
                <form id="tour-form">
                    <input type="date" required>
                    <input type="time" required>
                    <input type="text" placeholder="Your Name" required>
                    <input type="email" placeholder="Your Email" required>
                    <input type="tel" placeholder="Your Phone" required>
                    <button type="submit">Schedule Tour</button>
                </form>
            `;
            break;
        case 'offer':
            title = 'Make an Offer';
            content = `
                <form id="offer-form">
                    <input type="number" placeholder="Your Offer Amount" required>
                    <input type="text" placeholder="Your Name" required>
                    <input type="email" placeholder="Your Email" required>
                    <input type="tel" placeholder="Your Phone" required>
                    <textarea placeholder="Additional Notes"></textarea>
                    <button type="submit">Submit Offer</button>
                </form>
            `;
            break;
    }

    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>${title}</h2>
            ${content}
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });

    modal.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        // Handle form submission
        modal.remove();
        showNotification(`Your ${type} request has been submitted successfully!`);
    });
}

function toggleSaveProperty() {
    const saveButton = document.querySelector('.save-property');
    const icon = saveButton.querySelector('i');
    
    if (icon.classList.contains('far')) {
        icon.classList.replace('far', 'fas');
        showNotification('Property saved to favorites!');
    } else {
        icon.classList.replace('fas', 'far');
        showNotification('Property removed from favorites!');
    }
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
