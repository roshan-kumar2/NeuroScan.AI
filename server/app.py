import os
import json
import numpy as np

from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image

from ai_edge_litert.interpreter import Interpreter

from database import (
    init_database,
    save_scan,
    get_all_scans,
    get_scan_by_id
)


app = Flask(__name__)
CORS(app)


# --------------------------------------------------
# PATHS
# --------------------------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "neuroscan_model.tflite"
)

CLASS_NAMES_PATH = os.path.join(
    BASE_DIR,
    "class_names.json"
)


# --------------------------------------------------
# LOAD LITERT MODEL
# --------------------------------------------------

print("Loading NeuroScan.AI LiteRT model...")

interpreter = Interpreter(
    model_path=MODEL_PATH
)

interpreter.allocate_tensors()

input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

print("LiteRT model loaded successfully.")

print(
    "Input shape:",
    input_details[0]["shape"]
)

print(
    "Output shape:",
    output_details[0]["shape"]
)


# --------------------------------------------------
# LOAD CLASS NAMES
# --------------------------------------------------

with open(CLASS_NAMES_PATH, "r") as f:
    CLASS_NAMES = json.load(f)


print("Classes:", CLASS_NAMES)


# --------------------------------------------------
# DATABASE
# --------------------------------------------------

init_database()


IMAGE_SIZE = (224, 224)


# --------------------------------------------------
# HOME / HEALTH CHECK
# --------------------------------------------------

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "success": True,
        "message": "NeuroScan.AI API is running",
        "classes": CLASS_NAMES
    })


# --------------------------------------------------
# PREDICTION
# --------------------------------------------------

@app.route("/predict", methods=["POST"])
def predict():

    try:

        # ------------------------------------------
        # CHECK IMAGE
        # ------------------------------------------

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


        # ------------------------------------------
        # OPEN IMAGE
        # ------------------------------------------

        image = Image.open(file.stream)

        image = image.convert("RGB")

        image = image.resize(IMAGE_SIZE)


        # ------------------------------------------
        # PREPARE INPUT
        # ------------------------------------------

        image_array = np.array(
            image,
            dtype=np.float32
        )

        image_array = np.expand_dims(
            image_array,
            axis=0
        )


        # ------------------------------------------
        # LITERT INFERENCE
        # ------------------------------------------

        interpreter.set_tensor(
            input_details[0]["index"],
            image_array
        )

        interpreter.invoke()


        predictions = interpreter.get_tensor(
            output_details[0]["index"]
        )


        probabilities = predictions[0]


        # ------------------------------------------
        # PREDICTION
        # ------------------------------------------

        predicted_index = int(
            np.argmax(probabilities)
        )

        predicted_class = CLASS_NAMES[
            predicted_index
        ]


        confidence = float(
            probabilities[predicted_index] * 100
        )


        # ------------------------------------------
        # CLASS PROBABILITIES
        # ------------------------------------------

        class_probabilities = {}

        for i, class_name in enumerate(CLASS_NAMES):

            class_probabilities[class_name] = round(
                float(probabilities[i] * 100),
                2
            )


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


        # ------------------------------------------
        # SAVE TO DATABASE
        # ------------------------------------------

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


        # ------------------------------------------
        # RESPONSE
        # ------------------------------------------

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


# --------------------------------------------------
# HISTORY
# --------------------------------------------------

@app.route("/history", methods=["GET"])
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


# --------------------------------------------------
# HISTORY DETAIL
# --------------------------------------------------

@app.route(
    "/history/<int:scan_id>",
    methods=["GET"]
)
def history_detail(scan_id):

    try:

        scan = get_scan_by_id(
            scan_id
        )


        if scan is None:

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


# --------------------------------------------------
# START SERVER
# --------------------------------------------------

if __name__ == "__main__":

    port = int(
        os.environ.get(
            "PORT",
            5000
        )
    )

    app.run(
        host="0.0.0.0",
        port=port,
        debug=False
    )