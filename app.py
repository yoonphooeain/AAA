from __future__ import annotations

import csv
import io
import sqlite3
from pathlib import Path
from statistics import mean

from flask import Flask, jsonify, render_template, request, Response, url_for


BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "data" / "banking_research.db"

FACTOR_FIELDS = [
    "tangibles",
    "reliability",
    "responsiveness",
    "assurance",
    "empathy",
    "security",
    "digital_convenience",
    "overall_satisfaction",
]

FIELD_LABELS = {
    "tangibles": "Tangibles",
    "reliability": "Reliability",
    "responsiveness": "Responsiveness",
    "assurance": "Assurance",
    "empathy": "Empathy",
    "security": "Security",
    "digital_convenience": "Digital Convenience",
    "overall_satisfaction": "Overall Satisfaction",
}

FILTER_FIELDS = {
    "bank_name": "Bank",
    "gender": "Gender",
    "usage_frequency": "Usage Frequency",
}

SUPPORTED_LANGS = {"en", "my"}

UI_TEXT = {
    "en": {
        "site_title": "Banking Satisfaction Research",
        "brand_eyebrow": "Thesis Website",
        "brand_name": "Banking Satisfaction Analysis System",
        "nav_home": "Home",
        "nav_study": "Study",
        "nav_analysis": "Analysis",
        "nav_about": "About",
        "nav_theory": "Theory",
        "nav_methodology": "Methodology",
        "nav_survey": "Survey",
        "nav_dashboard": "Dashboard",
        "nav_report": "Report",
        "nav_results": "Results",
        "nav_recommendations": "Recommendations",
        "nav_admin": "Admin",
        "nav_logout": "Logout",
        "lang_en": "English",
        "lang_my": "မြန်မာ",
        "footer_title": "A Web-Based Customer Satisfaction Analysis System for Banking Services",
        "footer_subtitle": "Built with HTML, CSS, JavaScript, and Python.",
        "hero_eyebrow": "Research-Driven Website",
        "hero_intro": "This thesis website transforms the study into a working research platform. It explains the theories, presents the methodology, collects customer responses, and displays service-quality analysis through a dashboard.",
        "start_survey": "Start Survey",
        "view_analysis": "View Analysis",
        "study_focus": "Study Focus",
        "research_product": "Research Meets Product Design",
        "current_top_factor": "Current top factor",
        "no_data_yet": "No data yet",
        "dashboard_auto_updates": "The dashboard updates automatically when new survey responses are submitted.",
        "website_modules": "Website Modules",
        "what_system_includes": "What This System Includes",
        "research_architecture": "Research Architecture",
        "how_supports_thesis": "How The Website Supports The Thesis",
        "academic_flow": "Academic Flow",
        "system_outputs": "System Outputs",
        "research_path": "Research Path",
        "suggested_workflow": "Suggested Workflow",
        "quick_start": "Quick Start",
        "three_moves": "Use The Website In Three Moves",
        "open_theory": "Open Theory",
        "open_survey": "Open Survey",
        "open_dashboard": "Open Dashboard",
        "research_section": "Research Section",
        "section_summary": "Section Summary",
        "key_takeaways": "Key Takeaways",
        "what_section_adds": "What This Section Adds To The Thesis",
        "takeaway": "Takeaway",
        "data_collection": "Data Collection",
        "survey_form_title": "Customer Satisfaction Survey Form",
        "survey_form_intro": "Use this form to collect quantitative responses from bank customers. All rating fields use a 1 to 5 scale.",
        "survey_snapshot": "Survey Snapshot",
        "current_responses": "Current Responses",
        "measured_factors": "Measured Factors",
        "available_banks": "Available Banks",
        "form_progress": "Form Progress",
        "section_1": "Section 1",
        "respondent_profile": "Respondent Profile",
        "full_name_optional": "Full Name (Optional)",
        "enter_name": "Enter name",
        "age": "Age",
        "enter_age": "Enter age",
        "gender": "Gender",
        "bank_name": "Bank Name",
        "usage_frequency": "Usage Frequency",
        "select": "Select",
        "male": "Male",
        "female": "Female",
        "other": "Other",
        "daily": "Daily",
        "weekly": "Weekly",
        "monthly": "Monthly",
        "occasionally": "Occasionally",
        "section_2": "Section 2",
        "service_quality_ratings": "Service Quality Ratings",
        "additional_comment": "Additional Comment",
        "comment_placeholder": "Write a short comment about your banking experience",
        "submit_survey": "Submit Survey",
        "go_to_dashboard": "Go to Dashboard",
        "method_reminder": "Method Reminder",
        "best_practice": "Best practice for your thesis",
        "analysis_dashboard": "Analysis Dashboard",
        "customer_satisfaction_analysis": "Customer Satisfaction Data Analysis",
        "dashboard_intro": "This dashboard summarizes responses collected through the website survey and converts them into research-ready insights.",
        "filter_dataset": "Filter the Dataset",
        "review_patterns": "Review patterns by respondent group",
        "all": "All",
        "apply_filters": "Apply Filters",
        "reset": "Reset",
        "export_csv": "Export CSV",
        "open_pdf_report": "Open PDF Report",
        "interpretation_snapshot": "Interpretation Snapshot",
        "discussion_statements": "Quick statements you can use in discussion",
        "service_factor_means": "Service Factor Means",
        "avg_score_chartjs": "Average score out of 5 with Chart.js visualization",
        "bank_distribution": "Bank Distribution",
        "respondent_count_by_bank": "Respondent count by bank",
        "satisfaction_levels": "Satisfaction Levels",
        "distribution_overall": "Distribution of overall satisfaction",
        "recent_comments": "Recent Comments",
        "latest_observations": "Latest respondent observations",
        "printable_report": "Printable Report",
        "analysis_report": "Customer Satisfaction Analysis Report",
        "report_intro": "This page is optimized for print-to-PDF export. Use your browser print dialog to save the report as PDF.",
        "filter_label": "Filter",
        "print_save_pdf": "Print / Save as PDF",
        "summary": "Summary",
        "total_responses": "Total Responses",
        "overall_mean": "Overall Mean",
        "top_factor": "Top Factor",
        "weakest_factor": "Weakest Factor",
        "factor_means": "Factor Means",
        "service_quality_summary": "Service Quality Summary",
        "selected_comments": "Selected Respondent Notes",
        "submitting_survey": "Submitting survey...",
        "submit_success": "Survey submitted successfully.",
        "progress_required": "{completed} of {total} required fields completed",
        "insight": "Insight",
        "empty_state_title": "No data for the selected view",
        "empty_state_body": "Try changing the filters or collect more survey responses first.",
        "comparison_analysis": "Comparison Analysis",
        "comparison_intro": "Quick comparisons across banks, gender groups, and usage frequency.",
        "bank_comparison": "Bank Comparison",
        "gender_comparison": "Gender Comparison",
        "usage_comparison": "Usage Comparison",
        "validation_required": "{field} is required.",
        "validation_age_number": "Age must be a valid number.",
        "validation_age_range": "Age must be between 15 and 100.",
        "validation_score_number": "{field} must be a number.",
        "validation_score_range": "{field} must be between 1 and 5.",
        "validation_comment_length": "Comment should be 300 characters or fewer.",
        "validation_fix_form": "Please correct the highlighted fields before submitting.",
    },
    "my": {
        "site_title": "ဘဏ်ဝန်ဆောင်မှု ကျေနပ်မှု သုတေသန",
        "brand_eyebrow": "Thesis Website",
        "brand_name": "Banking Satisfaction Analysis System",
        "nav_home": "ပင်မစာမျက်နှာ",
        "nav_study": "Study",
        "nav_analysis": "Analysis",
        "nav_about": "အကြောင်းအရာ",
        "nav_theory": "သီအိုရီ",
        "nav_methodology": "Methodology",
        "nav_survey": "စစ်တမ်း",
        "nav_dashboard": "Dashboard",
        "nav_report": "အစီရင်ခံစာ",
        "nav_results": "Results",
        "nav_recommendations": "အကြံပြုချက်များ",
        "nav_admin": "Admin",
        "nav_logout": "Logout",
        "lang_en": "English",
        "lang_my": "မြန်မာ",
        "footer_title": "A Web-Based Customer Satisfaction Analysis System for Banking Services",
        "footer_subtitle": "HTML, CSS, JavaScript, နှင့် Python ဖြင့်တည်ဆောက်ထားသည်။",
        "hero_eyebrow": "သုတေသနအခြေပြု Website",
        "hero_intro": "ဒီ thesis website က study ကို အလုပ်လုပ်နိုင်တဲ့ research platform အဖြစ် ပြောင်းပေးပါတယ်။ Theory, methodology, survey data collection, and dashboard analysis အားလုံးကို တစ်နေရာတည်းမှာ ပြပေးပါတယ်။",
        "start_survey": "စစ်တမ်းစတင်ရန်",
        "view_analysis": "Analysis ကြည့်ရန်",
        "study_focus": "Study Focus",
        "research_product": "Research Meets Product Design",
        "current_top_factor": "လက်ရှိ အကောင်းဆုံး factor",
        "no_data_yet": "ဒေတာမရှိသေးပါ",
        "dashboard_auto_updates": "Survey response အသစ်ထည့်လိုက်တိုင်း dashboard က အလိုအလျောက် update ဖြစ်ပါတယ်။",
        "website_modules": "Website Modules",
        "what_system_includes": "ဒီ System မှာ ပါဝင်တာတွေ",
        "research_architecture": "Research Architecture",
        "how_supports_thesis": "ဒီ Website က Thesis ကို ဘယ်လိုထောက်ပံ့သလဲ",
        "academic_flow": "Academic Flow",
        "system_outputs": "System Outputs",
        "research_path": "Research Path",
        "suggested_workflow": "အကြံပြု Workflow",
        "quick_start": "Quick Start",
        "three_moves": "Website ကို အဆင့် ၃ ဆင့်နဲ့အသုံးပြုမယ်",
        "open_theory": "Theory ဖွင့်ရန်",
        "open_survey": "Survey ဖွင့်ရန်",
        "open_dashboard": "Dashboard ဖွင့်ရန်",
        "research_section": "သုတေသနအပိုင်း",
        "section_summary": "Section Summary",
        "key_takeaways": "အဓိက Takeaways",
        "what_section_adds": "ဒီ section က thesis ကို ဘာထပ်ဖြည့်ပေးလဲ",
        "takeaway": "Takeaway",
        "data_collection": "ဒေတာစုဆောင်းခြင်း",
        "survey_form_title": "Customer Satisfaction Survey Form",
        "survey_form_intro": "ဒီ form ကို bank customers တွေဆီက quantitative responses စုဆောင်းဖို့ အသုံးပြုနိုင်ပါတယ်။ Rating fields အားလုံး 1 မှ 5 scale သုံးထားပါတယ်။",
        "survey_snapshot": "Survey Snapshot",
        "current_responses": "လက်ရှိ Responses",
        "measured_factors": "တိုင်းတာမည့် Factors",
        "available_banks": "အသုံးပြုနိုင်သော Banks",
        "form_progress": "Form Progress",
        "section_1": "အပိုင်း ၁",
        "respondent_profile": "Respondent Profile",
        "full_name_optional": "အမည် (မဖြည့်လည်းရ)",
        "enter_name": "အမည်ထည့်ပါ",
        "age": "အသက်",
        "enter_age": "အသက်ထည့်ပါ",
        "gender": "လိင်",
        "bank_name": "ဘဏ်အမည်",
        "usage_frequency": "အသုံးပြုမှုအကြိမ်နှုန်း",
        "select": "ရွေးပါ",
        "male": "ကျား",
        "female": "မ",
        "other": "အခြား",
        "daily": "နေ့စဉ်",
        "weekly": "အပတ်စဉ်",
        "monthly": "လစဉ်",
        "occasionally": "အခါအားလျော်စွာ",
        "section_2": "အပိုင်း ၂",
        "service_quality_ratings": "Service Quality Ratings",
        "additional_comment": "အပိုမှတ်ချက်",
        "comment_placeholder": "သင့် bank experience အကြောင်း အတိုချုံးရေးပါ",
        "submit_survey": "Survey ပို့ရန်",
        "go_to_dashboard": "Dashboard သို့သွားရန်",
        "method_reminder": "Method Reminder",
        "best_practice": "Thesis အတွက် သင့်တော်သော နည်းလမ်း",
        "analysis_dashboard": "Analysis Dashboard",
        "customer_satisfaction_analysis": "Customer Satisfaction Data Analysis",
        "dashboard_intro": "ဒီ dashboard က website survey ကနေစုဆောင်းထားတဲ့ responses တွေကို သုတေသနအသုံးချနိုင်တဲ့ insights အဖြစ် ပြောင်းပေးပါတယ်။",
        "filter_dataset": "Dataset ကို Filter လုပ်ရန်",
        "review_patterns": "Respondent group အလိုက် pattern ကိုကြည့်ပါ",
        "all": "အားလုံး",
        "apply_filters": "Filters အသုံးပြုရန်",
        "reset": "Reset",
        "export_csv": "CSV ထုတ်ရန်",
        "open_pdf_report": "PDF Report ဖွင့်ရန်",
        "interpretation_snapshot": "Interpretation Snapshot",
        "discussion_statements": "Discussion မှာသုံးနိုင်တဲ့ အတိုချုံး statements",
        "service_factor_means": "Service Factor Means",
        "avg_score_chartjs": "Chart.js ဖြင့်ပြထားသော 5 မှတ်စနစ် average score",
        "bank_distribution": "Bank Distribution",
        "respondent_count_by_bank": "Bank အလိုက် respondent count",
        "satisfaction_levels": "Satisfaction Levels",
        "distribution_overall": "Overall satisfaction distribution",
        "recent_comments": "Recent Comments",
        "latest_observations": "နောက်ဆုံး respondent observations များ",
        "printable_report": "Printable Report",
        "analysis_report": "Customer Satisfaction Analysis Report",
        "report_intro": "ဒီ page ကို print-to-PDF export အတွက်ပြင်ထားပါတယ်။ Browser print dialog ကိုသုံးပြီး PDF အဖြစ်သိမ်းနိုင်ပါတယ်။",
        "filter_label": "Filter",
        "print_save_pdf": "Print / Save as PDF",
        "summary": "အနှစ်ချုပ်",
        "total_responses": "စုစုပေါင်း Responses",
        "overall_mean": "Overall Mean",
        "top_factor": "အကောင်းဆုံး Factor",
        "weakest_factor": "အားနည်းဆုံး Factor",
        "factor_means": "Factor Means",
        "service_quality_summary": "Service Quality Summary",
        "selected_comments": "Respondent မှတ်ချက်များ",
        "submitting_survey": "Survey ပို့နေသည်...",
        "submit_success": "Survey ကိုအောင်မြင်စွာပို့ပြီးပါပြီ။",
        "progress_required": "လိုအပ်သော fields {total} ခုအနက် {completed} ခု ဖြည့်ပြီးပါပြီ",
        "insight": "Insight",
        "empty_state_title": "ရွေးထားသော view အတွက် data မရှိပါ",
        "empty_state_body": "Filter ပြောင်းကြည့်ပါ သို့မဟုတ် survey responses ပိုစုဆောင်းပါ။",
        "comparison_analysis": "Comparison Analysis",
        "comparison_intro": "Bank, gender group, usage frequency အလိုက် အတိုချုံး comparison.",
        "bank_comparison": "Bank Comparison",
        "gender_comparison": "Gender Comparison",
        "usage_comparison": "Usage Comparison",
        "validation_required": "{field} ကို ဖြည့်ရန်လိုအပ်ပါသည်။",
        "validation_age_number": "အသက်ကို မှန်ကန်သော number ဖြင့်ထည့်ပါ။",
        "validation_age_range": "အသက်သည် 15 မှ 100 အတွင်းဖြစ်ရပါမည်။",
        "validation_score_number": "{field} သည် number ဖြစ်ရပါမည်။",
        "validation_score_range": "{field} သည် 1 မှ 5 အတွင်းဖြစ်ရပါမည်။",
        "validation_comment_length": "Comment သည် 300 characters ထက်မပိုရပါ။",
        "validation_fix_form": "Submit မလုပ်မီ highlighted fields များကိုပြင်ပါ။",
    },
}

