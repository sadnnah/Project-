from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
import random
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

DB = 'database.db'

def get_db():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    return conn

with get_db() as db:
    db.execute('''
        CREATE TABLE IF NOT EXISTS cards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            nationality TEXT NOT NULL,
            passport_number TEXT NOT NULL,
            employment_type TEXT NOT NULL,
            card_number TEXT NOT NULL,
            issue_date TEXT NOT NULL,
            expiry_date TEXT NOT NULL,
            status TEXT NOT NULL
        )
    ''')

def generate_card_number():
    
    return ''.join([str(random.randint(0,9)) for _ in range(12)])

def get_dates():
    
    today = datetime.now().date()
    expiry = today + timedelta(days=365*10)
    return today.isoformat(), expiry.isoformat()

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/api/cards', methods=['GET'])
def get_cards():
    db = get_db()
    cards = db.execute('SELECT * FROM cards').fetchall()
    return jsonify([dict(card) for card in cards])

@app.route('/api/cards', methods=['POST'])
def add_card():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No JSON data provided'}), 400
    
    card_number = generate_card_number()
    issue_date, expiry_date = get_dates()
    db = get_db()
    db.execute('''
        INSERT INTO cards (first_name, last_name, nationality, passport_number, employment_type, card_number, issue_date, expiry_date, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        data.get('first_name'),
        data.get('last_name'),
        data.get('nationality'),
        data.get('passport_number'),
        data.get('employment_type'),
        card_number,
        issue_date,
        expiry_date,
        data.get('status')
    ))
    db.commit()
    return jsonify({'message': 'Application submitted!', 'card_number': card_number}), 201

@app.route('/api/cards/<int:card_id>', methods=['PUT'])
def update_card(card_id):
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No JSON data provided'}), 400
    
    db = get_db()
    db.execute('''
        UPDATE cards SET first_name=?, last_name=?, nationality=?, passport_number=?, employment_type=?, status=?
        WHERE id=?
    ''', (
        data.get('first_name'),
        data.get('last_name'),
        data.get('nationality'),
        data.get('passport_number'),
        data.get('employment_type'),
        data.get('status'),
        card_id
    ))
    db.commit()
    return jsonify({'message': 'Application updated!'})

@app.route('/api/cards/<int:card_id>', methods=['DELETE'])
def delete_card(card_id):
    db = get_db()
    db.execute('DELETE FROM cards WHERE id=?', (card_id,))
    db.commit()
    return jsonify({'message': 'Application deleted!'})

if __name__ == '__main__':
    app.run(debug=True) 