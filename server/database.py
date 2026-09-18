import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_PATH = os.path.join(BASE_DIR, "neuroscan.db")


def get_connection():
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_database():
    connection = get_connection()

    connection.execute("""
        CREATE TABLE IF NOT EXISTS scan_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image_name TEXT NOT NULL,
            prediction TEXT NOT NULL,
            confidence REAL NOT NULL,
            glioma REAL NOT NULL,
            meningioma REAL NOT NULL,
            notumor REAL NOT NULL,
            pituitary REAL NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    connection.commit()
    connection.close()


def save_scan(
    image_name,
    prediction,
    confidence,
    glioma,
    meningioma,
    notumor,
    pituitary
):
    connection = get_connection()

    cursor = connection.execute("""
        INSERT INTO scan_history (
            image_name,
            prediction,
            confidence,
            glioma,
            meningioma,
            notumor,
            pituitary
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        image_name,
        prediction,
        confidence,
        glioma,
        meningioma,
        notumor,
        pituitary
    ))

    connection.commit()

    scan_id = cursor.lastrowid

    connection.close()

    return scan_id


def get_all_scans():
    connection = get_connection()

    scans = connection.execute("""
        SELECT *
        FROM scan_history
        ORDER BY created_at DESC
    """).fetchall()

    connection.close()

    return [dict(scan) for scan in scans]


def get_scan_by_id(scan_id):
    connection = get_connection()

    scan = connection.execute("""
        SELECT *
        FROM scan_history
        WHERE id = ?
    """, (scan_id,)).fetchone()

    connection.close()

    if scan:
        return dict(scan)

    return None