CONTENT_PAGES = {
    "about": {
        "title": "About the Study",
        "subtitle": "Background, problem statement, objectives, research questions, and scope of the thesis website.",
        "image": "https://images.pexels.com/photos/669619/pexels-photo-669619.jpeg?cs=srgb&dl=pexels-goumbik-669619.jpg&fm=jpg",
        "image_caption": "A research-focused desk scene with printed notes, planning documents, and a realistic academic workspace.",
        "summary": "This section explains why customer satisfaction matters in banking research and what the study is trying to solve.",
        "highlights": [
            {"label": "Research Focus", "value": "Banking service quality"},
            {"label": "Core Problem", "value": "Uneven customer satisfaction"},
            {"label": "Dependent Variable", "value": "Overall customer satisfaction"},
        ],
        "sections": [
            {
                "heading": "Background of the Study",
                "body": (
                    "The banking sector is becoming more competitive, and customer satisfaction has become a key "
                    "indicator of service success. Banks no longer compete only through financial products. They also "
                    "compete through service experience, trust, convenience, and digital accessibility."
                ),
            },
            {
                "heading": "Problem Statement",
                "body": (
                    "Although banks provide a range of services, customers may still experience long waiting times, "
                    "inconsistent staff behavior, weak digital convenience, or security concerns. These issues may "
                    "reduce satisfaction and weaken customer loyalty."
                ),
            },
            {
                "heading": "Objectives of the Study",
                "body": (
                    "This study aims to examine the level of customer satisfaction in banking services, identify the "
                    "factors affecting satisfaction, and provide recommendations for improving banking service quality."
                ),
            },
            {
                "heading": "Research Questions",
                "body": (
                    "The study asks three main questions: What is the level of customer satisfaction in banking "
                    "services? Which service factors most strongly affect satisfaction? How can banks improve service "
                    "quality and increase satisfaction?"
                ),
            },
            {
                "heading": "Scope of the Study",
                "body": (
                    "The website focuses on selected bank customers and examines service quality factors such as "
                    "staff behavior, waiting time, security, and digital convenience. The main dependent variable is "
                    "customer satisfaction."
                ),
            },
        ],
        "takeaways": [
            "The study is grounded in a real service-quality problem.",
            "Customer satisfaction is relevant for both branch and digital banking.",
            "The website converts thesis concepts into a usable research workflow.",
        ],
    },
    "theory": {
        "title": "Theoretical Framework",
        "subtitle": "The website uses recognized service-quality and satisfaction theories to guide the analysis.",
        "image": "https://images.pexels.com/photos/9034223/pexels-photo-9034223.jpeg?cs=srgb&dl=pexels-rdne-9034223.jpg&fm=jpg",
        "image_caption": "A close analytical scene showing documents, highlighted content, and theory-style interpretation materials.",
        "summary": "The thesis combines one service-quality model and one satisfaction theory so that the analysis has both structure and explanation.",
        "highlights": [
            {"label": "Primary Model", "value": "SERVQUAL"},
            {"label": "Support Theory", "value": "Expectation Confirmation Theory"},
            {"label": "Framework Use", "value": "Interpret service ratings"},
        ],
        "sections": [
            {
                "heading": "SERVQUAL Model",
                "body": (
                    "SERVQUAL is used to measure service quality through five dimensions: tangibles, reliability, "
                    "responsiveness, assurance, and empathy. In this research, those dimensions are adapted to the "
                    "banking context to evaluate customer experience."
                ),
            },
            {
                "heading": "Expectation Confirmation Theory",
                "body": (
                    "Expectation Confirmation Theory explains satisfaction by comparing customer expectation with "
                    "actual experience. When banking services meet or exceed expectations, satisfaction increases. "
                    "When services fall below expectation, dissatisfaction emerges."
                ),
            },
            {
                "heading": "Conceptual Framework",
                "body": (
                    "Service-related factors such as tangibles, reliability, responsiveness, assurance, empathy, "
                    "security, and digital convenience act as independent variables, while customer satisfaction is "
                    "the dependent variable."
                ),
            },
        ],
        "takeaways": [
            "SERVQUAL measures how customers perceive service quality.",
            "ECT explains why expectations shape final satisfaction.",
            "Together, the theories support both analysis and discussion.",
        ],
    },
    "methodology": {
        "title": "Methodology",
        "subtitle": "The site is designed around quantitative research practice and survey-based data collection.",
        "image": "https://images.pexels.com/photos/5717716/pexels-photo-5717716.jpeg?cs=srgb&dl=pexels-karola-g-5717716.jpg&fm=jpg",
        "image_caption": "A structured planning scene with documents, checklists, and a realistic research-method workflow setup.",
        "summary": "This section shows how the website aligns with formal thesis methodology and turns research logic into a working system.",
        "highlights": [
            {"label": "Research Design", "value": "Quantitative"},
            {"label": "Collection Method", "value": "Survey questionnaire"},
            {"label": "Scale", "value": "5-point Likert"},
        ],
        "sections": [
            {
                "heading": "Research Design",
                "body": (
                    "The study uses a quantitative research design because customer perceptions can be captured in a "
                    "structured and measurable form through rating scales and statistical analysis."
                ),
            },
            {
                "heading": "Data Collection Method",
                "body": (
                    "A structured questionnaire is used to collect responses from bank customers. The survey captures "
                    "demographic information, usage patterns, and satisfaction ratings across multiple service factors."
                ),
            },
            {
                "heading": "Sampling Method",
                "body": (
                    "Convenience sampling is suitable for practical student research, although simple random sampling "
                    "can also be used if broader access to customers is available."
                ),
            },
            {
                "heading": "Analysis Techniques",
                "body": (
                    "The website supports frequency, percentage, mean, and comparison-based analysis. These techniques "
                    "allow the researcher to summarize satisfaction levels and identify service areas that need "
                    "improvement."
                ),
            },
        ],
        "takeaways": [
            "The questionnaire is the central data-collection tool.",
            "The dashboard is built for descriptive analysis and interpretation.",
            "The structure is suitable for a student thesis prototype.",
        ],
    },
    "results": {
        "title": "Results and Discussion",
        "subtitle": "This page explains how the collected survey data can be interpreted through service-quality theory.",
        "image": "https://images.pexels.com/photos/20726163/pexels-photo-20726163.jpeg?cs=srgb&dl=pexels-jakubzerdzicki-20726163.jpg&fm=jpg",
        "image_caption": "A real data-analysis scene featuring charts, metrics, and screen-based insight review suitable for thesis discussion.",
        "summary": "The results stage links measured scores to theory, practical interpretation, and thesis-style discussion writing.",
        "highlights": [
            {"label": "Main Output", "value": "Mean-based interpretation"},
            {"label": "Discussion Lens", "value": "Theory-supported explanation"},
            {"label": "Visual Output", "value": "Dashboard summaries"},
        ],
        "sections": [
            {
                "heading": "Interpreting Satisfaction Scores",
                "body": (
                    "High mean scores suggest strong satisfaction in a service area, while lower scores reveal areas "
                    "where customers may be frustrated or underserved."
                ),
            },
            {
                "heading": "Connecting Results to Theory",
                "body": (
                    "If reliability and responsiveness receive higher ratings, the findings support the SERVQUAL view "
                    "that dependable and responsive service shapes perceived quality. If ratings fall when customer "
                    "expectations are not met, the findings also support Expectation Confirmation Theory."
                ),
            },
            {
                "heading": "Using the Dashboard",
                "body": (
                    "The dashboard summarizes overall satisfaction, service-factor averages, respondent profiles, and "
                    "satisfaction level distribution. These outputs can be discussed directly in a thesis chapter or "
                    "presentation."
                ),
            },
        ],
        "takeaways": [
            "High means indicate strengths in service delivery.",
            "Low means identify where banks may need improvement.",
            "Discussion becomes stronger when tied back to theory.",
        ],
    },
    "recommendations": {
        "title": "Recommendations",
        "subtitle": "Practical actions banks can take after reviewing customer-satisfaction findings.",
        "image": "https://images.pexels.com/photos/7877030/pexels-photo-7877030.jpeg?cs=srgb&dl=pexels-karola-g-7877030.jpg&fm=jpg",
        "image_caption": "A realistic strategy-planning scene focused on decision-making, action points, and service improvement planning.",
        "summary": "Recommendations turn the analysis into action points that banks can actually use to improve service quality.",
        "highlights": [
            {"label": "Operational Focus", "value": "Speed and staffing"},
            {"label": "Human Focus", "value": "Training and courtesy"},
            {"label": "Digital Focus", "value": "Convenience and security"},
        ],
        "sections": [
            {
                "heading": "Improve Service Speed",
                "body": (
                    "Banks should reduce waiting time by managing queues better, assigning adequate staff, and "
                    "streamlining transaction processes."
                ),
            },
            {
                "heading": "Strengthen Staff Training",
                "body": (
                    "Customer-facing staff should receive training on communication, courtesy, and problem-solving so "
                    "that customers feel respected and supported."
                ),
            },
            {
                "heading": "Enhance Digital Convenience and Security",
                "body": (
                    "Mobile and online banking systems should be easy to use, stable, and secure. Clear guidance and "
                    "quick support can also improve customer confidence."
                ),
            },
        ],
        "takeaways": [
            "Recommendations should follow actual data patterns.",
            "Service improvement should cover both human and digital touchpoints.",
            "The website can help present recommendations clearly to supervisors.",
        ],
    },
}


