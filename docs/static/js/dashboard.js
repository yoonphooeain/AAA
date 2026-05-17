function makeBarItem(label, valueText, percent) {
  return `
    <article class="bar-item">
      <header>
        <span>${label}</span>
        <strong>${valueText}</strong>
      </header>
      <div class="bar-track">
        <div class="bar-fill" style="width: ${percent}%"></div>
      </div>
    </article>
  `;
}

function toQueryString(filters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  if (window.APP_LANG && window.APP_LANG !== "en") {
    params.set("lang", window.APP_LANG);
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}

const chartPalette = {
  green: "rgba(26, 143, 103, 0.82)",
  greenSoft: "rgba(26, 143, 103, 0.18)",
  deep: "rgba(17, 98, 74, 0.95)",
  gold: "rgba(214, 168, 61, 0.86)",
  goldSoft: "rgba(214, 168, 61, 0.18)",
  coral: "rgba(232, 111, 91, 0.86)",
  coralSoft: "rgba(232, 111, 91, 0.18)",
  ink: "#1d221d",
  muted: "#647067",
  grid: "rgba(29, 34, 29, 0.08)",
};

const STATIC_STORAGE_KEY = "aaa_static_survey_responses";
const FACTOR_FIELDS = [
  ["tangibles", "Tangibles"],
  ["reliability", "Reliability"],
  ["responsiveness", "Responsiveness"],
  ["assurance", "Assurance"],
  ["empathy", "Empathy"],
  ["security", "Security"],
  ["digital_convenience", "Digital Convenience"],
  ["overall_satisfaction", "Overall Satisfaction"],
];

document.addEventListener("DOMContentLoaded", async () => {
  const appText = window.APP_TEXT || {};
  const isStatic = Boolean(window.APP_STATIC);
  const summaryGrid = document.getElementById("summary-grid");
  const factorBars = document.getElementById("factor-bars");
  const bankList = document.getElementById("bank-list");
  const levelList = document.getElementById("level-list");
  const commentList = document.getElementById("comment-list");
  const insightList = document.getElementById("insight-list");
  const bankComparison = document.getElementById("bank-comparison");
  const genderComparison = document.getElementById("gender-comparison");
  const usageComparison = document.getElementById("usage-comparison");
  const filterSelects = Array.from(document.querySelectorAll(".dashboard-filter"));
  const applyButton = document.getElementById("apply-filters");
  const resetButton = document.getElementById("reset-filters");
  const csvExport = document.getElementById("csv-export");
  const pdfExport = document.getElementById("pdf-export");

  if (!summaryGrid) return;

  const chartNodes = {
    factor: document.getElementById("factor-chart"),
    bank: document.getElementById("bank-chart"),
    level: document.getElementById("level-chart"),
  };

  const chartInstances = {
    factor: null,
    bank: null,
    level: null,
  };

  let latestRows = [];
  let staticSeedRows = [];

  function populateFilters(options) {
    filterSelects.forEach((select) => {
      const field = select.dataset.filter;
      const currentValue = select.value;
      const optionHtml = (options[field] || [])
        .map((value) => `<option value="${value}">${value}</option>`)
        .join("");
      const label = select.options[0].textContent;
      select.innerHTML = `<option value="">${label}</option>${optionHtml}`;
      select.value = currentValue;
    });
  }

  function baseChartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: chartPalette.ink,
            font: {
              family: "Plus Jakarta Sans",
              size: 12,
            },
          },
        },
        tooltip: {
          titleFont: { family: "Plus Jakarta Sans" },
          bodyFont: { family: "Plus Jakarta Sans" },
        },
      },
    };
  }

  function destroyChart(key) {
    if (chartInstances[key]) {
      chartInstances[key].destroy();
      chartInstances[key] = null;
    }
  }

  function renderCharts(data) {
    if (typeof Chart === "undefined") return;

    destroyChart("factor");
    destroyChart("bank");
    destroyChart("level");

    chartInstances.factor = new Chart(chartNodes.factor, {
      type: "bar",
      data: {
        labels: data.factors.map((item) => item.label),
        datasets: [
          {
            label: "Mean Score",
            data: data.factors.map((item) => item.mean),
            backgroundColor: [
              chartPalette.green,
              chartPalette.deep,
              chartPalette.gold,
              chartPalette.coral,
              "rgba(91, 122, 222, 0.82)",
              "rgba(118, 85, 173, 0.82)",
              "rgba(57, 166, 180, 0.82)",
              "rgba(103, 120, 103, 0.82)",
            ],
            borderRadius: 10,
            borderSkipped: false,
          },
        ],
      },
      options: {
        ...baseChartOptions(),
        scales: {
          y: {
            beginAtZero: true,
            max: 5,
            ticks: {
              color: chartPalette.muted,
              font: { family: "Plus Jakarta Sans" },
            },
            grid: { color: chartPalette.grid },
          },
          x: {
            ticks: {
              color: chartPalette.muted,
              font: { family: "Plus Jakarta Sans" },
            },
            grid: { display: false },
          },
        },
        plugins: {
          ...baseChartOptions().plugins,
          legend: { display: false },
        },
      },
    });

    chartInstances.bank = new Chart(chartNodes.bank, {
      type: "bar",
      data: {
        labels: data.bank_distribution.map((item) => item.label),
        datasets: [
          {
            label: "Respondents",
            data: data.bank_distribution.map((item) => item.value),
            backgroundColor: chartPalette.greenSoft,
            borderColor: chartPalette.deep,
            borderWidth: 2,
            borderRadius: 12,
            borderSkipped: false,
          },
        ],
      },
      options: {
        ...baseChartOptions(),
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
              color: chartPalette.muted,
              font: { family: "Plus Jakarta Sans" },
            },
            grid: { color: chartPalette.grid },
          },
          x: {
            ticks: {
              color: chartPalette.muted,
              font: { family: "Plus Jakarta Sans" },
            },
            grid: { display: false },
          },
        },
        plugins: {
          ...baseChartOptions().plugins,
          legend: { display: false },
        },
      },
    });

    chartInstances.level = new Chart(chartNodes.level, {
      type: "doughnut",
      data: {
        labels: data.satisfaction_levels.map((item) => item.label),
        datasets: [
          {
            data: data.satisfaction_levels.map((item) => item.value),
            backgroundColor: [chartPalette.green, chartPalette.gold, chartPalette.coral],
            borderColor: ["#ffffff", "#ffffff", "#ffffff"],
            borderWidth: 3,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        ...baseChartOptions(),
        cutout: "64%",
      },
    });
  }

  function renderDashboard(data) {
    const emptyMessage = `
      <article class="empty-state-card">
        <strong>${appText.empty_state_title || "No data for the selected view"}</strong>
        <p>${appText.empty_state_body || "Try changing the filters or collect more survey responses first."}</p>
      </article>
    `;

    summaryGrid.innerHTML = `
      <article class="stat-card">
        <span>${appText.total_responses || "Total Responses"}</span>
        <strong>${data.total_responses}</strong>
      </article>
      <article class="stat-card">
        <span>${appText.overall_mean || "Overall Mean"}</span>
        <strong>${data.overall_mean} / 5</strong>
      </article>
      <article class="stat-card">
        <span>${appText.top_factor || "Top Factor"}</span>
        <strong>${data.top_factor ? data.top_factor.label : "-"}</strong>
      </article>
      <article class="stat-card">
        <span>${appText.weakest_factor || "Weakest Factor"}</span>
        <strong>${data.weakest_factor ? data.weakest_factor.label : "-"}</strong>
      </article>
    `;

    factorBars.innerHTML = data.factors.length
      ? data.factors.map((item) => makeBarItem(item.label, `${item.mean} / 5`, item.percent)).join("")
      : emptyMessage;

    bankList.innerHTML = data.bank_distribution.length
      ? data.bank_distribution
          .map((item) => makeBarItem(item.label, `${item.value} respondents`, Math.max(10, item.value * 12)))
          .join("")
      : emptyMessage;

    levelList.innerHTML = data.satisfaction_levels.length
      ? data.satisfaction_levels
          .map(
            (item) => `
              <article class="pill-card">
                <strong>${item.value}</strong>
                <span>${item.label}</span>
              </article>
            `,
          )
          .join("")
      : "<p>No satisfaction levels available.</p>";

    insightList.innerHTML = data.insights.length
      ? data.insights
          .map(
            (item, index) => `
              <article class="insight-card">
                <strong>${appText.insight || "Insight"} ${index + 1}</strong>
                <p>${item}</p>
              </article>
            `,
          )
          .join("")
      : emptyMessage;

    commentList.innerHTML = data.recent_comments.length
      ? data.recent_comments
          .map(
            (item) => `
              <article class="comment-card">
                <strong>${item.name} - ${item.bank}</strong>
                <p>${item.comment}</p>
              </article>
            `,
          )
          .join("")
      : emptyMessage;

    const comparisons = data.comparisons || { banks: [], genders: [], usage: [] };
    bankComparison.innerHTML = comparisons.banks.length
      ? comparisons.banks.map((item) => makeBarItem(item.label, `${item.mean} / 5 · ${item.count}`, item.percent)).join("")
      : emptyMessage;
    genderComparison.innerHTML = comparisons.genders.length
      ? comparisons.genders.map((item) => makeBarItem(item.label, `${item.mean} / 5 · ${item.count}`, item.percent)).join("")
      : emptyMessage;
    usageComparison.innerHTML = comparisons.usage.length
      ? comparisons.usage.map((item) => makeBarItem(item.label, `${item.mean} / 5 · ${item.count}`, item.percent)).join("")
      : emptyMessage;

    populateFilters(data.available_filters);
    renderCharts(data);
  }

  function getCurrentFilters() {
    return Object.fromEntries(filterSelects.map((select) => [select.dataset.filter, select.value]));
  }

  async function loadStaticRows() {
    if (!isStatic) return [];
    const basePath = window.APP_BASE_PATH || "./";
    const response = await fetch(`${basePath}data/responses.json`);
    const result = await response.json();
    return result.responses || [];
  }

  function getLocalRows() {
    if (!isStatic) return [];
    return JSON.parse(window.localStorage.getItem(STATIC_STORAGE_KEY) || "[]");
  }

  function normalizeRow(row, index) {
    return {
      id: row.id || `local-${index + 1}`,
      full_name: row.full_name || "",
      age: row.age ? Number(row.age) : null,
      gender: row.gender || "",
      bank_name: row.bank_name || "",
      usage_frequency: row.usage_frequency || "",
      tangibles: Number(row.tangibles || 0),
      reliability: Number(row.reliability || 0),
      responsiveness: Number(row.responsiveness || 0),
      assurance: Number(row.assurance || 0),
      empathy: Number(row.empathy || 0),
      security: Number(row.security || 0),
      digital_convenience: Number(row.digital_convenience || 0),
      overall_satisfaction: Number(row.overall_satisfaction || 0),
      comment: row.comment || "",
      created_at: row.created_at || "",
    };
  }

  function buildStaticAnalysis(rows, filters) {
    const normalizedFilters = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
    const allRows = rows.map(normalizeRow);
    const filteredRows = allRows.filter((row) =>
      Object.entries(normalizedFilters).every(([field, value]) => String(row[field] || "") === String(value)),
    );

    const availableFilters = {
      bank_name: [...new Set(allRows.map((row) => row.bank_name).filter(Boolean))].sort(),
      gender: [...new Set(allRows.map((row) => row.gender).filter(Boolean))].sort(),
      usage_frequency: [...new Set(allRows.map((row) => row.usage_frequency).filter(Boolean))].sort(),
    };

    if (!filteredRows.length) {
      return {
        total_responses: 0,
        overall_mean: 0,
        factors: [],
        bank_distribution: [],
        satisfaction_levels: [],
        recent_comments: [],
        top_factor: null,
        weakest_factor: null,
        insights: [],
        comparisons: { banks: [], genders: [], usage: [] },
        filters: normalizedFilters,
        available_filters: availableFilters,
      };
    }

    const average = (items) => Number((items.reduce((sum, value) => sum + Number(value || 0), 0) / items.length).toFixed(2));
    const factors = FACTOR_FIELDS.map(([field, label]) => {
      const scores = filteredRows.map((row) => row[field]);
      const mean = average(scores);
      return { field, label, mean, percent: Number(((mean / 5) * 100).toFixed(1)) };
    }).sort((a, b) => b.mean - a.mean);

    const bankCounts = {};
    filteredRows.forEach((row) => {
      bankCounts[row.bank_name] = (bankCounts[row.bank_name] || 0) + 1;
    });

    const levels = { "High (4-5)": 0, "Moderate (3)": 0, "Low (1-2)": 0 };
    filteredRows.forEach((row) => {
      const score = row.overall_satisfaction;
      if (score >= 4) levels["High (4-5)"] += 1;
      else if (score === 3) levels["Moderate (3)"] += 1;
      else levels["Low (1-2)"] += 1;
    });

    const groupMeans = (field) =>
      Object.entries(
        filteredRows.reduce((acc, row) => {
          const label = String(row[field] || "").trim() || "Unknown";
          acc[label] ||= [];
          acc[label].push(row.overall_satisfaction);
          return acc;
        }, {}),
      )
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([label, scores]) => {
          const mean = average(scores);
          return { label, mean, count: scores.length, percent: Number(((mean / 5) * 100).toFixed(1)) };
        });

    const overallMean = average(filteredRows.map((row) => row.overall_satisfaction));
    return {
      total_responses: filteredRows.length,
      overall_mean: overallMean,
      factors,
      bank_distribution: Object.entries(bankCounts)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([label, value]) => ({ label, value })),
      satisfaction_levels: Object.entries(levels).map(([label, value]) => ({ label, value })),
      recent_comments: filteredRows
        .filter((row) => row.comment)
        .slice(0, 4)
        .map((row) => ({ name: row.full_name || "Anonymous", bank: row.bank_name, comment: row.comment })),
      top_factor: factors[0],
      weakest_factor: factors[factors.length - 1],
      insights: [
        `The strongest rated area is ${factors[0].label} with a mean score of ${factors[0].mean}.`,
        `The weakest rated area is ${factors[factors.length - 1].label} with a mean score of ${factors[factors.length - 1].mean}.`,
        `The current filtered sample reports an overall satisfaction mean of ${overallMean} out of 5.`,
      ],
      comparisons: {
        banks: groupMeans("bank_name"),
        genders: groupMeans("gender"),
        usage: groupMeans("usage_frequency"),
      },
      filters: normalizedFilters,
      available_filters: availableFilters,
    };
  }

  function downloadStaticCsv(rows) {
    const headers = [
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
    ];
    const lines = [
      headers.join(","),
      ...rows.map((row) =>
        [
          row.id,
          row.full_name,
          row.age,
          row.gender,
          row.bank_name,
          row.usage_frequency,
          row.tangibles,
          row.reliability,
          row.responsiveness,
          row.assurance,
          row.empathy,
          row.security,
          row.digital_convenience,
          row.overall_satisfaction,
          `"${String(row.comment || "").replaceAll('"', '""')}"`,
          row.created_at,
        ].join(","),
      ),
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const objectUrl = URL.createObjectURL(blob);
    link.href = objectUrl;
    link.download = "banking_satisfaction_static.csv";
    link.click();
    URL.revokeObjectURL(objectUrl);
  }

  function updateExportLinks() {
    const filters = getCurrentFilters();
    if (isStatic) {
      const basePath = window.APP_BASE_PATH || "./";
      csvExport.href = "#";
      pdfExport.href = `${basePath}report.html`;
      return;
    }
    csvExport.href = `/export/csv${toQueryString(filters)}`;
    pdfExport.href = `/report${toQueryString(filters)}`;
  }

  async function loadDashboard() {
    const filters = getCurrentFilters();
    let data;

    if (isStatic) {
      latestRows = [...staticSeedRows, ...getLocalRows()].map(normalizeRow);
      data = buildStaticAnalysis(latestRows, filters);
    } else {
      const response = await fetch(`/api/analysis${toQueryString(filters)}`);
      data = await response.json();
    }

    renderDashboard(data);
    updateExportLinks();
  }

  applyButton.addEventListener("click", loadDashboard);
  resetButton.addEventListener("click", async () => {
    filterSelects.forEach((select) => {
      select.value = "";
    });
    await loadDashboard();
  });

  if (isStatic) {
    staticSeedRows = await loadStaticRows();
    csvExport.addEventListener("click", (event) => {
      event.preventDefault();
      downloadStaticCsv(latestRows);
    });
  }

  updateExportLinks();
  await loadDashboard();
});
