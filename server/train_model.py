import os
import json
import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt

from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.applications import EfficientNetB0
from sklearn.utils.class_weight import compute_class_weight
from sklearn.metrics import classification_report, confusion_matrix


# ============================================================
# CONFIGURATION
# ============================================================

IMG_SIZE = (224, 224)
BATCH_SIZE = 32

INITIAL_EPOCHS = 15
FINE_TUNE_EPOCHS = 15

SEED = 42

np.random.seed(SEED)
tf.random.set_seed(SEED)


# ============================================================
# PATHS
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATASET_DIR = os.path.abspath(
    os.path.join(BASE_DIR, "..", "dataset")
)

TRAIN_DIR = os.path.join(DATASET_DIR, "Training")
TEST_DIR = os.path.join(DATASET_DIR, "Testing")

MODEL_PATH = os.path.join(
    BASE_DIR,
    "neuroscan_model.keras"
)

CLASS_NAMES_PATH = os.path.join(
    BASE_DIR,
    "class_names.json"
)

ACCURACY_GRAPH = os.path.join(
    BASE_DIR,
    "training_accuracy.png"
)

LOSS_GRAPH = os.path.join(
    BASE_DIR,
    "training_loss.png"
)


print("\n" + "=" * 70)
print("NeuroScan.AI - Improved Brain Tumor Model Training")
print("=" * 70)

print("\nDataset:")
print(DATASET_DIR)

print("\nTraining folder:")
print(TRAIN_DIR)

print("\nTesting folder:")
print(TEST_DIR)


# ============================================================
# CHECK DATASET
# ============================================================

if not os.path.exists(TRAIN_DIR):
    raise FileNotFoundError(
        f"Training folder not found:\n{TRAIN_DIR}"
    )

if not os.path.exists(TEST_DIR):
    raise FileNotFoundError(
        f"Testing folder not found:\n{TEST_DIR}"
    )


# ============================================================
# CLASS NAMES
# ============================================================

EXPECTED_CLASSES = [
    "glioma",
    "meningioma",
    "notumor",
    "pituitary"
]


for class_name in EXPECTED_CLASSES:

    train_class_dir = os.path.join(
        TRAIN_DIR,
        class_name
    )

    test_class_dir = os.path.join(
        TEST_DIR,
        class_name
    )

    if not os.path.exists(train_class_dir):
        raise FileNotFoundError(
            f"Missing training class folder:\n{train_class_dir}"
        )

    if not os.path.exists(test_class_dir):
        raise FileNotFoundError(
            f"Missing testing class folder:\n{test_class_dir}"
        )


CLASS_NAMES = EXPECTED_CLASSES

print("\nClasses:")
for i, name in enumerate(CLASS_NAMES):
    print(f"{i}: {name}")


# ============================================================
# LOAD TRAINING DATA
# ============================================================

# ============================================================
# LOAD TRAINING + VALIDATION DATA
# ============================================================

print("\nLoading training and validation datasets...")

train_ds, val_ds = tf.keras.utils.image_dataset_from_directory(
    TRAIN_DIR,
    labels="inferred",
    class_names=CLASS_NAMES,
    label_mode="int",
    color_mode="rgb",
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    shuffle=True,
    seed=SEED,
    validation_split=0.20,
    subset="both"
)


# ============================================================
# LOAD VALIDATION DATA
# ============================================================

# We take 20% of the TRAINING folder for validation.
# The separate Testing folder remains untouched.

print("\nLoading validation dataset...")

train_ds, val_ds = tf.keras.utils.image_dataset_from_directory(
    TRAIN_DIR,
    labels="inferred",
    class_names=CLASS_NAMES,
    label_mode="int",
    color_mode="rgb",
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    shuffle=True,
    seed=SEED,
    validation_split=0.20,
    subset="both"
)


# ============================================================
# LOAD FINAL TEST DATA
# ============================================================

print("\nLoading final test dataset...")

test_ds = tf.keras.utils.image_dataset_from_directory(
    TEST_DIR,
    labels="inferred",
    class_names=CLASS_NAMES,
    label_mode="int",
    color_mode="rgb",
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    shuffle=False
)


# ============================================================
# DATA AUGMENTATION
# ============================================================

data_augmentation = keras.Sequential(
    [
        layers.RandomFlip("horizontal"),

        layers.RandomRotation(0.08),

        layers.RandomZoom(
            height_factor=(-0.12, 0.12),
            width_factor=(-0.12, 0.12)
        ),

        layers.RandomContrast(0.15),
    ],
    name="data_augmentation"
)


# ============================================================
# CALCULATE CLASS WEIGHTS
# ============================================================

print("\nCalculating class weights...")

class_counts = np.zeros(
    len(CLASS_NAMES),
    dtype=np.int64
)


for _, labels in train_ds:

    labels_np = labels.numpy()

    for label in labels_np:

        class_counts[int(label)] += 1


