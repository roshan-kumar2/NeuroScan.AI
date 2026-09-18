# 🧠 NeuroScan.AI

### AI-Powered Brain Tumor Detection Using MRI

NeuroScan.AI is an AI-assisted medical imaging web application designed to classify brain MRI images into four categories:

- Glioma
- Meningioma
- Pituitary
- No Tumor

The project combines a modern React-based frontend, a Flask backend, SQLite database, and a deep learning image classification model to provide MRI analysis and maintain scan history.

> ⚠️ Medical Disclaimer: NeuroScan.AI is an academic AI-assisted project and is not intended to replace professional medical diagnosis, consultation, or treatment. MRI predictions should always be reviewed by a qualified medical professional.

---

## 📌 Project Overview

Brain tumors are abnormal growths of cells within or around the brain. MRI scans are commonly used by medical professionals to examine brain structures and identify abnormalities.

NeuroScan.AI aims to demonstrate how Artificial Intelligence and Deep Learning can assist in the classification of brain MRI images.

The application allows a user to:

1. Upload a brain MRI image.
2. Send the image to the Flask backend.
3. Process the image using a trained deep learning model.
4. Predict the MRI category.
5. Display the prediction and confidence.
6. Store the scan result in a SQLite database.
7. View previous scan results through the Scan History page.
8. View scan statistics through the Dashboard.

---

# ✨ Features

## 🧠 AI-Based MRI Classification

The application classifies MRI images into four categories:

| Class | Description |
|---|---|
| Glioma | MRI images classified as glioma |
| Meningioma | MRI images classified as meningioma |
| Pituitary | MRI images classified as pituitary tumor |
| No Tumor | MRI images classified as having no tumor |

---

## 📤 MRI Image Upload

Users can upload an MRI image through the web interface.

Supported image formats include:

- JPG
- JPEG
- PNG

The uploaded image is sent to the backend for AI-assisted classification.

---

## 🤖 Deep Learning Model

The project uses a transfer-learning based image classification model.

The final training implementation uses:

- EfficientNetB0
- ImageNet pretrained weights
- Data augmentation
- Class weighting
- Transfer learning
- Fine-tuning
- Early stopping
- Learning-rate reduction
- Model checkpointing

The trained model is saved as:

```text
server/neuroscan_model.keras