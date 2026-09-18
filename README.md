\# 🧠 NeuroScan.AI



\### AI-Powered Brain Tumor Detection Using MRI



NeuroScan.AI is an AI-assisted medical imaging web application designed to classify brain MRI images into four categories:



\- Glioma

\- Meningioma

\- Pituitary

\- No Tumor



The project combines a modern React-based frontend, a Flask backend, SQLite database, and a deep learning image classification model to provide MRI analysis and maintain scan history.



> ⚠️ Medical Disclaimer: NeuroScan.AI is an academic AI-assisted project and is not intended to replace professional medical diagnosis, consultation, or treatment. MRI predictions should always be reviewed by a qualified medical professional.



\---



\## 📌 Project Overview



Brain tumors are abnormal growths of cells within or around the brain. MRI scans are commonly used by medical professionals to examine brain structures and identify abnormalities.



NeuroScan.AI aims to demonstrate how Artificial Intelligence and Deep Learning can assist in the classification of brain MRI images.



The application allows a user to:



1\. Upload a brain MRI image.

2\. Send the image to the Flask backend.

3\. Process the image using a trained deep learning model.

4\. Predict the MRI category.

5\. Display the prediction and confidence.

6\. Store the scan result in a SQLite database.

7\. View previous scan results through the Scan History page.

8\. View scan statistics through the Dashboard.



\---



\# ✨ Features



\## 🧠 AI-Based MRI Classification



The application classifies MRI images into four categories:



| Class | Description |

|---|---|

| Glioma | MRI images classified as glioma |

| Meningioma | MRI images classified as meningioma |

| Pituitary | MRI images classified as pituitary tumor |

| No Tumor | MRI images classified as having no tumor |



\---



\## 📤 MRI Image Upload



Users can upload an MRI image through the web interface.



Supported image formats include:



\- JPG

\- JPEG

\- PNG



The uploaded image is sent to the backend for AI-assisted classification.



\---



\## 🤖 Deep Learning Model



The project uses a transfer-learning based image classification model.



The final training implementation uses:



\- EfficientNetB0

\- ImageNet pretrained weights

\- Data augmentation

\- Class weighting

\- Transfer learning

\- Fine-tuning

\- Early stopping

\- Learning-rate reduction

\- Model checkpointing



The trained model is saved as:



