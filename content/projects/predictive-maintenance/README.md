# Production ML Platform for Predictive Maintenance

![Status](https://img.shields.io/badge/status-released-brightgreen)
![Python](https://img.shields.io/badge/python-3.11+-blue)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

**Mohammad Ahmadian — AI / Machine Learning Engineer**

End-to-end production-oriented ML system for **machine failure risk** scoring: validated data → leakage-safe features → baseline + LightGBM → evaluation → FastAPI → Docker.

> Hiring managers: start with the [Demo Website](presentation/demo-website/index.html) · [Performance Dashboard](presentation/dashboard/index.html) · [Architecture](presentation/architecture/architecture.html) · [Presentation pack](presentation/README.md)

## Recruiter snapshot

| Item | Detail |
|------|--------|
| Problem | Binary failure risk on industrial sensor features |
| Dataset | AI4I 2020 (UCI) · CC BY 4.0 · synthetic benchmark |
| Integrity | Failure-mode flags excluded · chronological UDI split |
| Models | Logistic Regression baseline · LightGBM primary |
| Serving | FastAPI `/v1/predict` + OpenAPI |
| Docs | Full pack under [`docs/`](docs/00_MASTER_INDEX.md) |

### Held-out test metrics

| Model | Precision | Recall | F1 | ROC-AUC | PR-AUC |
|-------|----------:|-------:|---:|--------:|------:|
| Baseline (LogReg) | 0.571 | 0.138 | 0.222 | 0.901 | 0.323 |
| **Primary (LightGBM)** | **0.952** | **0.690** | **0.800** | **0.944** | **0.781** |

Full report: [`reports/EVALUATION_REPORT.md`](reports/EVALUATION_REPORT.md)

![Baseline vs Primary F1](reports/figures/baseline_vs_primary_f1.png)

## Architecture

![System architecture (Released)](presentation/architecture/architecture-diagram.png)

*Figure 1. System architecture (Released).*

## Demo & presentation

| Asset | Link |
|-------|------|
| Demo website | [presentation/demo-website](presentation/demo-website/index.html) |
| Performance dashboard | [presentation/dashboard](presentation/dashboard/index.html) |
| 90s video script + recorder slides | [presentation/video](presentation/video/SCRIPT_90S.md) |
| LinkedIn / Upwork copy | [presentation/copy](presentation/copy) |

To record the 90s silent demo: open `presentation/video/recorder-slides.html` full screen → screen-record 1080p → save as `presentation/video/demo-90s.mp4`.

## Quick start

```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
pip install -r requirements.txt

set PYTHONPATH=src
# optional retrain:
python -m predmaint.training.train

uvicorn predmaint.api.main:app --app-dir src --host 0.0.0.0 --port 8000
# http://localhost:8000/docs
```

Sample request: [`reports/sample_predict_payload.json`](reports/sample_predict_payload.json)

```bash
curl -s -X POST http://localhost:8000/v1/predict ^
  -H "Content-Type: application/json" ^
  -d @reports/sample_predict_payload.json
```

## Repository map

```text
src/predmaint/     data · features · models · training · evaluation · inference · api
configs/           default.yaml
docs/              PRD → Cursor specs (Released)
presentation/      demo website · dashboard · architecture · video · hiring copy
models/artifacts/production/   served model alias
reports/           metrics · figures · evaluation report
```

## Limitations (honest)

- AI4I is **synthetic**, not a live plant stream  
- `UDI` is a sequence proxy, not a wall-clock timestamp  
- Rare failures → F1 / PR-AUC matter more than accuracy  

## Contact

mohammad.ahmadian.dev@gmail.com · [github.com/ahmadian-dev](https://github.com/ahmadian-dev) · Turkey (GMT+3)

## License

MIT — see [LICENSE](LICENSE). Dataset: CC BY 4.0 (UCI AI4I 2020).
