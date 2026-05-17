from __future__ import annotations

import csv
import json
import shutil
from pathlib import Path
from types import SimpleNamespace

from flask import render_template, request

from app import (
    CONTENT_PAGES,
    FACTOR_FIELDS,
    FILTER_FIELDS,
    UI_TEXT,
    active_filter_summary,
    app,
    build_analysis,
    build_filter_options,
    build_home_context,
    fetch_all_responses,
)


BASE_DIR = Path(__file__).resolve().parent
DOCS_DIR = BASE_DIR / "docs"
STATIC_DIR = DOCS_DIR / "static"
DATA_DIR = DOCS_DIR / "data"

PAGE_MAP = {
    "index": ("index.html", "/"),
    "about": ("about.html", "/about"),
    "theory": ("theory.html", "/theory"),
    "methodology": ("methodology.html", "/methodology"),
    "survey": ("survey.html", "/survey"),
    "dashboard": ("dashboard.html", "/dashboard"),
    "results": ("results.html", "/results"),
    "recommendations": ("recommendations.html", "/recommendations"),
    "report": ("report.html", "/report"),
    "export_csv": ("data/banking_satisfaction_all.csv", "/export/csv"),
}


def tr(key: str) -> str:
    return UI_TEXT["en"].get(key, key)


def static_url_for(endpoint: str, **values) -> str:
    if endpoint == "static":
        return f"static/{values['filename']}"
    return PAGE_MAP.get(endpoint, ("index.html", "/"))[0]


def static_url_lang(endpoint: str, **values) -> str:
    return static_url_for(endpoint, **values)


def render_page(endpoint: str, template_name: str, **context) -> str:
    path = PAGE_MAP[endpoint][1]
    with app.test_request_context(path):
        request.url_rule = SimpleNamespace(endpoint=endpoint)
        return render_template(
            template_name,
            tr=tr,
            url_lang=static_url_lang,
            url_for=static_url_for,
            ui_text=UI_TEXT["en"],
            current_lang="en",
            app_static=True,
            app_base_path="./",
            **context,
        )


def export_pages() -> None:
    pages = {
        "index": ("index.html", {"home": build_home_context()}),
        "about": ("content.html", {"page": CONTENT_PAGES["about"]}),
        "theory": ("content.html", {"page": CONTENT_PAGES["theory"]}),
        "methodology": ("content.html", {"page": CONTENT_PAGES["methodology"]}),
        "survey": (
            "survey.html",
            {
                "survey_meta": {
                    "total_responses": build_analysis()["total_responses"],
                    "factor_count": len(FACTOR_FIELDS),
                    "banks": build_filter_options()["bank_name"],
                }
            },
        ),
        "dashboard": ("dashboard.html", {"filter_fields": FILTER_FIELDS}),
        "results": ("content.html", {"page": CONTENT_PAGES["results"]}),
        "recommendations": ("content.html", {"page": CONTENT_PAGES["recommendations"]}),
        "report": (
            "report.html",
            {
                "analysis": build_analysis(),
                "filter_summary": active_filter_summary({}),
            },
        ),
    }
    for endpoint, (template_name, context) in pages.items():
        output_path = DOCS_DIR / PAGE_MAP[endpoint][0]
        output_path.write_text(render_page(endpoint, template_name, **context), encoding="utf-8")


def export_data() -> None:
    analysis = build_analysis()
    responses = [dict(row) for row in fetch_all_responses({})]

    (DATA_DIR / "analysis.json").write_text(json.dumps(analysis, indent=2), encoding="utf-8")
    (DATA_DIR / "responses.json").write_text(json.dumps({"responses": responses}, indent=2), encoding="utf-8")

    with (DATA_DIR / "banking_satisfaction_all.csv").open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle)
        writer.writerow(
            [
                "ID",
                "Full Name",
                "Age",
                "Gender",
                "Bank Name",
                "Usage Frequency",
                "Tangibles",
                "Reliability",
                "Responsiveness",
                "Assurance",
                "Empathy",
                "Security",
                "Digital Convenience",
                "Overall Satisfaction",
                "Comment",
                "Created At",
            ]
        )
        for row in responses:
            writer.writerow(
                [
                    row["id"],
                    row["full_name"],
                    row["age"],
                    row["gender"],
                    row["bank_name"],
                    row["usage_frequency"],
                    row["tangibles"],
                    row["reliability"],
                    row["responsiveness"],
                    row["assurance"],
                    row["empathy"],
                    row["security"],
                    row["digital_convenience"],
                    row["overall_satisfaction"],
                    row["comment"],
                    row["created_at"],
                ]
            )


def main() -> None:
    if DOCS_DIR.exists():
        shutil.rmtree(DOCS_DIR)
    DOCS_DIR.mkdir()
    STATIC_DIR.mkdir()
    DATA_DIR.mkdir()

    shutil.copytree(BASE_DIR / "static", STATIC_DIR, dirs_exist_ok=True)
    export_pages()
    export_data()
    (DOCS_DIR / ".nojekyll").write_text("", encoding="utf-8")


if __name__ == "__main__":
    main()