```text

server/neuroscan\_model.keras📊 Model Performance



The final trained model achieved:



Test Accuracy: 84.13%



This result was obtained on the held-out test dataset used during model evaluation.



The model was evaluated using:



Accuracy

Precision

Recall

F1-score

Confusion Matrix



Model performance can vary depending on the MRI image, dataset distribution, image quality, and other factors.



🖥️ User Interface



NeuroScan.AI provides a clean medical-themed interface.



Main sections include:

Home

Detection

Dashboard

History

How It Works

About

Contact

Login



The homepage provides quick access to MRI upload and live capture functionality.



📈 Dashboard



The Dashboard provides an overview of stored scan results.



It includes:



Total Scans

Tumor Detected

No Tumor

Average Confidence

Recent Scan History

Quick Actions

New Scan

View Full History



Dashboard information is retrieved from the Flask backend.



📋 Scan History



The Scan History section displays previous MRI analysis records.



Each record contains:



Scan ID

Image name

Prediction

Confidence

Date \& Time



Scan timestamps are stored by the backend and displayed in Indian Standard Time (IST) on the frontend.



🗄️ Database



NeuroScan.AI uses SQLite for storing scan history.



Database file:



server/neuroscan.db



The database stores:



Image name

Prediction

Overall confidence

Glioma probability

Meningioma probability

No Tumor probability

Pituitary probability

Scan creation time       ┌─────────────────────┐

&#x20;                   │      User           │

&#x20;                   └──────────┬──────────┘

&#x20;                              │

&#x20;                              ▼

&#x20;                   ┌─────────────────────┐

&#x20;                   │   React Frontend    │

&#x20;                   │      Vite           │

&#x20;                   └──────────┬──────────┘

&#x20;                              │

&#x20;                        HTTP / Axios

&#x20;                              │

&#x20;                              ▼

&#x20;                   ┌─────────────────────┐

&#x20;                   │    Flask Backend    │

&#x20;                   │      Python         │

&#x20;                   └──────────┬──────────┘

&#x20;                              │

&#x20;                 ┌────────────┴────────────┐

&#x20;                 │                         │

&#x20;                 ▼                         ▼

&#x20;       ┌─────────────────┐       ┌─────────────────┐

&#x20;       │ Deep Learning   │       │ SQLite Database │

&#x20;       │     Model       │       │  Scan History   │

&#x20;       └────────┬────────┘       └─────────────────┘

&#x20;                │

&#x20;                ▼

&#x20;       ┌─────────────────┐

&#x20;       │ MRI Prediction  │

&#x20;       │ + Probabilities │

&#x20;       └─────────────────┘

🛠️ Technologies Used

Frontend

React

Vite

JavaScript

HTML5

CSS3

React Router DOM

Axios

React Icons

Framer Motion

Poppins Font

Backend

Python

Flask

Flask-CORS

NumPy

Pillow

SQLite

Machine Learning

TensorFlow

Keras

EfficientNetB0

Transfer Learning

Image Augmentation

Development Tools

Visual Studio Code

Git

GitHub

Vite Development Server


📁 Project Structure

BrainTumorAI/

│

├── client/

│   │

│   ├── public/

│   │

│   ├── src/

│   │   │

│   │   ├── assets/

│   │   │   └── mri-hero.png

│   │   │

│   │   ├── components/

│   │   │   ├── Navbar.jsx

│   │   │   ├── Hero.jsx

│   │   │   ├── Features.jsx

│   │   │   └── HowItWorks.jsx

│   │   │

│   │   ├── pages/

│   │   │   ├── Home.jsx

│   │   │   ├── Dashboard.jsx

│   │   │   ├── History.jsx

│   │   │   ├── ScanUpload.jsx

│   │   │   └── ScanResult.jsx

│   │   │

│   │   ├── styles/

│   │   │   ├── Navbar.css

│   │   │   ├── Hero.css

│   │   │   ├── Features.css

│   │   │   ├── Dashboard.css

│   │   │   ├── History.css

│   │   │   ├── UploadPage.css

│   │   │   └── ResultPage.css

│   │   │

│   │   ├── App.jsx

│   │   ├── main.jsx

│   │   └── index.css

│   │

│   ├── package.json

│   ├── package-lock.json

│   └── vite.config.js

│

├── server/

│   │

│   ├── app.py

│   ├── database.py

│   ├── train\_model.py

│   ├── neuroscan\_model.keras

│   ├── training\_accuracy.png

│   ├── training\_loss.png

│   └── neuroscan.db

│

├── .gitignore

└── README.md



Note: node\_modules, Python virtual environments, cache files, and local database files should not be committed to GitHub.



🔄 Application Workflow

Step 1 — User Uploads MRI



The user selects an MRI image from the Upload MRI page.



MRI Image

&#x20;  ↓

React Frontend

Step 2 — Frontend Sends Image



The frontend sends the image to the Flask backend using Axios.



React

&#x20;  ↓

POST /predict

&#x20;  ↓

Flask Backend

Step 3 — Image Processing



The backend:



Receives the image.

Opens the image using Pillow.

Converts it to RGB.

Resizes it to:

224 × 224

Converts it into a NumPy array.

Sends it to the trained model.

Step 4 — AI Prediction



The EfficientNetB0-based model processes the MRI image.



The model returns probabilities for:



Glioma

Meningioma

No Tumor

Pituitary



The class with the highest probability is selected as the predicted class.



Step 5 — Result Display



The frontend receives:



Prediction

Confidence

Class probabilities



and displays the result to the user.



Step 6 — Store Result



The backend stores the prediction in SQLite.



MRI Scan

&#x20;  ↓

Prediction

&#x20;  ↓

SQLite Database

Step 7 — History



Users can access the History page to view previous scans.



🔌 API Endpoints



The Flask backend provides the following endpoints.



GET /



Checks whether the backend API is running.



Example:



http://127.0.0.1:5000/

POST /predict



Analyzes an uploaded MRI image.



Request:



POST /predict



Form field:



image



The response contains prediction information and probabilities.



GET /history



Returns all stored scan records.



Example:



GET /history

GET /history/<scan\_id>



Returns a specific scan record.



Example:



GET /history/1

⚙️ Local Installation

Prerequisites



Install the following:



Node.js

npm

Python

Git

Visual Studio Code

🚀 Frontend Setup



Open a terminal inside the project:



cd client



Install dependencies:



npm install



Start the frontend:



npm run dev



The Vite development server will normally run at:



http://localhost:5173



If port 5173 is already being used, Vite may automatically use another available port.



🐍 Backend Setup



Open another terminal.



Go to the server folder:



cd server



Create a virtual environment:



python -m venv tf\_env



Activate it:



Windows PowerShell

.\\tf\_env\\Scripts\\Activate.ps1



Install the required packages:



pip install flask flask-cors numpy pillow tensorflow



Start the backend:



python app.py



The backend will run at:



http://127.0.0.1:5000

🧠 Model Setup



The trained model is expected at:



server/neuroscan\_model.keras



The backend loads the model when Flask starts.



If the model is missing, prediction functionality will not work.



🧪 Model Training



The training script is:



server/train\_model.py



The model training process includes:



Dataset loading

Image preprocessing

Training/validation split

Data augmentation

Class weighting

Transfer learning

Fine-tuning

Model evaluation

Classification report

Confusion matrix

Training graphs

Model saving



The final model is saved as:



server/neuroscan\_model.keras

📊 Evaluation



The trained model is evaluated using a separate test dataset.



Evaluation metrics include:



Accuracy

Precision

Recall

F1-Score

Confusion Matrix



The final reported test accuracy was:



84.13%

🔐 Privacy \& Security



This project is intended for academic demonstration.



The application includes a secure/confidential messaging approach in the user interface.



For a production medical application, additional security measures would be required, including:



User authentication

HTTPS

Secure file storage

Encryption

Access control

Audit logging

Data retention policies

Proper medical-device compliance

Secure deployment infrastructure

⚠️ Medical Disclaimer



NeuroScan.AI is an academic project demonstrating the use of Artificial Intelligence for MRI image classification.



The prediction generated by this application:



Is not a medical diagnosis.

Should not be used as a substitute for a doctor.

Should not be used to make treatment decisions.

May produce incorrect predictions.

Should be reviewed by a qualified healthcare professional.

🔮 Future Improvements



Potential future improvements include:



User authentication

Doctor login

Doctor dashboard

Patient profiles

PDF medical reports

Email reports

Improved model accuracy

Larger and more diverse datasets

Explainable AI

Grad-CAM visualization

MRI scan segmentation

Cloud deployment

Secure cloud storage

Mobile application

Real-time medical consultation

Advanced analytics

Multi-language support

🎓 Academic Project



This project was developed as a final-year engineering project to demonstrate the integration of:



Artificial Intelligence

Deep Learning

Computer Vision

React Development

Flask API Development

Database Management

Full-Stack Web Development

👨‍💻 Author



Roshan Kumar



Computer Science \& Data Science



Pranveer Singh Institute of Technology



📜 License



This project is intended for educational and academic purposes.



You may modify and use the project for learning and academic demonstration with appropriate attribution.