app = Flask(__name__)


def get_lang() -> str:
    lang = str(request.args.get("lang", "en")).strip().lower()
    return lang if lang in SUPPORTED_LANGS else "en"


def tr(key: str) -> str:
    lang = get_lang()
    return UI_TEXT.get(lang, UI_TEXT["en"]).get(key, UI_TEXT["en"].get(key, key))


@app.context_processor
def inject_ui_helpers():
    def url_lang(endpoint: str, **values):
        if get_lang() != "en":
            values.setdefault("lang", get_lang())
        return url_for(endpoint, **values)

    return {
        "tr": tr,
        "url_lang": url_lang,
        "current_lang": get_lang(),
        "ui_text": UI_TEXT.get(get_lang(), UI_TEXT["en"]),
    }


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with get_connection() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS survey_responses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT,
                age INTEGER,
                gender TEXT NOT NULL,
                bank_name TEXT NOT NULL,
                usage_frequency TEXT NOT NULL,
                tangibles INTEGER NOT NULL,
                reliability INTEGER NOT NULL,
                responsiveness INTEGER NOT NULL,
                assurance INTEGER NOT NULL,
                empathy INTEGER NOT NULL,
                security INTEGER NOT NULL,
                digital_convenience INTEGER NOT NULL,
                overall_satisfaction INTEGER NOT NULL,
                comment TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            """
        )
        count = conn.execute("SELECT COUNT(*) AS total FROM survey_responses").fetchone()["total"]
        if count == 0:
            seed_sample_data(conn)


def seed_sample_data(conn: sqlite3.Connection) -> None:
    samples = [
        ("Aye Aye", 24, "Female", "KBZ Bank", "Weekly", 4, 4, 4, 4, 4, 5, 4, 4, "The mobile app is helpful."),
        ("Ko Min", 31, "Male", "AYA Bank", "Monthly", 3, 4, 3, 4, 3, 4, 3, 3, "Waiting time can be long."),
        ("Su Mon", 27, "Female", "CB Bank", "Weekly", 4, 5, 4, 4, 5, 4, 4, 5, "Staff are very polite."),
        ("Zaw Lin", 35, "Male", "KBZ Bank", "Weekly", 3, 3, 3, 3, 3, 4, 4, 3, "Branch service needs to be faster."),
        ("Thida", 29, "Female", "AYA Bank", "Daily", 4, 4, 5, 4, 4, 5, 5, 5, "Digital service is very convenient."),
        ("Nandar", 22, "Female", "CB Bank", "Monthly", 4, 3, 4, 4, 4, 4, 3, 4, "Good experience overall."),
        ("Myo Tun", 40, "Male", "UAB Bank", "Weekly", 3, 4, 4, 3, 3, 4, 3, 4, "Security is good."),
        ("May Thu", 26, "Female", "KBZ Bank", "Weekly", 5, 4, 4, 5, 4, 5, 4, 5, "Clean branch and good service."),
        ("Htet Aung", 33, "Male", "AYA Bank", "Monthly", 3, 4, 3, 4, 3, 4, 2, 3, "Online banking can improve."),
        ("Ei Ei", 28, "Female", "UAB Bank", "Weekly", 4, 4, 4, 4, 4, 5, 4, 4, "Service is dependable."),
        ("Ye Yint", 37, "Male", "CB Bank", "Monthly", 3, 3, 2, 3, 3, 4, 3, 3, "Queue is too long sometimes."),
        ("Hnin Pwint", 25, "Female", "KBZ Bank", "Daily", 5, 5, 4, 5, 5, 5, 5, 5, "I trust the service a lot."),
    ]
    conn.executemany(
        """
        INSERT INTO survey_responses (
            full_name, age, gender, bank_name, usage_frequency,
            tangibles, reliability, responsiveness, assurance, empathy,
            security, digital_convenience, overall_satisfaction, comment
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        samples,
    )


