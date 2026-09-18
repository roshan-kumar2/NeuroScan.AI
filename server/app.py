import os
import json
import numpy as np
import tensorflow as tf

from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image

from database import (
    init_database,
    save_scan,
    get_all_scans,
    get_scan_by_id
)


# ============================================================
# FLASK APP
# ============================================================

app = Flask(__name__)
CORS(app)


# ============================================================
# PATHS
# ============================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "neuroscan_model.keras"
)

CLASS_NAMES_PATH = os.path.join(
    BASE_DIR,
    "class_names.json"
)


# ============================================================
# LOAD MODEL
# ============================================================

print("")
print("=" * 60)
print("Loading NeuroScan.AI model...")
print("=" * 60)

model = tf.keras.models.load_model(
    MODEL_PATH
)

print("Model loaded successfully.")


# ============================================================
# LOAD CLASS NAMES
# ============================================================

with open(
    CLASS_NAMES_PATH,
    "r"
) as f:

    CLASS_NAMES = json.load(f)


print("Classes:", CLASS_NAMES)


# ============================================================
# INITIALIZE DATABASE
# ============================================================

init_database()

print("Database initialized successfully.")


# ============================================================
# IMAGE SIZE
# ============================================================

IMAGE_SIZE = (
    224,
    224
)


# ============================================================
# HOME / API STATUS
# ============================================================

@app.route(
    "/",
    methods=["GET"]
)
def home():

    return jsonify({
        "success": True,
        "message": "NeuroScan.AI API is running",
        "classes": CLASS_NAMES
    })


# ============================================================
# PREDICT MRI
# ============================================================

@app.route(
    "/predict",
    methods=["POST"]
)
def predict():

    try:

        # ----------------------------------------------------
        # CHECK FILE
        # ----------------------------------------------------

        if "image" not in request.files:

            return jsonify({
                "success": False,
                "error": "No image uploaded"
            }), 400


        file = request.files["image"]


        if file.filename == "":

            return jsonify({
                "success": False,
                "error": "No image selected"
            }), 400


        # ----------------------------------------------------
        # OPEN IMAGE
        # ----------------------------------------------------

        image = Image.open(
            file.stream
        )


        # Convert image to RGB

        image = image.convert(
            "RGB"
        )


        # Resize to model input size

        image = image.resize(
            IMAGE_SIZE
        )


        # Convert to NumPy

        image_array = np.array(
            image
        )


        # Add batch dimension

        image_array = np.expand_dims(
            image_array,
            axis=0
        )


        # ----------------------------------------------------
        # MODEL PREDICTION
        # ----------------------------------------------------
        #
        # IMPORTANT:
        #
        # EfficientNetB0 model was trained with preprocessing
        # inside the model pipeline.
        #
        # Therefore we DO NOT apply an additional
        # preprocess_input() here.
        #
        # ----------------------------------------------------

        predictions = model.predict(
            image_array,
            verbose=0
        )


        probabilities = predictions[0]


        # ----------------------------------------------------
        # FIND PREDICTED CLASS
        # ----------------------------------------------------

        predicted_index = int(
            np.argmax(probabilities)
        )


        predicted_class = CLASS_NAMES[
            predicted_index
        ]


        # ----------------------------------------------------
        # CONFIDENCE
        # ----------------------------------------------------

        confidence = float(
            probabilities[
                predicted_index
            ] * 100
        )


        # ----------------------------------------------------
        # ALL CLASS PROBABILITIES
        # ----------------------------------------------------

        class_probabilities = {}

        for i, class_name in enumerate(
            CLASS_NAMES
        ):

            class_probabilities[
                class_name
            ] = round(
                float(
                    probabilities[i] * 100
                ),
                2
            )


        # ----------------------------------------------------
        # GET INDIVIDUAL PROBABILITIES
        # ----------------------------------------------------

        glioma_probability = class_probabilities.get(
            "glioma",
            0
        )

        meningioma_probability = class_probabilities.get(
            "meningioma",
            0
        )

        notumor_probability = class_probabilities.get(
            "notumor",
            0
        )

        pituitary_probability = class_probabilities.get(
            "pituitary",
            0
        )


        # ----------------------------------------------------
        # SAVE RESULT TO DATABASE
        # ----------------------------------------------------

        scan_id = save_scan(

            image_name=file.filename,

            prediction=predicted_class,

            confidence=round(
                confidence,
                2
            ),

            glioma=glioma_probability,

            meningioma=meningioma_probability,

            notumor=notumor_probability,

            pituitary=pituitary_probability
        )


        # ----------------------------------------------------
        # RETURN RESULT
        # ----------------------------------------------------

        return jsonify({

            "success": True,

            "scan_id": scan_id,

            "prediction": predicted_class,

            "confidence": round(
                confidence,
                2
            ),

            "probabilities":
                class_probabilities

        })


    except Exception as e:

        print(
            "Prediction error:",
            str(e)
        )


        return jsonify({

            "success": False,

            "error": str(e)

        }), 500


# ============================================================
# GET ALL SCAN HISTORY
# ============================================================

@app.route(
    "/history",
    methods=["GET"]
)
def history():

    try:

        scans = get_all_scans()


        return jsonify({

            "success": True,

            "scans": scans

        })


    except Exception as e:

        print(
            "History error:",
            str(e)
        )


        return jsonify({

            "success": False,

            "error": str(e)

        }), 500


# ============================================================
# GET SINGLE SCAN
# ============================================================

@app.route(
    "/history/<int:scan_id>",
    methods=["GET"]
)
def history_detail(
    scan_id
):

    try:

        scan = get_scan_by_id(
            scan_id
        )


        if not scan:

            return jsonify({

                "success": False,

                "error": "Scan not found"

            }), 404


        return jsonify({

            "success": True,

            "scan": scan

        })


    except Exception as e:

        print(
            "History detail error:",
            str(e)
        )


        return jsonify({

            "success": False,

            "error": str(e)

        }), 500


# ============================================================
# RUN SERVER
# ============================================================

if __name__ == "__main__":

    print("")
    print("=" * 60)
    print("NeuroScan.AI Backend")
    print("=" * 60)
    print(
        "Server: http://127.0.0.1:5000"
    )
    print(
        "Prediction: http://127.0.0.1:5000/predict"
    )
    print(
        "History: http://127.0.0.1:5000/history"
    )
    print("=" * 60)
    print("")


    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )