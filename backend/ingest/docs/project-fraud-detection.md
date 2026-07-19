# Multilingual Fraud Detection Analysis

Cybersecurity & NLP project (Aug 2025 – Dec 2025). Tech: DistilBERT, NLP, spaCy, scikit-learn, Python.

Niket conducted the first systematic analysis of language diversity in the DIFrauD fraud detection dataset, revealing that non-English content is concentrated in SMS messages (9.05%) with statistically significant differences between deceptive and non-deceptive classes.

He trained and benchmarked three classifiers on multilingual fraud data — DistilBERT, Random Forest, and LinearSVC — and found that DistilBERT exhibited the largest performance drop on multilingual content (a 7.4% accuracy decrease) despite achieving the highest absolute performance.

## Methodology

- Built a cross-validation framework using langdetect and spaCy that achieved 99.77% agreement, providing a reproducible methodology for language quality assessment in security datasets.
- Performed chi-square statistical tests to quantify language distribution differences.
- Synthesized controlled multilingual datasets via machine translation for rigorous hypothesis testing.
