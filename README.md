# Banking Satisfaction Thesis Website

This project is a thesis-style website for:

`A Web-Based Customer Satisfaction Analysis System for Banking Services`

## Deploy Online

This repository is configured for deployment on Render.

- Service name: `aaa-banking-thesis`
- Build command: `pip install -r requirements.txt`
- Start command: `gunicorn app:app`
- Python version: `3.11.11`

Deployment note:
- The project uses SQLite at `data/banking_research.db`.
- Survey responses can work online, but SQLite on a cloud web service is best for demos and small-scale use.
- Data may reset when the instance is rebuilt or restarted unless you later move to a persistent database.

## Project Structure

```text
paper 3/
|-- app.py
|-- requirements.txt
|-- README.md
|-- data/
|   `-- banking_research.db
|-- templates/
|   |-- base.html
|   |-- index.html
|   |-- content.html
|   |-- survey.html
|   `-- dashboard.html
`-- static/
    |-- css/
    |   `-- style.css
    `-- js/
        |-- main.js
        |-- survey.js
        `-- dashboard.js
```

## Features

- Thesis background, theory, methodology, results, recommendations, and conclusion pages
- Survey form for collecting banking customer satisfaction responses
- SQLite database for storing responses
- Dashboard with response count, factor means, bank distribution, and comments
- Python Flask backend with HTML, CSS, and JavaScript frontend

## Run Locally

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Start the app:

```bash
python app.py
```

3. Open in your browser:

```text
http://127.0.0.1:5000
```
