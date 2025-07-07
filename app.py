from flask import Flask, request, jsonify, render_template
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