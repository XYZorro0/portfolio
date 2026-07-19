# Dual-Pipeline Lung Cancer Detection System

Deep learning project (Aug 2025 – Dec 2025). Placed 3rd at the University of Houston HPE Data Science Institute Showcase. Tech: TensorFlow, CNNs, Python, computer vision, data augmentation.

Niket engineered a TensorFlow CNN-based classification system that detects and classifies lung cancer across 15 distinct classes from a Kaggle medical imaging dataset of approximately 5,000–15,000 samples.

The system's signature is its dual-pipeline architecture: separate processing paths for CT scan images and clinical tabular data, merged into a combined prediction layer. This fusion reached approximately 81% validation accuracy, outperforming single-pipeline baselines — and revealed that clinical data outperformed CT scans on certain visually ambiguous cancer subtypes.

## Engineering details

- Addressed class imbalance with data augmentation: rotation, flipping, zoom, cropping, and brightness adjustments.
- Resolved noisy and low-quality images through standardized resizing and padding.
- Normalized the clinical-data pipeline to third normal form (3NF), removed features with near-zero variance and high multicollinearity, and dropped rows with excessive missing values to preserve data integrity in a medical context.
