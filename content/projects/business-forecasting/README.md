# Enterprise Business Analytics & Forecasting Platform

![Status](https://img.shields.io/badge/status-released-brightgreen)
![Python](https://img.shields.io/badge/python-3.11+-blue)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

**Mohammad Ahmadian — AI / Machine Learning Engineer**  
**Target roles:** Data Scientist · Analytics Engineer

Enterprise-Grade Analytics, Forecasting and Decision Support System

> Hiring managers: [Demo Website](presentation/demo-website/index.html) · [Dashboard](presentation/dashboard/index.html) · [Architecture](presentation/architecture/architecture.html) · [Presentation pack](presentation/README.md)

## Recruiter snapshot

| Item | Detail |
|------|--------|
| Domain | Business Intelligence · Analytics · Forecasting · Decision Support |
| Capabilities | KPI panel · chronological split · lag/rolling features · baselines vs LightGBM · MAPE/RMSE · FastAPI |
| Serving | `/health` · `/v1/series` · `/v1/forecast` · `/v1/metrics` |
| Integrity | Chronological splits · baseline comparison · seeded panel honesty |

### Test metrics (chronological holdout)

| Model | MAPE | RMSE | MAE |
|-------|-----:|-----:|----:|
| Seasonal naive | 0.074 | 4.20 | 3.29 |
| Moving average | 0.079 | 4.28 | 3.46 |
| **Primary LightGBM** | **0.055** | **3.17** | **2.46** |

Full report: [`reports/EVALUATION_REPORT.md`](reports/EVALUATION_REPORT.md)

## Architecture

![System architecture (Released)](presentation/architecture/architecture-diagram.png)

*Figure 1. System architecture (Released).*

## Quick start

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt

set PYTHONPATH=src
python scripts/build_or_download_panel.py
python scripts/train_and_eval.py
uvicorn forecast.api.main:app --app-dir src --host 0.0.0.0 --port 8000
# http://localhost:8000/docs
```

### Example forecast

```bash
curl -s -X POST http://localhost:8000/v1/forecast ^
  -H "Content-Type: application/json" ^
  -d "{\"store_id\":\"S01\",\"sku_id\":\"SKU-100\",\"horizon_days\":14,\"model\":\"primary\"}"
```

## Documentation

[`docs/00_MASTER_INDEX.md`](docs/00_MASTER_INDEX.md) · Status: [`docs/status.md`](docs/status.md)

Doc 13 is **Forecasting Pipeline** (project-specific; same numbering DNA as Projects 1–2).

## Limitations (honest)

- Seeded synthetic daily sales panel — methodology demo, not a live ERP extract  
- One-step tabular evaluation on holdout; recursive multi-step used at serving  
- Metrics above are from a real training run  

## Contact

mohammad.ahmadian.dev@gmail.com · [github.com/ahmadian-dev](https://github.com/ahmadian-dev) · Turkey (GMT+3)

## License

MIT — see [LICENSE](LICENSE).