def normalize_filters(raw_filters: dict | None = None) -> dict[str, str]:
    raw_filters = raw_filters or {}
    normalized: dict[str, str] = {}
    for field in FILTER_FIELDS:
        value = str(raw_filters.get(field, "")).strip()
        if value and value.lower() != "all":
            normalized[field] = value
    return normalized


def fetch_all_responses(filters: dict | None = None) -> list[sqlite3.Row]:
    filters = normalize_filters(filters)
    query = """
        SELECT id, full_name, age, gender, bank_name, usage_frequency,
               tangibles, reliability, responsiveness, assurance, empathy,
               security, digital_convenience, overall_satisfaction, comment, created_at
        FROM survey_responses
    """
    params: list[str] = []
    if filters:
        clauses = [f"{field} = ?" for field in filters]
        query += " WHERE " + " AND ".join(clauses)
        params.extend(filters.values())
    query += " ORDER BY created_at DESC, id DESC"

    with get_connection() as conn:
        return conn.execute(query, params).fetchall()


def build_filter_options() -> dict[str, list[str]]:
    rows = fetch_all_responses()
    return {
        field: sorted({str(row[field]) for row in rows if str(row[field]).strip()})
        for field in FILTER_FIELDS
    }


def active_filter_summary(filters: dict[str, str]) -> str:
    if not filters:
        return "All responses"
    parts = [f"{FILTER_FIELDS[field]}: {value}" for field, value in filters.items()]
    return ", ".join(parts)