print("\nTraining class counts:")

for i, class_name in enumerate(CLASS_NAMES):

    print(
        f"{class_name:12s}: {class_counts[i]}"
    )


classes = np.arange(len(CLASS_NAMES))

class_weights_array = compute_class_weight(
    class_weight="balanced",
    classes=classes,
    y=np.concatenate(
        [
            labels.numpy()
            for _, labels in train_ds
        ]
    )
)


CLASS_WEIGHTS = {
    int(i): float(weight)
    for i, weight in enumerate(
        class_weights_array
    )
}


print("\nClass weights:")

for i, class_name in enumerate(CLASS_NAMES):

    print(
        f"{class_name:12s}: "
        f"{CLASS_WEIGHTS[i]:.4f}"
    )


# ============================================================
# PERFORMANCE OPTIMIZATION
# ============================================================

AUTOTUNE = tf.data.AUTOTUNE

train_ds = train_ds.prefetch(
    AUTOTUNE
)

val_ds = val_ds.prefetch(
    AUTOTUNE
)

test_ds = test_ds.prefetch(
    AUTOTUNE
)


# ============================================================
# BUILD EFFICIENTNET MODEL
# ============================================================

print("\nBuilding EfficientNetB0 model...")

base_model = EfficientNetB0(
    include_top=False,
    weights="imagenet",
    input_shape=(
        IMG_SIZE[0],
        IMG_SIZE[1],
        3
    )
)


# First stage:
# Freeze the pretrained feature extractor.

base_model.trainable = False


inputs = keras.Input(
    shape=(
        IMG_SIZE[0],
        IMG_SIZE[1],
        3
    )
)


x = data_augmentation(inputs)

# EfficientNetB0 in Keras includes its input
# rescaling/preprocessing internally.
x = base_model(
    x,
    training=False
)

x = layers.GlobalAveragePooling2D()(x)

x = layers.Dropout(
    0.35
)(x)

x = layers.Dense(
    256,
    activation="relu"
)(x)

x = layers.Dropout(
    0.25
)(x)

outputs = layers.Dense(
    len(CLASS_NAMES),
    activation="softmax"
)(x)


model = keras.Model(
    inputs,
    outputs
)


# ============================================================
# INITIAL COMPILE
# ============================================================

model.compile(
    optimizer=keras.optimizers.Adam(
        learning_rate=0.0001
    ),

    loss="sparse_categorical_crossentropy",

    metrics=[
        "accuracy"
    ]
)


model.summary()


# ============================================================
# CALLBACKS
# ============================================================

checkpoint = keras.callbacks.ModelCheckpoint(
    MODEL_PATH,
    monitor="val_accuracy",
    save_best_only=True,
    mode="max",
    verbose=1
)


early_stopping = keras.callbacks.EarlyStopping(
    monitor="val_accuracy",
    patience=5,
    mode="max",
    restore_best_weights=True,
    verbose=1
)


reduce_lr = keras.callbacks.ReduceLROnPlateau(
    monitor="val_loss",
    factor=0.3,
    patience=2,
    min_lr=1e-7,
    verbose=1
)


# ============================================================
# STAGE 1 - TRANSFER LEARNING
# ============================================================

print("\n" + "=" * 70)
print("STAGE 1 - TRANSFER LEARNING")
print("=" * 70)

history_initial = model.fit(
    train_ds,

    validation_data=val_ds,

    epochs=INITIAL_EPOCHS,

    class_weight=CLASS_WEIGHTS,

    callbacks=[
        checkpoint,
        early_stopping,
        reduce_lr
    ]
)


# ============================================================
# STAGE 2 - FINE TUNING
# ============================================================

print("\n" + "=" * 70)
print("STAGE 2 - FINE TUNING")
print("=" * 70)


base_model.trainable = True


# Freeze most of EfficientNet.
# Only the later feature layers are fine-tuned.

fine_tune_from = max(
    0,
    len(base_model.layers) - 80
)


for layer in base_model.layers[
    :fine_tune_from
]:

    layer.trainable = False


# Keep BatchNormalization layers frozen.
# This makes fine-tuning more stable.

for layer in base_model.layers:

    if isinstance(
        layer,
        layers.BatchNormalization
    ):

        layer.trainable = False


print(
    "\nFine-tuning from layer:",
    fine_tune_from
)

print(
    "Total EfficientNet layers:",
    len(base_model.layers)
)


# Recompile after changing trainable layers.

model.compile(
    optimizer=keras.optimizers.Adam(
        learning_rate=1e-5
    ),

    loss="sparse_categorical_crossentropy",

    metrics=[
        "accuracy"
    ]
)


history_fine = model.fit(
    train_ds,

    validation_data=val_ds,

    epochs=FINE_TUNE_EPOCHS,

    class_weight=CLASS_WEIGHTS,

    callbacks=[
        checkpoint,
        early_stopping,
        reduce_lr
    ]
)


