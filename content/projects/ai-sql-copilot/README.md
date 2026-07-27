# AI SQL Copilot

![Status](https://img.shields.io/badge/status-released-brightgreen)
![Python](https://img.shields.io/badge/python-3.11+-blue)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

**Mohammad Ahmadian — AI / Machine Learning Engineer**  
**Target roles:** Data Engineer · Analytics Engineer · AI Engineer

Enterprise-Grade Natural Language to SQL and Analytics Assistant

> Hiring managers: [Demo Website](presentation/demo-website/index.html) · [Dashboard](presentation/dashboard/index.html) · [Architecture](presentation/architecture/architecture.html) · [Presentation pack](presentation/README.md)

## Positioning

This is **not** a SQL chatbot.  
It is an **enterprise analytics assistant**: schema-aware NL→SQL, validation/safety gates, explainable queries, and secure read-oriented execution.

## Recruiter snapshot

| Item | Detail |
|------|--------|
| Domain | NL→SQL · Database intelligence · Analytics copilot |
| Capabilities | Schema catalog · generate · validate · explain · safe execute |
| Serving | `/health` · `/v1/schema` · `/v1/generate` · `/v1/explain` · `/v1/execute` |
| Integrity | SELECT-only · banlist · LIMIT · sample demo DB honesty |

### Evaluation (labeled fixtures)

| Metric | Value |
|--------|------:|
| Execution accuracy | **1.000** |
| Syntax valid rate | **1.000** |
| Safety block rate | **1.000** |

Full report: [`reports/EVALUATION_REPORT.md`](reports/EVALUATION_REPORT.md)

## Architecture

![System architecture (Released)](presentation/architecture/architecture-diagram.png)

## Quick start

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt

set PYTHONPATH=src
python scripts/bootstrap_demo_db.py
python scripts/run_eval.py
uvicorn sqlcopilot.api.main:app --app-dir src --host 0.0.0.0 --port 8000
# http://localhost:8000/docs
```

## Documentation

[`docs/00_MASTER_INDEX.md`](docs/00_MASTER_INDEX.md) · Doc 13: **SQL Generation Pipeline**

## Limitations (honest)

- Sample demo analytics DB — not a customer warehouse  
- Offline mode uses deterministic schema-grounded fallback (honest `mode=fallback`)  
- Optional LLM adapter when `LLM_API_KEY` is set  

## Contact

mohammad.ahmadian.dev@gmail.com · [github.com/ahmadian-dev](https://github.com/ahmadian-dev) · Turkey (GMT+3)

## License

MIT — see [LICENSE](LICENSE).