def build_analysis(filters: dict | None = None) -> dict:
    normalized_filters = normalize_filters(filters)
    rows = fetch_all_responses(normalized_filters)
    if not rows:
        return {
            "total_responses": 0,
            "overall_mean": 0,
            "factors": [],
            "bank_distribution": [],
            "satisfaction_levels": [],
            "recent_comments": [],
            "top_factor": None,
            "weakest_factor": None,
            "insights": [],
            "comparisons": {"banks": [], "genders": [], "usage": []},
            "filters": normalized_filters,
            "available_filters": build_filter_options(),
        }

    factor_means = []
    for field in FACTOR_FIELDS:
        scores = [row[field] for row in rows]
        factor_means.append(
            {
                "field": field,
                "label": FIELD_LABELS[field],
                "mean": round(mean(scores), 2),
                "percent": round((mean(scores) / 5) * 100, 1),
            }
        )

    factor_means.sort(key=lambda item: item["mean"], reverse=True)

    bank_counts: dict[str, int] = {}
    for row in rows:
        bank_counts[row["bank_name"]] = bank_counts.get(row["bank_name"], 0) + 1

    levels = {"High (4-5)": 0, "Moderate (3)": 0, "Low (1-2)": 0}
    for row in rows:
        score = row["overall_satisfaction"]
        if score >= 4:
            levels["High (4-5)"] += 1
        elif score == 3:
            levels["Moderate (3)"] += 1
        else:
            levels["Low (1-2)"] += 1

    comments = [
        {
            "name": row["full_name"] or "Anonymous",
            "bank": row["bank_name"],
            "comment": row["comment"],
        }
        for row in rows
        if row["comment"]
    ][:4]

    insights = [
        f"The strongest rated area is {factor_means[0]['label']} with a mean score of {factor_means[0]['mean']}.",
        f"The weakest rated area is {factor_means[-1]['label']} with a mean score of {factor_means[-1]['mean']}.",
        f"The current filtered sample reports an overall satisfaction mean of {round(mean([row['overall_satisfaction'] for row in rows]), 2)} out of 5.",
    ]

    def group_means(group_field: str) -> list[dict]:
        grouped: dict[str, list[int]] = {}
        for row in rows:
            label = str(row[group_field]).strip() or "Unknown"
            grouped.setdefault(label, []).append(int(row["overall_satisfaction"]))
        return [
            {
                "label": label,
                "mean": round(mean(scores), 2),
                "count": len(scores),
                "percent": round((mean(scores) / 5) * 100, 1),
            }
            for label, scores in sorted(grouped.items())
        ]

    return {
        "total_responses": len(rows),
        "overall_mean": round(mean([row["overall_satisfaction"] for row in rows]), 2),
        "factors": factor_means,
        "bank_distribution": [{"label": bank, "value": value} for bank, value in sorted(bank_counts.items())],
        "satisfaction_levels": [{"label": label, "value": value} for label, value in levels.items()],
        "recent_comments": comments,
        "top_factor": factor_means[0],
        "weakest_factor": factor_means[-1],
        "insights": insights,
        "comparisons": {
            "banks": group_means("bank_name"),
            "genders": group_means("gender"),
            "usage": group_means("usage_frequency"),
        },
        "filters": normalized_filters,
        "available_filters": build_filter_options(),
    }


