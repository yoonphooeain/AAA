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

document.addEventListener("DOMContentLoaded", async () => {
  const appText = window.APP_TEXT || {};
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
              family: "Manrope",
              size: 12,
            },
          },
        },
        tooltip: {
          titleFont: { family: "Manrope" },
          bodyFont: { family: "Manrope" },
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
              font: { family: "Manrope" },
            },
            grid: { color: chartPalette.grid },
          },
          x: {
            ticks: {
              color: chartPalette.muted,
              font: { family: "Manrope" },
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
              font: { family: "Manrope" },
            },
            grid: { color: chartPalette.grid },
          },
          x: {
            ticks: {
              color: chartPalette.muted,
              font: { family: "Manrope" },
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

  function updateExportLinks() {
    const filters = getCurrentFilters();
    csvExport.href = `/export/csv${toQueryString(filters)}`;
    pdfExport.href = `/report${toQueryString(filters)}`;
  }

  async function loadDashboard() {
    const filters = getCurrentFilters();
    const response = await fetch(`/api/analysis${toQueryString(filters)}`);
    const data = await response.json();
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

  updateExportLinks();
  await loadDashboard();
});
