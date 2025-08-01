# EstatePro Real Estate Web App

This is a Flask-based web application for managing real estate listings, user accounts, property images, and premium features. The app supports buying, selling, renting, and searching for properties, as well as user registration, login, and premium membership upgrades.

## Features
- User registration and login
- Premium membership system
- Buy, sell, and rent property workflows
- Property image uploads and management
- Search and filter properties by location, type, and price
- User dashboard with properties, chats, appointments, documents, and emails
- Add and view favorite properties
- Data stored in text files for simplicity

## Folder Structure
```
web 2/
    main.py                  # Main Flask app
    properties.txt           # Property listings
    property_features.txt    # Property features
    property_images.txt      # Property images
    rent_contacts.txt        # Rent contact submissions
    users_info.txt           # User account info
    static/                  # Static files (CSS, JS, images)
    templates/               # HTML templates
    user_models/             # User model code
```

## Getting Started
1. Install Python 3 and Flask:
   ```cmd
   pip install flask mysql-connector-python
   ```
2. Run the app:
   ```cmd
   python "web 2/main.py"
   ```
3. Open your browser and go to `http://127.0.0.1:5000/`

## Notes
- Uploaded property images are stored in `web 2/static/UPLOAD_FOLDER/`.
- All user and property data is stored in text files for demo purposes.
- Premium features (like selling properties) require registration and upgrade.

## License
This project is for educational/demo use. No warranty provided.
