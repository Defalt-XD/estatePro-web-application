from flask import Flask, request, jsonify, render_template, url_for, redirect, session, flash
from user_models.user_model import users
from werkzeug.utils import secure_filename 
import mysql.connector
import os
import ast
import re

obj =users()
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = os.path.join('static', 'UPLOAD_FOLDER')
app.secret_key = 'your_secret_key_here'  # Needed for session

def sanitize_input(value, field_type='text', min_length=0, max_length=100):
    if not isinstance(value, str):
        return ''
    value = value.strip()
    # Remove script tags and dangerous characters
    value = re.sub(r'<.*?>', '', value)
    value = re.sub(r'[\r\n\t]', '', value)
    if len(value) < min_length or len(value) > max_length:
        return ''
    if field_type == 'email':
        # Basic email validation
        if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', value):
            return ''
    elif field_type == 'password':
        # Password must be at least 6 chars, contain a number and a letter
        if len(value) < max(min_length, 6) or not re.search(r'[A-Za-z]', value) or not re.search(r'\d', value):
            return ''
    elif field_type == 'phone':
        # Only allow digits, +, -, and spaces
        value = re.sub(r'[^\d\+\- ]', '', value)
        if len(value) < 7:
            return ''
    elif field_type == 'number':
        value = re.sub(r'[^\d.]', '', value)
    return value

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/buy', methods=['GET'])
def buy ():
    return render_template('buy.html', message="Thank you for your purchase!")

#@app.route('/rent', methods=['GET', 'POST'])
@app.route('/rent', methods=['GET', 'POST'])
def rent():
    if request.method == 'POST':
        # Handle contact agent form submission (from modal)
        name = request.form.get('name', '')
        email = request.form.get('email', '')
        phone = request.form.get('phone', '')
        property_id = request.form.get('property_id', '')
        contact_data = {
            'name': name,
            'email': email,
            'phone': phone,
            'property_id': property_id
        }
        with open('rent_contacts.txt', 'a', encoding='utf-8') as f:
            f.write(str(contact_data) + '\n')
        return 'Message sent to agent!'
    else:
        return render_template('rent.html')

def is_premium():
    # Example: check session for premium status
    return session.get('is_premium', False)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = sanitize_input(request.form.get('name'), min_length=2, max_length=50)
        email = sanitize_input(request.form.get('email'), 'email', min_length=5, max_length=100)
        password = sanitize_input(request.form.get('password'), 'password', min_length=6, max_length=32)
        if not name or not email or not password:
            flash('Invalid input. Please check your details. Name: 2-50 chars, Email: 5-100 chars, Password: 6-32 chars, must contain a letter and a number.')
            return redirect(url_for('register'))
        # Prevent duplicate registration
        if os.path.exists('users_info.txt'):
            with open('users_info.txt', 'r', encoding='utf-8') as f:
                for line in f:
                    try:
                        u = eval(line.strip())
                        # Skip users with invalid data
                        if not isinstance(u, dict) or not u.get('email') or not u.get('password'):
                            continue
                        if len(u.get('email','')) < 5 or len(u.get('email','')) > 100:
                            continue
                        if u.get('email') == email:
                            flash('Email already registered. Please login.')
                            return redirect(url_for('login'))
                    except Exception:
                        continue
        user_data = {'name': name, 'email': email, 'password': password, 'is_premium': False}
        with open('users_info.txt', 'a', encoding='utf-8') as f:
            f.write(str(user_data) + '\n')
        flash('Registration successful! Please log in.')
        return redirect(url_for('login'))
    return render_template('register.html')