def build_home_highlights() -> list[dict]:
    analysis = build_analysis()
    return [
        {"label": "Research Method", "value": "Quantitative Survey"},
        {"label": "Main Theory", "value": "SERVQUAL + ECT"},
        {"label": "Current Responses", "value": analysis["total_responses"]},
        {"label": "Overall Mean", "value": analysis["overall_mean"]},
    ]


def build_home_context() -> dict:
    analysis = build_analysis()
    return {
        "highlights": build_home_highlights(),
        "feature_cards": [
            {
                "title": "Research-Guided Structure",
                "body": "The pages follow a thesis flow from background and theory to methodology, results, and recommendations.",
            },
            {
                "title": "Interactive Data Collection",
                "body": "The survey form captures banking-service ratings that are immediately reflected in the dashboard.",
            },
            {
                "title": "Visual Data Interpretation",
                "body": "Analysis outputs help explain strong and weak service areas for academic discussion and presentations.",
            },
        ],
        "research_steps": [
            "Study the background, theory, and methodology pages.",
            "Collect responses from bank customers through the web form.",
            "Use filters and visual summaries to interpret the dataset.",
            "Turn the findings into thesis discussion and recommendations.",
        ],
        "analysis_snapshot": analysis,
    }


@app.route("/")
def index():
    return render_template("index.html", home=build_home_context())