# ============================================================
# LOAD BEST MODEL
# ============================================================

print("\nLoading best saved model...")

model = tf.keras.models.load_model(
    MODEL_PATH
)


# ============================================================
# FINAL TEST EVALUATION
# ============================================================

print("\n" + "=" * 70)
print("FINAL TEST EVALUATION")
print("=" * 70)

test_loss, test_accuracy = model.evaluate(
    test_ds,
    verbose=1
)


print(
    f"\nTest Loss: {test_loss:.4f}"
)

print(
    f"Test Accuracy: "
    f"{test_accuracy * 100:.2f}%"
)


# ============================================================
# PREDICTIONS
# ============================================================

print("\nGenerating predictions...")

y_true = []
y_pred = []


for images, labels in test_ds:

    predictions = model.predict(
        images,
        verbose=0
    )

    predicted_classes = np.argmax(
        predictions,
        axis=1
    )

    y_true.extend(
        labels.numpy()
    )

    y_pred.extend(
        predicted_classes
    )


y_true = np.array(
    y_true
)

y_pred = np.array(
    y_pred
)


# ============================================================
# CLASSIFICATION REPORT
# ============================================================

print("\n" + "=" * 70)
print("CLASSIFICATION REPORT")
print("=" * 70)

report = classification_report(
    y_true,
    y_pred,
    target_names=CLASS_NAMES,
    digits=4
)

print(report)


# ============================================================
# CONFUSION MATRIX
# ============================================================

cm = confusion_matrix(
    y_true,
    y_pred
)


print("\n" + "=" * 70)
print("CONFUSION MATRIX")
print("=" * 70)

print(cm)


# ============================================================
# SAVE CLASS NAMES
# ============================================================

with open(
    CLASS_NAMES_PATH,
    "w"
) as f:

    json.dump(
        CLASS_NAMES,
        f,
        indent=4
    )


print(
    f"\nClass names saved to:"
    f"\n{CLASS_NAMES_PATH}"
)


# ============================================================
# COMBINE TRAINING HISTORY
# ============================================================

initial_acc = history_initial.history.get(
    "accuracy",
    []
)

initial_val_acc = history_initial.history.get(
    "val_accuracy",
    []
)

fine_acc = history_fine.history.get(
    "accuracy",
    []
)

fine_val_acc = history_fine.history.get(
    "val_accuracy",
    []
)


initial_loss = history_initial.history.get(
    "loss",
    []
)

initial_val_loss = history_initial.history.get(
    "val_loss",
    []
)

fine_loss = history_fine.history.get(
    "loss",
    []
)

fine_val_loss = history_fine.history.get(
    "val_loss",
    []
)


all_acc = (
    initial_acc +
    fine_acc
)

all_val_acc = (
    initial_val_acc +
    fine_val_acc
)

all_loss = (
    initial_loss +
    fine_loss
)

all_val_loss = (
    initial_val_loss +
    fine_val_loss
)


# ============================================================
# SAVE ACCURACY GRAPH
# ============================================================

plt.figure(
    figsize=(10, 6)
)

plt.plot(
    all_acc,
    label="Training Accuracy"
)

plt.plot(
    all_val_acc,
    label="Validation Accuracy"
)

plt.xlabel(
    "Epoch"
)

plt.ylabel(
    "Accuracy"
)

plt.title(
    "NeuroScan.AI Training Accuracy"
)

plt.legend()

plt.grid(
    True
)

plt.tight_layout()

plt.savefig(
    ACCURACY_GRAPH,
    dpi=150
)

plt.close()


# ============================================================
# SAVE LOSS GRAPH
# ============================================================

plt.figure(
    figsize=(10, 6)
)

plt.plot(
    all_loss,
    label="Training Loss"
)

plt.plot(
    all_val_loss,
    label="Validation Loss"
)

plt.xlabel(
    "Epoch"
)

plt.ylabel(
    "Loss"
)

plt.title(
    "NeuroScan.AI Training Loss"
)

plt.legend()

plt.grid(
    True
)

plt.tight_layout()

plt.savefig(
    LOSS_GRAPH,
    dpi=150
)

plt.close()


# ============================================================
# FINAL INFORMATION
# ============================================================

print("\n" + "=" * 70)
print("TRAINING COMPLETE")
print("=" * 70)

print(
    f"\nBest model:"
    f"\n{MODEL_PATH}"
)

print(
    f"\nAccuracy graph:"
    f"\n{ACCURACY_GRAPH}"
)

print(
    f"\nLoss graph:"
    f"\n{LOSS_GRAPH}"
)

print(
    f"\nFinal Test Accuracy:"
    f" {test_accuracy * 100:.2f}%"
)

print("\nNeuroScan.AI model training finished.")
print("=" * 70)