@app.route('/get_premium')
def get_premium():
    email = session.get('user_email')
    if not email:
        flash('You must be logged in to upgrade.')
        return redirect(url_for('login'))
    updated = False
    users = []
    if os.path.exists('users_info.txt'):
        with open('users_info.txt', 'r', encoding='utf-8') as f:
            for line in f:
                try:
                    user = eval(line.strip())
                    if user.get('email') == email:
                        user['is_premium'] = True
                        session['is_premium'] = True
                        updated = True
                    users.append(user)
                except Exception:
                    continue
        with open('users_info.txt', 'w', encoding='utf-8') as f:
            for user in users:
                f.write(str(user) + '\n')
    if updated:
        flash('You are now a premium member!')
    else:
        flash('Upgrade failed.')
    return redirect(url_for('dashboard'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = sanitize_input(request.form.get('username'), 'email', min_length=5, max_length=100)
        password = sanitize_input(request.form.get('password'), 'password', min_length=6, max_length=32)
        if not email or not password:
            flash('Invalid login details. Email: 5-100 chars, Password: 6-32 chars, must contain a letter and a number.')
            return redirect(url_for('login'))
        user = None
        if os.path.exists('users_info.txt'):
            with open('users_info.txt', 'r', encoding='utf-8') as f:
                for line in f:
                    try:
                        u = eval(line.strip())
                        # Skip users with invalid data
                        if not isinstance(u, dict) or not u.get('email') or not u.get('password'):
                            continue
                        if len(u.get('email','')) < 5 or len(u.get('email','')) > 100:
                            continue
                        if len(u.get('password','')) < 6 or len(u.get('password','')) > 32:
                            continue
                        if u.get('email') == email and u.get('password') == password:
                            user = u
                            break
                    except Exception:
                        continue
        if user:
            session['is_premium'] = user.get('is_premium', False)
            session['user_name'] = user.get('name', '')
            session['user_email'] = user.get('email', '')
            flash('Logged in successfully!')
            return redirect(url_for('dashboard'))
        else:
            session['is_premium'] = False
            session['user_name'] = ''
            session['user_email'] = ''
            flash('Login failed or not a premium member.')
            return redirect(url_for('login'))
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    flash('Logged out.')
    return redirect(url_for('index'))

@app.route('/sell', methods=['GET','POST'])
def sell():
    if not is_premium():
        flash('Only premium members can access this page.')
        return redirect(url_for('login'))
    if request.method == 'POST':
        try:
            name = session.get('user_name', '')
            email = session.get('user_email', '')
            phone = sanitize_input(request.form['phone'], 'phone')
            if not phone:
                return 'Invalid phone number!'
            user_data = f"Name: {name}, Email: {email}, Phone: {phone}\n"
            with open('users_info.txt', 'a', encoding='utf-8') as f:
                f.write(user_data)

            property_data = {
                'user_name': name,
                'type': sanitize_input(request.form['type']),
                'price': sanitize_input(request.form['price'], 'number'),
                'bedrooms': sanitize_input(request.form['bedrooms'], 'number'),
                'bathrooms': sanitize_input(request.form['bathrooms'], 'number'),
                'address': sanitize_input(request.form['address']),
                'city': sanitize_input(request.form['city']),
                'state': sanitize_input(request.form['state']),
                'zip_code': sanitize_input(request.form['zip_code'], 'number'),
                'square_feet': sanitize_input(request.form['square_feet'], 'number'),
                'year_built': sanitize_input(request.form['year_built'], 'number'),
                'description': sanitize_input(request.form['description'])
            }
            with open('properties.txt', 'a', encoding='utf-8') as f:
                f.write(str(property_data) + '\n')

            features = request.form.getlist('features')
            with open('property_features.txt', 'a', encoding='utf-8') as f:
                for feature in features:
                    f.write(f"User: {name}, Feature: {feature}\n")

            images = request.files.getlist('photos')
            upload_folder = app.config['UPLOAD_FOLDER']
            if not os.path.exists(upload_folder):
                os.makedirs(upload_folder)
            # Create a unique property key for image association
            property_key = f"{request.form['address'].strip()}|{request.form['city'].strip()}|{name.strip()}"
            for file in images:
                if file and file.filename:
                    filename = os.path.basename(file.filename)
                    base, ext = os.path.splitext(filename)
                    counter = 1
                    unique_filename = filename
                    while os.path.exists(os.path.join(upload_folder, unique_filename)):
                        unique_filename = f"{base}_{counter}{ext}"
                        counter += 1
                    path = os.path.join(upload_folder, unique_filename)
                    file.save(path)
                    rel_path = os.path.relpath(path, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static'))
                    with open('property_images.txt', 'a', encoding='utf-8') as f:
                        f.write(f"PropertyKey: {property_key}, Image: {rel_path.replace('\\', '/')}\n")

            return "Data added successfully ✅"
        except Exception as e:
            print(e)
            return "Error occurred while adding data ❌"
    else:
        return render_template('sell.html')
    
@app.route('/dashboard', methods=['GET'])
def dashboard():
    if not is_premium():
        flash('Only premium members can access the dashboard.')
        return redirect(url_for('login'))
    user_name = session.get('user_name', 'User')
    user_email = session.get('user_email', '')
    is_premium_member = session.get('is_premium', False)
    return render_template('dashboard.html', user_name=user_name, user_email=user_email, is_premium=is_premium_member)

@app.route('/invest_calculator', methods=['GET'])
def invest_calculator():
    return render_template('invest_calculator.html', message="Thank you for using our investment calculator!")

@app.route('/property_detail', methods=['GET'])
def property_detail():
    return render_template('property_detail.html', message="Thank you for viewing the property details!" )


@app.route('/search')
def search():
    location = request.args.get('location', '').strip().lower()
    property_type = request.args.get('type', '').lower()
    price = request.args.get('price', '')
    properties = []
    # Load property images and map by unique property key (address|city|user_name)
    image_map = {}
    if os.path.exists('property_images.txt'):
        with open('property_images.txt', 'r', encoding='utf-8') as f:
            for line in f:
                if 'PropertyKey:' in line and 'Image:' in line:
                    parts = line.strip().split(',')
                    key = None
                    image = None
                    for part in parts:
                        if 'PropertyKey:' in part:
                            key = part.split('PropertyKey:')[1].strip()
                        if 'Image:' in part:
                            image = part.split('Image:')[1].strip()
                    if key and image:
                        image_map.setdefault(key, []).append(image)
    if os.path.exists('properties.txt'):
        with open('properties.txt', 'r', encoding='utf-8') as f:
            for idx, line in enumerate(f):
                try:
                    prop = eval(line.strip())
                    # Filter by location
                    if location and not (location in prop.get('address', '').lower() or location in prop.get('city', '').lower()):
                        continue
                    # Filter by type
                    if property_type and property_type != prop.get('type', '').lower():
                        continue
                    # Filter by price
                    price_val = float(prop.get('price', 0))
                    if price == '0-100k' and not (0 <= price_val <= 100000):
                        continue
                    elif price == '100k-300k' and not (100000 < price_val <= 300000):
                        continue
                    elif price == '300k+' and not (price_val > 300000):
                        continue
                    # Use the same unique key for this property
                    key = f"{prop.get('address','').strip()}|{prop.get('city','').strip()}|{prop.get('user_name','').strip()}"
                    prop_images = image_map.get(key, [])
                    properties.append({
                        'address': prop.get('address', ''),
                        'city': prop.get('city', ''),
                        'type': prop.get('type', ''),
                        'price': prop.get('price', ''),
                        'bedrooms': prop.get('bedrooms', ''),
                        'bathrooms': prop.get('bathrooms', ''),
                        'images': prop_images
                    })
                except Exception:
                    continue
    return jsonify(properties)

@app.route('/buy_property', methods=['POST'])
def buy_property():
    data = request.get_json()
    property_id = data.get('property_id')
    # Mark property as sold in properties.txt (simulate by adding a sold flag)
    updated_lines = []
    sold = False
    if os.path.exists('properties.txt'):
        with open('properties.txt', 'r', encoding='utf-8') as f:
            for idx, line in enumerate(f):
                try:
                    prop = eval(line.strip())
                    # Use line number as property_id for simplicity
                    if str(idx) == str(property_id):
                        prop['sold'] = True
                        sold = True
                    updated_lines.append(str(prop) + '\n')
                except Exception:
                    updated_lines.append(line)
        with open('properties.txt', 'w', encoding='utf-8') as f:
            f.writelines(updated_lines)
    return jsonify({'success': sold})

@app.route('/dashboard_properties')
def dashboard_properties():
    prop_type = request.args.get('type', 'my')
    properties = []
    user_email = session.get('user_email', None)
    user_name = session.get('user_name', None)
    # Use the same image mapping logic as in /search
    image_map = {}
    if os.path.exists('property_images.txt'):
        with open('property_images.txt', 'r', encoding='utf-8') as f:
            for line in f:
                if 'PropertyKey:' in line and 'Image:' in line:
                    parts = line.strip().split(',')
                    key = None
                    image = None
                    for part in parts:
                        if 'PropertyKey:' in part:
                            key = part.split('PropertyKey:')[1].strip()
                        if 'Image:' in part:
                            image = part.split('Image:')[1].strip()
                    if key and image:
                        image_map.setdefault(key, []).append(image)
    if os.path.exists('properties.txt'):
        with open('properties.txt', 'r', encoding='utf-8') as f:
            for line in f:
                try:
                    prop = eval(line.strip())
                    # Only show properties for the logged-in user if type is 'my'
                    if prop_type == 'my':
                        if user_name and prop.get('user_name') != user_name:
                            continue
                    # Use the same unique key for this property
                    key = f"{prop.get('address','').strip()}|{prop.get('city','').strip()}|{prop.get('user_name','').strip()}"
                    prop_images = image_map.get(key, [])
                    prop_dict = {
                        'img': f"/static/{prop_images[0]}" if prop_images else '/static/images/image4.jpeg',
                        'title': prop.get('address', 'Property'),
                        'type': prop.get('type', ''),
                        'price': prop.get('price', ''),
                        'status': 'For Sale' if prop_type == 'my' else '',
                    }
                    properties.append(prop_dict)
                except Exception:
                    continue
    return jsonify(properties)

@app.route('/dashboard_chats')
def dashboard_chats():
    user_email = session.get('user_email', None)
    chats = []
    if os.path.exists('chats.txt'):
        with open('chats.txt', 'r', encoding='utf-8') as f:
            for line in f:
                try:
                    chat = eval(line.strip())
                    if chat.get('user_email') == user_email:
                        chats.append(chat)
                except Exception:
                    continue
    # If no file or no user-specific data, return demo data for the logged-in user only
    if not chats:
        chats = [
            {"name": "Agent Smith", "last": "See you at 2pm!", "unread": 2, "user_email": user_email},
            {"name": "John Doe", "last": "Thanks for the update.", "unread": 0, "user_email": user_email},
            {"name": "Sarah Lee", "last": "Can we reschedule?", "unread": 1, "user_email": user_email}
        ]
    return jsonify(chats)

@app.route('/dashboard_appointments')
def dashboard_appointments():
    user_email = session.get('user_email', None)
    appointments = []
    if os.path.exists('appointments.txt'):
        with open('appointments.txt', 'r', encoding='utf-8') as f:
            for line in f:
                try:
                    appt = eval(line.strip())
                    if appt.get('user_email') == user_email:
                        appointments.append(appt)
                except Exception:
                    continue
    # If no file or no user-specific data, return demo data for the logged-in user only
    if not appointments:
        appointments = [
            {"day": "23", "month": "Jan", "title": "Property Viewing", "details": "123 Ocean Drive, 2:00 PM", "user_email": user_email},
            {"day": "25", "month": "Jan", "title": "Agent Meeting", "details": "Virtual Meeting, 11:00 AM", "user_email": user_email},
            {"day": "28", "month": "Jan", "title": "Document Signing", "details": "Downtown Office, 4:00 PM", "user_email": user_email},
            {"day": "30", "month": "Jan", "title": "Final Walkthrough", "details": "456 Maple Ave, 10:00 AM", "user_email": user_email},
            {"day": "02", "month": "Feb", "title": "Mortgage Consultation", "details": "Online, 3:00 PM", "user_email": user_email}
        ]
    return jsonify(appointments)

@app.route('/dashboard_documents')
def dashboard_documents():
    user_email = session.get('user_email', None)
    documents = []
    if os.path.exists('documents.txt'):
        with open('documents.txt', 'r', encoding='utf-8') as f:
            for line in f:
                try:
                    doc = eval(line.strip())
                    if doc.get('user_email') == user_email:
                        documents.append(doc)
                except Exception:
                    continue
    # If no file or no user-specific data, return demo data for the logged-in user only
    if not documents:
        documents = [
            {"name": "Lease_Agreement.pdf", "type": "PDF", "user_email": user_email},
            {"name": "ID_Verification.jpg", "type": "Image", "user_email": user_email},
            {"name": "Payment_Receipt.pdf", "type": "PDF", "user_email": user_email}
        ]
    return jsonify(documents)

@app.route('/dashboard_emails')
def dashboard_emails():
    user_email = session.get('user_email', None)
    emails = [
        {
            "from": "support@estatepro.com",
            "to": user_email,
            "subject": "Welcome to EstatePro!",
            "date": "2025-06-10",
            "snippet": "Thank you for joining EstatePro. We're excited to have you!"
        },
        {
            "from": "agent.jane@estatepro.com",
            "to": user_email,
            "subject": "Property Viewing Confirmation",
            "date": "2025-06-09",
            "snippet": "Your viewing for 123 Ocean Drive is confirmed for June 12, 2:00 PM."
        },
        {
            "from": "newsletter@estatepro.com",
            "to": user_email,
            "subject": "Top Investment Tips for June",
            "date": "2025-06-08",
            "snippet": "Discover the best real estate investment opportunities this month."
        }
    ]
    # Only show emails for this user
    user_emails = [e for e in emails if e.get('to') == user_email]
    return jsonify(user_emails)

@app.route('/add_favorite', methods=['POST'])
def add_favorite():
    user_email = session.get('user_email')
    property_data = request.json.get('property')
    if not user_email or not property_data:
        return jsonify({'success': False, 'error': 'Missing user or property'}), 400
    # Store favorite as a dict with user_email and property info
    with open('favorites.txt', 'a', encoding='utf-8') as f:
        f.write(str({'user_email': user_email, 'property': property_data}) + '\n')
    return jsonify({'success': True})

@app.route('/get_favorites')
def get_favorites():
    user_email = session.get('user_email')
    favorites = []
    if os.path.exists('favorites.txt'):
        with open('favorites.txt', 'r', encoding='utf-8') as f:
            for line in f:
                try:
                    fav = eval(line.strip())
                    if fav.get('user_email') == user_email:
                        favorites.append(fav.get('property'))
                except Exception:
                    continue
    return jsonify(favorites)

@app.route('/fix_properties_usernames')
def fix_properties_usernames():
    import ast
    session_user_name = session.get('user_name', None)
    if not session_user_name:
        return 'No user logged in.'
    if os.path.exists('properties.txt'):
        updated_lines = []
        with open('properties.txt', 'r', encoding='utf-8') as f:
            for line in f:
                try:
                    prop = ast.literal_eval(line.strip())
                    prop['user_name'] = session_user_name
                    updated_lines.append(str(prop) + '\n')
                except Exception:
                    updated_lines.append(line)
        with open('properties.txt', 'w', encoding='utf-8') as f:
            f.writelines(updated_lines)
        return 'All property user_name fields updated to your current user.'
    return 'properties.txt not found.'

if __name__ == '__main__':
    app.run(debug=True)