@app.route("/about")
def about():
    return render_template("content.html", page=CONTENT_PAGES["about"])


@app.route("/theory")
def theory():
    return render_template("content.html", page=CONTENT_PAGES["theory"])


@app.route("/methodology")
def methodology():
    return render_template("content.html", page=CONTENT_PAGES["methodology"])


@app.route("/survey")
def survey():
    return render_template(
        "survey.html",
        survey_meta={
            "total_responses": build_analysis()["total_responses"],
            "factor_count": len(FACTOR_FIELDS),
            "banks": build_filter_options()["bank_name"],
        },
    )


@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html", filter_fields=FILTER_FIELDS)


@app.route("/results")
def results():
    return render_template("content.html", page=CONTENT_PAGES["results"])


@app.route("/recommendations")
def recommendations():
    return render_template("content.html", page=CONTENT_PAGES["recommendations"])


@app.route("/api/analysis")
def api_analysis():
    filters = {field: request.args.get(field, "") for field in FILTER_FIELDS}
    return jsonify(build_analysis(filters))


@app.route("/export/csv")
def export_csv():
    filters = normalize_filters({field: request.args.get(field, "") for field in FILTER_FIELDS})
    rows = fetch_all_responses(filters)
    output = io.StringIO()
    writer = csv.writer(output)
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
    for row in rows:
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

    filename_suffix = "-".join(value.replace(" ", "_") for value in filters.values()) if filters else "all"
    return Response(
        output.getvalue(),
        mimetype="text/csv",
        headers={"Content-Disposition": f"attachment; filename=banking_satisfaction_{filename_suffix}.csv"},
    )


