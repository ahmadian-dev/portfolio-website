# Computer Vision Inspection Platform

![Status](https://img.shields.io/badge/status-released-brightgreen)
![Python](https://img.shields.io/badge/python-3.11+-blue)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

**Mohammad Ahmadian — AI / Machine Learning Engineer**  
**Target roles:** Computer Vision Engineer · Machine Learning Engineer

Enterprise-Grade Visual Inspection System for Industrial Quality Control

> Hiring managers: [Demo Website](presentation/demo-website/index.html) · [Dashboard](presentation/dashboard/index.html) · [Architecture](presentation/architecture/architecture.html) · [Presentation pack](presentation/README.md)

## Positioning

This is a **Computer Vision Inspection Platform**, not a single YOLO notebook.

Capabilities (v1):
- Image classification (OK / defect) with Grad-CAM
- Object detection via segment-then-box (+ classical baseline)
- Semantic segmentation (Compact U-Net)
- FastAPI serving, baselines, evaluation, Docker, tests

## Recruiter snapshot

| Item | Detail |
|------|--------|
| Domain | Industrial CV · Visual inspection · Quality control |
| Tasks | Classification · Detection · Segmentation · XAI |
| Serving | `/health` · `/v1/classify` · `/v1/detect` · `/v1/segment` · `/v1/model` |
| Integrity | Baselines vs primary · real metrics · synthetic sample honesty |

### Evaluation (synthetic industrial sample · test)

| Metric | Value |
|--------|------:|
| Primary classification F1 (ResNet18) | **1.000** |
| Baseline classification F1 (LogReg) | **0.933** |
| Detection mAP@0.5 proxy (segment→box) | **0.958** |
| Segmentation mean IoU | **0.993** |

Full report: [`reports/EVALUATION_REPORT.md`](reports/EVALUATION_REPORT.md)

## Architecture

![System architecture (Released)](presentation/architecture/architecture-diagram.png)

## Quick start

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
pip install -e .

set PYTHONPATH=src
python scripts/prepare_dataset.py
python scripts/train_and_eval.py
uvicorn cvinspect.api.main:app --app-dir src --host 0.0.0.0 --port 8000
# http://localhost:8000/docs
```

Docker:

```bash
docker compose up --build
```

## Documentation

[`docs/00_MASTER_INDEX.md`](docs/00_MASTER_INDEX.md) · Doc 13: **Computer Vision Pipeline**

## Limitations (honest)

- Seeded synthetic industrial-style imagery — methodology demo, not a live plant warranty  
- Compact CPU-friendly models for reproducible portfolio packaging  
- Detection primary uses segment-then-box (documented engineering choice)

## Contact

mohammad.ahmadian.dev@gmail.com · [github.com/ahmadian-dev](https://github.com/ahmadian-dev) · Turkey (GMT+3)

## License

MIT — see [LICENSE](LICENSE).