@app.route("/report")
def report():
    filters = normalize_filters({field: request.args.get(field, "") for field in FILTER_FIELDS})
    analysis = build_analysis(filters)
    return render_template(
        "report.html",
        analysis=analysis,
        filter_summary=active_filter_summary(filters),
    )


@app.route("/api/responses", methods=["POST"])
def api_responses():
    payload = request.get_json(force=True)
    required_text = ["gender", "bank_name", "usage_frequency"]
    required_scores = FACTOR_FIELDS

    for field in required_text:
        if not str(payload.get(field, "")).strip():
            return jsonify({"ok": False, "message": tr("validation_required").replace("{field}", field)}), 400

    parsed_scores = {}
    for field in required_scores:
        try:
            value = int(payload.get(field, 0))
        except (TypeError, ValueError):
            return jsonify({"ok": False, "message": tr("validation_score_number").replace("{field}", field)}), 400
        if value < 1 or value > 5:
            return jsonify({"ok": False, "message": tr("validation_score_range").replace("{field}", field)}), 400
        parsed_scores[field] = value

    age = payload.get("age")
    age_value = None
    if str(age).strip():
        try:
            age_value = int(age)
        except (TypeError, ValueError):
            return jsonify({"ok": False, "message": tr("validation_age_number")}), 400
        if age_value < 15 or age_value > 100:
            return jsonify({"ok": False, "message": tr("validation_age_range")}), 400

    comment_value = str(payload.get("comment", "")).strip()
    if len(comment_value) > 300:
        return jsonify({"ok": False, "message": tr("validation_comment_length")}), 400

    with get_connection() as conn:
        conn.execute(
            """
            INSERT INTO survey_responses (
                full_name, age, gender, bank_name, usage_frequency,
                tangibles, reliability, responsiveness, assurance, empathy,
                security, digital_convenience, overall_satisfaction, comment
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                str(payload.get("full_name", "")).strip(),
                age_value,
                str(payload["gender"]).strip(),
                str(payload["bank_name"]).strip(),
                str(payload["usage_frequency"]).strip(),
                parsed_scores["tangibles"],
                parsed_scores["reliability"],
                parsed_scores["responsiveness"],
                parsed_scores["assurance"],
                parsed_scores["empathy"],
                parsed_scores["security"],
                parsed_scores["digital_convenience"],
                parsed_scores["overall_satisfaction"],
                comment_value,
            ),
        )
        conn.commit()

    return jsonify(
        {
            "ok": True,
            "message": "Survey submitted successfully.",
            "analysis": build_analysis(),
        }
    )


@app.route("/api/project-structure")
def api_project_structure():
    structure = {
        "backend": ["app.py", "data/banking_research.db"],
        "templates": ["base.html", "index.html", "content.html", "survey.html", "dashboard.html"],
        "static": ["static/css/style.css", "static/js/main.js", "static/js/survey.js", "static/js/dashboard.js"],
    }
    return jsonify(structure)


init_db()


if __name__ == "__main__":
    app.run(debug=True)
